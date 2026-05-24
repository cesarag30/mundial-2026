import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useParams } from 'react-router';
import { obtenerEquipo } from '../data/teams';
import {
  ETIQUETAS_POSICION,
  ORDEN_POSICIONES,
  plantillaAgrupada,
  tienePlantillaCompleta,
} from '../data/squads';
import { partidosDeEquipo } from '../data/matches';
import './Equipos.css';

const EquipoDetalle: React.FC = () => {
  const { codigo } = useParams<{ codigo: string }>();
  const eq = obtenerEquipo(codigo);

  if (!eq) {
    return (
      <IonPage>
        <IonContent className="ion-padding">No se encontró el equipo {codigo}</IonContent>
      </IonPage>
    );
  }

  const plantilla = plantillaAgrupada(codigo);
  const completa = tienePlantillaCompleta(codigo);
  const totalJugadores = ORDEN_POSICIONES.reduce(
    (acc, pos) => acc + plantilla[pos].length, 0
  );
  const partidos = partidosDeEquipo(codigo).filter((p) => p.fase === 'GRUPOS');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar-mundial">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/equipos" />
          </IonButtons>
          <IonTitle>{eq.nombre}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Portada del equipo */}
        <div className="equipo-portada">
          <div className="flag-large" aria-hidden>{eq.bandera}</div>
          <h1>{eq.nombre}</h1>
          <p className="apodo">{eq.apodo}</p>
          <div className="meta">
            Grupo {eq.grupo} · {eq.confederacion}
            {eq.anfitrion && ' · 🏟️ Anfitrión'}
          </div>
        </div>

        {/* Partidos del equipo en fase de grupos */}
        <IonList inset>
          <IonListHeader>
            <IonLabel><h2>Partidos de la fase de grupos</h2></IonLabel>
          </IonListHeader>
          {partidos.map((p) => {
            const oponente = p.equipoLocal === codigo
              ? obtenerEquipo(p.equipoVisitante)
              : obtenerEquipo(p.equipoLocal);
            const esLocal = p.equipoLocal === codigo;
            return (
              <IonItem key={p.id}>
                <IonLabel>
                  <h3>
                    Jornada {p.jornada} · {esLocal ? 'vs' : '@'} {oponente?.bandera} {oponente?.nombre}
                  </h3>
                  <IonNote>{p.fecha} · {p.horaLocal} (hora local)</IonNote>
                </IonLabel>
              </IonItem>
            );
          })}
        </IonList>

        {/* Plantilla convocada */}
        {!completa && (
          <div className="aviso-plantilla-parcial">
            ⚠️ Plantilla provisional ({totalJugadores} jugadores). FIFA publica las
            listas oficiales de 26 entre el 1 y el 6 de junio de 2026.
          </div>
        )}

        <IonListHeader className="ion-padding-start ion-padding-top">
          <IonLabel>
            <h2>Plantilla convocada</h2>
            <IonNote>{totalJugadores} jugadores</IonNote>
          </IonLabel>
        </IonListHeader>

        {ORDEN_POSICIONES.map((pos) => {
          const lista = plantilla[pos];
          if (lista.length === 0) return null;
          return (
            <IonList key={pos} inset>
              <IonItem className="plantilla-grupo-header" lines="none">
                <IonLabel>{ETIQUETAS_POSICION[pos]}s ({lista.length})</IonLabel>
              </IonItem>
              {lista.map((j) => (
                <IonItem key={`${pos}-${j.dorsal}-${j.nombre}`}>
                  <span
                    slot="start"
                    className={`jugador-dorsal ${j.capitan ? 'jugador-capitan' : ''}`}
                  >
                    {j.dorsal}
                  </span>
                  <IonLabel>
                    <h3>
                      {j.nombre} {j.capitan && '🅒'}
                    </h3>
                    <IonNote>{j.club}</IonNote>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          );
        })}
      </IonContent>
    </IonPage>
  );
};

export default EquipoDetalle;
