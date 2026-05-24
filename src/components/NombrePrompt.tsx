import {
  IonAlert,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useAmigos } from '../context/AmigosContext';

/**
 * Muestra una sola vez (al primer arranque) un prompt pidiendo el nombre.
 * Se usa para identificar al usuario en el ranking compartido.
 */
const NombrePrompt: React.FC = () => {
  const { miNombre, setMiNombre, tieneNombre } = useAmigos();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Solo mostrar si NO tiene nombre tras cargar
    const t = setTimeout(() => {
      if (!tieneNombre) setOpen(true);
    }, 600);
    return () => clearTimeout(t);
  }, [tieneNombre]);

  return (
    <IonAlert
      isOpen={open}
      backdropDismiss={false}
      header="👋 ¡Hola!"
      message="¿Cómo te llamas? Lo usaré para que aparezcas en el ranking cuando compartas tu quiniela con amigos."
      inputs={[
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Tu nombre o apodo',
          attributes: { maxlength: 30 },
          value: miNombre,
        },
      ]}
      buttons={[
        {
          text: 'Guardar',
          handler: (data) => {
            const nombre = (data?.nombre ?? '').trim();
            if (!nombre) return false; // no cierra el alert
            setMiNombre(nombre);
            setOpen(false);
            return true;
          },
        },
      ]}
    />
  );
};

export default NombrePrompt;
