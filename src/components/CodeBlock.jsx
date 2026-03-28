import { useState } from 'react';
import s from './CodeBlock.module.css';

const highlight = (code) =>
  code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(\/\/[^\n]*)/g, '<span class="c-comment">$1</span>')
    .replace(/(`[^`]*`)/g, '<span class="c-template">$1</span>')
    .replace(/('[^']*'|"[^"]*")/g, '<span class="c-string">$1</span>')
    .replace(/\b(const|let|var|return|import|export|default|from|new|class|interface|type|extends|implements|async|await|if|else|for|while|of|in|true|false|null|undefined|void|static|readonly)\b/g,
      '<span class="c-keyword">$1</span>')
    .replace(/\b(useState|useEffect|useCallback|useMemo|useRef|useContext|useQuery|useMutation|useInfiniteQuery|useSearchParams|useVirtualizer|useReducer)\b/g,
      '<span class="c-hook">$1</span>')
    .replace(/\b(React|Fragment|Suspense|lazy|createContext|memo|forwardRef|Children)\b/g,
      '<span class="c-react">$1</span>');

export default function CodeBlock({ code, filename }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={s.wrap}>
      <div className={s.bar}>
        <div className={s.dots}>
          <span className={s.dot} style={{ background: '#ef4444' }} />
          <span className={s.dot} style={{ background: '#f59e0b' }} />
          <span className={s.dot} style={{ background: '#22c55e' }} />
        </div>
        <span className={s.filename}>{filename || 'example.jsx'}</span>
        <button className={s.copy} onClick={copy}>
          {copied ? '✓ Skopiowano' : 'Kopiuj'}
        </button>
      </div>
      <pre className={s.pre}>
        <code
          dangerouslySetInnerHTML={{
            __html: highlight(code),
          }}
        />
      </pre>
    </div>
  );
}
