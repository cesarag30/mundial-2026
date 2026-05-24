/**
 * Las 48 selecciones clasificadas al Mundial FIFA 2026
 * Sorteo oficial: 12 grupos (A-L) de 4 equipos.
 * Fuente: FIFA.com (sorteo final marzo 2026).
 */

export type Confederacion =
  | 'UEFA'
  | 'CONMEBOL'
  | 'CONCACAF'
  | 'CAF'
  | 'AFC'
  | 'OFC';

export type Grupo =
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  | 'G' | 'H' | 'I' | 'J' | 'K' | 'L';

export interface Equipo {
  /** Código FIFA de 3 letras */
  codigo: string;
  /** Nombre del país en español */
  nombre: string;
  /** Emoji de la bandera */
  bandera: string;
  /** Confederación a la que pertenece */
  confederacion: Confederacion;
  /** Grupo asignado en el sorteo */
  grupo: Grupo;
  /** Si es país anfitrión */
  anfitrion?: boolean;
  /** Apodo de la selección */
  apodo?: string;
  /** Color principal (para UI) */
  color: string;
}

export const equipos: Equipo[] = [
  // ===== GRUPO A =====
  { codigo: 'MEX', nombre: 'México',         bandera: '🇲🇽', confederacion: 'CONCACAF', grupo: 'A', anfitrion: true, apodo: 'El Tri',         color: '#006847' },
  { codigo: 'RSA', nombre: 'Sudáfrica',       bandera: '🇿🇦', confederacion: 'CAF',      grupo: 'A',                  apodo: 'Bafana Bafana', color: '#007A4D' },
  { codigo: 'KOR', nombre: 'Corea del Sur',   bandera: '🇰🇷', confederacion: 'AFC',      grupo: 'A',                  apodo: 'Los Tigres de Asia', color: '#C8102E' },
  { codigo: 'CZE', nombre: 'Chequia',         bandera: '🇨🇿', confederacion: 'UEFA',     grupo: 'A',                  apodo: 'Národní tým',    color: '#11457E' },

  // ===== GRUPO B =====
  { codigo: 'CAN', nombre: 'Canadá',          bandera: '🇨🇦', confederacion: 'CONCACAF', grupo: 'B', anfitrion: true, apodo: 'Les Rouges',     color: '#D52B1E' },
  { codigo: 'BIH', nombre: 'Bosnia-Herzegovina', bandera: '🇧🇦', confederacion: 'UEFA',  grupo: 'B',                  apodo: 'Zmajevi',        color: '#002F6C' },
  { codigo: 'QAT', nombre: 'Catar',           bandera: '🇶🇦', confederacion: 'AFC',      grupo: 'B',                  apodo: 'Al-Annabi',      color: '#8A1538' },
  { codigo: 'SUI', nombre: 'Suiza',           bandera: '🇨🇭', confederacion: 'UEFA',     grupo: 'B',                  apodo: 'La Nati',        color: '#D52B1E' },

  // ===== GRUPO C =====
  { codigo: 'BRA', nombre: 'Brasil',          bandera: '🇧🇷', confederacion: 'CONMEBOL', grupo: 'C',                  apodo: 'Canarinha',      color: '#FFDF00' },
  { codigo: 'MAR', nombre: 'Marruecos',       bandera: '🇲🇦', confederacion: 'CAF',      grupo: 'C',                  apodo: 'Leones del Atlas', color: '#C1272D' },
  { codigo: 'HAI', nombre: 'Haití',           bandera: '🇭🇹', confederacion: 'CONCACAF', grupo: 'C',                  apodo: 'Les Grenadiers', color: '#00209F' },
  { codigo: 'SCO', nombre: 'Escocia',         bandera: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', confederacion: 'UEFA', grupo: 'C',                  apodo: 'Tartan Army',    color: '#0065BD' },

  // ===== GRUPO D =====
  { codigo: 'USA', nombre: 'Estados Unidos',  bandera: '🇺🇸', confederacion: 'CONCACAF', grupo: 'D', anfitrion: true, apodo: 'USMNT',          color: '#002868' },
  { codigo: 'PAR', nombre: 'Paraguay',        bandera: '🇵🇾', confederacion: 'CONMEBOL', grupo: 'D',                  apodo: 'La Albirroja',   color: '#D52B1E' },
  { codigo: 'AUS', nombre: 'Australia',       bandera: '🇦🇺', confederacion: 'AFC',      grupo: 'D',                  apodo: 'Socceroos',      color: '#FFCD00' },
  { codigo: 'TUR', nombre: 'Türkiye',         bandera: '🇹🇷', confederacion: 'UEFA',     grupo: 'D',                  apodo: 'Ay-Yıldızlılar', color: '#E30A17' },

  // ===== GRUPO E =====
  { codigo: 'GER', nombre: 'Alemania',        bandera: '🇩🇪', confederacion: 'UEFA',     grupo: 'E',                  apodo: 'Die Mannschaft', color: '#000000' },
  { codigo: 'CUW', nombre: 'Curazao',         bandera: '🇨🇼', confederacion: 'CONCACAF', grupo: 'E',                  apodo: 'Famia Kòrsou',   color: '#002868' },
  { codigo: 'CIV', nombre: 'Costa de Marfil', bandera: '🇨🇮', confederacion: 'CAF',      grupo: 'E',                  apodo: 'Les Éléphants',  color: '#F77F00' },
  { codigo: 'ECU', nombre: 'Ecuador',         bandera: '🇪🇨', confederacion: 'CONMEBOL', grupo: 'E',                  apodo: 'La Tri',         color: '#FFD700' },

  // ===== GRUPO F =====
  { codigo: 'NED', nombre: 'Países Bajos',    bandera: '🇳🇱', confederacion: 'UEFA',     grupo: 'F',                  apodo: 'Oranje',         color: '#FF6900' },
  { codigo: 'JPN', nombre: 'Japón',           bandera: '🇯🇵', confederacion: 'AFC',      grupo: 'F',                  apodo: 'Samurái Azul',   color: '#0B1F47' },
  { codigo: 'SWE', nombre: 'Suecia',          bandera: '🇸🇪', confederacion: 'UEFA',     grupo: 'F',                  apodo: 'Blågult',        color: '#006AA7' },
  { codigo: 'TUN', nombre: 'Túnez',           bandera: '🇹🇳', confederacion: 'CAF',      grupo: 'F',                  apodo: 'Águilas de Cartago', color: '#E70013' },

  // ===== GRUPO G =====
  { codigo: 'BEL', nombre: 'Bélgica',         bandera: '🇧🇪', confederacion: 'UEFA',     grupo: 'G',                  apodo: 'Diablos Rojos',  color: '#ED2939' },
  { codigo: 'EGY', nombre: 'Egipto',          bandera: '🇪🇬', confederacion: 'CAF',      grupo: 'G',                  apodo: 'Los Faraones',   color: '#CE1126' },
  { codigo: 'IRN', nombre: 'Irán',            bandera: '🇮🇷', confederacion: 'AFC',      grupo: 'G',                  apodo: 'Team Melli',     color: '#239F40' },
  { codigo: 'NZL', nombre: 'Nueva Zelanda',   bandera: '🇳🇿', confederacion: 'OFC',      grupo: 'G',                  apodo: 'All Whites',     color: '#000000' },

  // ===== GRUPO H =====
  { codigo: 'ESP', nombre: 'España',          bandera: '🇪🇸', confederacion: 'UEFA',     grupo: 'H',                  apodo: 'La Roja',        color: '#C60B1E' },
  { codigo: 'CPV', nombre: 'Cabo Verde',      bandera: '🇨🇻', confederacion: 'CAF',      grupo: 'H',                  apodo: 'Tubarões Azuis', color: '#003893' },
  { codigo: 'KSA', nombre: 'Arabia Saudita',  bandera: '🇸🇦', confederacion: 'AFC',      grupo: 'H',                  apodo: 'Los Halcones Verdes', color: '#006C35' },
  { codigo: 'URU', nombre: 'Uruguay',         bandera: '🇺🇾', confederacion: 'CONMEBOL', grupo: 'H',                  apodo: 'La Celeste',     color: '#5CBFEB' },

  // ===== GRUPO I =====
  { codigo: 'FRA', nombre: 'Francia',         bandera: '🇫🇷', confederacion: 'UEFA',     grupo: 'I',                  apodo: 'Les Bleus',      color: '#002395' },
  { codigo: 'SEN', nombre: 'Senegal',         bandera: '🇸🇳', confederacion: 'CAF',      grupo: 'I',                  apodo: 'Leones de Teranga', color: '#00853F' },
  { codigo: 'IRQ', nombre: 'Iraq',            bandera: '🇮🇶', confederacion: 'AFC',      grupo: 'I',                  apodo: 'Los Leones de Mesopotamia', color: '#007A3D' },
  { codigo: 'NOR', nombre: 'Noruega',         bandera: '🇳🇴', confederacion: 'UEFA',     grupo: 'I',                  apodo: 'Drillos',        color: '#BA0C2F' },

  // ===== GRUPO J =====
  { codigo: 'ARG', nombre: 'Argentina',       bandera: '🇦🇷', confederacion: 'CONMEBOL', grupo: 'J',                  apodo: 'La Albiceleste', color: '#75AADB' },
  { codigo: 'ALG', nombre: 'Argelia',         bandera: '🇩🇿', confederacion: 'CAF',      grupo: 'J',                  apodo: 'Los Zorros del Desierto', color: '#006233' },
  { codigo: 'AUT', nombre: 'Austria',         bandera: '🇦🇹', confederacion: 'UEFA',     grupo: 'J',                  apodo: 'Das Team',       color: '#ED2939' },
  { codigo: 'JOR', nombre: 'Jordania',        bandera: '🇯🇴', confederacion: 'AFC',      grupo: 'J',                  apodo: 'Al-Nashama',     color: '#007A3D' },

  // ===== GRUPO K =====
  { codigo: 'POR', nombre: 'Portugal',        bandera: '🇵🇹', confederacion: 'UEFA',     grupo: 'K',                  apodo: 'A Seleção',      color: '#006600' },
  { codigo: 'COD', nombre: 'RD del Congo',    bandera: '🇨🇩', confederacion: 'CAF',      grupo: 'K',                  apodo: 'Leopardos',      color: '#007FFF' },
  { codigo: 'UZB', nombre: 'Uzbekistán',      bandera: '🇺🇿', confederacion: 'AFC',      grupo: 'K',                  apodo: 'Lobos Blancos',  color: '#1EB53A' },
  { codigo: 'COL', nombre: 'Colombia',        bandera: '🇨🇴', confederacion: 'CONMEBOL', grupo: 'K',                  apodo: 'Los Cafeteros',  color: '#FCD116' },

  // ===== GRUPO L =====
  { codigo: 'ENG', nombre: 'Inglaterra',      bandera: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', confederacion: 'UEFA', grupo: 'L',                  apodo: 'Three Lions',    color: '#FFFFFF' },
  { codigo: 'CRO', nombre: 'Croacia',         bandera: '🇭🇷', confederacion: 'UEFA',     grupo: 'L',                  apodo: 'Vatreni',        color: '#FF0000' },
  { codigo: 'GHA', nombre: 'Ghana',           bandera: '🇬🇭', confederacion: 'CAF',      grupo: 'L',                  apodo: 'Black Stars',    color: '#FCD116' },
  { codigo: 'PAN', nombre: 'Panamá',          bandera: '🇵🇦', confederacion: 'CONCACAF', grupo: 'L',                  apodo: 'La Marea Roja',  color: '#DA121A' },
];

/** Devuelve un equipo por su código FIFA */
export const obtenerEquipo = (codigo: string): Equipo | undefined =>
  equipos.find((e) => e.codigo === codigo);

/** Devuelve los 4 equipos de un grupo */
export const equiposPorGrupo = (grupo: Grupo): Equipo[] =>
  equipos.filter((e) => e.grupo === grupo);

/** Lista ordenada de los 12 grupos */
export const GRUPOS: Grupo[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

/** Lista de confederaciones para filtros */
export const CONFEDERACIONES: Confederacion[] = [
  'UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC', 'OFC',
];
