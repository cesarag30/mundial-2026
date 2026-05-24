import { equiposPorGrupo, GRUPOS, type Grupo } from '../data/teams';
import { partidosDeGrupo } from '../data/matches';
import { useLiveData } from '../context/LiveDataContext';
import './Bracket.css';

interface FilaTabla {
  codigo: string;
  bandera: string;
  nombre: string;
  jugados: number;
  ganados: number;
  empatados: number;
  perdidos: number;
  golesFavor: number;
  golesContra: number;
  diferencia: number;
  puntos: number;
}

const TablaGrupos: React.FC = () => {
  const { marcadorDe } = useLiveData();

  const calcularTablaGrupo = (grupo: Grupo): FilaTabla[] => {
    const equipos = equiposPorGrupo(grupo);
    const filas: Record<string, FilaTabla> = {};
    equipos.forEach((e) => {
      filas[e.codigo] = {
        codigo: e.codigo, bandera: e.bandera, nombre: e.nombre,
        jugados: 0, ganados: 0, empatados: 0, perdidos: 0,
        golesFavor: 0, golesContra: 0, diferencia: 0, puntos: 0,
      };
    });

    partidosDeGrupo(grupo).forEach((p) => {
      const marcador = marcadorDe(p);
      if (!marcador) return;
      const { local, visitante } = marcador;
      const L = filas[p.equipoLocal];
      const V = filas[p.equipoVisitante];
      if (!L || !V) return;
      L.jugados++; V.jugados++;
      L.golesFavor += local;   L.golesContra += visitante;
      V.golesFavor += visitante; V.golesContra += local;
      if (local > visitante)      { L.ganados++; L.puntos += 3; V.perdidos++; }
      else if (visitante > local) { V.ganados++; V.puntos += 3; L.perdidos++; }
      else                        { L.empatados++; V.empatados++; L.puntos++; V.puntos++; }
    });

    return Object.values(filas)
      .map((f) => ({ ...f, diferencia: f.golesFavor - f.golesContra }))
      .sort((a, b) => b.puntos - a.puntos || b.diferencia - a.diferencia || b.golesFavor - a.golesFavor);
  };

  return (
    <div className="grupos-tabla">
      {GRUPOS.map((g) => {
        const filas = calcularTablaGrupo(g);
        return (
          <div className="grupo-card" key={g}>
            <div className="grupo-card-titulo">Grupo {g}</div>
            <div className="grupo-card-equipo grupo-card-headers">
              <span></span><span>Equipo</span>
              <span>PJ</span><span>GF</span><span>GC</span><span>PTS</span>
            </div>
            {filas.map((f) => (
              <div key={f.codigo} className="grupo-card-equipo">
                <span className="flag-medium" style={{ fontSize: 18 }}>{f.bandera}</span>
                <span>{f.nombre}</span>
                <span>{f.jugados}</span>
                <span>{f.golesFavor}</span>
                <span>{f.golesContra}</span>
                <span className="pts">{f.puntos}</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default TablaGrupos;
