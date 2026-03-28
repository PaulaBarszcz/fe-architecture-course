import { useState, useEffect } from 'react';
import CodeBlock from './CodeBlock';
import Quiz from './Quiz';
import s from './LessonView.module.css';

// Simple markdown-ish parser for content
const parseContent = (text) => {
  return text
    .trim()
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('## ')) return <h3 key={i} className={s.h3}>{line.slice(3)}</h3>;
      if (line.startsWith('**') && line.endsWith('**')) {
        const inner = line.slice(2, -2);
        return <p key={i} className={s.bold}>{inner}</p>;
      }
      if (line.match(/^\*\*/)) {
        // Inline bold
        const parts = line.split(/\*\*(.*?)\*\*/);
        return (
          <p key={i} className={s.p}>
            {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
          </p>
        );
      }
      if (line.startsWith('- ')) return <li key={i} className={s.li}>{parseLine(line.slice(2))}</li>;
      if (line.trim() === '') return <div key={i} className={s.spacer} />;
      return <p key={i} className={s.p}>{parseLine(line)}</p>;
    });
};

const parseLine = (line) => {
  const parts = line.split(/\*\*(.*?)\*\*/);
  if (parts.length === 1) return line;
  return parts.map((p, i) =>
    i % 2 === 1 ? <strong key={i}>{p}</strong> : p
  );
};

export default function LessonView({ lesson, moduleColor, onNext, onPrev, hasNext, hasPrev, lessonNum, totalLessons }) {
  const [quizDone, setQuizDone] = useState(false);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    setQuizDone(false);
    setShowCode(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lesson.id]);

  return (
    <article className={s.wrap}>
      {/* Header */}
      <header className={s.header}>
        <div className={s.meta}>
          <span className={s.lessonNum} style={{ color: moduleColor }}>
            Lekcja {lessonNum} / {totalLessons}
          </span>
          <span className={s.duration}>⏱ {lesson.duration}</span>
        </div>
        <h1 className={s.title}>{lesson.title}</h1>
        <div className={s.divider} style={{ background: moduleColor }} />
      </header>

      {/* Content */}
      <div className={s.content}>
        {parseContent(lesson.content)}
      </div>

      {/* Code example */}
      {lesson.code && (
        <div className={s.codeSection}>
          <button
            className={s.codeToggle}
            onClick={() => setShowCode(v => !v)}
            style={{ borderColor: showCode ? moduleColor : undefined, color: showCode ? moduleColor : undefined }}
          >
            <span>{showCode ? '▼' : '▶'}</span>
            <span>{showCode ? 'Ukryj' : 'Pokaż'} przykład kodu</span>
          </button>
          {showCode && (
            <CodeBlock
              code={lesson.code}
              filename={lesson.title.toLowerCase().replace(/\s+/g, '-') + '.jsx'}
            />
          )}
        </div>
      )}

      {/* Quiz */}
      {lesson.quiz && (
        <Quiz
          quiz={lesson.quiz}
          onComplete={() => setQuizDone(true)}
        />
      )}

      {/* Navigation */}
      <nav className={s.nav}>
        <button
          className={s.navBtn}
          onClick={onPrev}
          disabled={!hasPrev}
        >
          ← Poprzednia
        </button>
        <button
          className={[s.navBtn, s.navNext].join(' ')}
          onClick={onNext}
          disabled={!hasNext}
          style={hasNext ? { borderColor: moduleColor, color: moduleColor } : {}}
        >
          Następna →
        </button>
      </nav>
    </article>
  );
}
