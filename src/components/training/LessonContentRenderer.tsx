import { useEffect, useRef } from 'react';
import type { LessonContentBlock } from '../../data/training/types';
import { ExerciseBlock } from './ExerciseBlock';
import { DownloadBlock } from './DownloadBlock';
import { useStepProgress } from '../../hooks/useStepProgress';
import './LessonContentRenderer.css';

const COPY_ICON_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
const CHECK_ICON_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

function TextBlock({ heading, body }: { heading?: string; body?: string }) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = bodyRef.current;
    if (!root || !body) return;

    const pres = Array.from(root.querySelectorAll('pre'));
    const cleanupFns: Array<() => void> = [];

    pres.forEach((pre) => {
      if (pre.parentElement?.classList.contains('copyable-pre-wrapper')) return;
      const text = (pre.querySelector('code')?.textContent ?? pre.textContent ?? '').trim();
      if (!text) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'copyable-pre-wrapper';
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copyable-pre-btn';
      btn.setAttribute('aria-label', 'Copy to clipboard');
      btn.innerHTML = COPY_ICON_SVG + '<span>Copy</span>';

      let resetTimer: number | null = null;
      const handleClick = async () => {
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
        btn.innerHTML = CHECK_ICON_SVG + '<span>Copied</span>';
        btn.setAttribute('aria-label', 'Copied to clipboard');
        if (resetTimer) window.clearTimeout(resetTimer);
        resetTimer = window.setTimeout(() => {
          btn.classList.remove('is-copied');
          btn.innerHTML = COPY_ICON_SVG + '<span>Copy</span>';
          btn.setAttribute('aria-label', 'Copy to clipboard');
        }, 2000);
      };

      btn.addEventListener('click', handleClick);
      wrapper.appendChild(btn);

      cleanupFns.push(() => {
        btn.removeEventListener('click', handleClick);
        if (resetTimer) window.clearTimeout(resetTimer);
      });
    });

    return () => cleanupFns.forEach((fn) => fn());
  }, [body]);

  return (
    <div className="lesson-text-block">
      {heading && <h2 className="lesson-block-heading">{heading}</h2>}
      {body && (
        <div
          ref={bodyRef}
          className="lesson-block-body"
          dangerouslySetInnerHTML={{ __html: body }}
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

function renderBlock(block: LessonContentBlock, key: React.Key): React.ReactNode {
  switch (block.type) {
    case 'text':
      return <TextBlock key={key} heading={block.heading} body={block.body} />;

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

    case 'exercise':
      if (!block.exercise) return null;
      return (
        <ExerciseBlock
          key={key}
          title={block.exercise.title}
          instructions={block.exercise.instructions}
          promptTemplate={block.exercise.promptTemplate}
          expectedOutcome={block.exercise.expectedOutcome}
          tips={block.exercise.tips}
          exampleOutput={block.exercise.exampleOutput}
        />
      );

    case 'download':
      if (!block.download) return null;
      return <DownloadBlock key={key} download={block.download} />;

    case 'checklist':
      if (!block.checklist) return null;
      return (
        <div key={key} className="lesson-checklist-block">
          <h3 className="lesson-checklist-title">{block.checklist.title}</h3>
          <ul className="lesson-checklist-items">
            {block.checklist.items.map((item, i) => (
              <li key={i} className="lesson-checklist-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      );

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
  const groups = groupBlocks(blocks);

  return (
    <div className="lesson-content-blocks">
      {groups.map((group, gIndex) => {
        if (group.stepNum === null) {
          return (
            <div key={`g-${gIndex}`} className="lesson-prologue-group">
              {group.items.map(({ block, index }) => renderBlock(block, index))}
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
                return renderBlock(toRender, index);
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
