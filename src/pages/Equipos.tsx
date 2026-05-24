import {
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
  IonBadge,
} from '@ionic/react';
import { useHistory } from 'react-router';
import { equiposPorGrupo, GRUPOS } from '../data/teams';
import './Equipos.css';

const Equipos: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar-mundial">
          <IonTitle>Equipos · Mundial 2026</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="equipos-intro">
          <p>
            48 selecciones clasificadas, repartidas en 12 grupos. Toca un equipo
            para ver su plantilla convocada.
          </p>
        </div>

        {GRUPOS.map((grupo) => (
          <IonList key={grupo} inset>
            <IonListHeader className="grupo-header">
              <IonLabel>
                <h2>Grupo {grupo}</h2>
              </IonLabel>
            </IonListHeader>

            {equiposPorGrupo(grupo).map((eq) => (
              <IonItem
                key={eq.codigo}
                button
                detail
                onClick={() => history.push(`/equipos/${eq.codigo}`)}
              >
                <span className="flag-medium" slot="start" aria-hidden>
                  {eq.bandera}
                </span>
                <IonLabel>
                  <h3>{eq.nombre}</h3>
                  <IonNote color="medium">{eq.apodo} · {eq.confederacion}</IonNote>
                </IonLabel>
                {eq.anfitrion && (
                  <IonBadge color="warning" slot="end">
                    Anfitrión
                  </IonBadge>
                )}
              </IonItem>
            ))}
          </IonList>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Equipos;
