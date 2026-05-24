/**
 * Fase de grupos — los 72 partidos del Mundial 2026.
 *
 * Calendario: 11 al 27 de junio de 2026 (17 días).
 * 12 grupos × 3 jornadas × 2 partidos = 72 encuentros.
 *
 * NOTA: las horas mostradas son hora LOCAL del estadio (ver `sedeId.zonaHoraria`).
 * La tercera jornada de cada grupo se juega simultáneamente para evitar acuerdos.
 */

import type { Grupo } from './teams';

export type Fase =
  | 'GRUPOS'
  | 'R32'        // Dieciseisavos (Round of 32)
  | 'OCTAVOS'    // Octavos (Round of 16)
  | 'CUARTOS'
  | 'SEMIS'
  | 'TERCERO'    // Tercer puesto
  | 'FINAL';

export interface Marcador {
  local: number;
  visitante: number;
}

export interface Partido {
  id: string;
  fase: Fase;
  /** Solo en fase de grupos */
  grupo?: Grupo;
  /** Solo en fase de grupos: 1, 2 o 3 */
  jornada?: 1 | 2 | 3;
  /** Fecha en formato YYYY-MM-DD */
  fecha: string;
  /** Hora local del estadio HH:MM (24h) */
  horaLocal: string;
  /** ID de la sede (ver sedes.ts) */
  sedeId: string;
  /** Código FIFA del equipo local — 'TBD' en eliminatorias hasta que se decida */
  equipoLocal: string;
  /** Código FIFA del equipo visitante — 'TBD' en eliminatorias hasta que se decida */
  equipoVisitante: string;
  /** Marcador oficial cuando ya se jugó */
  marcadorOficial?: Marcador;
  /** Etiqueta descriptiva para eliminatorias (ej. "1A vs 2B") */
  descripcion?: string;
}

