import { useState, useRef, useEffect } from 'react';
import type { DIAPComment } from '../types/activity';

interface DIAPCommentThreadProps {
  comments: DIAPComment[];
  onAddComment: (text: string) => void;
}

function formatCommentTime(timestamp: string): string {
  const date = new Date(timestamp);
  const dateStr = date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = date.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
  return `${dateStr}, ${timeStr}`;
}

export function DIAPCommentThread({ comments, onAddComment }: DIAPCommentThreadProps) {
  const [text, setText] = useState('');
  const listEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (comments.length > 0) {
      listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAddComment(trimmed);
    setText('');
  };

  return (
    <div className="diap-comment-thread">
      <h5 className="comment-thread-heading">
        Comments {comments.length > 0 && <span className="comment-count">({comments.length})</span>}
      </h5>

      {comments.length > 0 && (
        <ul className="comment-list" aria-label="Comments">
          {comments.map(comment => (
            <li key={comment.id} className="comment-item">
              <div className="comment-header">
                <strong className="comment-author">{comment.authorName}</strong>
                <time className="comment-time" dateTime={comment.createdAt}>
                  {formatCommentTime(comment.createdAt)}
                </time>
              </div>
              <p className="comment-text">{comment.text}</p>
            </li>
          ))}
          <div ref={listEndRef} />
        </ul>
      )}

      <form className="comment-form" onSubmit={handleSubmit}>
        <label htmlFor="comment-input" className="sr-only">Add a comment</label>
        <textarea
          id="comment-input"
          className="comment-input"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add a comment..."
          rows={2}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button type="submit" className="comment-submit" disabled={!text.trim()}>
          Post
        </button>
      </form>
    </div>
  );
}
