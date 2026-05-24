import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { partidos, type Partido } from '../data/matches';
import { useLiveData } from './LiveDataContext';
import { useQuiniela } from './QuinielaContext';
import {
  decodificarQuiniela,
  type QuinielaCompartida,
} from '../data/codigo-quiniela';

const STORAGE_KEY_NOMBRE = 'mundial2026-nombre';
const STORAGE_KEY_AMIGOS = 'mundial2026-amigos';

export interface AmigoRankeado {
  /** Identificador único interno */
  id: string;
  /** Nombre del amigo */
  nombre: string;
  /** ¿Es el usuario actual? */
  esTu: boolean;
  /** Puntos totales acumulados */
  puntos: number;
  /** Aciertos exactos */
  exactos: number;
  /** Aciertos de ganador */
  ganadores: number;
  /** Aciertos fallidos */
  fallidos: number;
  /** Predicciones pendientes (partido sin marcador) */
  pendientes: number;
  /** Total de predicciones hechas */
  totalPredicciones: number;
  /** Cuándo compartió/se actualizó */
  actualizado: string;
}

interface AmigosContextType {
  /** Nombre del usuario actual */
  miNombre: string;
  /** Establecer el nombre del usuario */
  setMiNombre: (n: string) => void;
  /** ¿Ya configuró su nombre? */
  tieneNombre: boolean;
  /** Lista de amigos importados (sin incluir al usuario) */
  amigos: QuinielaCompartida[];
  /** Importar una quiniela de un amigo. Devuelve true si OK */
  importarAmigo: (codigo: string) => { ok: boolean; mensaje: string };
  /** Borrar un amigo */
  borrarAmigo: (id: string) => void;
  /** Ranking ordenado (usuario actual + todos los amigos) */
  ranking: AmigoRankeado[];
  /** Posición del usuario en el ranking (1 = primero) */
  miPosicion: number;
}

const AmigosContext = createContext<AmigosContextType | undefined>(undefined);

// Cálculo de puntos (igual lógica que QuinielaContext)
const calcularPuntosUno = (
  predicciones: Record<string, { golesLocal: number; golesVisitante: number }>,
  marcadorDe: (p: Partido) => { local: number; visitante: number } | undefined,
) => {
  let puntos = 0, exactos = 0, ganadores = 0, fallidos = 0, pendientes = 0;
  Object.entries(predicciones).forEach(([partidoId, pred]) => {
    const partido = partidos.find((p) => p.id === partidoId);
    if (!partido) return;
    const m = marcadorDe(partido);
    if (!m) { pendientes++; return; }
    if (pred.golesLocal === m.local && pred.golesVisitante === m.visitante) {
      exactos++; puntos += 3;
    } else {
      const gp = pred.golesLocal === pred.golesVisitante ? 'E'
              : pred.golesLocal > pred.golesVisitante ? 'L' : 'V';
      const go = m.local === m.visitante ? 'E'
              : m.local > m.visitante ? 'L' : 'V';
      if (gp === go) { ganadores++; puntos += 1; }
      else fallidos++;
    }
  });
  return { puntos, exactos, ganadores, fallidos, pendientes };
};

const idAmigo = (q: QuinielaCompartida): string =>
  `${q.nombre.toLowerCase().trim()}_${Date.parse(q.generado)}`;

export const AmigosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [miNombre, setMiNombreState] = useState<string>('');
  const [amigos, setAmigos] = useState<QuinielaCompartida[]>([]);
  const { marcadorDe } = useLiveData();
  const { predicciones } = useQuiniela();

  // Cargar desde localStorage al iniciar
  useEffect(() => {
    const nombre = localStorage.getItem(STORAGE_KEY_NOMBRE);
    if (nombre) setMiNombreState(nombre);

    const raw = localStorage.getItem(STORAGE_KEY_AMIGOS);
    if (raw) {
      try {
        setAmigos(JSON.parse(raw));
      } catch {}
    }
  }, []);

  const setMiNombre = useCallback((n: string) => {
    const limpio = n.trim().slice(0, 30);
    setMiNombreState(limpio);
    localStorage.setItem(STORAGE_KEY_NOMBRE, limpio);
  }, []);

  const importarAmigo = useCallback((codigo: string): { ok: boolean; mensaje: string } => {
    const q = decodificarQuiniela(codigo);
    if (!q) {
      return { ok: false, mensaje: 'Código inválido. Asegúrate de copiarlo completo.' };
    }
    if (Object.keys(q.predicciones).length === 0) {
      return { ok: false, mensaje: `${q.nombre} aún no tiene predicciones.` };
    }
    const id = idAmigo(q);

    setAmigos((prev) => {
      // Si ya está el mismo nombre + timestamp → reemplazar
      const filtrados = prev.filter((a) => idAmigo(a) !== id);
      // Si tiene el mismo nombre pero distinto timestamp → reemplazar también (versión más nueva)
      const sinMismoNombre = filtrados.filter(
        (a) => a.nombre.toLowerCase().trim() !== q.nombre.toLowerCase().trim()
      );
      const nuevo = [...sinMismoNombre, q];
      localStorage.setItem(STORAGE_KEY_AMIGOS, JSON.stringify(nuevo));
      return nuevo;
    });

    return {
      ok: true,
      mensaje: `Quiniela de ${q.nombre} importada (${Object.keys(q.predicciones).length} predicciones).`,
    };
  }, []);

  const borrarAmigo = useCallback((id: string) => {
    setAmigos((prev) => {
      const nuevo = prev.filter((a) => idAmigo(a) !== id);
      localStorage.setItem(STORAGE_KEY_AMIGOS, JSON.stringify(nuevo));
      return nuevo;
    });
  }, []);

  // Computa el ranking cada vez que cambia algo
  const ranking = useMemo((): AmigoRankeado[] => {
    const items: AmigoRankeado[] = [];

    // Usuario actual (si tiene nombre)
    if (miNombre) {
      const stats = calcularPuntosUno(predicciones, marcadorDe);
      items.push({
        id: '_yo',
        nombre: miNombre,
        esTu: true,
        ...stats,
        totalPredicciones: Object.keys(predicciones).length,
        actualizado: new Date().toISOString(),
      });
    }

    // Amigos
    amigos.forEach((a) => {
      const stats = calcularPuntosUno(a.predicciones, marcadorDe);
      items.push({
        id: idAmigo(a),
        nombre: a.nombre,
        esTu: false,
        ...stats,
        totalPredicciones: Object.keys(a.predicciones).length,
        actualizado: a.generado,
      });
    });

    // Orden: puntos desc → exactos desc → ganadores desc → nombre asc
    items.sort((a, b) =>
      b.puntos - a.puntos
      || b.exactos - a.exactos
      || b.ganadores - a.ganadores
      || a.nombre.localeCompare(b.nombre)
    );

    return items;
  }, [miNombre, amigos, predicciones, marcadorDe]);

  const miPosicion = useMemo(() => {
    const idx = ranking.findIndex((r) => r.esTu);
    return idx >= 0 ? idx + 1 : 0;
  }, [ranking]);

  const tieneNombre = !!miNombre;

  return (
    <AmigosContext.Provider
      value={{
        miNombre, setMiNombre, tieneNombre,
        amigos, importarAmigo, borrarAmigo,
        ranking, miPosicion,
      }}
    >
      {children}
    </AmigosContext.Provider>
  );
};

export const useAmigos = (): AmigosContextType => {
  const ctx = useContext(AmigosContext);
  if (!ctx) throw new Error('useAmigos debe usarse dentro de AmigosProvider');
  return ctx;
};
