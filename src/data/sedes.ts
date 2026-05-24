/**
 * Las 16 sedes oficiales del Mundial 2026
 * 11 en Estados Unidos, 3 en México, 2 en Canadá.
 */

export type Pais = 'USA' | 'MEX' | 'CAN';

export interface Sede {
  /** Identificador interno */
  id: string;
  /** Nombre oficial del estadio (incluye nombre comercial entre paréntesis si aplica) */
  estadio: string;
  /** Ciudad donde se ubica */
  ciudad: string;
  /** País anfitrión */
  pais: Pais;
  /** Capacidad aproximada */
  capacidad: number;
  /** Zona horaria IANA */
  zonaHoraria: string;
  /** Región geográfica del torneo */
  region: 'Oeste' | 'Centro' | 'Este';
}

export const sedes: Sede[] = [
  // ===== MÉXICO (3 sedes) =====
  { id: 'azteca',     estadio: 'Estadio Azteca',                ciudad: 'Ciudad de México', pais: 'MEX', capacidad: 87000, zonaHoraria: 'America/Mexico_City',  region: 'Centro' },
  { id: 'akron',      estadio: 'Estadio Akron',                 ciudad: 'Guadalajara',      pais: 'MEX', capacidad: 48071, zonaHoraria: 'America/Mexico_City',  region: 'Centro' },
  { id: 'bbva',       estadio: 'Estadio BBVA',                  ciudad: 'Monterrey',        pais: 'MEX', capacidad: 53500, zonaHoraria: 'America/Monterrey',    region: 'Centro' },

  // ===== CANADÁ (2 sedes) =====
  { id: 'bmo',        estadio: 'BMO Field',                     ciudad: 'Toronto',          pais: 'CAN', capacidad: 45000, zonaHoraria: 'America/Toronto',      region: 'Este' },
  { id: 'bcplace',    estadio: 'BC Place',                      ciudad: 'Vancouver',        pais: 'CAN', capacidad: 54500, zonaHoraria: 'America/Vancouver',    region: 'Oeste' },

  // ===== ESTADOS UNIDOS (11 sedes) =====
  { id: 'metlife',    estadio: 'MetLife Stadium',               ciudad: 'Nueva York / Nueva Jersey', pais: 'USA', capacidad: 82500, zonaHoraria: 'America/New_York', region: 'Este' },
  { id: 'sofi',       estadio: 'SoFi Stadium',                  ciudad: 'Los Ángeles',      pais: 'USA', capacidad: 70240, zonaHoraria: 'America/Los_Angeles',  region: 'Oeste' },
  { id: 'att',        estadio: 'AT&T Stadium',                  ciudad: 'Dallas (Arlington)', pais: 'USA', capacidad: 80000, zonaHoraria: 'America/Chicago',   region: 'Centro' },
  { id: 'mercedes',   estadio: 'Mercedes-Benz Stadium',         ciudad: 'Atlanta',          pais: 'USA', capacidad: 71000, zonaHoraria: 'America/New_York',     region: 'Este' },
  { id: 'hardrock',   estadio: 'Hard Rock Stadium',             ciudad: 'Miami',            pais: 'USA', capacidad: 65326, zonaHoraria: 'America/New_York',     region: 'Este' },
  { id: 'gillette',   estadio: 'Gillette Stadium',              ciudad: 'Boston (Foxborough)', pais: 'USA', capacidad: 65878, zonaHoraria: 'America/New_York', region: 'Este' },
  { id: 'lincoln',    estadio: 'Lincoln Financial Field',       ciudad: 'Filadelfia',       pais: 'USA', capacidad: 69596, zonaHoraria: 'America/New_York',     region: 'Este' },
  { id: 'lumen',      estadio: 'Lumen Field',                   ciudad: 'Seattle',          pais: 'USA', capacidad: 68740, zonaHoraria: 'America/Los_Angeles',  region: 'Oeste' },
  { id: 'arrowhead',  estadio: 'Arrowhead Stadium',             ciudad: 'Kansas City',      pais: 'USA', capacidad: 76416, zonaHoraria: 'America/Chicago',      region: 'Centro' },
  { id: 'nrg',        estadio: 'NRG Stadium',                   ciudad: 'Houston',          pais: 'USA', capacidad: 72220, zonaHoraria: 'America/Chicago',      region: 'Centro' },
  { id: 'levis',      estadio: 'Levi\'s Stadium',               ciudad: 'San Francisco (Santa Clara)', pais: 'USA', capacidad: 68500, zonaHoraria: 'America/Los_Angeles', region: 'Oeste' },
];

/** Devuelve una sede por id */
export const obtenerSede = (id: string): Sede | undefined =>
  sedes.find((s) => s.id === id);
