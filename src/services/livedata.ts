/**
 * Servicio de datos en vivo del Mundial 2026.
 *
 * Estrategia:
 *  1. Si hay API key de football-data.org configurada → consulta esa API.
 *  2. Si hay un JSON URL personalizado (ej. un GitHub Gist) → consulta ese URL.
 *  3. Si nada está configurado → usa solo los datos estáticos del proyecto.
 *
 * Configurar en `.env.local`:
 *   REACT_APP_FOOTBALL_API_KEY=tu_clave_aqui
 *   o
 *   REACT_APP_RESULTS_JSON_URL=https://gist.githubusercontent.com/usuario/abc/raw/results.json
 *
 * El URL del JSON debe devolver un array de objetos:
 *   [{ "partidoId": "G01", "local": 2, "visitante": 1 }, ...]
 */

import { partidos } from '../data/matches';
import type { Marcador } from '../data/matches';

const API_KEY = process.env.REACT_APP_FOOTBALL_API_KEY ?? '';
const JSON_URL = process.env.REACT_APP_RESULTS_JSON_URL ?? '';
const FOOTBALL_DATA_BASE = 'https://api.football-data.org/v4';
/** Identificador de competición en football-data.org */
const COMPETITION_ID = 'WC';
/** URL del archivo de simulación local (auto-detectado si existe) */
const SIMULACION_URL = '/simulacion.json';
/** Cache: ¿hemos confirmado que existe simulacion.json? */
let _simulacionDisponible: boolean | null = null;

export type EstadoPartido = 'SCHEDULED' | 'IN_PLAY' | 'PAUSED' | 'FINISHED';

export interface MarcadorVivo extends Marcador {
  estado: EstadoPartido;
  /** Timestamp ISO de la última actualización */
  actualizado: string;
}

/** Resultado de un fetch: mapa de partidoId -> marcador en vivo */
export type LiveMarcadores = Record<string, MarcadorVivo>;

/**
 * Mapeo de códigos del API a códigos FIFA internos.
 * Verificado contra football-data.org el 24-may-2026 con los 48 equipos del Mundial.
 * Solo se listan los que DIFIEREN del estándar FIFA de 3 letras.
 */
const ALIAS_CODIGO: Record<string, string> = {
  // football-data.org usa URY (ISO 3166-1 alpha-3) en vez de URU (FIFA)
  URY: 'URU',
  // (sigue el mismo patrón para otros si surgen incompatibilidades)
};

const normaliza = (codigo: string): string =>
  ALIAS_CODIGO[codigo?.toUpperCase()] ?? codigo?.toUpperCase() ?? '';

/**
 * Construye un índice rápido `(fecha + local + visitante) -> partidoId`
 * para mapear cualquier respuesta de API a nuestro id interno.
 */
const indicePorEnfrentamiento = (() => {
  const map = new Map<string, string>();
  partidos.forEach((p) => {
    const key = `${p.fecha}|${p.equipoLocal}|${p.equipoVisitante}`;
    map.set(key, p.id);
    // tolerancia a invertido (algunos APIs pueden invertir local/visitante)
    map.set(`${p.fecha}|${p.equipoVisitante}|${p.equipoLocal}`, p.id);
  });
  return map;
})();

/** Convierte un partido del API football-data.org a nuestro formato */
const mapFootballDataMatch = (m: any): { id: string; data: MarcadorVivo } | null => {
  const fecha = (m.utcDate as string)?.slice(0, 10);
  const local = normaliza(m.homeTeam?.tla);
  const visitante = normaliza(m.awayTeam?.tla);
  if (!fecha || !local || !visitante) return null;
  const id = indicePorEnfrentamiento.get(`${fecha}|${local}|${visitante}`);
  if (!id) return null;
  const golesL = m.score?.fullTime?.home;
  const golesV = m.score?.fullTime?.away;
  if (golesL == null || golesV == null) return null;
  return {
    id,
    data: {
      local: golesL,
      visitante: golesV,
      estado: (m.status as EstadoPartido) ?? 'SCHEDULED',
      actualizado: new Date().toISOString(),
    },
  };
};

/** Fetch desde football-data.org (requiere API key) */
const fetchDesdeFootballData = async (): Promise<LiveMarcadores> => {
  const res = await fetch(
    `${FOOTBALL_DATA_BASE}/competitions/${COMPETITION_ID}/matches`,
    { headers: { 'X-Auth-Token': API_KEY } },
  );
  if (!res.ok) throw new Error(`football-data.org HTTP ${res.status}`);
  const json = await res.json();
  const matches = json.matches ?? [];
  const out: LiveMarcadores = {};
  matches.forEach((m: any) => {
    const mapped = mapFootballDataMatch(m);
    if (mapped) out[mapped.id] = mapped.data;
  });
  return out;
};

/** Fetch desde un JSON URL personalizado (sin auth) */
const fetchDesdeJsonUrl = async (url: string): Promise<LiveMarcadores> => {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Custom JSON HTTP ${res.status}`);
  const lista: Array<{
    partidoId: string;
    local: number;
    visitante: number;
    estado?: EstadoPartido;
  }> = await res.json();
  const out: LiveMarcadores = {};
  const ahora = new Date().toISOString();
  lista.forEach((r) => {
    if (!r.partidoId || typeof r.local !== 'number' || typeof r.visitante !== 'number') return;
    out[r.partidoId] = {
      local: r.local,
      visitante: r.visitante,
      estado: r.estado ?? 'FINISHED',
      actualizado: ahora,
    };
  });
  return out;
};

/** Comprueba si existe public/simulacion.json (HEAD request, una sola vez) */
const detectaSimulacion = async (): Promise<boolean> => {
  if (_simulacionDisponible !== null) return _simulacionDisponible;
  try {
    const res = await fetch(SIMULACION_URL, { method: 'HEAD', cache: 'no-store' });
    _simulacionDisponible = res.ok;
  } catch {
    _simulacionDisponible = false;
  }
  return _simulacionDisponible;
};

/** Decide qué backend usar y devuelve los marcadores en vivo */
export const fetchLiveMarcadores = async (): Promise<LiveMarcadores> => {
  if (API_KEY) {
    return await fetchDesdeFootballData();
  }
  if (JSON_URL) {
    return await fetchDesdeJsonUrl(JSON_URL);
  }
  // Auto-detección de simulación local
  if (await detectaSimulacion()) {
    return await fetchDesdeJsonUrl(SIMULACION_URL);
  }
  return {};
};

/** Indica si la app tiene alguna fuente de datos en vivo configurada o detectada */
export const tieneFuenteEnVivo = (): boolean =>
  !!API_KEY || !!JSON_URL || _simulacionDisponible === true;

/** Devuelve qué fuente está activa, para mostrar en la UI */
export const nombreFuenteActiva = (): string => {
  if (API_KEY) return 'football-data.org';
  if (JSON_URL) return 'JSON personalizado';
  if (_simulacionDisponible) return '🎲 simulación';
  return 'datos estáticos';
};
