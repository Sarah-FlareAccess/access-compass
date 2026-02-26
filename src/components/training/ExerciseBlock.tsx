import { useState, useRef } from 'react';

interface ExerciseBlockProps {
  title: string;
  instructions: string;
  promptTemplate?: string;
  expectedOutcome?: string;
  tips?: string[];
  exampleOutput?: string;
}

export function ExerciseBlock({
  title,
  instructions,
  promptTemplate,
  expectedOutcome,
  tips,
  exampleOutput,
}: ExerciseBlockProps) {
  const [copied, setCopied] = useState(false);
  const statusRef = useRef<HTMLSpanElement>(null);

  const handleCopy = async () => {
    if (!promptTemplate) return;
    try {
      await navigator.clipboard.writeText(promptTemplate);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = promptTemplate;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="exercise-block">
      <div className="exercise-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        <h4 className="exercise-title">{title}</h4>
      </div>

      <div className="exercise-instructions">{instructions}</div>

      {promptTemplate && (
        <div className="exercise-prompt-section">
          <div className="exercise-prompt-header">
            <span className="exercise-prompt-label">Prompt template</span>
            <button
              className="exercise-copy-btn"
              onClick={handleCopy}
              aria-label="Copy prompt template to clipboard"
            >
              {copied ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              )}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="exercise-prompt-template">{promptTemplate}</pre>
          <span ref={statusRef} className="sr-only" aria-live="polite">
            {copied ? 'Prompt template copied to clipboard' : ''}
          </span>
        </div>
      )}

      {expectedOutcome && (
        <div className="exercise-expected">
          <strong>Expected outcome:</strong> {expectedOutcome}
        </div>
      )}

      {tips && tips.length > 0 && (
        <div className="exercise-tips">
          <strong>Tips:</strong>
          <ul>
            {tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {exampleOutput && (
        <details className="exercise-example">
          <summary>View example output</summary>
          <div className="exercise-example-content">{exampleOutput}</div>
        </details>
      )}
    </div>
  );
}
