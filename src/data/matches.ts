/**
 * Punto de acceso unificado para todos los 104 partidos del Mundial 2026.
 * 72 fase de grupos + 32 eliminatorias.
 */

import { partidosGrupos } from './matches-grupos';
import { partidosEliminatorias } from './matches-eliminatorias';
import type { Partido, Fase, Marcador } from './matches-grupos';

export type { Partido, Fase, Marcador };

/** Todos los partidos en orden cronológico */
export const partidos: Partido[] = [...partidosGrupos, ...partidosEliminatorias];

/** Partidos indexados por id */
export const partidoPorId = (id: string): Partido | undefined =>
  partidos.find((p) => p.id === id);

/** Partidos agrupados por fecha (YYYY-MM-DD) */
export const partidosPorFecha = (): Record<string, Partido[]> => {
  const out: Record<string, Partido[]> = {};
  partidos.forEach((p) => {
    if (!out[p.fecha]) out[p.fecha] = [];
    out[p.fecha].push(p);
  });
  // Orden por hora dentro de cada día
  Object.values(out).forEach((lista) =>
    lista.sort((a, b) => a.horaLocal.localeCompare(b.horaLocal))
  );
  return out;
};

/** Partidos de un grupo concreto, ordenados por jornada */
export const partidosDeGrupo = (grupo: string): Partido[] =>
  partidosGrupos
    .filter((p) => p.grupo === grupo)
    .sort((a, b) => (a.jornada! - b.jornada!));

/** Partidos en los que aparece un equipo (local o visitante) */
export const partidosDeEquipo = (codigo: string): Partido[] =>
  partidos.filter((p) => p.equipoLocal === codigo || p.equipoVisitante === codigo);

/** Etiquetas legibles para cada fase */
export const ETIQUETAS_FASE: Record<Fase, string> = {
  GRUPOS:   'Fase de grupos',
  R32:      'Dieciseisavos',
  OCTAVOS:  'Octavos de final',
  CUARTOS:  'Cuartos de final',
  SEMIS:    'Semifinales',
  TERCERO:  'Tercer puesto',
  FINAL:    'Final',
};

/** Orden de las fases para la UI */
export const ORDEN_FASES: Fase[] = [
  'GRUPOS', 'R32', 'OCTAVOS', 'CUARTOS', 'SEMIS', 'TERCERO', 'FINAL',
];
