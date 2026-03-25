import type { ActivityEntry } from '../types/activity';
import type { DIAPItem } from '../hooks/useDIAPManagement';

function formatStatus(status?: string): string {
  if (!status) return 'unknown';
  return status.replace(/-/g, ' ');
}

export function generateDIAPAssignmentMessage(item: DIAPItem, orgName: string): string {
  return `Hi ${item.responsibleRole || 'team'},

You've been assigned a DIAP action item for ${orgName}:

Objective: ${item.objective}
Action: ${item.action}
Priority: ${item.priority}
${item.dueDate ? `Due date: ${new Date(item.dueDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}\n` : ''}
This is part of our Disability Inclusion Action Plan. Please update the status in Access Compass as you make progress.

Thanks!`;
}

export function generateModuleCompletionMessage(
  moduleName: string,
  doingWellCount: number,
  actionCount: number,
  orgName: string
): string {
  return `Hi team,

The "${moduleName}" accessibility module has been completed for ${orgName}.

Results:
- ${doingWellCount} areas doing well
- ${actionCount} areas for improvement

${actionCount > 0 ? 'Action items have been added to the DIAP. Please review and assign responsible team members.' : 'Great results! No urgent action items identified.'}

View the full results in Access Compass.`;
}

export function generateStatusChangeMessage(item: DIAPItem, oldStatus: string, orgName: string): string {
  return `DIAP Update for ${orgName}:

"${item.objective}" has been updated from ${formatStatus(oldStatus)} to ${formatStatus(item.status)}.

${item.responsibleRole ? `Assigned to: ${item.responsibleRole}` : ''}
${item.status === 'achieved' ? '\nGreat work on completing this action!' : ''}`;
}

export function generateWeeklyDigestMessage(activities: ActivityEntry[], orgName: string): string {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recent = activities.filter(a => new Date(a.timestamp) >= weekAgo);

  const completed = recent.filter(a => a.type === 'module-completed');
  const started = recent.filter(a => a.type === 'module-started');
  const diapCreated = recent.filter(a => a.type === 'diap-item-created');
  const diapStatusChanges = recent.filter(a => a.type === 'diap-status-changed');
  const comments = recent.filter(a => a.type === 'diap-comment-added');

  let message = `Access Compass Weekly Digest for ${orgName}
${now.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
${'='.repeat(50)}

`;

  if (recent.length === 0) {
    message += 'No activity this week. Time to make some progress on accessibility!\n';
    return message;
  }

  if (completed.length > 0) {
    message += `MODULES COMPLETED (${completed.length}):\n`;
    completed.forEach(a => {
      message += `  - ${a.moduleName || 'Unknown module'} (by ${a.actorName})\n`;
    });
    message += '\n';
  }

  if (started.length > 0) {
    message += `MODULES STARTED (${started.length}):\n`;
    started.forEach(a => {
      message += `  - ${a.moduleName || 'Unknown module'} (by ${a.actorName})\n`;
    });
    message += '\n';
  }

  if (diapCreated.length > 0) {
    message += `NEW DIAP ITEMS (${diapCreated.length}):\n`;
    diapCreated.forEach(a => {
      message += `  - ${a.diapItemObjective || 'New item'}\n`;
    });
    message += '\n';
  }

  if (diapStatusChanges.length > 0) {
    message += `DIAP STATUS UPDATES (${diapStatusChanges.length}):\n`;
    diapStatusChanges.forEach(a => {
      message += `  - "${a.diapItemObjective}": ${formatStatus(a.oldValue)} -> ${formatStatus(a.newValue)}\n`;
    });
    message += '\n';
  }

  if (comments.length > 0) {
    message += `COMMENTS ADDED: ${comments.length}\n\n`;
  }

  message += 'View full details in Access Compass.';

  return message;
}
