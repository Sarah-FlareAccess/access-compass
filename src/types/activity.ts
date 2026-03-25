export type ActivityType =
  | 'module-completed'
  | 'module-assigned'
  | 'module-started'
  | 'diap-item-created'
  | 'diap-status-changed'
  | 'diap-assigned'
  | 'diap-comment-added'
  | 'report-generated';

export interface ActivityEntry {
  id: string;
  sessionId: string;
  type: ActivityType;
  actorName: string;
  actorId?: string;
  timestamp: string;
  moduleId?: string;
  moduleName?: string;
  diapItemId?: string;
  diapItemObjective?: string;
  oldValue?: string;
  newValue?: string;
  assigneeName?: string;
  commentText?: string;
}

export interface DIAPComment {
  id: string;
  authorName: string;
  authorId?: string;
  text: string;
  createdAt: string;
}
