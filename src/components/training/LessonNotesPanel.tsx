import { useEffect, useState } from 'react';
import { useLessonNotes } from '../../hooks/useLessonNotes';
import './LessonNotesPanel.css';

interface Props {
  courseId: string;
  courseTitle: string;
}

export function LessonNotesPanel({ courseId, courseTitle }: Props) {
  const [open, setOpen] = useState(false);
  const { notes, setNotes, clearNotes } = useLessonNotes(courseId);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const handleDownload = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const stamp = now.toLocaleString('en-AU');
    const content = `Notes from ${courseTitle}\nCaptured ${stamp}\n\n${'-'.repeat(60)}\n\n${notes.trim() || '(no notes yet)'}\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accessible-comms-notes-${date}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (window.confirm('Clear all your notes for this course? This cannot be undone.')) {
      clearNotes();
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        className="lesson-notes-trigger"
        onClick={() => setOpen(true)}
        aria-label="Open my notes"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        <span>Notes</span>
      </button>
    );
  }

  return (
    <aside className="lesson-notes-panel" role="complementary" aria-label="My notes">
      <div className="lesson-notes-header">
        <h2 className="lesson-notes-title">My notes</h2>
        <button
          type="button"
          className="lesson-notes-close"
          onClick={() => setOpen(false)}
          aria-label="Close notes panel"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <p className="lesson-notes-help">Anything you jot down saves locally to your browser as you type. Download as a text file before closing the session so you have a copy you can open in any app.</p>
      <textarea
        className="lesson-notes-textarea"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Insights, questions, follow-ups, names of people to test the draft with..."
        aria-label="Your notes"
      />
      <div className="lesson-notes-footer">
        <button type="button" className="lesson-notes-download" onClick={handleDownload}>
          Download notes
        </button>
        <button type="button" className="lesson-notes-clear" onClick={handleClear}>
          Clear
        </button>
      </div>
    </aside>
  );
}
