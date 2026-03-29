import { useState, useMemo } from 'react';
import type { ActivityEntry, ActivityCategory } from '../types/activity';
import { getActivityCategory } from '../types/activity';
import '../styles/activity-feed.css';

interface ActivityFeedProps {
  activities: ActivityEntry[];
  maxInitial?: number;
  trimmedByRetention?: boolean;
  onExportCSV?: () => void;
  onExportPDF?: () => void;
}

function getActivityIcon(type: ActivityEntry['type']): string {
  switch (type) {
    case 'module-completed': return '\u2705';
    case 'module-started': return '\u25B6\uFE0F';
    case 'module-assigned': return '\uD83D\uDC64';
    case 'diap-item-created': return '\u2795';
    case 'diap-status-changed': return '\uD83D\uDD04';
    case 'diap-assigned': return '\uD83D\uDC64';
    case 'diap-comment-added': return '\uD83D\uDCAC';
    case 'report-generated': return '\uD83D\uDCC4';
    default: return '\uD83D\uDCCC';
  }
}

export function getActivityDescription(entry: ActivityEntry): string {
  switch (entry.type) {
    case 'module-completed':
      return `completed ${entry.moduleId ? `[${entry.moduleId}] ` : ''}${entry.moduleName || 'a module'}`;
    case 'module-started':
      return `started ${entry.moduleId ? `[${entry.moduleId}] ` : ''}${entry.moduleName || 'a module'}`;
    case 'module-assigned':
      return `assigned ${entry.moduleId ? `[${entry.moduleId}] ` : ''}${entry.moduleName || 'a module'} to ${entry.assigneeName || 'someone'}`;
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

function getCategoryLabel(cat: ActivityCategory): string {
  switch (cat) {
    case 'all': return 'All';
    case 'module': return 'Modules';
    case 'diap': return 'DIAP';
    case 'report': return 'Reports';
    default: return 'All';
  }
}

function groupByDate(entries: ActivityEntry[]): { label: string; entries: ActivityEntry[] }[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const weekAgo = new Date(today.getTime() - 7 * 86400000);

  const groups: { label: string; entries: ActivityEntry[] }[] = [
    { label: 'Today', entries: [] },
    { label: 'Yesterday', entries: [] },
    { label: 'This week', entries: [] },
    { label: 'Older', entries: [] },
  ];

  for (const entry of entries) {
    const d = new Date(entry.timestamp);
    if (d >= today) groups[0].entries.push(entry);
    else if (d >= yesterday) groups[1].entries.push(entry);
    else if (d >= weekAgo) groups[2].entries.push(entry);
    else groups[3].entries.push(entry);
  }

  return groups.filter(g => g.entries.length > 0);
}

export function ActivityFeed({ activities, maxInitial = 20, trimmedByRetention, onExportCSV, onExportPDF }: ActivityFeedProps) {
  const [filter, setFilter] = useState<ActivityCategory>('all');
  const [showCount, setShowCount] = useState(maxInitial);

  const countByCategory = useMemo(() => {
    const counts: Record<ActivityCategory, number> = { all: activities.length, module: 0, diap: 0, report: 0 };
    for (const a of activities) {
      const cat = getActivityCategory(a.type);
      counts[cat]++;
    }
    return counts;
  }, [activities]);

  const filtered = useMemo(() => {
    if (filter === 'all') return activities;
    return activities.filter(a => getActivityCategory(a.type) === filter);
  }, [activities, filter]);

  const visible = filtered.slice(0, showCount);
  const hasMore = filtered.length > showCount;
  const dateGroups = useMemo(() => groupByDate(visible), [visible]);

  if (activities.length === 0) {
    return (
      <div className="activity-feed-empty">
        <p>No activity yet. Actions like completing modules, creating DIAP items, and adding comments will appear here.</p>
      </div>
    );
  }

  return (
    <div className="activity-log">
      {/* Filter tabs */}
      <div className="activity-filters" role="tablist" aria-label="Filter by category">
        {(['all', 'module', 'diap', 'report'] as const).map(cat => (
          <button
            key={cat}
            role="tab"
            aria-selected={filter === cat}
            className={`activity-filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => { setFilter(cat); setShowCount(maxInitial); }}
          >
            {getCategoryLabel(cat)}
            <span className="filter-count">{countByCategory[cat]}</span>
          </button>
        ))}
      </div>

      {/* Retention notice */}
      {trimmedByRetention && (
        <p className="activity-retention-notice">Showing last 12 months of activity</p>
      )}

      {/* Grouped entries */}
      {dateGroups.map(group => (
        <div key={group.label} className="activity-date-group">
          <h4 className="activity-date-heading">{group.label}</h4>
          <ul>
            {group.entries.map(entry => (
              <li key={entry.id} className="activity-entry" aria-label={`${entry.actorName} ${getActivityDescription(entry)}`}>
                <span className="activity-icon" aria-hidden="true">{getActivityIcon(entry.type)}</span>
                <span className={`activity-category-badge category-${getActivityCategory(entry.type)}`}>
                  {getActivityCategory(entry.type)}
                </span>
                <div className="activity-body">
                  <p className="activity-text">
                    <strong className="activity-actor">{entry.actorName}</strong>{' '}
                    {getActivityDescription(entry)}
                  </p>
                  {entry.commentText && (
                    <p className="activity-comment-preview">"{truncate(entry.commentText, 100)}"</p>
                  )}
                </div>
                <time className="activity-time" dateTime={entry.timestamp}>
                  {formatRelativeTime(entry.timestamp)}
                </time>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {hasMore && (
        <button
          type="button"
          className="activity-show-more"
          onClick={() => setShowCount(prev => prev + 20)}
        >
          Show more ({filtered.length - showCount} remaining)
        </button>
      )}

      {/* Export */}
      {(onExportCSV || onExportPDF) && (
        <div className="activity-export">
          {onExportCSV && (
            <button type="button" onClick={onExportCSV} className="btn-export">
              Export CSV
            </button>
          )}
          {onExportPDF && (
            <button type="button" onClick={onExportPDF} className="btn-export">
              Export PDF
            </button>
          )}
        </div>
      )}
    </div>
  );
}
