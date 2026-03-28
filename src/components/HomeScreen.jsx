import { MODULES, TOTAL_LESSONS } from '../data/courseData';
import s from './HomeScreen.module.css';

export default function HomeScreen({ completedLessons, onStart, onSelectLesson }) {
  const totalCompleted = completedLessons.size;
  const pct = Math.round((totalCompleted / TOTAL_LESSONS) * 100);

  return (
    <div className={s.wrap}>
      <div className={s.hero}>
        <div className={s.badge}>Kurs interaktywny</div>
        <h1 className={s.title}>
          Frontend
          <br />
          <em>Architecture</em>
        </h1>
        <p className={s.subtitle}>
          Wzorce komponentów, zarządzanie stanem, architektura aplikacji,
          SOLID w React i FE Systems Design — kompletny przegląd dla
          Senior Frontend Developera.
        </p>

        <div className={s.stats}>
          <div className={s.stat}>
            <span className={s.statNum}>{MODULES.length}</span>
            <span className={s.statLabel}>Modułów</span>
          </div>
          <div className={s.statDivider} />
          <div className={s.stat}>
            <span className={s.statNum}>{TOTAL_LESSONS}</span>
            <span className={s.statLabel}>Lekcji</span>
          </div>
          <div className={s.statDivider} />
          <div className={s.stat}>
            <span className={s.statNum}>{totalCompleted}</span>
            <span className={s.statLabel}>Ukończonych</span>
          </div>
        </div>

        {totalCompleted > 0 && (
          <div className={s.progressSection}>
            <div className={s.progressLabel}>
              <span>Postęp</span>
              <span className={s.pct}>{pct}%</span>
            </div>
            <div className={s.progressTrack}>
              <div className={s.progressFill} style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        <button className={s.startBtn} onClick={onStart}>
          {totalCompleted === 0 ? 'Zacznij kurs' : 'Kontynuuj naukę'} →
        </button>
      </div>

      <div className={s.modules}>
        <h2 className={s.modulesTitle}>Zawartość kursu</h2>
        <div className={s.moduleGrid}>
          {MODULES.map((mod) => {
            const done = mod.lessons.filter(l => completedLessons.has(l.id)).length;
            return (
              <div key={mod.id} className={s.moduleCard}>
                <div className={s.moduleTop}>
                  <span className={s.moduleIcon} style={{ color: mod.color }}>{mod.icon}</span>
                  <span className={s.moduleProgress} style={{ color: mod.color }}>
                    {done}/{mod.lessons.length}
                  </span>
                </div>
                <h3 className={s.moduleTitle}>{mod.title}</h3>
                <ul className={s.moduleList}>
                  {mod.lessons.map(l => (
                    <li key={l.id}>
                      <button
                        className={s.lessonLink}
                        onClick={() => onSelectLesson(mod.id, l.id)}
                      >
                        <span style={{ color: completedLessons.has(l.id) ? '#22c55e' : 'var(--text-dim)' }}>
                          {completedLessons.has(l.id) ? '✓' : '○'}
                        </span>
                        {l.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
