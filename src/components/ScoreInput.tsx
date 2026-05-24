import { IonIcon } from '@ionic/react';
import { add, remove } from 'ionicons/icons';
import './ScoreInput.css';

interface ScoreInputProps {
  golesLocal: number;
  golesVisitante: number;
  onChange: (l: number, v: number) => void;
  disabled?: boolean;
}

const ScoreInput: React.FC<ScoreInputProps> = ({
  golesLocal,
  golesVisitante,
  onChange,
  disabled,
}) => {
  const inc = (lado: 'L' | 'V') => {
    if (disabled) return;
    if (lado === 'L') onChange(golesLocal + 1, golesVisitante);
    else onChange(golesLocal, golesVisitante + 1);
  };
  const dec = (lado: 'L' | 'V') => {
    if (disabled) return;
    if (lado === 'L' && golesLocal > 0) onChange(golesLocal - 1, golesVisitante);
    else if (lado === 'V' && golesVisitante > 0) onChange(golesLocal, golesVisitante - 1);
  };

  return (
    <div className="score-input">
      <div className="score-side">
        <button type="button" className="score-btn" onClick={() => dec('L')} disabled={disabled}>
          <IonIcon icon={remove} />
        </button>
        <span className="score-value">{golesLocal}</span>
        <button type="button" className="score-btn" onClick={() => inc('L')} disabled={disabled}>
          <IonIcon icon={add} />
        </button>
      </div>
      <span className="score-sep">·</span>
      <div className="score-side">
        <button type="button" className="score-btn" onClick={() => dec('V')} disabled={disabled}>
          <IonIcon icon={remove} />
        </button>
        <span className="score-value">{golesVisitante}</span>
        <button type="button" className="score-btn" onClick={() => inc('V')} disabled={disabled}>
          <IonIcon icon={add} />
        </button>
      </div>
    </div>
  );
};

export default ScoreInput;
