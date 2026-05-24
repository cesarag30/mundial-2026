import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  fetchLiveMarcadores,
  tieneFuenteEnVivo,
  nombreFuenteActiva,
  type LiveMarcadores,
  type MarcadorVivo,
} from '../services/livedata';
import { partidoPorId, type Partido, type Marcador } from '../data/matches';

/** Intervalo de auto-refresco (2 minutos) */
const POLLING_MS = 2 * 60 * 1000;

const STORAGE_KEY = 'mundial2026-livedata';

interface PersistedState {
  marcadores: LiveMarcadores;
  ultimaActualizacion: string | null;
}

interface LiveDataContextType {
  /** Marcadores en vivo indexados por partidoId */
  marcadores: LiveMarcadores;
  /** ISO timestamp de la última actualización exitosa */
  ultimaActualizacion: string | null;
  /** Si hay un fetch en curso */
  cargando: boolean;
  /** Mensaje de error de la última operación (null si OK) */
  error: string | null;
  /** Fuente activa (football-data.org, etc.) — para mostrar en UI */
  fuente: string;
  /** ¿Está configurada alguna fuente en vivo? */
  enVivoActivo: boolean;
  /** Dispara un refresh manual ahora */
  refrescar: () => Promise<void>;
  /**
   * Devuelve el marcador efectivo de un partido:
   * primero busca en datos en vivo, si no, usa el `marcadorOficial` estático.
   */
  marcadorDe: (partido: Partido) => Marcador | undefined;
  /** Devuelve el marcador vivo (con estado) de un partido, si existe */
  marcadorVivo: (partidoId: string) => MarcadorVivo | undefined;
}

const LiveDataContext = createContext<LiveDataContextType | undefined>(undefined);

const loadFromStorage = (): PersistedState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { marcadores: {}, ultimaActualizacion: null };
};

const saveToStorage = (state: PersistedState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
};

export const LiveDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initial = loadFromStorage();
  const [marcadores, setMarcadores] = useState<LiveMarcadores>(initial.marcadores);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<string | null>(initial.ultimaActualizacion);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Estos pueden cambiar tras el primer fetch (auto-detección de simulacion.json)
  const [enVivoActivo, setEnVivoActivo] = useState<boolean>(tieneFuenteEnVivo());
  const [fuente, setFuente] = useState<string>(nombreFuenteActiva());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refrescar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const nuevos = await fetchLiveMarcadores();
      // Re-evalúa fuente activa por si se detectó simulacion.json
      setEnVivoActivo(tieneFuenteEnVivo());
      setFuente(nombreFuenteActiva());
      if (Object.keys(nuevos).length > 0) {
        const ahora = new Date().toISOString();
        setMarcadores(nuevos);
        setUltimaActualizacion(ahora);
        saveToStorage({ marcadores: nuevos, ultimaActualizacion: ahora });
      }
    } catch (e: any) {
      setError(e?.message ?? 'Error al actualizar');
    } finally {
      setCargando(false);
    }
  }, []);

  // Carga inicial + polling
  useEffect(() => {
    // Fetch inicial inmediato (intenta detectar simulacion.json incluso si no hay API)
    refrescar();
    intervalRef.current = setInterval(refrescar, POLLING_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refrescar]);

  // Refresh al volver a foco (cuando el usuario regresa a la app)
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refrescar();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [refrescar]);

  const marcadorDe = useCallback((partido: Partido): Marcador | undefined => {
    const vivo = marcadores[partido.id];
    if (vivo) return { local: vivo.local, visitante: vivo.visitante };
    return partido.marcadorOficial;
  }, [marcadores]);

  const marcadorVivo = useCallback(
    (partidoId: string): MarcadorVivo | undefined => marcadores[partidoId],
    [marcadores]
  );

  return (
    <LiveDataContext.Provider
      value={{
        marcadores,
        ultimaActualizacion,
        cargando,
        error,
        fuente,
        enVivoActivo,
        refrescar,
        marcadorDe,
        marcadorVivo,
      }}
    >
      {children}
    </LiveDataContext.Provider>
  );
};

export const useLiveData = (): LiveDataContextType => {
  const ctx = useContext(LiveDataContext);
  if (!ctx) throw new Error('useLiveData debe usarse dentro de LiveDataProvider');
  return ctx;
};

/** Helper standalone para resolver el marcador efectivo (también lo usa la quiniela) */
export const resolverMarcador = (
  partido: Partido,
  marcadoresVivo: LiveMarcadores,
): Marcador | undefined => {
  const vivo = marcadoresVivo[partido.id];
  if (vivo) return { local: vivo.local, visitante: vivo.visitante };
  return partido.marcadorOficial;
};

/** Resolver por id de partido */
export const resolverMarcadorPorId = (
  partidoId: string,
  marcadoresVivo: LiveMarcadores,
): Marcador | undefined => {
  const partido = partidoPorId(partidoId);
  if (!partido) return undefined;
  return resolverMarcador(partido, marcadoresVivo);
};
