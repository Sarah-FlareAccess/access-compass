import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { LessonContentBlock } from '../../data/training/types';
import { ExerciseBlock } from './ExerciseBlock';
import { DownloadBlock } from './DownloadBlock';
import { useStepProgress } from '../../hooks/useStepProgress';
import { useFormatChoice } from '../../hooks/useFormatChoice';
import { useChecklistProgress } from '../../hooks/useChecklistProgress';
import { generatePromptPackPdf } from '../../utils/promptPackPdf';
import './LessonContentRenderer.css';

function FormatChoiceBlock({
  legend,
  helpText,
  formats,
  audienceLabel,
  audienceExample,
  contextFields,
  briefGuidance,
  briefHelpPrompt,
  courseId,
}: {
  legend: string;
  helpText?: string;
  formats: Array<{ value: string; label: string }>;
  audienceLabel: string;
  audienceExample?: string;
  contextFields?: Array<{ key: string; label: string; example?: string; multiline?: boolean }>;
  briefGuidance?: { title: string; bodyHtml: string };
  briefHelpPrompt?: { title: string; introHtml?: string; prompt: string };
  courseId: string;
}) {
  const { choice, setFormat, setAudience, setContextField } = useFormatChoice(courseId);
  const [copied, setCopied] = useState(false);
  const hasBoth = choice.format && choice.audience.trim();
  const audienceId = `format-choice-audience-${courseId}`;
  const audienceExampleId = audienceExample ? `${audienceId}-example` : undefined;

  const buildBriefText = () => {
    const lines = [
      'My brief',
      '',
      `Format: ${choice.format || '(not set)'}`,
      `Audience: ${choice.audience || '(not set)'}`,
    ];
    if (contextFields) {
      contextFields.forEach((f) => {
        const v = choice.contextFields[f.key] ?? '';
        lines.push(`${f.label}: ${v || '(not set)'}`);
      });
    }
    return lines.join('\n');
  };

  const handleCopyBrief = async () => {
    const text = buildBriefText();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadBrief = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const stamp = now.toLocaleString('en-AU');
    const content = `${buildBriefText()}\n\nCaptured ${stamp}\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accessible-comms-brief-${date}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const [helpCopied, setHelpCopied] = useState(false);
  const handleCopyHelpPrompt = async () => {
    if (!briefHelpPrompt) return;
    try {
      await navigator.clipboard.writeText(briefHelpPrompt.prompt);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = briefHelpPrompt.prompt;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setHelpCopied(true);
    window.setTimeout(() => setHelpCopied(false), 2000);
  };

  return (
    <fieldset className="format-choice-block">
      <legend className="format-choice-legend">{legend}</legend>
      {helpText && <p className="format-choice-help">{helpText}</p>}
      {(briefGuidance || briefHelpPrompt) && (
        <div className="format-choice-scaffolds">
          {briefGuidance && (
            <details className="format-choice-scaffold">
              <summary>{briefGuidance.title}</summary>
              <div
                className="format-choice-scaffold-body"
                dangerouslySetInnerHTML={{ __html: briefGuidance.bodyHtml }}
              />
            </details>
          )}
          {briefHelpPrompt && (
            <details className="format-choice-scaffold">
              <summary>{briefHelpPrompt.title}</summary>
              <div className="format-choice-scaffold-body">
                {briefHelpPrompt.introHtml && (
                  <div dangerouslySetInnerHTML={{ __html: briefHelpPrompt.introHtml }} />
                )}
                <div className="format-choice-help-prompt-wrapper">
                  <button
                    type="button"
                    className={`format-choice-help-prompt-btn${helpCopied ? ' is-copied' : ''}`}
                    onClick={handleCopyHelpPrompt}
                    aria-label={helpCopied ? 'Prompt copied to clipboard' : 'Copy this prompt to clipboard'}
                  >
                    {helpCopied ? 'Copied' : 'Copy this prompt'}
                  </button>
                  <pre className="format-choice-help-prompt-text">{briefHelpPrompt.prompt}</pre>
                </div>
              </div>
            </details>
          )}
        </div>
      )}
      <div className="format-choice-options" role="radiogroup" aria-label="Format">
        {formats.map((f) => (
          <label key={f.value} className={`format-choice-option${choice.format === f.value ? ' is-selected' : ''}`}>
            <input
              type="radio"
              name={`format-choice-${courseId}`}
              value={f.value}
              checked={choice.format === f.value}
              onChange={() => setFormat(f.value)}
            />
            <span>{f.label}</span>
          </label>
        ))}
      </div>
      <div className="format-choice-audience">
        <label htmlFor={audienceId}>{audienceLabel}</label>
        {audienceExample && (
          <p className="format-choice-audience-example" id={audienceExampleId}>
            For example: {audienceExample}
          </p>
        )}
        <input
          id={audienceId}
          type="text"
          value={choice.audience}
          onChange={(e) => setAudience(e.target.value)}
          autoComplete="off"
          aria-describedby={audienceExampleId}
        />
      </div>
      {contextFields?.map((field) => {
        const inputId = `format-choice-${field.key.toLowerCase().replace(/\s+/g, '-')}-${courseId}`;
        const exampleId = field.example ? `${inputId}-example` : undefined;
        const value = choice.contextFields[field.key] ?? '';
        return (
          <div key={field.key} className="format-choice-audience">
            <label htmlFor={inputId}>{field.label}</label>
            {field.example && (
              <p className="format-choice-audience-example" id={exampleId}>
                For example: {field.example}
              </p>
            )}
            {field.multiline ? (
              <textarea
                id={inputId}
                value={value}
                onChange={(e) => setContextField(field.key, e.target.value)}
                rows={3}
                aria-describedby={exampleId}
              />
            ) : (
              <input
                id={inputId}
                type="text"
                value={value}
                onChange={(e) => setContextField(field.key, e.target.value)}
                autoComplete="off"
                aria-describedby={exampleId}
              />
            )}
          </div>
        );
      })}
      {hasBoth && (
        <div className="format-choice-summary-wrapper">
          <p className="format-choice-summary" aria-live="polite">
            Your brief is saved. It will pre-fill the briefing prompt in Step 3 and the sense-check prompt in Lesson 4. You can change it anytime.
          </p>
          <div className="format-choice-brief-actions">
            <button
              type="button"
              className={`format-choice-copy-brief${copied ? ' is-copied' : ''}`}
              onClick={handleCopyBrief}
              aria-label={copied ? 'Brief copied to clipboard' : 'Copy your brief to clipboard'}
            >
              {copied ? 'Brief copied' : 'Copy your brief'}
            </button>
            <button
              type="button"
              className="format-choice-download-brief"
              onClick={handleDownloadBrief}
              aria-label="Download your brief as a text file"
            >
              Download your brief
            </button>
          </div>
        </div>
      )}
    </fieldset>
  );
}

function InteractiveChecklistBlock({
  title,
  items,
  introHtml,
  courseId,
  lessonId,
  selectedFormat,
}: {
  title: string;
  items: string[];
  introHtml?: string;
  courseId: string;
  lessonId: string;
  selectedFormat?: string;
}) {
  const { isChecked, toggle } = useChecklistProgress(courseId, lessonId);
  // Use a checklist key that varies with the selected format so different
  // format checklists do not stomp on each other in localStorage.
  const checklistKey = selectedFormat ? `${title} :: ${selectedFormat}` : title;
  const checkedCount = items.reduce((sum, _, i) => sum + (isChecked(checklistKey, i) ? 1 : 0), 0);

  return (
    <div className="lesson-checklist-block">
      <div className="lesson-checklist-header">
        <h3 className="lesson-checklist-title">{title}</h3>
        <span className="lesson-checklist-count" aria-live="polite">
          {checkedCount} of {items.length}
        </span>
      </div>
      {introHtml && (
        <div
          className="lesson-checklist-intro"
          dangerouslySetInnerHTML={{ __html: introHtml }}
        />
      )}
      <ul className="lesson-checklist-items">
        {items.map((item, i) => {
          const checked = isChecked(checklistKey, i);
          return (
            <li
              key={i}
              className={`lesson-checklist-item${checked ? ' is-checked' : ''}`}
            >
              <label>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(checklistKey, i)}
                />
                <span>{item}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function applyPackSubstitutions(text: string, subs: Record<string, string>): string {
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

function TakeHomeBlock({
  title,
  introHtml,
  includeBrief,
  promptPack,
  browseAllLink,
  courseId,
}: {
  title: string;
  introHtml?: string;
  includeBrief?: boolean;
  promptPack?: {
    label: string;
    filename: string;
    headerNote?: string;
    sections: Array<{ heading: string; content: string }>;
  };
  browseAllLink?: { label: string; description?: string; href: string };
  courseId: string;
}) {
  const { choice } = useFormatChoice(courseId);
  const [copied, setCopied] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);

  const subs: Record<string, string> = {
    'FORMAT NAME': choice.format,
    AUDIENCE: choice.audience,
    ...choice.contextFields,
  };

  const buildBriefText = () => {
    const lines = [
      'My brief',
      '',
      `Format: ${choice.format || '(not set)'}`,
      `Audience: ${choice.audience || '(not set)'}`,
    ];
    Object.entries(choice.contextFields).forEach(([k, v]) => {
      lines.push(`${k}: ${v || '(not set)'}`);
    });
    return lines.join('\n');
  };

  const handleCopyBrief = async () => {
    const text = buildBriefText();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadBrief = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const stamp = now.toLocaleString('en-AU');
    const content = `${buildBriefText()}\n\nCaptured ${stamp}\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accessible-comms-brief-${date}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const briefSubtitleLine = () => {
    if (choice.format && choice.audience.trim()) {
      return `${choice.format} for ${choice.audience}`;
    }
    return 'Your reusable workshop kit';
  };

  const handleDownloadPromptPackTxt = () => {
    if (!promptPack) return;
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const stamp = now.toLocaleString('en-AU');
    const briefSummary = `Format: ${choice.format || '(not set)'}\nAudience: ${choice.audience || '(not set)'}` +
      (Object.keys(choice.contextFields).length
        ? '\n' + Object.entries(choice.contextFields).map(([k, v]) => `${k}: ${v || '(not set)'}`).join('\n')
        : '');
    const headerLines = [
      promptPack.label,
      `Captured ${stamp}`,
      '',
      'Your brief:',
      briefSummary,
    ];
    if (promptPack.headerNote) {
      headerLines.push('', promptPack.headerNote);
    }
    const sectionTexts = promptPack.sections.map((s, i) => {
      const divider = '='.repeat(60);
      const body = applyPackSubstitutions(s.content, subs);
      return `${divider}\n${i + 1}. ${s.heading}\n${divider}\n\n${body}`;
    });
    const content = headerLines.join('\n') + '\n\n' + sectionTexts.join('\n\n') + '\n';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${promptPack.filename}-${date}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPromptPackPdf = async () => {
    if (!promptPack || pdfBusy) return;
    setPdfBusy(true);
    try {
    const date = new Date().toISOString().split('T')[0];
    const blob = await generatePromptPackPdf({
      title: promptPack.label,
      subtitle: briefSubtitleLine(),
      intro:
        promptPack.headerNote ??
        'Your reusable workshop kit. Paste each prompt into the right tool when you start a new piece of accessible content.',
      howToUse: [
        'Section 1 sets up the AI assistant in ChatGPT (or your drafting tool).',
        'Section 2 sets up Claude as your reviewer.',
        'Section 3 is the briefing prompt, already filled in with your brief.',
        'Sections 4 a to f are the six build prompts, one per format.',
        'Section 5 is the iteration prompts you reach for between drafts.',
        'Section 6 is the reset prompt if the AI drifts.',
        'Section 7 is the Claude Word formatting checklist prompt for accessible Word output.',
      ],
      sections: promptPack.sections.map((s) => ({
        title: s.heading,
        prompt: applyPackSubstitutions(s.content, subs),
      })),
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${promptPack.filename}-${date}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    } finally {
      setPdfBusy(false);
    }
  };

  const hasBrief = choice.format && choice.audience.trim();

  return (
    <section className="take-home-panel" aria-labelledby={`take-home-${courseId}`}>
      <h2 id={`take-home-${courseId}`} className="take-home-title">{title}</h2>
      {introHtml && (
        <div
          className="take-home-intro"
          dangerouslySetInnerHTML={{ __html: introHtml }}
        />
      )}
      {includeBrief && (
        <div className="take-home-action">
          <div className="take-home-action-label">Your brief</div>
          {hasBrief ? (
            <>
              <p className="take-home-action-summary">
                <strong>{choice.format}</strong> for <strong>{choice.audience}</strong>
              </p>
              <div className="take-home-action-buttons">
                <button
                  type="button"
                  className={`format-choice-copy-brief${copied ? ' is-copied' : ''}`}
                  onClick={handleCopyBrief}
                  aria-label={copied ? 'Brief copied to clipboard' : 'Copy your brief to clipboard'}
                >
                  {copied ? 'Brief copied' : 'Copy your brief'}
                </button>
                <button
                  type="button"
                  className="format-choice-download-brief"
                  onClick={handleDownloadBrief}
                  aria-label="Download your brief as a text file"
                >
                  Download your brief
                </button>
              </div>
            </>
          ) : (
            <p className="take-home-action-empty">Your brief is empty. Scroll back to Step 1 of Lesson 2 to fill it in, then come back to grab it.</p>
          )}
        </div>
      )}
      {promptPack && (
        <div className="take-home-action">
          <div className="take-home-action-label">{promptPack.label}</div>
          <p className="take-home-action-summary">
            {promptPack.sections.length} prompt{promptPack.sections.length === 1 ? '' : 's'} bundled into one file
            {hasBrief
              ? ', with your brief already substituted into the placeholders.'
              : '. Your brief is empty so the placeholders stay as [FORMAT NAME], [AUDIENCE] etc., ready for you to fill in.'}
          </p>
          <p className="take-home-action-note">
            Grab both formats. The PDF is for printing, filing or sharing with a colleague. The TXT is what you paste into AI tools next time.
          </p>
          <div className="take-home-action-buttons">
            <button
              type="button"
              className="format-choice-download-brief"
              onClick={handleDownloadPromptPackPdf}
              disabled={pdfBusy}
              aria-label={pdfBusy ? 'Building PDF, please wait' : `Download ${promptPack.label} as a PDF`}
            >
              {pdfBusy ? 'Building PDF…' : 'Download prompt pack (PDF)'}
            </button>
            <button
              type="button"
              className="format-choice-copy-brief"
              onClick={handleDownloadPromptPackTxt}
              aria-label={`Download ${promptPack.label} as a text file`}
            >
              Download prompt pack (TXT)
            </button>
          </div>
        </div>
      )}
      {browseAllLink && (
        <div className="take-home-browse-all">
          {browseAllLink.description && (
            <p className="take-home-browse-all-desc">{browseAllLink.description}</p>
          )}
          <Link to={browseAllLink.href} className="take-home-browse-all-link">
            {browseAllLink.label}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>
        </div>
      )}
    </section>
  );
}

const COPY_ICON_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
const CHECK_ICON_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';
const COPY_BTN_INNER = COPY_ICON_SVG + '<span>Copy</span>';
const COPIED_BTN_INNER = CHECK_ICON_SVG + '<span>Copied</span>';

function highlightBracketPlaceholders(preInner: string): string {
  // Wrap any remaining [placeholder] in a <mark> so they stand out visually.
  // textContent strips the tag on copy, so brackets travel unchanged into the AI tool.
  return preInner.replace(
    /\[([^\[\]\n<>]+)\]/g,
    '<mark class="prompt-placeholder">[$1]</mark>'
  );
}

function addCopyButtonsToHtml(html: string): string {
  // Wrap every <pre>...</pre> with a wrapper + toolbar + copy button so the
  // button is part of the React-rendered HTML (survives re-renders, no race
  // with dangerouslySetInnerHTML). A sr-only live region inside each wrapper
  // announces "Copied to clipboard" to screen readers on click.
  return html.replace(/<pre>([\s\S]*?)<\/pre>/g, (_match, inner) => {
    const highlighted = highlightBracketPlaceholders(inner);
    return `<div class="copyable-pre-wrapper"><div class="copyable-pre-toolbar"><button type="button" class="copyable-pre-btn" aria-label="Copy to clipboard">${COPY_BTN_INNER}</button></div><pre>${highlighted}</pre><span class="sr-only copyable-pre-status" aria-live="polite"></span></div>`;
  });
}

function TextBlock({
  heading,
  body,
  substitutions,
}: {
  heading?: string;
  body?: string;
  substitutions?: Record<string, string>;
}) {
  const subbedBody = body ? applyPackSubstitutions(body, substitutions ?? {}) : undefined;
  const transformed = subbedBody ? addCopyButtonsToHtml(subbedBody) : undefined;

  const handleClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const btn = target.closest<HTMLButtonElement>('.copyable-pre-btn');
    if (!btn) return;
    const wrapper = btn.closest('.copyable-pre-wrapper');
    const pre = wrapper?.querySelector('pre');
    if (!pre) return;
    const text = (pre.querySelector('code')?.textContent ?? pre.textContent ?? '').trim();
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    btn.classList.add('is-copied');
    btn.innerHTML = COPIED_BTN_INNER;
    btn.setAttribute('aria-label', 'Copied to clipboard');
    const liveRegion = wrapper?.querySelector<HTMLSpanElement>('.copyable-pre-status');
    if (liveRegion) liveRegion.textContent = 'Copied to clipboard';
    window.setTimeout(() => {
      btn.classList.remove('is-copied');
      btn.innerHTML = COPY_BTN_INNER;
      btn.setAttribute('aria-label', 'Copy to clipboard');
      if (liveRegion) liveRegion.textContent = '';
    }, 2000);
  };

  return (
    <div className="lesson-text-block">
      {heading && <h2 className="lesson-block-heading">{heading}</h2>}
      {transformed && (
        <div
          className="lesson-block-body"
          onClick={handleClick}
          dangerouslySetInnerHTML={{ __html: transformed }}
        />
      )}
    </div>
  );
}

interface LessonContentRendererProps {
  blocks: LessonContentBlock[];
  courseId: string;
  lessonId: string;
}

const STEP_RE = /^Step\s+(\d+)\s*[:.\s]/i;
const STEP_STRIP_RE = /^Step\s+\d+\s*[:.\s]\s*/i;

function getStepNumber(block: LessonContentBlock): number | null {
  let heading: string | undefined;
  if (block.type === 'text') heading = block.heading;
  else if (block.type === 'exercise') heading = block.exercise?.title;
  else if (block.type === 'checklist') heading = block.checklist?.title;
  if (!heading) return null;
  const m = heading.match(STEP_RE);
  return m ? parseInt(m[1], 10) : null;
}

function stripStepPrefix(text: string): string {
  return text.replace(STEP_STRIP_RE, '');
}

function withStrippedHeading(block: LessonContentBlock): LessonContentBlock {
  if (block.type === 'text' && block.heading) {
    return { ...block, heading: stripStepPrefix(block.heading) };
  }
  if (block.type === 'exercise' && block.exercise) {
    return {
      ...block,
      exercise: { ...block.exercise, title: stripStepPrefix(block.exercise.title) },
    };
  }
  if (block.type === 'checklist' && block.checklist) {
    return {
      ...block,
      checklist: { ...block.checklist, title: stripStepPrefix(block.checklist.title) },
    };
  }
  return block;
}

function CalloutBlock({ variant, text }: { variant: string; text: string }) {
  const icons: Record<string, React.ReactNode> = {
    tip: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    ),
    warning: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    info: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    ),
    example: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
    ),
  };

  return (
    <div className={`lesson-callout callout-${variant}`} role="note">
      <span className="callout-icon">{icons[variant] ?? icons.info}</span>
      <span className="callout-text">{text}</span>
    </div>
  );
}

