import { useState, useCallback, useEffect } from 'react';
import { MODULES, TOTAL_LESSONS } from './data/courseData';
import Sidebar from './components/Sidebar';
import LessonView from './components/LessonView';
import HomeScreen from './components/HomeScreen';
import s from './App.module.css';

const STORAGE_KEY = 'fe-course-progress';

const loadProgress = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
};

const saveProgress = (set) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {}
};

// Flatten all lessons with module context
const allLessons = MODULES.flatMap(mod =>
  mod.lessons.map(lesson => ({ ...lesson, moduleId: mod.id, moduleColor: mod.color }))
);

export default function App() {
  const [view, setView] = useState('home'); // 'home' | 'lesson'
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(loadProgress);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeLesson = allLessons.find(l => l.id === activeLessonId);
  const activeModule = MODULES.find(m => m.id === activeModuleId);
  const activeLessonIndex = allLessons.findIndex(l => l.id === activeLessonId);

  const markComplete = useCallback((lessonId) => {
    setCompletedLessons(prev => {
      const next = new Set(prev);
      next.add(lessonId);
      saveProgress(next);
      return next;
    });
  }, []);

  const selectLesson = useCallback((moduleId, lessonId) => {
    setActiveModuleId(moduleId);
    setActiveLessonId(lessonId);
    setView('lesson');
    // Auto-mark as visited
    markComplete(lessonId);
    setSidebarOpen(false);
  }, [markComplete]);

  const goNext = useCallback(() => {
    if (activeLessonIndex < allLessons.length - 1) {
      const next = allLessons[activeLessonIndex + 1];
      selectLesson(next.moduleId, next.id);
    }
  }, [activeLessonIndex, selectLesson]);

  const goPrev = useCallback(() => {
    if (activeLessonIndex > 0) {
      const prev = allLessons[activeLessonIndex - 1];
      selectLesson(prev.moduleId, prev.id);
    }
  }, [activeLessonIndex, selectLesson]);

  const handleStart = useCallback(() => {
    // Find first uncompleted lesson or just start from beginning
    const first = allLessons.find(l => !completedLessons.has(l.id)) || allLessons[0];
    selectLesson(first.moduleId, first.id);
  }, [completedLessons, selectLesson]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (view !== 'lesson') return;
      if (e.key === 'ArrowRight' && !e.altKey) goNext();
      if (e.key === 'ArrowLeft' && !e.altKey) goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [view, goNext, goPrev]);

  const totalCompleted = completedLessons.size;
  const pct = Math.round((totalCompleted / TOTAL_LESSONS) * 100);

  return (
    <div className={s.app}>
      {/* Sidebar */}
      <Sidebar
        modules={MODULES}
        activeModuleId={activeModuleId}
        activeLessonId={activeLessonId}
        completedLessons={completedLessons}
        onSelectLesson={selectLesson}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <div className={s.main}>
        {/* Top bar */}
        <header className={s.topbar}>
          <button
            className={s.menuBtn}
            onClick={() => setSidebarOpen(v => !v)}
            aria-label="Otwórz menu"
          >
            ☰
          </button>

          <button
            className={s.homeBtn}
            onClick={() => setView('home')}
          >
            ◈ FE Architecture
          </button>

          <div className={s.topbarRight}>
            <div className={s.topProgress}>
              <span className={s.topProgressLabel}>{pct}%</span>
              <div className={s.topProgressTrack}>
                <div className={s.topProgressFill} style={{ width: `${pct}%` }} />
              </div>
            </div>
            {activeLesson && (
              <span className={s.breadcrumb}>
                {activeModule?.title} / {activeLesson.title}
              </span>
            )}
          </div>
        </header>

        {/* Content */}
        <main className={s.content}>
          {view === 'home' ? (
            <HomeScreen
              completedLessons={completedLessons}
              onStart={handleStart}
              onSelectLesson={selectLesson}
            />
          ) : activeLesson ? (
            <LessonView
              lesson={activeLesson}
              moduleColor={activeLesson.moduleColor}
              onNext={goNext}
              onPrev={goPrev}
              hasNext={activeLessonIndex < allLessons.length - 1}
              hasPrev={activeLessonIndex > 0}
              lessonNum={activeLessonIndex + 1}
              totalLessons={allLessons.length}
            />
          ) : null}
        </main>
      </div>
    </div>
  );
}
