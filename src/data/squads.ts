/**
 * Punto de acceso unificado a las plantillas convocadas.
 * - 16 selecciones top: plantilla completa de 26 jugadores.
 * - 32 selecciones restantes: 11 titulares proyectados.
 *
 * Las plantillas oficiales se anunciarán entre el 1 y el 6 de junio de 2026.
 */

import { plantillasTop, type Jugador, type Posicion } from './squads-top';
import { plantillasResto } from './squads-resto';

export type { Jugador, Posicion };

/** Plantilla combinada de las 48 selecciones, indexada por código FIFA */
export const plantillas: Record<string, Jugador[]> = {
  ...plantillasTop,
  ...plantillasResto,
};

/** Devuelve la plantilla de un equipo por código FIFA */
export const obtenerPlantilla = (codigo: string): Jugador[] =>
  plantillas[codigo] ?? [];

/** Indica si un equipo tiene plantilla completa (26 jugadores) */
export const tienePlantillaCompleta = (codigo: string): boolean =>
  (plantillas[codigo]?.length ?? 0) >= 26;

/** Etiquetas legibles para las posiciones */
export const ETIQUETAS_POSICION: Record<Posicion, string> = {
  POR: 'Portero',
  DEF: 'Defensa',
  MED: 'Mediocampista',
  DEL: 'Delantero',
};

/** Orden de las posiciones para presentación */
export const ORDEN_POSICIONES: Posicion[] = ['POR', 'DEF', 'MED', 'DEL'];

/** Devuelve la plantilla agrupada por posición */
export const plantillaAgrupada = (codigo: string): Record<Posicion, Jugador[]> => {
  const lista = obtenerPlantilla(codigo);
  const grupos: Record<Posicion, Jugador[]> = { POR: [], DEF: [], MED: [], DEL: [] };
  lista.forEach((j) => grupos[j.posicion].push(j));
  // Orden por dorsal dentro de cada grupo
  ORDEN_POSICIONES.forEach((p) =>
    grupos[p].sort((a, b) => a.dorsal - b.dorsal)
  );
  return grupos;
};