function renderBlock(
  block: LessonContentBlock,
  key: React.Key,
  ctx: { courseId: string; lessonId: string; substitutions: Record<string, string>; selectedFormat: string }
): React.ReactNode {
  switch (block.type) {
    case 'text':
      return (
        <TextBlock
          key={key}
          heading={block.heading}
          body={block.body}
          substitutions={ctx.substitutions}
        />
      );

    case 'video':
      if (!block.video) return null;
      return (
        <div key={key} className="lesson-video-block">
          <div className="lesson-video-wrapper">
            <iframe
              src={`https://player.vimeo.com/video/${block.video.vimeoId}?dnt=1`}
              title={block.video.title}
              allow="fullscreen; picture-in-picture"
              allowFullScreen
              className="lesson-video-iframe"
            />
          </div>
          <div className="lesson-video-info">
            <span className="lesson-video-title">{block.video.title}</span>
            <span className="lesson-video-duration">{block.video.duration}</span>
            {block.video.hasCaptions && (
              <span className="lesson-video-badge">CC</span>
            )}
          </div>
        </div>
      );

    case 'exercise': {
      if (!block.exercise) return null;
      const ex = block.exercise;
      const exerciseInner = (
        <ExerciseBlock
          title={ex.title}
          instructions={ex.instructions}
          promptTemplate={ex.promptTemplate}
          expectedOutcome={ex.expectedOutcome}
          tips={ex.tips}
          exampleOutput={ex.exampleOutput}
          substitutions={ctx.substitutions}
          targetTool={ex.targetTool}
        />
      );
      if (ex.formatKey && ex.formatKey !== ctx.selectedFormat) {
        return (
          <details key={key} className="build-prompt-detail">
            <summary>{ex.title}</summary>
            {exerciseInner}
          </details>
        );
      }
      return <div key={key}>{exerciseInner}</div>;
    }

    case 'format-choice':
      if (!block.formatChoice) return null;
      return (
        <FormatChoiceBlock
          key={key}
          legend={block.formatChoice.legend}
          helpText={block.formatChoice.helpText}
          formats={block.formatChoice.formats}
          audienceLabel={block.formatChoice.audienceLabel}
          audienceExample={block.formatChoice.audienceExample}
          contextFields={block.formatChoice.contextFields}
          briefGuidance={block.formatChoice.briefGuidance}
          briefHelpPrompt={block.formatChoice.briefHelpPrompt}
          courseId={ctx.courseId}
        />
      );

    case 'take-home':
      if (!block.takeHome) return null;
      return (
        <TakeHomeBlock
          key={key}
          title={block.takeHome.title}
          introHtml={block.takeHome.introHtml}
          includeBrief={block.takeHome.includeBrief}
          promptPack={block.takeHome.promptPack}
          browseAllLink={block.takeHome.browseAllLink}
          courseId={ctx.courseId}
        />
      );

    case 'download':
      if (!block.download) return null;
      return <DownloadBlock key={key} download={block.download} />;

    case 'checklist': {
      if (!block.checklist) return null;
      const formatItems = block.checklist.byFormat?.[ctx.selectedFormat];
      const itemsToShow = formatItems ?? block.checklist.items;
      return (
        <InteractiveChecklistBlock
          key={key}
          title={block.checklist.title}
          items={itemsToShow}
          introHtml={block.checklist.introHtml}
          courseId={ctx.courseId}
          lessonId={ctx.lessonId}
          selectedFormat={formatItems ? ctx.selectedFormat : undefined}
        />
      );
    }

    case 'callout':
      if (!block.callout) return null;
      return (
        <CalloutBlock
          key={key}
          variant={block.callout.variant}
          text={block.callout.text}
        />
      );

    case 'image':
      if (!block.image) return null;
      return (
        <figure key={key} className="lesson-image-block">
          <img
            src={block.image.src}
            alt={block.image.alt}
            className="lesson-image"
            loading="lazy"
          />
          {block.image.caption && (
            <figcaption className="lesson-image-caption">{block.image.caption}</figcaption>
          )}
        </figure>
      );

    default:
      return null;
  }
}

