/**
 * Resource Card Component
 *
 * Displays a resource as a card in the browse view.
 * Shows title, summary, category, and key metadata.
 */

import {
  BookOpen,
  MapPin,
  Users,
  Settings,
  ArrowRight,
  Video,
  FileText,
  CheckCircle,
} from 'lucide-react';
import type { HelpContent, ModuleGroup } from '../../data/help/types';
import './ResourceCard.css';

interface ResourceCardProps {
  resource: HelpContent;
  onClick: () => void;
}

// Category icons and colors
const CATEGORY_CONFIG: Record<ModuleGroup, { icon: React.ReactNode; color: string; label: string }> = {
  'before-arrival': {
    icon: <BookOpen size={16} />,
    color: '#3b82f6',
    label: 'Before Arrival',
  },
  'getting-in': {
    icon: <MapPin size={16} />,
    color: '#22c55e',
    label: 'Getting In',
  },
  'during-visit': {
    icon: <Users size={16} />,
    color: '#a855f7',
    label: 'During Visit',
  },
  'service-support': {
    icon: <Settings size={16} />,
    color: '#f59e0b',
    label: 'Service & Support',
  },
};

export function ResourceCard({ resource, onClick }: ResourceCardProps) {
  const category = CATEGORY_CONFIG[resource.moduleGroup];

  // Check what content types are available
  const hasVideo = !!resource.video;
  const hasChecklist = !!resource.howToCheck;
  const hasExamples = resource.examples && resource.examples.length > 0;
  const hasStandards = !!resource.standardsReference;

  return (
    <button className="resource-card" onClick={onClick}>
      {/* Category Badge */}
      <div
        className="resource-card-category"
        style={{ '--category-color': category.color } as React.CSSProperties}
      >
        {category.icon}
        <span>{category.label}</span>
      </div>

      {/* Title */}
      <h3 className="resource-card-title">{resource.title}</h3>

      {/* Summary */}
      <p className="resource-card-summary">{resource.summary}</p>

      {/* Content Type Badges */}
      <div className="resource-card-badges">
        {hasVideo && (
          <span className="content-badge badge-video">
            <Video size={12} />
            Video
          </span>
        )}
        {hasChecklist && (
          <span className="content-badge badge-checklist">
            <CheckCircle size={12} />
            Checklist
          </span>
        )}
        {hasExamples && (
          <span className="content-badge badge-examples">
            <FileText size={12} />
            Examples
          </span>
        )}
        {hasStandards && (
          <span className="content-badge badge-standards">
            Standards
          </span>
        )}
      </div>

      {/* Read More Arrow */}
      <div className="resource-card-arrow">
        <ArrowRight size={18} />
      </div>
    </button>
  );
}

export default ResourceCard;
