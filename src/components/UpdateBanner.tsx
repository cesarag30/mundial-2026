import { IonChip, IonIcon, IonLabel, IonSpinner } from '@ionic/react';
import { cloudOffline, refresh, syncCircle, warning } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useLiveData } from '../context/LiveDataContext';
import './UpdateBanner.css';

/** Devuelve "hace X minutos" en español */
const tiempoRelativo = (iso: string | null): string => {
  if (!iso) return 'nunca';
  const diff = Date.now() - new Date(iso).getTime();
  const seg = Math.floor(diff / 1000);
  if (seg < 60) return `hace ${seg}s`;
  const min = Math.floor(seg / 60);
  if (min < 60) return `hace ${min} min`;
  const hor = Math.floor(min / 60);
  if (hor < 24) return `hace ${hor} h`;
  const dias = Math.floor(hor / 24);
  return `hace ${dias} d`;
};

const UpdateBanner: React.FC = () => {
  const { ultimaActualizacion, cargando, error, fuente, enVivoActivo, refrescar } = useLiveData();
  const [, force] = useState(0);

  // Re-render cada 30s para que "hace X min" se actualice
  useEffect(() => {
    const t = setInterval(() => force((n) => n + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  if (!enVivoActivo) {
    return (
      <div className="update-banner update-banner-offline">
        <IonChip color="medium" outline>
          <IonIcon icon={cloudOffline} />
          <IonLabel>Modo sin conexión · datos estáticos</IonLabel>
        </IonChip>
      </div>
    );
  }

  return (
    <div className="update-banner">
      <IonChip
        color={error ? 'danger' : 'success'}
        outline
        onClick={() => !cargando && refrescar()}
      >
        {cargando ? (
          <>
            <IonSpinner name="dots" />
            <IonLabel>Actualizando…</IonLabel>
          </>
        ) : error ? (
          <>
            <IonIcon icon={warning} />
            <IonLabel>Error: {error.length > 40 ? error.slice(0, 40) + '…' : error}</IonLabel>
          </>
        ) : (
          <>
            <IonIcon icon={syncCircle} />
            <IonLabel>
              Actualizado {tiempoRelativo(ultimaActualizacion)} · {fuente}
            </IonLabel>
            <IonIcon icon={refresh} />
          </>
        )}
      </IonChip>
    </div>
  );
};

export default UpdateBanner;
