import { IonButton, IonIcon, IonToast } from '@ionic/react';
import { logoWhatsapp, shareSocial } from 'ionicons/icons';
import { useState } from 'react';
import { useQuiniela } from '../context/QuinielaContext';
import { useAmigos } from '../context/AmigosContext';
import { codificarQuiniela, textoCompartir } from '../data/codigo-quiniela';

interface Props {
  /** 'nativo' usa el sheet del sistema, 'whatsapp' va directo a WhatsApp */
  modo?: 'nativo' | 'whatsapp';
  className?: string;
}

const CompartirQuiniela: React.FC<Props> = ({ modo = 'nativo', className }) => {
  const { predicciones, desglose } = useQuiniela();
  const { miNombre } = useAmigos();
  const [mensaje, setMensaje] = useState<string | null>(null);

  const compartir = async () => {
    if (!miNombre) {
      setMensaje('Primero configura tu nombre arriba.');
      return;
    }
    if (Object.keys(predicciones).length === 0) {
      setMensaje('Tienes que predecir al menos 1 partido para compartir.');
      return;
    }

    const q = {
      nombre: miNombre,
      predicciones,
      generado: new Date().toISOString(),
    };
    const codigo = codificarQuiniela(q);
    const texto = textoCompartir(q, codigo, desglose.total, desglose.exactos);

    if (modo === 'whatsapp') {
      // Abrir WhatsApp directamente
      const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
      window.open(url, '_blank');
      return;
    }

    // Modo nativo: usa el sheet de iOS/Android (o Web Share API en navegador)
    try {
      // Intentar el plugin de Capacitor primero (en APK)
      const { Share } = await import('@capacitor/share');
      const can = await Share.canShare();
      if (can.value) {
        await Share.share({
          title: 'Mi quiniela del Mundial 2026',
          text: texto,
          dialogTitle: 'Compartir mi quiniela con...',
        });
        return;
      }
    } catch {}

    // Fallback 1: Web Share API (móvil web moderno)
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: 'Mi quiniela del Mundial 2026',
          text: texto,
        });
        return;
      } catch {}
    }

    // Fallback 2: copiar al portapapeles
    try {
      await navigator.clipboard.writeText(texto);
      setMensaje('Copiado al portapapeles. Pégalo en tu chat.');
    } catch {
      setMensaje('Tu navegador no soporta compartir. Texto: ' + texto.slice(0, 60) + '…');
    }
  };

  return (
    <>
      <IonButton
        expand="block"
        color={modo === 'whatsapp' ? 'success' : 'tertiary'}
        onClick={compartir}
        className={className}
      >
        <IonIcon icon={modo === 'whatsapp' ? logoWhatsapp : shareSocial} slot="start" />
        {modo === 'whatsapp' ? 'Compartir por WhatsApp' : 'Compartir mi quiniela'}
      </IonButton>
      <IonToast
        isOpen={!!mensaje}
        message={mensaje ?? ''}
        duration={3500}
        onDidDismiss={() => setMensaje(null)}
        position="bottom"
      />
    </>
  );
};

export default CompartirQuiniela;
