import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonTitle,
  IonToast,
  IonToolbar,
  IonText,
} from '@ionic/react';
import { close, clipboard, personAdd } from 'ionicons/icons';
import { useState } from 'react';
import { useAmigos } from '../context/AmigosContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ImportarAmigoModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [codigo, setCodigo] = useState('');
  const [toast, setToast] = useState<{ msg: string; color: 'success' | 'danger' } | null>(null);
  const { importarAmigo } = useAmigos();

  const pegarDesdePortapapeles = async () => {
    try {
      const txt = await navigator.clipboard.readText();
      // Busca el patrón MUN26-... dentro del texto pegado (puede venir con texto extra)
      const m = txt.match(/MUN26-[A-Za-z0-9\-_]+/);
      setCodigo(m ? m[0] : txt.trim());
    } catch {
      setToast({ msg: 'No se pudo leer el portapapeles. Pega manualmente.', color: 'danger' });
    }
  };

  const importar = () => {
    if (!codigo.trim()) {
      setToast({ msg: 'Pega un código primero.', color: 'danger' });
      return;
    }
    const r = importarAmigo(codigo);
    setToast({ msg: r.mensaje, color: r.ok ? 'success' : 'danger' });
    if (r.ok) {
      setCodigo('');
      setTimeout(() => onClose(), 1000);
    }
  };

  return (
    <>
      <IonModal isOpen={isOpen} onDidDismiss={onClose}>
        <IonHeader>
          <IonToolbar className="toolbar-mundial">
            <IonTitle>Importar amigo</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={onClose}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonText color="medium">
            <p style={{ fontSize: 14, lineHeight: 1.5 }}>
              Pega aquí el código de un amigo que te haya compartido su quiniela
              por WhatsApp. Una vez importada aparece en el ranking.
            </p>
            <p style={{ fontSize: 12, opacity: 0.7 }}>
              Empieza por <code>MUN26-</code>
            </p>
          </IonText>

          <IonItem>
            <IonLabel position="stacked">Código del amigo</IonLabel>
            <IonInput
              value={codigo}
              onIonInput={(e) => setCodigo(e.detail.value ?? '')}
              placeholder="MUN26-..."
              autocapitalize="off"
              autoCorrect="off"
              spellcheck={false}
            />
          </IonItem>

          <IonButton
            expand="block"
            fill="outline"
            onClick={pegarDesdePortapapeles}
            style={{ marginTop: 8 }}
          >
            <IonIcon icon={clipboard} slot="start" />
            Pegar del portapapeles
          </IonButton>

          <IonButton
            expand="block"
            color="primary"
            onClick={importar}
            style={{ marginTop: 16 }}
          >
            <IonIcon icon={personAdd} slot="start" />
            Importar
          </IonButton>
        </IonContent>
      </IonModal>

      <IonToast
        isOpen={!!toast}
        message={toast?.msg ?? ''}
        color={toast?.color}
        duration={3000}
        onDidDismiss={() => setToast(null)}
        position="bottom"
      />
    </>
  );
};

export default ImportarAmigoModal;
