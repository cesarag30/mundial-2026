import { useMemo } from 'react';
import { GRUPOS } from '../data/teams';
import {
  calcularTablaGrupo,
  partidosConMarcador,
  type ResolverMarcador,
} from '../data/clasificacion';
import { useLiveData } from '../context/LiveDataContext';
import { useQuiniela } from '../context/QuinielaContext';
import './ComparacionGrupos.css';

/**
 * Compara, grupo por grupo, la clasificación REAL (marcadores oficiales)
 * con la clasificación según LA QUINIELA del usuario.
 *
 * Cada fila se ordena por la tabla real y muestra al lado en qué posición
 * tiene el usuario a ese equipo. ✓ = posición acertada.
 */
const ComparacionGrupos: React.FC = () => {
  const { marcadorDe } = useLiveData();
  const { predicciones } = useQuiniela();

  const resolverQuiniela: ResolverMarcador = useMemo(
    () => (p) => {
      const pred = predicciones[p.id];
      return pred
        ? { local: pred.golesLocal, visitante: pred.golesVisitante }
        : undefined;
    },
    [predicciones],
  );

  return (
    <div className="comparacion-grupos">
      <div className="comparacion-leyenda">
        Ordenado por la clasificación <strong>real</strong>. La columna
        «Tu quiniela» muestra dónde colocas tú a cada equipo. ✓ = posición acertada.
      </div>

      {GRUPOS.map((g) => {
        const tablaReal = calcularTablaGrupo(g, marcadorDe);
        const tablaQuiniela = calcularTablaGrupo(g, resolverQuiniela);
        const predichos = partidosConMarcador(g, resolverQuiniela);
        const jugadosReal = partidosConMarcador(g, marcadorDe);

        // posición y puntos de cada equipo según la quiniela
        const quinielaPorEquipo = new Map(
          tablaQuiniela.map((f) => [f.codigo, f]),
        );

        const aciertos = tablaReal.filter(
          (f) => quinielaPorEquipo.get(f.codigo)?.posicion === f.posicion,
        ).length;

        const sinDatos = predichos === 0 && jugadosReal === 0;
        const comparable = predichos > 0 && jugadosReal > 0;

        return (
          <div className="comparacion-card" key={g}>
            <div className="comparacion-titulo">
              <span>Grupo {g}</span>
              {comparable && (
                <span className="comparacion-aciertos">
                  {aciertos}/4 posiciones acertadas
                </span>
              )}
            </div>

            {sinDatos ? (
              <div className="comparacion-vacio">
                Aún no hay marcadores reales ni predicciones tuyas en este grupo.
              </div>
            ) : (
              <>
                <div className="comparacion-fila comparacion-headers">
                  <span>Real</span>
                  <span>Equipo</span>
                  <span>PTS</span>
                  <span>Tu quiniela</span>
                </div>
                {tablaReal.map((f) => {
                  const q = quinielaPorEquipo.get(f.codigo);
                  const acierto = comparable && q?.posicion === f.posicion;
                  return (
                    <div
                      key={f.codigo}
                      className={`comparacion-fila ${f.posicion <= 2 ? 'fila-clasificado' : ''}`}
                    >
                      <span className="comparacion-pos">
                        {jugadosReal > 0 ? `${f.posicion}º` : '—'}
                      </span>
                      <span className="comparacion-equipo">
                        <span className="flag-medium" style={{ fontSize: 18 }}>{f.bandera}</span>
                        {f.nombre}
                      </span>
                      <span className="pts">{jugadosReal > 0 ? f.puntos : '—'}</span>
                      <span className={`comparacion-tuya ${acierto ? 'acierto' : ''}`}>
                        {predichos > 0 && q
                          ? <>{q.posicion}º ({q.puntos} pts) {acierto && '✓'}</>
                          : '—'}
                      </span>
                    </div>
                  );
                })}
                {predichos === 0 && (
                  <div className="comparacion-nota">
                    Predice los partidos de este grupo en la Quiniela para comparar.
                  </div>
                )}
                {predichos > 0 && predichos < 6 && (
                  <div className="comparacion-nota">
                    Has predicho {predichos} de 6 partidos del grupo.
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ComparacionGrupos;
