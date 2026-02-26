import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getResourceBySlug, getCategoryConfig } from '../data/training/index';
import { DownloadBlock } from '../components/training/DownloadBlock';
import { useTrainingProgress } from '../hooks/useTrainingProgress';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuth } from '../contexts/AuthContext';
import { canAccessTraining } from '../utils/trainingAccess';
import { PageFooter } from '../components/PageFooter';
import './TrainingResourceDetail.css';

export default function TrainingResourceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { accessState } = useAuth();

  const resource = useMemo(() => getResourceBySlug(slug ?? ''), [slug]);
  usePageTitle(resource?.title ?? 'Resource');

  const { markResourceViewed, isResourceViewed } = useTrainingProgress();

  if (!resource) {
    return (
      <div className="training-resource-detail">
        <div className="training-resource-not-found">
          <h1>Resource not found</h1>
          <Link to="/training">Back to Training Hub</Link>
        </div>
      </div>
    );
  }

  const canAccess = canAccessTraining(resource.accessTier, accessState.accessLevel);
  const categoryConfig = getCategoryConfig(resource.category);
  const viewed = isResourceViewed(resource.id);

  if (!viewed && canAccess) {
    markResourceViewed(resource.id);
  }

  // Locked resource view
  if (!canAccess) {
    return (
      <div className="training-resource-detail">
        <nav aria-label="Breadcrumb" className="training-resource-breadcrumb">
          <ol>
            <li><Link to="/training">Training Hub</Link></li>
            <li aria-current="page">{resource.title}</li>
          </ol>
        </nav>

        <div className="training-resource-locked">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <h1 className="training-resource-locked-title">This resource requires premium access</h1>
          <p className="training-resource-locked-text">
            Upgrade to Deep Dive to unlock this resource.
          </p>
          <Link to="/decision" className="training-resource-locked-cta">Upgrade to Deep Dive</Link>
          <Link to="/training" className="training-resource-locked-back">Back to Training Hub</Link>
        </div>
      </div>
    );
  }

  const contentTypeLabel =
    resource.contentType === 'video' ? 'Video' :
    resource.contentType === 'webinar' ? 'Webinar' :
    resource.contentType === 'article' ? 'Article' :
    resource.contentType === 'download' ? 'Download' :
    resource.contentType === 'checklist' ? 'Checklist' : resource.contentType;

  return (
    <div className="training-resource-detail">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="training-resource-breadcrumb">
        <ol>
          <li><Link to="/training">Training Hub</Link></li>
          <li aria-current="page">{resource.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="training-resource-header">
        <div className="training-resource-tags">
          {categoryConfig && (
            <span
              className="training-resource-category"
              style={{ color: categoryConfig.color }}
            >
              {categoryConfig.label}
            </span>
          )}
          <span className="training-resource-type">{contentTypeLabel}</span>
        </div>

        <h1 className="training-resource-title">{resource.title}</h1>
        <p className="training-resource-description">{resource.description}</p>

        <div className="training-resource-meta">
          {resource.estimatedMinutes && (
            <span className="training-resource-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {resource.estimatedMinutes} min
            </span>
          )}
          {resource.author && (
            <span className="training-resource-meta-item">By {resource.author}</span>
          )}
          {resource.publishedDate && (
            <span className="training-resource-meta-item">
              {new Date(resource.publishedDate).toLocaleDateString('en-AU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          )}
        </div>
      </div>

      {/* Video embed */}
      {resource.video && (
        <div className="training-resource-video">
          <div className="training-resource-video-wrapper">
            <iframe
              src={`https://player.vimeo.com/video/${resource.video.vimeoId}?dnt=1`}
              title={resource.video.title}
              allow="fullscreen; picture-in-picture"
              allowFullScreen
              className="training-resource-video-iframe"
            />
          </div>
          <div className="training-resource-video-info">
            <span className="training-resource-video-duration">{resource.video.duration}</span>
            {resource.video.hasCaptions && (
              <span className="training-resource-video-badge">CC</span>
            )}
          </div>
        </div>
      )}

      {/* Download */}
      {resource.download && (
        <div className="training-resource-download-section">
          <DownloadBlock download={resource.download} />
        </div>
      )}

      {/* Body content */}
      {resource.body && (
        <div
          className="training-resource-body"
          dangerouslySetInnerHTML={{ __html: resource.body }}
        />
      )}

      {/* Back link */}
      <div className="training-resource-footer-nav">
        <Link to="/training" className="training-resource-back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Training Hub
        </Link>
      </div>

      <PageFooter />
    </div>
  );
}