type StepGroup = {
  stepNum: number | null;
  items: Array<{ block: LessonContentBlock; index: number }>;
};

function groupBlocks(blocks: LessonContentBlock[]): StepGroup[] {
  const groups: StepGroup[] = [];
  blocks.forEach((block, index) => {
    const stepNum = getStepNumber(block);
    if (stepNum !== null) {
      groups.push({ stepNum, items: [{ block, index }] });
      return;
    }
    // take-home blocks always break out of the preceding step group so they
    // render as a standalone wrap-up panel, not nested inside a step card.
    if (block.type === 'take-home') {
      groups.push({ stepNum: null, items: [{ block, index }] });
      return;
    }
    const last = groups[groups.length - 1];
    if (last) {
      last.items.push({ block, index });
    } else {
      groups.push({ stepNum: null, items: [{ block, index }] });
    }
  });
  return groups;
}

export function LessonContentRenderer({ blocks, courseId, lessonId }: LessonContentRendererProps) {
  const { toggleStep, isStepDone } = useStepProgress(courseId, lessonId);
  const { choice } = useFormatChoice(courseId);
  const groups = groupBlocks(blocks);
  const substitutions: Record<string, string> = {
    'FORMAT NAME': choice.format,
    AUDIENCE: choice.audience,
    ...choice.contextFields,
  };
  const ctx = { courseId, lessonId, substitutions, selectedFormat: choice.format };

  return (
    <div className="lesson-content-blocks">
      {groups.map((group, gIndex) => {
        if (group.stepNum === null) {
          return (
            <div key={`g-${gIndex}`} className="lesson-prologue-group">
              {group.items.map(({ block, index }) => renderBlock(block, index, ctx))}
            </div>
          );
        }
        const stepNum = group.stepNum;
        const done = isStepDone(stepNum);
        return (
          <section
            key={`step-${gIndex}`}
            className={`lesson-step-card${done ? ' is-complete' : ''}`}
            aria-label={`Step ${stepNum}`}
          >
            <div className="lesson-step-card-header">
              <span className="lesson-step-badge" aria-hidden="true">
                {done ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  stepNum
                )}
              </span>
              <span className="lesson-step-label">Step {stepNum}</span>
            </div>
            <div className="lesson-step-card-body">
              {group.items.map(({ block, index }, i) => {
                const toRender = i === 0 ? withStrippedHeading(block) : block;
                return renderBlock(toRender, index, ctx);
              })}
            </div>
            <div className="lesson-step-card-footer">
              <button
                type="button"
                className={`lesson-step-complete-btn${done ? ' is-complete' : ''}`}
                onClick={() => toggleStep(stepNum)}
                aria-pressed={done}
              >
                {done ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Step {stepNum} complete
                  </>
                ) : (
                  <>Mark Step {stepNum} done</>
                )}
              </button>
            </div>
          </section>
        );
      })}
    </div>
  );
}
