import { useState } from 'react';
import s from './Quiz.module.css';

export default function Quiz({ quiz, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (idx) => {
    if (revealed) return;
    setSelected(idx);
  };

  const handleCheck = () => {
    if (selected === null) return;
    setRevealed(true);
    if (selected === quiz.correct && onComplete) onComplete();
  };

  const isCorrect = selected === quiz.correct;

  return (
    <div className={s.wrap}>
      <div className={s.label}>🎯 Sprawdź wiedzę</div>
      <p className={s.question}>{quiz.q}</p>

      <div className={s.options}>
        {quiz.options.map((opt, i) => (
          <button
            key={i}
            className={[
              s.option,
              selected === i ? s.selected : '',
              revealed && i === quiz.correct ? s.correct : '',
              revealed && selected === i && selected !== quiz.correct ? s.wrong : '',
            ].join(' ')}
            onClick={() => handleSelect(i)}
            disabled={revealed}
          >
            <span className={s.optLetter}>
              {String.fromCharCode(65 + i)}
            </span>
            <span className={s.optText}>{opt}</span>
            {revealed && i === quiz.correct && (
              <span className={s.mark}>✓</span>
            )}
            {revealed && selected === i && selected !== quiz.correct && (
              <span className={s.mark}>✕</span>
            )}
          </button>
        ))}
      </div>

      {!revealed ? (
        <button
          className={s.checkBtn}
          onClick={handleCheck}
          disabled={selected === null}
        >
          Sprawdź odpowiedź
        </button>
      ) : (
        <div className={[s.explanation, isCorrect ? s.exCorrect : s.exWrong].join(' ')}>
          <strong>{isCorrect ? '✓ Dobrze!' : '✕ Prawie!'}</strong>
          <p>{quiz.explanation}</p>
        </div>
      )}
    </div>
  );
}