export const partidosGrupos: Partido[] = [
  // ============================================
  // JORNADA 1 (11-17 junio) — 24 partidos
  // ============================================

  // Día 1 — 11 jun (jue) — apertura
  { id: 'G01', fase: 'GRUPOS', grupo: 'A', jornada: 1, fecha: '2026-06-11', horaLocal: '18:00', sedeId: 'azteca',    equipoLocal: 'MEX', equipoVisitante: 'RSA' },

  // Día 2 — 12 jun (vie)
  { id: 'G02', fase: 'GRUPOS', grupo: 'A', jornada: 1, fecha: '2026-06-12', horaLocal: '12:00', sedeId: 'arrowhead', equipoLocal: 'KOR', equipoVisitante: 'CZE' },
  { id: 'G03', fase: 'GRUPOS', grupo: 'B', jornada: 1, fecha: '2026-06-12', horaLocal: '15:00', sedeId: 'bmo',       equipoLocal: 'CAN', equipoVisitante: 'BIH' },
  { id: 'G04', fase: 'GRUPOS', grupo: 'B', jornada: 1, fecha: '2026-06-12', horaLocal: '18:00', sedeId: 'metlife',   equipoLocal: 'QAT', equipoVisitante: 'SUI' },
  { id: 'G05', fase: 'GRUPOS', grupo: 'D', jornada: 1, fecha: '2026-06-12', horaLocal: '21:00', sedeId: 'sofi',      equipoLocal: 'USA', equipoVisitante: 'PAR' },

  // Día 3 — 13 jun (sáb)
  { id: 'G06', fase: 'GRUPOS', grupo: 'C', jornada: 1, fecha: '2026-06-13', horaLocal: '12:00', sedeId: 'hardrock',  equipoLocal: 'BRA', equipoVisitante: 'MAR' },
  { id: 'G07', fase: 'GRUPOS', grupo: 'C', jornada: 1, fecha: '2026-06-13', horaLocal: '15:00', sedeId: 'mercedes',  equipoLocal: 'HAI', equipoVisitante: 'SCO' },
  { id: 'G08', fase: 'GRUPOS', grupo: 'D', jornada: 1, fecha: '2026-06-13', horaLocal: '18:00', sedeId: 'lincoln',   equipoLocal: 'AUS', equipoVisitante: 'TUR' },
  { id: 'G09', fase: 'GRUPOS', grupo: 'E', jornada: 1, fecha: '2026-06-13', horaLocal: '21:00', sedeId: 'nrg',       equipoLocal: 'GER', equipoVisitante: 'CUW' },

  // Día 4 — 14 jun (dom)
  { id: 'G10', fase: 'GRUPOS', grupo: 'E', jornada: 1, fecha: '2026-06-14', horaLocal: '12:00', sedeId: 'att',       equipoLocal: 'CIV', equipoVisitante: 'ECU' },
  { id: 'G11', fase: 'GRUPOS', grupo: 'F', jornada: 1, fecha: '2026-06-14', horaLocal: '15:00', sedeId: 'gillette',  equipoLocal: 'NED', equipoVisitante: 'JPN' },
  { id: 'G12', fase: 'GRUPOS', grupo: 'F', jornada: 1, fecha: '2026-06-14', horaLocal: '18:00', sedeId: 'levis',     equipoLocal: 'SWE', equipoVisitante: 'TUN' },
  { id: 'G13', fase: 'GRUPOS', grupo: 'G', jornada: 1, fecha: '2026-06-14', horaLocal: '21:00', sedeId: 'lumen',     equipoLocal: 'BEL', equipoVisitante: 'EGY' },

  // Día 5 — 15 jun (lun)
  { id: 'G14', fase: 'GRUPOS', grupo: 'G', jornada: 1, fecha: '2026-06-15', horaLocal: '12:00', sedeId: 'bcplace',   equipoLocal: 'IRN', equipoVisitante: 'NZL' },
  { id: 'G15', fase: 'GRUPOS', grupo: 'H', jornada: 1, fecha: '2026-06-15', horaLocal: '15:00', sedeId: 'bbva',      equipoLocal: 'ESP', equipoVisitante: 'CPV' },
  { id: 'G16', fase: 'GRUPOS', grupo: 'H', jornada: 1, fecha: '2026-06-15', horaLocal: '18:00', sedeId: 'akron',     equipoLocal: 'KSA', equipoVisitante: 'URU' },
  { id: 'G17', fase: 'GRUPOS', grupo: 'I', jornada: 1, fecha: '2026-06-15', horaLocal: '21:00', sedeId: 'metlife',   equipoLocal: 'FRA', equipoVisitante: 'SEN' },

  // Día 6 — 16 jun (mar)
  { id: 'G18', fase: 'GRUPOS', grupo: 'I', jornada: 1, fecha: '2026-06-16', horaLocal: '12:00', sedeId: 'mercedes',  equipoLocal: 'IRQ', equipoVisitante: 'NOR' },
  { id: 'G19', fase: 'GRUPOS', grupo: 'J', jornada: 1, fecha: '2026-06-16', horaLocal: '15:00', sedeId: 'hardrock',  equipoLocal: 'ARG', equipoVisitante: 'ALG' },
  { id: 'G20', fase: 'GRUPOS', grupo: 'J', jornada: 1, fecha: '2026-06-16', horaLocal: '18:00', sedeId: 'arrowhead', equipoLocal: 'AUT', equipoVisitante: 'JOR' },
  { id: 'G21', fase: 'GRUPOS', grupo: 'K', jornada: 1, fecha: '2026-06-16', horaLocal: '21:00', sedeId: 'sofi',      equipoLocal: 'POR', equipoVisitante: 'COD' },

  // Día 7 — 17 jun (mié)
  { id: 'G22', fase: 'GRUPOS', grupo: 'K', jornada: 1, fecha: '2026-06-17', horaLocal: '12:00', sedeId: 'nrg',       equipoLocal: 'UZB', equipoVisitante: 'COL' },
  { id: 'G23', fase: 'GRUPOS', grupo: 'L', jornada: 1, fecha: '2026-06-17', horaLocal: '15:00', sedeId: 'att',       equipoLocal: 'ENG', equipoVisitante: 'CRO' },
  { id: 'G24', fase: 'GRUPOS', grupo: 'L', jornada: 1, fecha: '2026-06-17', horaLocal: '18:00', sedeId: 'lincoln',   equipoLocal: 'GHA', equipoVisitante: 'PAN' },

  // ============================================
  // JORNADA 2 (17-23 junio) — 24 partidos
  // ============================================

  // Día 7 — 17 jun (mié) (último slot)
  { id: 'G25', fase: 'GRUPOS', grupo: 'A', jornada: 2, fecha: '2026-06-17', horaLocal: '21:00', sedeId: 'azteca',    equipoLocal: 'MEX', equipoVisitante: 'KOR' },

  // Día 8 — 18 jun (jue)
  { id: 'G26', fase: 'GRUPOS', grupo: 'A', jornada: 2, fecha: '2026-06-18', horaLocal: '12:00', sedeId: 'arrowhead', equipoLocal: 'CZE', equipoVisitante: 'RSA' },
  { id: 'G27', fase: 'GRUPOS', grupo: 'B', jornada: 2, fecha: '2026-06-18', horaLocal: '15:00', sedeId: 'bcplace',   equipoLocal: 'CAN', equipoVisitante: 'QAT' },
  { id: 'G28', fase: 'GRUPOS', grupo: 'B', jornada: 2, fecha: '2026-06-18', horaLocal: '18:00', sedeId: 'bmo',       equipoLocal: 'SUI', equipoVisitante: 'BIH' },
  { id: 'G29', fase: 'GRUPOS', grupo: 'C', jornada: 2, fecha: '2026-06-18', horaLocal: '21:00', sedeId: 'hardrock',  equipoLocal: 'BRA', equipoVisitante: 'HAI' },

  // Día 9 — 19 jun (vie)
  { id: 'G30', fase: 'GRUPOS', grupo: 'C', jornada: 2, fecha: '2026-06-19', horaLocal: '12:00', sedeId: 'mercedes',  equipoLocal: 'MAR', equipoVisitante: 'SCO' },
  { id: 'G31', fase: 'GRUPOS', grupo: 'D', jornada: 2, fecha: '2026-06-19', horaLocal: '15:00', sedeId: 'lumen',     equipoLocal: 'USA', equipoVisitante: 'AUS' },
  { id: 'G32', fase: 'GRUPOS', grupo: 'D', jornada: 2, fecha: '2026-06-19', horaLocal: '18:00', sedeId: 'att',       equipoLocal: 'TUR', equipoVisitante: 'PAR' },
  { id: 'G33', fase: 'GRUPOS', grupo: 'E', jornada: 2, fecha: '2026-06-19', horaLocal: '21:00', sedeId: 'gillette',  equipoLocal: 'GER', equipoVisitante: 'CIV' },

  // Día 10 — 20 jun (sáb)
  { id: 'G34', fase: 'GRUPOS', grupo: 'E', jornada: 2, fecha: '2026-06-20', horaLocal: '12:00', sedeId: 'nrg',       equipoLocal: 'ECU', equipoVisitante: 'CUW' },
  { id: 'G35', fase: 'GRUPOS', grupo: 'F', jornada: 2, fecha: '2026-06-20', horaLocal: '15:00', sedeId: 'metlife',   equipoLocal: 'NED', equipoVisitante: 'SWE' },
  { id: 'G36', fase: 'GRUPOS', grupo: 'F', jornada: 2, fecha: '2026-06-20', horaLocal: '18:00', sedeId: 'levis',     equipoLocal: 'TUN', equipoVisitante: 'JPN' },
  { id: 'G37', fase: 'GRUPOS', grupo: 'G', jornada: 2, fecha: '2026-06-20', horaLocal: '21:00', sedeId: 'gillette',  equipoLocal: 'BEL', equipoVisitante: 'IRN' },

  // Día 11 — 21 jun (dom)
  { id: 'G38', fase: 'GRUPOS', grupo: 'G', jornada: 2, fecha: '2026-06-21', horaLocal: '12:00', sedeId: 'lumen',     equipoLocal: 'NZL', equipoVisitante: 'EGY' },
  { id: 'G39', fase: 'GRUPOS', grupo: 'H', jornada: 2, fecha: '2026-06-21', horaLocal: '15:00', sedeId: 'bbva',      equipoLocal: 'ESP', equipoVisitante: 'KSA' },
  { id: 'G40', fase: 'GRUPOS', grupo: 'H', jornada: 2, fecha: '2026-06-21', horaLocal: '18:00', sedeId: 'akron',     equipoLocal: 'URU', equipoVisitante: 'CPV' },
  { id: 'G41', fase: 'GRUPOS', grupo: 'I', jornada: 2, fecha: '2026-06-21', horaLocal: '21:00', sedeId: 'metlife',   equipoLocal: 'FRA', equipoVisitante: 'IRQ' },

  // Día 12 — 22 jun (lun)
  { id: 'G42', fase: 'GRUPOS', grupo: 'I', jornada: 2, fecha: '2026-06-22', horaLocal: '12:00', sedeId: 'mercedes',  equipoLocal: 'NOR', equipoVisitante: 'SEN' },
  { id: 'G43', fase: 'GRUPOS', grupo: 'J', jornada: 2, fecha: '2026-06-22', horaLocal: '15:00', sedeId: 'hardrock',  equipoLocal: 'ARG', equipoVisitante: 'AUT' },
  { id: 'G44', fase: 'GRUPOS', grupo: 'J', jornada: 2, fecha: '2026-06-22', horaLocal: '18:00', sedeId: 'arrowhead', equipoLocal: 'JOR', equipoVisitante: 'ALG' },
  { id: 'G45', fase: 'GRUPOS', grupo: 'K', jornada: 2, fecha: '2026-06-22', horaLocal: '21:00', sedeId: 'lincoln',   equipoLocal: 'POR', equipoVisitante: 'UZB' },

  // Día 13 — 23 jun (mar)
  { id: 'G46', fase: 'GRUPOS', grupo: 'K', jornada: 2, fecha: '2026-06-23', horaLocal: '15:00', sedeId: 'att',       equipoLocal: 'COL', equipoVisitante: 'COD' },
  { id: 'G47', fase: 'GRUPOS', grupo: 'L', jornada: 2, fecha: '2026-06-23', horaLocal: '18:00', sedeId: 'gillette',  equipoLocal: 'ENG', equipoVisitante: 'GHA' },
  { id: 'G48', fase: 'GRUPOS', grupo: 'L', jornada: 2, fecha: '2026-06-23', horaLocal: '21:00', sedeId: 'hardrock',  equipoLocal: 'PAN', equipoVisitante: 'CRO' },

  // ============================================
  // JORNADA 3 (24-27 junio) — 24 partidos
  // Jornada final: cada grupo juega sus 2 partidos simultáneos
  // ============================================

  // Día 14 — 24 jun (mié) — Grupos A y B
  { id: 'G49', fase: 'GRUPOS', grupo: 'A', jornada: 3, fecha: '2026-06-24', horaLocal: '16:00', sedeId: 'azteca',    equipoLocal: 'MEX', equipoVisitante: 'CZE' },
  { id: 'G50', fase: 'GRUPOS', grupo: 'A', jornada: 3, fecha: '2026-06-24', horaLocal: '16:00', sedeId: 'bbva',      equipoLocal: 'RSA', equipoVisitante: 'KOR' },
  { id: 'G51', fase: 'GRUPOS', grupo: 'B', jornada: 3, fecha: '2026-06-24', horaLocal: '20:00', sedeId: 'bmo',       equipoLocal: 'CAN', equipoVisitante: 'SUI' },
  { id: 'G52', fase: 'GRUPOS', grupo: 'B', jornada: 3, fecha: '2026-06-24', horaLocal: '20:00', sedeId: 'bcplace',   equipoLocal: 'BIH', equipoVisitante: 'QAT' },

  // Día 15 — 25 jun (jue) — Grupos C y D
  { id: 'G53', fase: 'GRUPOS', grupo: 'C', jornada: 3, fecha: '2026-06-25', horaLocal: '16:00', sedeId: 'hardrock',  equipoLocal: 'BRA', equipoVisitante: 'SCO' },
  { id: 'G54', fase: 'GRUPOS', grupo: 'C', jornada: 3, fecha: '2026-06-25', horaLocal: '16:00', sedeId: 'mercedes',  equipoLocal: 'HAI', equipoVisitante: 'MAR' },
  { id: 'G55', fase: 'GRUPOS', grupo: 'D', jornada: 3, fecha: '2026-06-25', horaLocal: '21:00', sedeId: 'sofi',      equipoLocal: 'TUR', equipoVisitante: 'USA' },
  { id: 'G56', fase: 'GRUPOS', grupo: 'D', jornada: 3, fecha: '2026-06-25', horaLocal: '21:00', sedeId: 'att',       equipoLocal: 'PAR', equipoVisitante: 'AUS' },

  // Día 16 — 26 jun (vie) — Grupos E, F, G, H
  { id: 'G57', fase: 'GRUPOS', grupo: 'E', jornada: 3, fecha: '2026-06-26', horaLocal: '11:00', sedeId: 'nrg',       equipoLocal: 'GER', equipoVisitante: 'ECU' },
  { id: 'G58', fase: 'GRUPOS', grupo: 'E', jornada: 3, fecha: '2026-06-26', horaLocal: '11:00', sedeId: 'arrowhead', equipoLocal: 'CIV', equipoVisitante: 'CUW' },
  { id: 'G59', fase: 'GRUPOS', grupo: 'F', jornada: 3, fecha: '2026-06-26', horaLocal: '15:00', sedeId: 'gillette',  equipoLocal: 'NED', equipoVisitante: 'TUN' },
  { id: 'G60', fase: 'GRUPOS', grupo: 'F', jornada: 3, fecha: '2026-06-26', horaLocal: '15:00', sedeId: 'lincoln',   equipoLocal: 'JPN', equipoVisitante: 'SWE' },
  { id: 'G61', fase: 'GRUPOS', grupo: 'G', jornada: 3, fecha: '2026-06-26', horaLocal: '18:00', sedeId: 'lumen',     equipoLocal: 'BEL', equipoVisitante: 'NZL' },
  { id: 'G62', fase: 'GRUPOS', grupo: 'G', jornada: 3, fecha: '2026-06-26', horaLocal: '18:00', sedeId: 'bcplace',   equipoLocal: 'EGY', equipoVisitante: 'IRN' },
  { id: 'G63', fase: 'GRUPOS', grupo: 'H', jornada: 3, fecha: '2026-06-26', horaLocal: '20:00', sedeId: 'bbva',      equipoLocal: 'ESP', equipoVisitante: 'URU' },
  { id: 'G64', fase: 'GRUPOS', grupo: 'H', jornada: 3, fecha: '2026-06-26', horaLocal: '20:00', sedeId: 'akron',     equipoLocal: 'CPV', equipoVisitante: 'KSA' },

  // Día 17 — 27 jun (sáb) — Grupos I, J, K, L
  { id: 'G65', fase: 'GRUPOS', grupo: 'I', jornada: 3, fecha: '2026-06-27', horaLocal: '11:00', sedeId: 'metlife',   equipoLocal: 'FRA', equipoVisitante: 'NOR' },
  { id: 'G66', fase: 'GRUPOS', grupo: 'I', jornada: 3, fecha: '2026-06-27', horaLocal: '11:00', sedeId: 'mercedes',  equipoLocal: 'IRQ', equipoVisitante: 'SEN' },
  { id: 'G67', fase: 'GRUPOS', grupo: 'J', jornada: 3, fecha: '2026-06-27', horaLocal: '15:00', sedeId: 'hardrock',  equipoLocal: 'ARG', equipoVisitante: 'JOR' },
  { id: 'G68', fase: 'GRUPOS', grupo: 'J', jornada: 3, fecha: '2026-06-27', horaLocal: '15:00', sedeId: 'arrowhead', equipoLocal: 'ALG', equipoVisitante: 'AUT' },
  { id: 'G69', fase: 'GRUPOS', grupo: 'K', jornada: 3, fecha: '2026-06-27', horaLocal: '18:00', sedeId: 'att',       equipoLocal: 'POR', equipoVisitante: 'COL' },
  { id: 'G70', fase: 'GRUPOS', grupo: 'K', jornada: 3, fecha: '2026-06-27', horaLocal: '18:00', sedeId: 'nrg',       equipoLocal: 'COD', equipoVisitante: 'UZB' },
  { id: 'G71', fase: 'GRUPOS', grupo: 'L', jornada: 3, fecha: '2026-06-27', horaLocal: '21:00', sedeId: 'lincoln',   equipoLocal: 'ENG', equipoVisitante: 'PAN' },
  { id: 'G72', fase: 'GRUPOS', grupo: 'L', jornada: 3, fecha: '2026-06-27', horaLocal: '21:00', sedeId: 'levis',     equipoLocal: 'CRO', equipoVisitante: 'GHA' },
];
