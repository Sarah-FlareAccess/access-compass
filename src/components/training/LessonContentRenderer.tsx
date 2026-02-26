import type { LessonContentBlock } from '../../data/training/types';
import { ExerciseBlock } from './ExerciseBlock';
import { DownloadBlock } from './DownloadBlock';
import './LessonContentRenderer.css';

interface LessonContentRendererProps {
  blocks: LessonContentBlock[];
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

export function LessonContentRenderer({ blocks }: LessonContentRendererProps) {
  return (
    <div className="lesson-content-blocks">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'text':
            return (
              <div key={index} className="lesson-text-block">
                {block.heading && <h3 className="lesson-block-heading">{block.heading}</h3>}
                {block.body && (
                  <div
                    className="lesson-block-body"
                    dangerouslySetInnerHTML={{ __html: block.body }}
                  />
                )}
              </div>
            );

          case 'video':
            if (!block.video) return null;
            return (
              <div key={index} className="lesson-video-block">
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
                key={index}
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
            return <DownloadBlock key={index} download={block.download} />;

          case 'checklist':
            if (!block.checklist) return null;
            return (
              <div key={index} className="lesson-checklist-block">
                <h4 className="lesson-checklist-title">{block.checklist.title}</h4>
                <ul className="lesson-checklist-items">
                  {block.checklist.items.map((item, i) => (
                    <li key={i} className="lesson-checklist-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
                key={index}
                variant={block.callout.variant}
                text={block.callout.text}
              />
            );

          case 'image':
            if (!block.image) return null;
            return (
              <figure key={index} className="lesson-image-block">
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
      })}
    </div>
  );
}
