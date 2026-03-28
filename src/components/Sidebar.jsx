import ProgressBar from './ProgressBar';
import s from './Sidebar.module.css';

export default function Sidebar({ modules, activeModuleId, activeLessonId, completedLessons, onSelectLesson, isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className={s.overlay} onClick={onClose} />}
      <aside className={[s.sidebar, isOpen ? s.open : ''].join(' ')}>
        <div className={s.top}>
          <div className={s.brand}>
            <span className={s.brandIcon}>◈</span>
            <span className={s.brandName}>FE Architecture</span>
          </div>
          <button className={s.closeBtn} onClick={onClose} aria-label="Zamknij menu">✕</button>
        </div>

        <nav className={s.nav}>
          {modules.map((mod) => {
            const modCompleted = mod.lessons.filter(l => completedLessons.has(l.id)).length;
            const isActiveModule = mod.id === activeModuleId;

            return (
              <div key={mod.id} className={s.module}>
                <div className={[s.moduleHeader, isActiveModule ? s.moduleActive : ''].join(' ')}>
                  <span className={s.moduleIcon} style={{ color: mod.color }}>{mod.icon}</span>
                  <span className={s.moduleTitle}>{mod.title}</span>
                  <span className={s.moduleCount} style={{ color: mod.color }}>
                    {modCompleted}/{mod.lessons.length}
                  </span>
                </div>
                <div className={s.progressWrap}>
                  <ProgressBar
                    completed={modCompleted}
                    total={mod.lessons.length}
                    color={mod.color}
                  />
                </div>

                <ul className={s.lessons}>
                  {mod.lessons.map((lesson) => {
                    const isActive = lesson.id === activeLessonId;
                    const isDone = completedLessons.has(lesson.id);
                    return (
                      <li key={lesson.id}>
                        <button
                          className={[
                            s.lessonBtn,
                            isActive ? s.lessonActive : '',
                            isDone ? s.lessonDone : '',
                          ].join(' ')}
                          onClick={() => { onSelectLesson(mod.id, lesson.id); onClose(); }}
                          style={isActive ? { borderLeftColor: mod.color } : {}}
                        >
                          <span className={s.lessonStatus}>
                            {isDone ? '✓' : isActive ? '▶' : '○'}
                          </span>
                          <span className={s.lessonTitle}>{lesson.title}</span>
                          <span className={s.lessonDur}>{lesson.duration}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
