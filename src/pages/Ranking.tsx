import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBadge,
} from '@ionic/react';
import { personAdd, trash } from 'ionicons/icons';
import { useState } from 'react';
import { useAmigos } from '../context/AmigosContext';
import ImportarAmigoModal from '../components/ImportarAmigoModal';
import CompartirQuiniela from '../components/CompartirQuiniela';
import './Ranking.css';

const MEDALLAS = ['🥇', '🥈', '🥉'];

const Ranking: React.FC = () => {
  const { ranking, miPosicion, borrarAmigo, amigos } = useAmigos();
  const [importarOpen, setImportarOpen] = useState(false);

  const totalParticipantes = ranking.length;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar-mundial">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/quiniela" />
          </IonButtons>
          <IonTitle>🏅 Ranking</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Resumen del usuario */}
        {miPosicion > 0 && (
          <div className="ranking-hero">
            <div className="ranking-posicion">#{miPosicion}</div>
            <div className="ranking-de">
              de {totalParticipantes} {totalParticipantes === 1 ? 'participante' : 'participantes'}
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="ranking-acciones">
          <CompartirQuiniela modo="whatsapp" />
          <IonButton
            expand="block"
            fill="outline"
            onClick={() => setImportarOpen(true)}
          >
            <IonIcon icon={personAdd} slot="start" />
            Importar quiniela de un amigo
          </IonButton>
        </div>

        {/* Lista del ranking */}
        {ranking.length === 0 ? (
          <div className="ranking-vacio">
            <p>
              Aún no hay nadie en el ranking. Configura tu nombre y empieza a
              predecir partidos para aparecer.
            </p>
          </div>
        ) : (
          <IonList>
            {ranking.map((r, i) => {
              const posicion = i + 1;
              const medalla = MEDALLAS[i] ?? '';
              return (
                <IonItemSliding key={r.id}>
                  <IonItem className={r.esTu ? 'ranking-yo' : ''} lines="full">
                    <div className="ranking-fila">
                      <div className="ranking-pos">
                        {medalla || `#${posicion}`}
                      </div>
                      <div className="ranking-nombre-cont">
                        <strong className="ranking-nombre">
                          {r.nombre}
                          {r.esTu && <IonBadge color="tertiary" className="badge-yo">TÚ</IonBadge>}
                        </strong>
                        <IonNote className="ranking-stats">
                          🎯 {r.exactos} · ✓ {r.ganadores} · ✗ {r.fallidos} · ⏳ {r.pendientes}
                        </IonNote>
                      </div>
                      <div className="ranking-puntos">
                        <span className="ranking-puntos-num">{r.puntos}</span>
                        <span className="ranking-puntos-label">pts</span>
                      </div>
                    </div>
                  </IonItem>
                  {!r.esTu && (
                    <IonItemOptions side="end">
                      <IonItemOption color="danger" onClick={() => borrarAmigo(r.id)}>
                        <IonIcon icon={trash} slot="icon-only" />
                      </IonItemOption>
                    </IonItemOptions>
                  )}
                </IonItemSliding>
              );
            })}
          </IonList>
        )}

        {amigos.length === 0 && ranking.length > 0 && (
          <div className="ranking-tip">
            💡 <strong>Tip:</strong> comparte tu quiniela por WhatsApp y pídele
            a tus amigos que también te compartan la suya para poblar el ranking.
            Desliza un amigo a la izquierda para borrarlo.
          </div>
        )}
      </IonContent>

      <ImportarAmigoModal
        isOpen={importarOpen}
        onClose={() => setImportarOpen(false)}
      />
    </IonPage>
  );
};

export default Ranking;
