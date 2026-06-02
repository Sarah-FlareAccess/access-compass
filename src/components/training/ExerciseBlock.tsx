import { useState, useRef } from 'react';
import type { ReactNode } from 'react';

function renderWithPlaceholderHighlights(text: string): ReactNode {
  const parts: ReactNode[] = [];
  const regex = /\[([^\[\]\n]{1,80})\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <mark className="prompt-placeholder" key={`ph-${key++}`}>{match[0]}</mark>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? parts : text;
}

interface ExerciseBlockProps {
  title: string;
  instructions: string;
  promptTemplate?: string;
  expectedOutcome?: string;
  tips?: string[];
  exampleOutput?: string;
  substitutions?: Record<string, string>;
}

function applySubstitutions(text: string, subs?: Record<string, string>): string {
  if (!subs) return text;
  let result = text;
  for (const [key, value] of Object.entries(subs)) {
    if (!value) continue;
    const placeholder = `[${key}]`;
    while (result.includes(placeholder)) {
      result = result.replace(placeholder, value);
    }
  }
  return result;
}

export function ExerciseBlock({
  title,
  instructions,
  promptTemplate,
  expectedOutcome,
  tips,
  exampleOutput,
  substitutions,
}: ExerciseBlockProps) {
  const [copied, setCopied] = useState(false);
  const statusRef = useRef<HTMLSpanElement>(null);

  const resolvedInstructions = applySubstitutions(instructions, substitutions);
  const resolvedPromptTemplate = promptTemplate
    ? applySubstitutions(promptTemplate, substitutions)
    : undefined;
  const resolvedExpectedOutcome = expectedOutcome
    ? applySubstitutions(expectedOutcome, substitutions)
    : undefined;

  const handleCopy = async () => {
    if (!resolvedPromptTemplate) return;
    try {
      await navigator.clipboard.writeText(resolvedPromptTemplate);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = resolvedPromptTemplate;
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
        <h3 className="exercise-title">{title}</h3>
      </div>

      <div className="exercise-instructions">{resolvedInstructions}</div>

      {resolvedPromptTemplate && (
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
          <pre className="exercise-prompt-template">{renderWithPlaceholderHighlights(resolvedPromptTemplate)}</pre>
          <span ref={statusRef} className="sr-only" aria-live="polite">
            {copied ? 'Prompt template copied to clipboard' : ''}
          </span>
        </div>
      )}

      {resolvedExpectedOutcome && (
        <div className="exercise-expected">
          <strong>Expected outcome:</strong> {resolvedExpectedOutcome}
        </div>
      )}

      {tips && tips.length > 0 && (
        <div className="exercise-tips">
          <div className="exercise-tips-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 18h6"/>
              <path d="M10 22h4"/>
              <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V18h6v-1.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z"/>
            </svg>
            <span>Tips</span>
          </div>
          <ul>
            {tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {exampleOutput && (
        <details className="exercise-example">
          <summary title="Expand or collapse example output">View example output</summary>
          <div className="exercise-example-content">{exampleOutput}</div>
        </details>
      )}
    </div>
  );
}
