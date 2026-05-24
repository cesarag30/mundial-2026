import {
  IonContent,
  IonHeader,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useMemo, useState } from 'react';
import MatchCard from '../components/MatchCard';
import UpdateBanner from '../components/UpdateBanner';
import { partidos, type Fase } from '../data/matches';
import './Calendario.css';

type Filtro = 'TODOS' | Fase;

const NOMBRES_DIA = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const NOMBRES_MES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

const formatearFecha = (yyyymmdd: string): string => {
  const [y, m, d] = yyyymmdd.split('-').map(Number);
  const fecha = new Date(y, m - 1, d);
  return `${NOMBRES_DIA[fecha.getDay()]} ${d} de ${NOMBRES_MES[m - 1]}`;
};

const Calendario: React.FC = () => {
  const [filtro, setFiltro] = useState<Filtro>('TODOS');

  const partidosAgrupados = useMemo(() => {
    const lista = filtro === 'TODOS'
      ? partidos
      : partidos.filter((p) => p.fase === filtro);

    const porFecha: Record<string, typeof lista> = {};
    lista.forEach((p) => {
      if (!porFecha[p.fecha]) porFecha[p.fecha] = [];
      porFecha[p.fecha].push(p);
    });

    Object.values(porFecha).forEach((arr) =>
      arr.sort((a, b) => a.horaLocal.localeCompare(b.horaLocal))
    );

    return Object.entries(porFecha).sort(([a], [b]) => a.localeCompare(b));
  }, [filtro]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar-mundial">
          <IonTitle>Calendario</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment
            value={filtro}
            onIonChange={(e) => setFiltro(e.detail.value as Filtro)}
            scrollable
          >
            <IonSegmentButton value="TODOS"><IonLabel>Todos</IonLabel></IonSegmentButton>
            <IonSegmentButton value="GRUPOS"><IonLabel>Grupos</IonLabel></IonSegmentButton>
            <IonSegmentButton value="R32"><IonLabel>1/16</IonLabel></IonSegmentButton>
            <IonSegmentButton value="OCTAVOS"><IonLabel>Octavos</IonLabel></IonSegmentButton>
            <IonSegmentButton value="CUARTOS"><IonLabel>Cuartos</IonLabel></IonSegmentButton>
            <IonSegmentButton value="SEMIS"><IonLabel>Semis</IonLabel></IonSegmentButton>
            <IonSegmentButton value="TERCERO"><IonLabel>3º</IonLabel></IonSegmentButton>
            <IonSegmentButton value="FINAL"><IonLabel>Final</IonLabel></IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <UpdateBanner />
        {partidosAgrupados.map(([fecha, lista]) => (
          <div key={fecha}>
            <div className="fecha-bloque">
              {formatearFecha(fecha)}
            </div>
            {lista.map((p) => (
              <MatchCard key={p.id} partido={p} />
            ))}
          </div>
        ))}

        {partidosAgrupados.length === 0 && (
          <div className="ion-padding ion-text-center">
            <p>No hay partidos para el filtro seleccionado.</p>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Calendario;
