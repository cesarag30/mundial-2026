import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useState } from 'react';
import { obtenerEquipo } from '../data/teams';
import { obtenerSede } from '../data/sedes';
import { partidos, ETIQUETAS_FASE } from '../data/matches';
import { useQuiniela } from '../context/QuinielaContext';
import { useLiveData } from '../context/LiveDataContext';
import ScoreInput from '../components/ScoreInput';
import UpdateBanner from '../components/UpdateBanner';
import './Quiniela.css';

type Filtro = 'PROXIMOS' | 'JUGADOS' | 'TODOS';

const Quiniela: React.FC = () => {
  const { predicciones, guardarPrediccion, desglose, puntosDe } = useQuiniela();
  const { marcadorDe, marcadorVivo } = useLiveData();
  const [filtro, setFiltro] = useState<Filtro>('TODOS');

  const lista = partidos.filter((p) => {
    const tieneMarcador = !!marcadorDe(p);
    if (filtro === 'JUGADOS') return tieneMarcador;
    if (filtro === 'PROXIMOS') return !tieneMarcador;
    return true;
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar-mundial">
          <IonTitle>Mi Quiniela</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <UpdateBanner />

        <div className="puntos-resumen">
          <div className="puntos-total">
            <span className="puntos-num">{desglose.total}</span>
            <span className="puntos-label">puntos</span>
          </div>
          <div className="puntos-detalle">
            <div><strong>{desglose.exactos}</strong><span>Exactos (3p)</span></div>
            <div><strong>{desglose.ganadores}</strong><span>Ganadores (1p)</span></div>
            <div><strong>{desglose.fallidos}</strong><span>Fallidos</span></div>
            <div><strong>{desglose.pendientes}</strong><span>Pendientes</span></div>
          </div>
        </div>

        <div className="quiniela-reglas">
          <strong>Reglas:</strong> 3 puntos por marcador exacto · 1 punto por
          acertar ganador o empate · 0 puntos si fallas.
        </div>

        <IonSegment value={filtro} onIonChange={(e) => setFiltro(e.detail.value as Filtro)}>
          <IonSegmentButton value="TODOS"><IonLabel>Todos</IonLabel></IonSegmentButton>
          <IonSegmentButton value="PROXIMOS"><IonLabel>Próximos</IonLabel></IonSegmentButton>
          <IonSegmentButton value="JUGADOS"><IonLabel>Jugados</IonLabel></IonSegmentButton>
        </IonSegment>

        <IonList>
          {lista.map((p) => {
            const local = obtenerEquipo(p.equipoLocal);
            const visitante = obtenerEquipo(p.equipoVisitante);
            const sede = obtenerSede(p.sedeId);
            const pred = predicciones[p.id] ?? { partidoId: p.id, golesLocal: 0, golesVisitante: 0 };
            const marcador = marcadorDe(p);
            const vivo = marcadorVivo(p.id);
            const yaJugado = !!marcador;
            const enJuego = vivo?.estado === 'IN_PLAY' || vivo?.estado === 'PAUSED';
            const r = puntosDe(p.id);

            return (
              <IonItem key={p.id} className="quiniela-item" lines="full">
                <div className="quiniela-row">
                  <div className="quiniela-meta">
                    <IonNote>{p.fecha} · {p.horaLocal} · {sede?.ciudad}</IonNote>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      {enJuego && <span className="en-vivo-dot" />}
                      {p.grupo
                        ? <span className="fase-tag">Grupo {p.grupo} · J{p.jornada}</span>
                        : <span className="fase-tag">{ETIQUETAS_FASE[p.fase]}</span>}
                    </div>
                  </div>

                  <div className="quiniela-equipos">
                    <div className="equipo-line equipo-local">
                      <span className="flag-medium">{local?.bandera ?? '⚪'}</span>
                      <strong>{local?.nombre ?? 'TBD'}</strong>
                    </div>

                    <div className="quiniela-marcadores">
                      <div className="marcador-bloque tu-marcador">
                        <div className="marcador-titulo">Tu marcador</div>
                        <ScoreInput
                          golesLocal={pred.golesLocal}
                          golesVisitante={pred.golesVisitante}
                          onChange={(l, v) => guardarPrediccion({
                            partidoId: p.id,
                            golesLocal: l,
                            golesVisitante: v,
                          })}
                          disabled={yaJugado && !enJuego}
                        />
                      </div>
                      <div className="marcador-bloque marcador-real">
                        <div className="marcador-titulo">
                          Oficial {enJuego && <span style={{ color: 'var(--ion-color-danger)' }}>· EN VIVO</span>}
                        </div>
                        {marcador ? (
                          <span className={`oficial-num ${enJuego ? 'marcador-en-vivo' : ''}`}>
                            {marcador.local} · {marcador.visitante}
                          </span>
                        ) : (
                          <span className="oficial-pendiente">—</span>
                        )}
                      </div>
                    </div>

                    <div className="equipo-line equipo-visitante">
                      <strong>{visitante?.nombre ?? 'TBD'}</strong>
                      <span className="flag-medium">{visitante?.bandera ?? '⚪'}</span>
                    </div>
                  </div>

                  {yaJugado && predicciones[p.id] && r.tipo !== 'pendiente' && (
                    <div className={`puntos-partido puntos-${r.puntos}`}>
                      {r.tipo === 'exacto' && '🎯 ¡Marcador exacto! +3 pts'}
                      {r.tipo === 'ganador' && '✓ Acertaste el ganador +1 pt'}
                      {r.tipo === 'fallo' && '✗ No acertaste'}
                    </div>
                  )}
                </div>
              </IonItem>
            );
          })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Quiniela;
