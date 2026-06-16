export type ActivityType =
  | 'module-completed'
  | 'module-assigned'
  | 'module-started'
  | 'diap-item-created'
  | 'diap-status-changed'
  | 'diap-assigned'
  | 'diap-comment-added'
  | 'diap-item-updated'
  | 'report-generated'
  | 'site-created'
  | 'site-deleted'
  | 'training-course-started'
  | 'training-course-completed'
  | 'training-lesson-completed'
  | 'training-resource-downloaded';

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
  changedFields?: string[];
  attachmentName?: string;
  siteName?: string;
  courseId?: string;
  courseName?: string;
  lessonId?: string;
  lessonName?: string;
  resourceName?: string;
  resourceFormat?: string;
}

export type ActivityCategory = 'module' | 'diap' | 'report' | 'site' | 'training' | 'all';

export function getActivityCategory(type: ActivityType): ActivityCategory {
  if (type.startsWith('module-')) return 'module';
  if (type.startsWith('diap-')) return 'diap';
  if (type === 'report-generated') return 'report';
  if (type.startsWith('site-')) return 'site';
  if (type.startsWith('training-')) return 'training';
  return 'module';
}

export interface DIAPComment {
  id: string;
  authorName: string;
  authorId?: string;
  text: string;
  createdAt: string;
}
