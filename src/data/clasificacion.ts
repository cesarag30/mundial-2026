/**
 * Cálculo de la tabla de clasificación de un grupo a partir de una fuente
 * de marcadores arbitraria.
 *
 * La misma función sirve para:
 *  - La tabla OFICIAL (marcadores reales de la API / datos estáticos)
 *  - La tabla de LA QUINIELA (marcadores predichos por el usuario)
 *
 * Criterio de orden FIFA: puntos → diferencia de gol → goles a favor → nombre.
 */

import { equiposPorGrupo, type Grupo } from './teams';
import { partidosDeGrupo, type Partido, type Marcador } from './matches';

export interface FilaTabla {
  codigo: string;
  bandera: string;
  nombre: string;
  jugados: number;
  ganados: number;
  empatados: number;
  perdidos: number;
  golesFavor: number;
  golesContra: number;
  diferencia: number;
  puntos: number;
  /** Posición en la tabla (1-4) */
  posicion: number;
}

/** Función que resuelve el marcador de un partido (o undefined si no hay) */
export type ResolverMarcador = (p: Partido) => Marcador | undefined;

export const calcularTablaGrupo = (
  grupo: Grupo,
  resolver: ResolverMarcador,
): FilaTabla[] => {
  const filas: Record<string, FilaTabla> = {};
  equiposPorGrupo(grupo).forEach((e) => {
    filas[e.codigo] = {
      codigo: e.codigo, bandera: e.bandera, nombre: e.nombre,
      jugados: 0, ganados: 0, empatados: 0, perdidos: 0,
      golesFavor: 0, golesContra: 0, diferencia: 0, puntos: 0,
      posicion: 0,
    };
  });

  partidosDeGrupo(grupo).forEach((p) => {
    const m = resolver(p);
    if (!m) return;
    const L = filas[p.equipoLocal];
    const V = filas[p.equipoVisitante];
    if (!L || !V) return;
    L.jugados++; V.jugados++;
    L.golesFavor += m.local;     L.golesContra += m.visitante;
    V.golesFavor += m.visitante; V.golesContra += m.local;
    if (m.local > m.visitante)      { L.ganados++; L.puntos += 3; V.perdidos++; }
    else if (m.visitante > m.local) { V.ganados++; V.puntos += 3; L.perdidos++; }
    else                            { L.empatados++; V.empatados++; L.puntos++; V.puntos++; }
  });

  const ordenadas = Object.values(filas)
    .map((f) => ({ ...f, diferencia: f.golesFavor - f.golesContra }))
    .sort((a, b) =>
      b.puntos - a.puntos
      || b.diferencia - a.diferencia
      || b.golesFavor - a.golesFavor
      || a.nombre.localeCompare(b.nombre)
    );

  ordenadas.forEach((f, i) => { f.posicion = i + 1; });
  return ordenadas;
};

/** Cuántos partidos del grupo tienen marcador según la fuente dada */
export const partidosConMarcador = (
  grupo: Grupo,
  resolver: ResolverMarcador,
): number =>
  partidosDeGrupo(grupo).filter((p) => !!resolver(p)).length;
