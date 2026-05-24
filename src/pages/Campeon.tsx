import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { obtenerEquipo } from '../data/teams';
import { obtenerPlantilla, ETIQUETAS_POSICION, ORDEN_POSICIONES } from '../data/squads';
import { partidosEliminatorias } from '../data/matches-eliminatorias';
import { obtenerSede } from '../data/sedes';
import { useLiveData } from '../context/LiveDataContext';
import './Campeon.css';

const Campeon: React.FC = () => {
  const { marcadorDe } = useLiveData();
  const final = partidosEliminatorias.find((p) => p.fase === 'FINAL');
  const marcadorFinal = final ? marcadorDe(final) : undefined;
  const finalJugada = !!marcadorFinal;
  const campeonCodigo = finalJugada && final
    ? (marcadorFinal!.local > marcadorFinal!.visitante
        ? final.equipoLocal
        : final.equipoVisitante)
    : null;
  const subcampeonCodigo = finalJugada && final
    ? (campeonCodigo === final.equipoLocal ? final.equipoVisitante : final.equipoLocal)
    : null;

  const campeon = campeonCodigo ? obtenerEquipo(campeonCodigo) : null;
  const subcampeon = subcampeonCodigo ? obtenerEquipo(subcampeonCodigo) : null;
  const sedeFinal = final ? obtenerSede(final.sedeId) : null;

  // Recorrido: todos los partidos eliminatorios del campeón
  const recorrido = campeonCodigo
    ? partidosEliminatorias.filter((p) =>
        p.equipoLocal === campeonCodigo || p.equipoVisitante === campeonCodigo
      )
    : [];

  const plantilla = campeonCodigo ? obtenerPlantilla(campeonCodigo) : [];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar-mundial">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/torneo" />
          </IonButtons>
          <IonTitle>🏆 Campeón Mundial 2026</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {!campeon ? (
          <div className="campeon-pendiente">
            <div className="trofeo-emoji">🏆</div>
            <h2>Aún no hay campeón</h2>
            <p>
              Cuando se juegue la final del 19 de julio en MetLife Stadium y se
              registre el marcador oficial, aquí aparecerá la selección campeona
              del Mundial 2026 con la foto del equipo y su recorrido completo.
            </p>
          </div>
        ) : (
          <>
            {/* Hero con bandera enorme = "foto" del equipo */}
            <div
              className="campeon-hero"
              style={{
                background: `linear-gradient(135deg, ${campeon.color}cc 0%, ${campeon.color} 100%)`,
              }}
            >
              <div className="trofeo-emoji">🏆</div>
              <div className="campeon-flag">{campeon.bandera}</div>
              <h1>{campeon.nombre}</h1>
              <p className="campeon-apodo">{campeon.apodo}</p>
              <p className="campeon-titulo">CAMPEÓN DEL MUNDIAL 2026</p>
            </div>

            {/* Datos de la final */}
            <div className="final-datos">
              <h3>La gran final</h3>
              <div className="final-resultado">
                <div className="final-equipo">
                  <span className="flag-medium">{campeon.bandera}</span>
                  <strong>{campeon.nombre}</strong>
                </div>
                <span className="final-score">
                  {marcadorFinal!.local > marcadorFinal!.visitante
                    ? `${marcadorFinal!.local} - ${marcadorFinal!.visitante}`
                    : `${marcadorFinal!.visitante} - ${marcadorFinal!.local}`}
                </span>
                <div className="final-equipo">
                  <span className="flag-medium">{subcampeon?.bandera}</span>
                  <strong>{subcampeon?.nombre}</strong>
                </div>
              </div>
              <IonNote>
                {final!.fecha} · {sedeFinal?.estadio}, {sedeFinal?.ciudad}
              </IonNote>
            </div>

            {/* Recorrido hasta la final */}
            <div className="recorrido-titulo">Camino al título</div>
            <IonList>
              {recorrido.map((p) => {
                const rival = obtenerEquipo(
                  p.equipoLocal === campeonCodigo ? p.equipoVisitante : p.equipoLocal
                );
                const m = marcadorDe(p);
                const golesCampeon = p.equipoLocal === campeonCodigo ? m?.local : m?.visitante;
                const golesRival   = p.equipoLocal === campeonCodigo ? m?.visitante : m?.local;
                return (
                  <IonItem key={p.id}>
                    <IonLabel>
                      <h3>
                        {p.fase === 'R32' && '1/16 · '}
                        {p.fase === 'OCTAVOS' && 'Octavos · '}
                        {p.fase === 'CUARTOS' && 'Cuartos · '}
                        {p.fase === 'SEMIS' && 'Semifinal · '}
                        {p.fase === 'FINAL' && 'Final · '}
                        vs {rival?.bandera} {rival?.nombre}
                      </h3>
                      <IonNote>{p.fecha}</IonNote>
                    </IonLabel>
                    <div slot="end" className="recorrido-score">
                      {golesCampeon ?? '-'} - {golesRival ?? '-'}
                    </div>
                  </IonItem>
                );
              })}
            </IonList>

            {/* Plantilla campeona */}
            <div className="recorrido-titulo">Plantilla campeona</div>
            {ORDEN_POSICIONES.map((pos) => {
              const lista = plantilla.filter((j) => j.posicion === pos);
              if (lista.length === 0) return null;
              return (
                <div key={pos}>
                  <div className="plantilla-pos-titulo">
                    {ETIQUETAS_POSICION[pos]}s
                  </div>
                  <IonList>
                    {lista.map((j) => (
                      <IonItem key={`${pos}-${j.dorsal}`}>
                        <span className="jugador-dorsal" slot="start">{j.dorsal}</span>
                        <IonLabel>
                          <h3>{j.nombre} {j.capitan && '🅒'}</h3>
                          <IonNote>{j.club}</IonNote>
                        </IonLabel>
                      </IonItem>
                    ))}
                  </IonList>
                </div>
              );
            })}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Campeon;
