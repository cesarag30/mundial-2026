/**
 * Codifica/decodifica una quiniela en un código compartible.
 *
 * Formato del código:
 *   MUN26-{nombre-base64}-{predicciones-base64}-{timestamp-base36}
 *
 * Diseño:
 *  - 100% serverless (no requiere backend)
 *  - URL-safe (puede ir en un mensaje de WhatsApp, email, etc.)
 *  - Pequeño: ~500 bytes para una quiniela completa de 104 partidos
 *  - Versionado con prefijo "MUN26-" por si cambiamos el formato
 */

import type { Prediccion } from '../context/QuinielaContext';

export interface QuinielaCompartida {
  /** Nombre del propietario de la quiniela */
  nombre: string;
  /** Predicciones indexadas por partidoId */
  predicciones: Record<string, Prediccion>;
  /** Timestamp ISO de cuándo se generó el código */
  generado: string;
}

const PREFIJO = 'MUN26';

/** Codifica un string a base64 URL-safe (sin padding) */
const toBase64Url = (s: string): string => {
  // btoa solo soporta Latin1, así que encode primero
  const b64 = btoa(unescape(encodeURIComponent(s)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const fromBase64Url = (s: string): string => {
  let b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  return decodeURIComponent(escape(atob(b64)));
};

/**
 * Convierte el objeto de predicciones a un string ultracompacto.
 *
 * Cada predicción ocupa ~10 chars: "G01:2-1;"
 * Para 100 predicciones: ~1000 chars (luego base64 → ~1400)
 */
const predToString = (predicciones: Record<string, Prediccion>): string => {
  return Object.values(predicciones)
    .filter((p) => p.golesLocal >= 0 && p.golesVisitante >= 0)
    .map((p) => `${p.partidoId}:${p.golesLocal}-${p.golesVisitante}`)
    .join(';');
};

const stringToPred = (s: string): Record<string, Prediccion> => {
  const out: Record<string, Prediccion> = {};
  if (!s) return out;
  s.split(';').forEach((entry) => {
    const m = entry.match(/^([A-Z0-9-]+):(\d+)-(\d+)$/);
    if (!m) return;
    const [, partidoId, l, v] = m;
    out[partidoId] = {
      partidoId,
      golesLocal: parseInt(l, 10),
      golesVisitante: parseInt(v, 10),
    };
  });
  return out;
};

/** Codifica una quiniela completa a un código compartible */
export const codificarQuiniela = (q: QuinielaCompartida): string => {
  const nombreEnc = toBase64Url(q.nombre);
  const predEnc = toBase64Url(predToString(q.predicciones));
  const ts = Date.parse(q.generado).toString(36);
  return `${PREFIJO}-${nombreEnc}-${predEnc}-${ts}`;
};

/** Decodifica un código a una quiniela. Devuelve null si el formato es inválido. */
export const decodificarQuiniela = (codigo: string): QuinielaCompartida | null => {
  try {
    const limpio = codigo.trim();
    const partes = limpio.split('-');
    // Mínimo: MUN26-{nombre}-{pred}-{ts} = 4 partes
    if (partes.length < 4) return null;
    if (partes[0] !== PREFIJO) return null;

    // La última parte es el timestamp; las del medio son predicciones
    // (rejoin por si el nombre o predicciones tienen guiones internos
    // poco probable porque son base64 URL-safe, pero por si acaso)
    const ts = partes[partes.length - 1];
    const predEnc = partes[partes.length - 2];
    const nombreEnc = partes.slice(1, partes.length - 2).join('-');

    const nombre = fromBase64Url(nombreEnc);
    const predStr = fromBase64Url(predEnc);
    const predicciones = stringToPred(predStr);
    const generado = new Date(parseInt(ts, 36)).toISOString();

    if (!nombre || nombre.length > 50) return null;

    return { nombre, predicciones, generado };
  } catch {
    return null;
  }
};

/** Genera un texto bonito para compartir por WhatsApp */
export const textoCompartir = (
  q: QuinielaCompartida,
  codigo: string,
  puntos: number,
  aciertos: number,
): string => {
  const totalPred = Object.keys(q.predicciones).length;
  return `🏆 ¡Mira mi Quiniela del Mundial 2026! 🏆

👤 ${q.nombre}
⚽ ${totalPred} partidos predichos
🎯 ${aciertos} marcadores acertados
⭐ ${puntos} puntos

¿Te animas a competir? Descarga la app del Mundial y pega este código en "Importar amigo":

${codigo}

🇲🇽🇨🇦🇺🇸 #Mundial2026`;
};
