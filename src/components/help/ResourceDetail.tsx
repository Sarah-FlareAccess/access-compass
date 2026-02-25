/**
 * Resource Detail Component
 *
 * Full view of a single resource with all content sections:
 * - Summary and Why It Matters
 * - Tips
 * - How to Check (checklist)
 * - Standards Reference
 * - Examples by business type
 * - Video embed
 * - External resources
 * - Related resources
 */

import { useState } from 'react';
import {
  Lightbulb,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Play,
  BookOpen,
  Building2,
  Scale,
  Clock,
  Wrench,
  ThumbsUp,
  ThumbsDown,
  Quote,
  TrendingUp,
  Target,
  Hammer,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { HelpContent, HelpTip, HelpExample, GradedSolution } from '../../data/help/types';
import './ResourceDetail.css';

interface ResourceDetailProps {
  resource: HelpContent;
  onNavigateToResource?: (resourceId: string) => void;
}

// Get Lucide icon by name
function getIcon(iconName: string, size: number = 20): React.ReactNode {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const icons = LucideIcons as any;
  const IconComponent = icons[iconName];
  if (IconComponent) {
    return <IconComponent size={size} />;
  }
  return <Lightbulb size={size} />;
}

export function ResourceDetail({ resource, onNavigateToResource }: ResourceDetailProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    solutions: true,
    howToCheck: false,
    standards: false,
    examples: true,
    video: false,
  });


  const [feedbackGiven, setFeedbackGiven] = useState<'positive' | 'negative' | null>(null);
  const [selectedBusinessType, setSelectedBusinessType] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFeedback = (isPositive: boolean) => {
    setFeedbackGiven(isPositive ? 'positive' : 'negative');
    // Analytics tracking would go here
  };

  // Filter examples by business type
  const displayedExamples = selectedBusinessType
    ? resource.examples?.filter(ex => ex.businessType === selectedBusinessType)
    : resource.examples;

  // Get unique business types from examples
  const businessTypes = resource.examples
    ? [...new Set(resource.examples.map(ex => ex.businessType))]
    : [];

  return (
    <div className="resource-detail">
      {/* Header */}
      <div className="resource-detail-header">
        <div className="resource-detail-meta">
          <span className="resource-module-badge">{resource.moduleCode}</span>
          {resource.lastUpdated && (
            <span className="resource-updated">
              Updated {new Date(resource.lastUpdated).toLocaleDateString('en-AU', {
                month: 'short',
                year: 'numeric',
              })}
            </span>
          )}
        </div>
        <h1 className="resource-detail-title">{resource.title}</h1>
        <p className="resource-detail-summary">{resource.summary}</p>
      </div>

      {/* Why It Matters */}
      <section className="resource-section why-it-matters">
        <div className="section-header">
          <AlertCircle size={22} className="section-icon" />
          <h2>Why It Matters</h2>
        </div>
        <div className="section-content">
          <p>{resource.whyItMatters.text}</p>

          {resource.whyItMatters.statistic && (
            <div className="statistic-card">
              <TrendingUp size={24} className="statistic-icon" />
              <div className="statistic-content">
                <span className="statistic-value">{resource.whyItMatters.statistic.value}</span>
                <span className="statistic-context">{resource.whyItMatters.statistic.context}</span>
                {resource.whyItMatters.statistic.source && (
                  <span className="statistic-source">— {resource.whyItMatters.statistic.source}</span>
                )}
              </div>
            </div>
          )}

          {resource.whyItMatters.quote && (
            <blockquote className="quote-card">
              <Quote size={20} className="quote-icon" />
              <p>"{resource.whyItMatters.quote.text}"</p>
              <cite>— {resource.whyItMatters.quote.attribution}</cite>
            </blockquote>
          )}
        </div>
      </section>

      {/* Tips */}
      <section className="resource-section tips-section">
        <div className="section-header">
          <Lightbulb size={22} className="section-icon" />
          <h2>Quick Tips</h2>
        </div>
        <div className="tips-grid">
          {resource.tips
            .sort((a, b) => (a.priority || 99) - (b.priority || 99))
            .map((tip, index) => (
              <TipCard key={index} tip={tip} />
            ))}
        </div>
      </section>

      {/* Solutions */}
      {resource.solutions && resource.solutions.length > 0 && (
        <section className="resource-section collapsible-section">
          <button
            className="section-toggle"
            onClick={() => toggleSection('solutions')}
            aria-expanded={expandedSections.solutions}
          >
            <div className="section-header">
              <Target size={22} className="section-icon" />
              <h2>Solutions</h2>
            </div>
            {expandedSections.solutions ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {expandedSections.solutions && (
            <div className="section-content solutions-content">
              <div className="solutions-list">
                {resource.solutions.map((solution, index) => (
                  <SolutionCard key={index} solution={solution} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Image */}
      {resource.image && (
        <section className="resource-section image-section">
          <figure className="resource-image">
            <img
              src={resource.image.src}
              alt={resource.image.alt}
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            {resource.image.caption && (
              <figcaption>{resource.image.caption}</figcaption>
            )}
          </figure>
        </section>
      )}

      {/* How to Check */}
      {resource.howToCheck && (
        <section className="resource-section collapsible-section">
          <button
            className="section-toggle"
            onClick={() => toggleSection('howToCheck')}
            aria-expanded={expandedSections.howToCheck}
          >
            <div className="section-header">
              <CheckCircle size={22} className="section-icon" />
              <h2>{resource.howToCheck.title || 'How to Check'}</h2>
            </div>
            {expandedSections.howToCheck ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {expandedSections.howToCheck && (
            <div className="section-content checklist-content">
              {resource.howToCheck.tools && resource.howToCheck.tools.length > 0 && (
                <div className="checklist-tools">
                  <Wrench size={16} />
                  <span>You'll need: {resource.howToCheck.tools.join(', ')}</span>
                </div>
              )}

              {resource.howToCheck.estimatedTime && (
                <div className="checklist-time">
                  <Clock size={16} />
                  <span>Estimated time: {resource.howToCheck.estimatedTime}</span>
                </div>
              )}

              <ol className="checklist-steps">
                {resource.howToCheck.steps.map((step, index) => (
                  <li key={index} className="checklist-step">
                    <span className="step-number">{index + 1}</span>
                    <div className="step-content">
                      <p>{step.text}</p>
                      {step.measurement && (
                        <div className="step-measurement">
                          <strong>{step.measurement.target}:</strong>{' '}
                          {step.measurement.acceptable} {step.measurement.unit}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>
      )}

      {/* Standards Reference */}
      {resource.standardsReference && (
        <section className="resource-section collapsible-section">
          <button
            className="section-toggle"
            onClick={() => toggleSection('standards')}
            aria-expanded={expandedSections.standards}
          >
            <div className="section-header">
              <Scale size={22} className="section-icon" />
              <h2>Australian Standards</h2>
            </div>
            {expandedSections.standards ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {expandedSections.standards && (
            <div className="section-content standards-content">
              <div className="standard-primary">
                <span className="standard-code">{resource.standardsReference.primary.code}</span>
                {resource.standardsReference.primary.section && (
                  <span className="standard-section">{resource.standardsReference.primary.section}</span>
                )}
                <p className="standard-requirement">{resource.standardsReference.primary.requirement}</p>
              </div>

              {resource.standardsReference.related && resource.standardsReference.related.length > 0 && (
                <div className="standards-related">
                  <h3>Related Standards</h3>
                  <ul>
                    {resource.standardsReference.related.map((rel, index) => (
                      <li key={index}>
                        <strong>{rel.code}:</strong> {rel.relevance}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="standards-plain-english">
                <h3>In Plain English</h3>
                <p>{resource.standardsReference.plainEnglish}</p>
              </div>

              {resource.standardsReference.complianceNote && (
                <div className="standards-note">
                  <AlertCircle size={16} />
                  <p>{resource.standardsReference.complianceNote}</p>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Examples */}
      {resource.examples && resource.examples.length > 0 && (
        <section className="resource-section collapsible-section">
          <button
            className="section-toggle"
            onClick={() => toggleSection('examples')}
            aria-expanded={expandedSections.examples}
          >
            <div className="section-header">
              <Building2 size={22} className="section-icon" />
              <h2>Real-World Examples</h2>
            </div>
            {expandedSections.examples ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {expandedSections.examples && (
            <div className="section-content examples-content">
              {/* Business type filter */}
              {businessTypes.length > 1 && (
                <div className="examples-filter">
                  <span>Filter by:</span>
                  <div className="examples-filter-chips">
                    <button
                      className={`filter-chip ${!selectedBusinessType ? 'active' : ''}`}
                      onClick={() => setSelectedBusinessType(null)}
                    >
                      All
                    </button>
                    {businessTypes.map(type => (
                      <button
                        key={type}
                        className={`filter-chip ${selectedBusinessType === type ? 'active' : ''}`}
                        onClick={() => setSelectedBusinessType(type)}
                      >
                        {resource.examples?.find(ex => ex.businessType === type)?.businessTypeLabel || type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Example cards */}
              <div className="examples-list">
                {displayedExamples?.map((example, index) => (
                  <ExampleCard key={index} example={example} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Video */}
      {resource.video && (
        <section className="resource-section collapsible-section">
          <button
            className="section-toggle"
            onClick={() => toggleSection('video')}
            aria-expanded={expandedSections.video}
          >
            <div className="section-header">
              <Play size={22} className="section-icon" />
              <h2>Video: {resource.video.title}</h2>
            </div>
            {expandedSections.video ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {expandedSections.video && (
            <div className="section-content video-content">
              <div className="video-embed">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${resource.video.youtubeId}`}
                  title={resource.video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="video-meta">
                <span className="video-duration">
                  <Clock size={14} />
                  {resource.video.duration}
                </span>
                {resource.video.hasCaptions && (
                  <span className="video-captions">Captions available</span>
                )}
              </div>
              {resource.video.description && (
                <p className="video-description">{resource.video.description}</p>
              )}
            </div>
          )}
        </section>
      )}

      {/* Related Resources */}
      {resource.relatedQuestions && resource.relatedQuestions.length > 0 && (
        <section className="resource-section related-section">
          <div className="section-header">
            <BookOpen size={22} className="section-icon" />
            <h2>Related Resources</h2>
          </div>
          <div className="related-list">
            {resource.relatedQuestions.map((related, index) => (
              <button
                key={index}
                className="related-item"
                onClick={() => onNavigateToResource?.(related.questionId)}
              >
                <span className="related-module">{related.moduleCode}</span>
                <span className="related-text">{related.questionText}</span>
                <span className="related-reason">{related.relationship}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Feedback */}
      <section className="resource-section feedback-section">
        <div className="feedback-prompt">
          <span>Was this resource helpful?</span>
          <div className="feedback-buttons">
            <button
              className={`feedback-btn ${feedbackGiven === 'positive' ? 'active' : ''}`}
              onClick={() => handleFeedback(true)}
              disabled={feedbackGiven !== null}
            >
              <ThumbsUp size={18} />
              <span>Yes</span>
            </button>
            <button
              className={`feedback-btn ${feedbackGiven === 'negative' ? 'active' : ''}`}
              onClick={() => handleFeedback(false)}
              disabled={feedbackGiven !== null}
            >
              <ThumbsDown size={18} />
              <span>No</span>
            </button>
          </div>
          {feedbackGiven && (
            <span className="feedback-thanks">Thanks for your feedback!</span>
          )}
        </div>
      </section>
    </div>
  );
}

// Tip Card sub-component
function TipCard({ tip }: { tip: HelpTip }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`tip-card ${tip.detail ? 'has-detail' : ''}`}>
      <div className="tip-icon">{getIcon(tip.icon, 20)}</div>
      <div className="tip-content">
        <p className="tip-text">{tip.text}</p>
        {tip.detail && (
          <>
            <button
              className="tip-expand"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Less' : 'More'}
            </button>
            {expanded && <p className="tip-detail">{tip.detail}</p>}
          </>
        )}
      </div>
    </div>
  );
}

// Example Card sub-component
function ExampleCard({ example }: { example: HelpExample }) {
  return (
    <div className="example-card">
      <div className="example-header">
        <span className="example-business-type">{example.businessTypeLabel}</span>
        <div className="example-meta">
          {example.cost && <span className="example-cost">{example.cost}</span>}
          {example.timeframe && <span className="example-timeframe">{example.timeframe}</span>}
        </div>
      </div>
      <div className="example-body">
        <div className="example-section">
          <strong>Challenge:</strong>
          <p>{example.scenario}</p>
        </div>
        <div className="example-section">
          <strong>Solution:</strong>
          <p>{example.solution}</p>
        </div>
        {example.outcome && (
          <div className="example-section example-outcome">
            <strong>Outcome:</strong>
            <p>{example.outcome}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Solution Card sub-component
function SolutionCard({ solution }: { solution: GradedSolution }) {
  const [expanded, setExpanded] = useState(false);

  const getImplementerLabel = (implementer: GradedSolution['implementedBy']) => {
    switch (implementer) {
      case 'diy': return 'Do it yourself';
      case 'staff': return 'Staff can do this';
      case 'contractor': return 'May need contractor';
      case 'specialist': return 'Specialist required';
    }
  };

  const getImpactLabel = (impact: GradedSolution['impact']) => {
    switch (impact) {
      case 'quick-win': return 'Quick win';
      case 'moderate': return 'Moderate impact';
      case 'significant': return 'Significant impact';
    }
  };

  return (
    <div className="solution-card">
      <div className="solution-header">
        <div className="solution-title-row">
          <span className={`solution-impact impact-${solution.impact}`}>
            {getImpactLabel(solution.impact)}
          </span>
        </div>
        <h3 className="solution-title">{solution.title}</h3>
      </div>

      <div className="solution-body">
        <p className="solution-description">{solution.description}</p>

        <div className="solution-meta">
          <div className="solution-meta-item">
            <Clock size={14} />
            <span>{solution.timeRequired}</span>
          </div>
          <div className="solution-meta-item">
            <Hammer size={14} />
            <span>{getImplementerLabel(solution.implementedBy)}</span>
          </div>
        </div>

        {solution.steps && solution.steps.length > 0 && (
          <>
            <button
              className="solution-steps-toggle"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Hide steps' : 'Show steps'}
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {expanded && (
              <ol className="solution-steps">
                {solution.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            )}
          </>
        )}

        {solution.notes && (
          <p className="solution-notes">
            <AlertCircle size={14} />
            {solution.notes}
          </p>
        )}
      </div>
    </div>
  );
}

export default ResourceDetail;
