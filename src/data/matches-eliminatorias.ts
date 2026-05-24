/**
 * Eliminatorias — 32 partidos del Mundial 2026.
 *
 * Estructura del bracket ampliado a 48 equipos:
 *  - Dieciseisavos (R32): 16 partidos (28 jun - 3 jul) → entran los 2 primeros
 *    de cada grupo + los 8 mejores terceros.
 *  - Octavos (R16):       8 partidos  (4 - 7 jul)
 *  - Cuartos:             4 partidos  (9 - 11 jul)
 *  - Semifinales:         2 partidos  (14 y 15 jul)
 *  - Tercer puesto:       1 partido   (18 jul)
 *  - Final:               1 partido   (19 jul) @ MetLife Stadium
 *
 * Los equipos aparecen como 'TBD' hasta que se resuelva el partido anterior
 * (el bracket de la Fase 9 los irá pintando dinámicamente).
 */

import type { Partido } from './matches-grupos';

export const partidosEliminatorias: Partido[] = [
  // =====================================================
  // DIECISEISAVOS DE FINAL (R32) — 16 partidos
  // 28 junio – 3 julio
  // =====================================================
  { id: 'R32-01', fase: 'R32', fecha: '2026-06-28', horaLocal: '12:00', sedeId: 'hardrock',  equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: '1A vs 3er C/D/E/F' },
  { id: 'R32-02', fase: 'R32', fecha: '2026-06-28', horaLocal: '15:00', sedeId: 'mercedes',  equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: '2B vs 2F' },
  { id: 'R32-03', fase: 'R32', fecha: '2026-06-28', horaLocal: '18:00', sedeId: 'azteca',    equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: '1C vs 3er A/B/F/H' },
  { id: 'R32-04', fase: 'R32', fecha: '2026-06-28', horaLocal: '21:00', sedeId: 'sofi',      equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: '1D vs 3er B/E/F/I' },

  { id: 'R32-05', fase: 'R32', fecha: '2026-06-29', horaLocal: '12:00', sedeId: 'lumen',     equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: '1E vs 2L' },
  { id: 'R32-06', fase: 'R32', fecha: '2026-06-29', horaLocal: '15:00', sedeId: 'metlife',   equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: '1F vs 3er A/B/C/D' },
  { id: 'R32-07', fase: 'R32', fecha: '2026-06-29', horaLocal: '18:00', sedeId: 'bcplace',   equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: '2A vs 2C' },
  { id: 'R32-08', fase: 'R32', fecha: '2026-06-29', horaLocal: '21:00', sedeId: 'att',       equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: '1G vs 3er A/E/H/I' },

  { id: 'R32-09', fase: 'R32', fecha: '2026-06-30', horaLocal: '13:00', sedeId: 'gillette',  equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: '2D vs 2H' },
  { id: 'R32-10', fase: 'R32', fecha: '2026-06-30', horaLocal: '16:00', sedeId: 'nrg',       equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: '1H vs 3er A/B/C/I' },
  { id: 'R32-11', fase: 'R32', fecha: '2026-06-30', horaLocal: '19:00', sedeId: 'lincoln',   equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: '1I vs 2K' },

  { id: 'R32-12', fase: 'R32', fecha: '2026-07-01', horaLocal: '15:00', sedeId: 'arrowhead', equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: '2E vs 2J' },
  { id: 'R32-13', fase: 'R32', fecha: '2026-07-01', horaLocal: '18:00', sedeId: 'bbva',      equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: '1J vs 3er C/E/H/L' },
  { id: 'R32-14', fase: 'R32', fecha: '2026-07-01', horaLocal: '21:00', sedeId: 'sofi',      equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: '1K vs 2I' },

  { id: 'R32-15', fase: 'R32', fecha: '2026-07-02', horaLocal: '18:00', sedeId: 'hardrock',  equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: '1L vs 2G' },
  { id: 'R32-16', fase: 'R32', fecha: '2026-07-03', horaLocal: '20:00', sedeId: 'akron',     equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: '1B vs 2E' },

  // =====================================================
  // OCTAVOS DE FINAL (R16) — 8 partidos
  // 4 – 7 julio
  // =====================================================
  { id: 'OCT-01', fase: 'OCTAVOS', fecha: '2026-07-04', horaLocal: '13:00', sedeId: 'mercedes',  equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: 'Ganador R32-01 vs Ganador R32-02' },
  { id: 'OCT-02', fase: 'OCTAVOS', fecha: '2026-07-04', horaLocal: '17:00', sedeId: 'metlife',   equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: 'Ganador R32-03 vs Ganador R32-04' },
  { id: 'OCT-03', fase: 'OCTAVOS', fecha: '2026-07-05', horaLocal: '13:00', sedeId: 'lumen',     equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: 'Ganador R32-05 vs Ganador R32-06' },
  { id: 'OCT-04', fase: 'OCTAVOS', fecha: '2026-07-05', horaLocal: '17:00', sedeId: 'att',       equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: 'Ganador R32-07 vs Ganador R32-08' },

  { id: 'OCT-05', fase: 'OCTAVOS', fecha: '2026-07-06', horaLocal: '13:00', sedeId: 'azteca',    equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: 'Ganador R32-09 vs Ganador R32-10' },
  { id: 'OCT-06', fase: 'OCTAVOS', fecha: '2026-07-06', horaLocal: '17:00', sedeId: 'sofi',      equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: 'Ganador R32-11 vs Ganador R32-12' },

  { id: 'OCT-07', fase: 'OCTAVOS', fecha: '2026-07-07', horaLocal: '13:00', sedeId: 'hardrock',  equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: 'Ganador R32-13 vs Ganador R32-14' },
  { id: 'OCT-08', fase: 'OCTAVOS', fecha: '2026-07-07', horaLocal: '17:00', sedeId: 'gillette',  equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: 'Ganador R32-15 vs Ganador R32-16' },

  // =====================================================
  // CUARTOS DE FINAL — 4 partidos
  // 9 – 11 julio
  // =====================================================
  { id: 'CUA-01', fase: 'CUARTOS', fecha: '2026-07-09', horaLocal: '17:00', sedeId: 'att',       equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: 'Ganador OCT-01 vs Ganador OCT-02' },
  { id: 'CUA-02', fase: 'CUARTOS', fecha: '2026-07-09', horaLocal: '21:00', sedeId: 'sofi',      equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: 'Ganador OCT-03 vs Ganador OCT-04' },
  { id: 'CUA-03', fase: 'CUARTOS', fecha: '2026-07-10', horaLocal: '17:00', sedeId: 'metlife',   equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: 'Ganador OCT-05 vs Ganador OCT-06' },
  { id: 'CUA-04', fase: 'CUARTOS', fecha: '2026-07-11', horaLocal: '17:00', sedeId: 'hardrock',  equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: 'Ganador OCT-07 vs Ganador OCT-08' },

  // =====================================================
  // SEMIFINALES — 2 partidos
  // 14 – 15 julio
  // =====================================================
  { id: 'SEM-01', fase: 'SEMIS', fecha: '2026-07-14', horaLocal: '20:00', sedeId: 'att',       equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: 'Ganador CUA-01 vs Ganador CUA-02' },
  { id: 'SEM-02', fase: 'SEMIS', fecha: '2026-07-15', horaLocal: '20:00', sedeId: 'metlife',   equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: 'Ganador CUA-03 vs Ganador CUA-04' },

  // =====================================================
  // PARTIDO POR EL TERCER PUESTO
  // 18 julio
  // =====================================================
  { id: 'TER-01', fase: 'TERCERO', fecha: '2026-07-18', horaLocal: '16:00', sedeId: 'hardrock', equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: 'Perdedor SEM-01 vs Perdedor SEM-02' },

  // =====================================================
  // 🏆 GRAN FINAL 🏆
  // 19 julio — MetLife Stadium, Nueva York / Nueva Jersey
  // =====================================================
  { id: 'FIN-01', fase: 'FINAL', fecha: '2026-07-19', horaLocal: '15:00', sedeId: 'metlife',   equipoLocal: 'TBD', equipoVisitante: 'TBD', descripcion: 'Ganador SEM-01 vs Ganador SEM-02' },
];
