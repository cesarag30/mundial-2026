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
import { useMemo, useState } from 'react';
import Bracket from '../components/Bracket';
import TablaGrupos from '../components/TablaGrupos';
import ComparacionGrupos from '../components/ComparacionGrupos';
import UpdateBanner from '../components/UpdateBanner';
import { obtenerEquipo } from '../data/teams';
import { partidosEliminatorias } from '../data/matches-eliminatorias';
import { useLiveData } from '../context/LiveDataContext';
import { useQuiniela } from '../context/QuinielaContext';
import type { ResolverMarcador } from '../data/clasificacion';

type Vista = 'GRUPOS' | 'BRACKET';
type FuenteGrupos = 'OFICIAL' | 'QUINIELA' | 'COMPARAR';

const Torneo: React.FC = () => {
  const history = useHistory();
  const [vista, setVista] = useState<Vista>('GRUPOS');
  const [fuente, setFuente] = useState<FuenteGrupos>('OFICIAL');
  const { marcadorDe } = useLiveData();
  const { predicciones } = useQuiniela();

  // Resolver de marcadores según las predicciones del usuario
  const resolverQuiniela: ResolverMarcador = useMemo(
    () => (p) => {
      const pred = predicciones[p.id];
      return pred
        ? { local: pred.golesLocal, visitante: pred.golesVisitante }
        : undefined;
    },
    [predicciones],
  );

  // ¿Hay campeón? (final con marcador oficial)
  const final = partidosEliminatorias.find((p) => p.fase === 'FINAL');
  const marcadorFinal = final ? marcadorDe(final) : undefined;
  const campeonCodigo = marcadorFinal && final
    ? (marcadorFinal.local > marcadorFinal.visitante
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
          <IonSegment value={vista} onIonChange={(e) => setVista(e.detail.value as Vista)}>
            <IonSegmentButton value="GRUPOS"><IonLabel>Grupos</IonLabel></IonSegmentButton>
            <IonSegmentButton value="BRACKET"><IonLabel>Bracket</IonLabel></IonSegmentButton>
          </IonSegment>
        </IonToolbar>
        {vista === 'GRUPOS' && (
          <IonToolbar>
            <IonSegment
              value={fuente}
              onIonChange={(e) => setFuente(e.detail.value as FuenteGrupos)}
            >
              <IonSegmentButton value="OFICIAL"><IonLabel>Oficial</IonLabel></IonSegmentButton>
              <IonSegmentButton value="QUINIELA"><IonLabel>Mi quiniela</IonLabel></IonSegmentButton>
              <IonSegmentButton value="COMPARAR"><IonLabel>Comparar</IonLabel></IonSegmentButton>
            </IonSegment>
          </IonToolbar>
        )}
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

        {vista === 'BRACKET' && <Bracket />}
        {vista === 'GRUPOS' && fuente === 'OFICIAL' && <TablaGrupos />}
        {vista === 'GRUPOS' && fuente === 'QUINIELA' && (
          <TablaGrupos resolver={resolverQuiniela} subtitulo="según tu quiniela" />
        )}
        {vista === 'GRUPOS' && fuente === 'COMPARAR' && <ComparacionGrupos />}
      </IonContent>
    </IonPage>
  );
};

export default Torneo;
