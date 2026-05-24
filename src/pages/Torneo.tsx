import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { trophy } from 'ionicons/icons';
import { useHistory } from 'react-router';
import { useState } from 'react';
import Bracket from '../components/Bracket';
import TablaGrupos from '../components/TablaGrupos';
import UpdateBanner from '../components/UpdateBanner';
import { obtenerEquipo } from '../data/teams';
import { partidosEliminatorias } from '../data/matches-eliminatorias';
import { useLiveData } from '../context/LiveDataContext';

const Torneo: React.FC = () => {
  const history = useHistory();
  const [vista, setVista] = useState<'BRACKET' | 'GRUPOS'>('GRUPOS');
  const { marcadorDe } = useLiveData();

  const final = partidosEliminatorias.find((p) => p.fase === 'FINAL');
  const marcadorFinal = final ? marcadorDe(final) : undefined;
  const finalJugada = !!marcadorFinal;
  const campeonCodigo = finalJugada && final
    ? (marcadorFinal!.local > marcadorFinal!.visitante
        ? final.equipoLocal
        : final.equipoVisitante)
    : null;
  const campeon = campeonCodigo ? obtenerEquipo(campeonCodigo) : null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar-mundial">
          <IonTitle>Torneo</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={vista} onIonChange={(e) => setVista(e.detail.value as 'BRACKET' | 'GRUPOS')}>
            <IonSegmentButton value="GRUPOS"><IonLabel>Grupos</IonLabel></IonSegmentButton>
            <IonSegmentButton value="BRACKET"><IonLabel>Bracket</IonLabel></IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <UpdateBanner />

        {campeon && (
          <div style={{ padding: 16, textAlign: 'center' }}>
            <IonButton expand="block" color="warning" onClick={() => history.push('/campeon')}>
              <IonIcon icon={trophy} slot="start" />
              ¡Campeón: {campeon.bandera} {campeon.nombre}!
            </IonButton>
          </div>
        )}

        {vista === 'GRUPOS' ? <TablaGrupos /> : <Bracket />}
      </IonContent>
    </IonPage>
  );
};

export default Torneo;
