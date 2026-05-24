import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { partidos } from '../data/matches';
import { useLiveData } from './LiveDataContext';

export interface Prediccion {
  partidoId: string;
  golesLocal: number;
  golesVisitante: number;
}

export interface DesglosePuntos {
  total: number;
  exactos: number;
  ganadores: number;
  fallidos: number;
  pendientes: number;
}

interface QuinielaContextType {
  predicciones: Record<string, Prediccion>;
  guardarPrediccion: (p: Prediccion) => void;
  borrarPrediccion: (partidoId: string) => void;
  desglose: DesglosePuntos;
  /** Puntos del partido individual (usa el marcador efectivo, vivo o estático) */
  puntosDe: (partidoId: string) => { puntos: number; tipo: 'exacto' | 'ganador' | 'fallo' | 'pendiente' };
}

const QuinielaContext = createContext<QuinielaContextType | undefined>(undefined);
const STORAGE_KEY = 'mundial2026-quiniela';

const calcularPuntos = (
  pred: Prediccion,
  oficial: { local: number; visitante: number },
): { puntos: number; tipo: 'exacto' | 'ganador' | 'fallo' } => {
  if (pred.golesLocal === oficial.local && pred.golesVisitante === oficial.visitante) {
    return { puntos: 3, tipo: 'exacto' };
  }
  const gPred = pred.golesLocal === pred.golesVisitante
    ? 'E' : pred.golesLocal > pred.golesVisitante ? 'L' : 'V';
  const gOf = oficial.local === oficial.visitante
    ? 'E' : oficial.local > oficial.visitante ? 'L' : 'V';
  if (gPred === gOf) return { puntos: 1, tipo: 'ganador' };
  return { puntos: 0, tipo: 'fallo' };
};

export const QuinielaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [predicciones, setPredicciones] = useState<Record<string, Prediccion>>({});
  const { marcadorDe } = useLiveData();

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setPredicciones(JSON.parse(raw)); } catch {}
    }
  }, []);

  const persist = useCallback((data: Record<string, Prediccion>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, []);

  const guardarPrediccion = useCallback((p: Prediccion) => {
    setPredicciones((prev) => {
      const nuevo = { ...prev, [p.partidoId]: p };
      persist(nuevo);
      return nuevo;
    });
  }, [persist]);

  const borrarPrediccion = useCallback((partidoId: string) => {
    setPredicciones((prev) => {
      const nuevo = { ...prev };
      delete nuevo[partidoId];
      persist(nuevo);
      return nuevo;
    });
  }, [persist]);

  const puntosDe = useCallback((partidoId: string) => {
    const pred = predicciones[partidoId];
    const partido = partidos.find((p) => p.id === partidoId);
    if (!partido || !pred) return { puntos: 0, tipo: 'pendiente' as const };
    const marcador = marcadorDe(partido);
    if (!marcador) return { puntos: 0, tipo: 'pendiente' as const };
    return calcularPuntos(pred, marcador);
  }, [predicciones, marcadorDe]);

  const desglose: DesglosePuntos = useMemo(() => {
    let total = 0, exactos = 0, ganadores = 0, fallidos = 0, pendientes = 0;
    Object.values(predicciones).forEach((pred) => {
      const partido = partidos.find((p) => p.id === pred.partidoId);
      if (!partido) return;
      const marcador = marcadorDe(partido);
      if (!marcador) { pendientes += 1; return; }
      const r = calcularPuntos(pred, marcador);
      total += r.puntos;
      if (r.tipo === 'exacto') exactos += 1;
      else if (r.tipo === 'ganador') ganadores += 1;
      else fallidos += 1;
    });
    return { total, exactos, ganadores, fallidos, pendientes };
  }, [predicciones, marcadorDe]);

  return (
    <QuinielaContext.Provider
      value={{ predicciones, guardarPrediccion, borrarPrediccion, desglose, puntosDe }}
    >
      {children}
    </QuinielaContext.Provider>
  );
};

export const useQuiniela = () => {
  const ctx = useContext(QuinielaContext);
  if (!ctx) throw new Error('useQuiniela debe usarse dentro de QuinielaProvider');
  return ctx;
};
