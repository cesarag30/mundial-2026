import { GRUPOS } from '../data/teams';
import { calcularTablaGrupo, type ResolverMarcador } from '../data/clasificacion';
import { useLiveData } from '../context/LiveDataContext';
import './Bracket.css';

interface Props {
  /** Fuente de marcadores. Por defecto: oficiales (API en vivo / estáticos). */
  resolver?: ResolverMarcador;
  /** Etiqueta opcional bajo el título de cada grupo (ej. "según tu quiniela") */
  subtitulo?: string;
}

const TablaGrupos: React.FC<Props> = ({ resolver, subtitulo }) => {
  const { marcadorDe } = useLiveData();
  const resolverFinal = resolver ?? marcadorDe;

  return (
    <div className="grupos-tabla">
      {GRUPOS.map((g) => {
        const filas = calcularTablaGrupo(g, resolverFinal);
        return (
          <div className="grupo-card" key={g}>
            <div className="grupo-card-titulo">
              Grupo {g}
              {subtitulo && <span className="grupo-card-subtitulo"> · {subtitulo}</span>}
            </div>
            <div className="grupo-card-equipo grupo-card-headers">
              <span></span><span>Equipo</span>
              <span>PJ</span><span>GF</span><span>GC</span><span>PTS</span>
            </div>
            {filas.map((f) => (
              <div
                key={f.codigo}
                className={`grupo-card-equipo ${f.posicion <= 2 ? 'fila-clasificado' : ''}`}
              >
                <span className="flag-medium" style={{ fontSize: 18 }}>{f.bandera}</span>
                <span>{f.nombre}</span>
                <span>{f.jugados}</span>
                <span>{f.golesFavor}</span>
                <span>{f.golesContra}</span>
                <span className="pts">{f.puntos}</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default TablaGrupos;
