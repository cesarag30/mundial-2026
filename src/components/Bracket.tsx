import { obtenerEquipo } from '../data/teams';
import { partidosEliminatorias } from '../data/matches-eliminatorias';
import { useLiveData } from '../context/LiveDataContext';
import type { Partido, Fase } from '../data/matches';
import './Bracket.css';

interface ColumnaBracket {
  fase: Fase;
  titulo: string;
  partidos: Partido[];
}

const Bracket: React.FC = () => {
  const { marcadorDe } = useLiveData();

  const columnas: ColumnaBracket[] = [
    { fase: 'R32',     titulo: '1/16',   partidos: partidosEliminatorias.filter(p => p.fase === 'R32') },
    { fase: 'OCTAVOS', titulo: 'Octavos',partidos: partidosEliminatorias.filter(p => p.fase === 'OCTAVOS') },
    { fase: 'CUARTOS', titulo: 'Cuartos',partidos: partidosEliminatorias.filter(p => p.fase === 'CUARTOS') },
    { fase: 'SEMIS',   titulo: 'Semis',  partidos: partidosEliminatorias.filter(p => p.fase === 'SEMIS') },
    { fase: 'FINAL',   titulo: 'Final',  partidos: partidosEliminatorias.filter(p => p.fase === 'FINAL') },
  ];

  return (
    <div className="bracket-scroll">
      <div className="bracket-grid">
        {columnas.map((col) => (
          <div key={col.fase} className={`bracket-col col-${col.fase.toLowerCase()}`}>
            <div className="bracket-col-titulo">{col.titulo}</div>
            <div className="bracket-matches">
              {col.partidos.map((p) => {
                const local = obtenerEquipo(p.equipoLocal);
                const visitante = obtenerEquipo(p.equipoVisitante);
                const marcador = marcadorDe(p);
                const ganadorLocal = !!marcador && marcador.local > marcador.visitante;
                const ganadorVisit = !!marcador && marcador.visitante > marcador.local;
                return (
                  <div key={p.id} className="bracket-match">
                    <div className={`bracket-team ${ganadorLocal ? 'ganador' : ''}`}>
                      <span className="bracket-flag">{local?.bandera ?? '⚪'}</span>
                      <span className="bracket-nombre">{local?.codigo ?? 'TBD'}</span>
                      <span className="bracket-gol">{marcador?.local ?? '-'}</span>
                    </div>
                    <div className={`bracket-team ${ganadorVisit ? 'ganador' : ''}`}>
                      <span className="bracket-flag">{visitante?.bandera ?? '⚪'}</span>
                      <span className="bracket-nombre">{visitante?.codigo ?? 'TBD'}</span>
                      <span className="bracket-gol">{marcador?.visitante ?? '-'}</span>
                    </div>
                    <div className="bracket-meta">{p.fecha}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bracket;
