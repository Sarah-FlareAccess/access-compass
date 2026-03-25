import { useState } from 'react';
import type { ActivityEntry } from '../types/activity';
import '../styles/activity-feed.css';

interface ActivityFeedProps {
  activities: ActivityEntry[];
  maxInitial?: number;
}

function getActivityIcon(type: ActivityEntry['type']): string {
  switch (type) {
    case 'module-completed': return '✅';
    case 'module-started': return '▶️';
    case 'module-assigned': return '👤';
    case 'diap-item-created': return '➕';
    case 'diap-status-changed': return '🔄';
    case 'diap-assigned': return '👤';
    case 'diap-comment-added': return '💬';
    case 'report-generated': return '📄';
    default: return '📌';
  }
}

function getActivityDescription(entry: ActivityEntry): string {
  switch (entry.type) {
    case 'module-completed':
      return `completed ${entry.moduleName || 'a module'}`;
    case 'module-started':
      return `started ${entry.moduleName || 'a module'}`;
    case 'module-assigned':
      return `assigned ${entry.moduleName || 'a module'} to ${entry.assigneeName || 'someone'}`;
    case 'diap-item-created':
      return `created DIAP item: ${truncate(entry.diapItemObjective || '', 60)}`;
    case 'diap-status-changed':
      return `changed status of "${truncate(entry.diapItemObjective || '', 40)}" from ${formatStatus(entry.oldValue)} to ${formatStatus(entry.newValue)}`;
    case 'diap-assigned':
      return `assigned "${truncate(entry.diapItemObjective || '', 40)}" to ${entry.assigneeName || 'someone'}`;
    case 'diap-comment-added':
      return `commented on "${truncate(entry.diapItemObjective || '', 40)}"`;
    case 'report-generated':
      return 'generated a report';
    default:
      return 'performed an action';
  }
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max) + '...';
}

function formatStatus(status?: string): string {
  if (!status) return 'unknown';
  return status.replace(/-/g, ' ');
}

function formatRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
}

export function ActivityFeed({ activities, maxInitial = 20 }: ActivityFeedProps) {
  const [showCount, setShowCount] = useState(maxInitial);

  const visible = activities.slice(0, showCount);
  const hasMore = activities.length > showCount;

  if (activities.length === 0) {
    return (
      <div className="activity-feed-empty">
        <p>No activity yet. Actions like completing modules, creating DIAP items, and adding comments will appear here.</p>
      </div>
    );
  }

  return (
    <div className="activity-feed">
      <ul role="feed" aria-label="Recent activity">
        {visible.map(entry => (
          <li key={entry.id} className="activity-entry" aria-label={`${entry.actorName} ${getActivityDescription(entry)}`}>
            <span className="activity-icon" aria-hidden="true">{getActivityIcon(entry.type)}</span>
            <div className="activity-body">
              <p className="activity-text">
                <strong className="activity-actor">{entry.actorName}</strong>{' '}
                {getActivityDescription(entry)}
              </p>
              <time className="activity-time" dateTime={entry.timestamp}>
                {formatRelativeTime(entry.timestamp)}
              </time>
            </div>
          </li>
        ))}
      </ul>
      {hasMore && (
        <button
          type="button"
          className="activity-show-more"
          onClick={() => setShowCount(prev => prev + 20)}
        >
          Show more ({activities.length - showCount} remaining)
        </button>
      )}
    </div>
  );
}
