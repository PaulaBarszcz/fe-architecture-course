import s from './ProgressBar.module.css';

export default function ProgressBar({ completed, total, color }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className={s.wrap}>
      <div
        className={s.bar}
        style={{
          width: `${pct}%`,
          background: color || 'var(--accent)',
        }}
      />
    </div>
  );
}
