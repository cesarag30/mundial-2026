import { IonBadge, IonItem, IonLabel, IonNote } from '@ionic/react';
import { obtenerEquipo } from '../data/teams';
import { obtenerSede } from '../data/sedes';
import { ETIQUETAS_FASE, type Partido } from '../data/matches';
import { useLiveData } from '../context/LiveDataContext';
import './MatchCard.css';

interface MatchCardProps {
  partido: Partido;
  marcadorUsuario?: { local: number; visitante: number };
  onClick?: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ partido, marcadorUsuario, onClick }) => {
  const { marcadorDe, marcadorVivo } = useLiveData();
  const local = obtenerEquipo(partido.equipoLocal);
  const visitante = obtenerEquipo(partido.equipoVisitante);
  const sede = obtenerSede(partido.sedeId);
  const marcador = marcadorDe(partido);
  const vivo = marcadorVivo(partido.id);
  const enJuego = vivo?.estado === 'IN_PLAY' || vivo?.estado === 'PAUSED';

  return (
    <IonItem button={!!onClick} onClick={onClick} className="match-card-row" lines="full">
      <div className="match-card-content">
        <div className="match-card-meta">
          <IonNote>
            {partido.horaLocal} · {sede?.ciudad} ({sede?.estadio})
          </IonNote>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {enJuego && <span className="en-vivo-dot" />}
            <IonBadge color="medium" className="fase-badge">
              {partido.grupo
                ? `Grupo ${partido.grupo}·J${partido.jornada}`
                : ETIQUETAS_FASE[partido.fase]}
            </IonBadge>
          </div>
        </div>

        <div className="equipos-row">
          <div className="equipo-info equipo-local">
            <span className="flag-medium" aria-hidden>{local?.bandera ?? '⚪'}</span>
            <IonLabel>
              <h3>{local?.nombre ?? partido.descripcion?.split(' vs ')[0] ?? 'TBD'}</h3>
            </IonLabel>
          </div>

          <div className="marcador">
            {marcador ? (
              <span className={`marcador-oficial ${enJuego ? 'marcador-en-vivo' : ''}`}>
                {marcador.local} - {marcador.visitante}
              </span>
            ) : marcadorUsuario ? (
              <span className="marcador-usuario">
                {marcadorUsuario.local} - {marcadorUsuario.visitante}
              </span>
            ) : (
              <span className="marcador-vs">VS</span>
            )}
          </div>

          <div className="equipo-info equipo-visitante">
            <IonLabel>
              <h3>{visitante?.nombre ?? partido.descripcion?.split(' vs ')[1] ?? 'TBD'}</h3>
            </IonLabel>
            <span className="flag-medium" aria-hidden>{visitante?.bandera ?? '⚪'}</span>
          </div>
        </div>
      </div>
    </IonItem>
  );
};

export default MatchCard;
