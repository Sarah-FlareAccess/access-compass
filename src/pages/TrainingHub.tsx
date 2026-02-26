import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  allCourses,
  allResources,
  TRAINING_CATEGORIES,
  searchTraining,
} from '../data/training/index';
import type { TrainingCategory, TrainingCourse, TrainingResource } from '../data/training/types';
import { TrainingCard } from '../components/training/TrainingCard';
import { useTrainingProgress } from '../hooks/useTrainingProgress';
import { usePageTitle } from '../hooks/usePageTitle';
import { PageFooter } from '../components/PageFooter';
import './TrainingHub.css';

export default function TrainingHub() {
  usePageTitle('Training Hub');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get('category') as TrainingCategory | null;
  const searchQuery = searchParams.get('q') ?? '';
  const contentType = searchParams.get('type') as 'course' | 'resource' | null;

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const { getCourseCompletionPercentage } = useTrainingProgress();

  const filtered = useMemo(() => {
    let { courses, resources } = searchQuery
      ? searchTraining(searchQuery)
      : { courses: allCourses, resources: allResources };

    if (activeCategory) {
      courses = courses.filter((c) => c.category === activeCategory);
      resources = resources.filter((r) => r.category === activeCategory);
    }

    if (contentType === 'course') resources = [];
    if (contentType === 'resource') courses = [];

    return { courses, resources };
  }, [searchQuery, activeCategory, contentType]);

  const featuredCourse = allCourses.find((c) => c.featured);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (localSearchQuery.trim()) {
      params.set('q', localSearchQuery.trim());
    } else {
      params.delete('q');
    }
    setSearchParams(params);
  };

  const toggleCategory = (id: TrainingCategory) => {
    const params = new URLSearchParams(searchParams);
    if (activeCategory === id) {
      params.delete('category');
    } else {
      params.set('category', id);
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
    setLocalSearchQuery('');
  };

  const hasActiveFilters = activeCategory || searchQuery || contentType;

  return (
    <div className="training-hub">
      <div className="training-hub-header">
        <h1 className="training-hub-title">Training Hub</h1>
        <p className="training-hub-subtitle">
          Build your team's accessibility knowledge with courses, webinars, and practical resources.
        </p>
      </div>

      {/* Featured course banner */}
      {featuredCourse && !hasActiveFilters && (
        <button
          className="training-featured-banner"
          onClick={() => navigate(`/training/course/${featuredCourse.slug}`)}
        >
          <div className="training-featured-content">
            <span className="training-featured-badge">Featured Program</span>
            <h2 className="training-featured-title">{featuredCourse.title}</h2>
            <p className="training-featured-description">{featuredCourse.description}</p>
            <span className="training-featured-meta">
              {featuredCourse.lessons.length} lessons &middot; {featuredCourse.totalEstimatedMinutes} min &middot; {featuredCourse.skillLevel}
            </span>
            <span className="training-featured-cta">View program</span>
          </div>
        </button>
      )}

      {/* Search + filters */}
      <div className="training-filters">
        <form className="training-search-form" onSubmit={handleSearch} role="search">
          <label htmlFor="training-search" className="sr-only">Search training</label>
          <div className="training-search-wrapper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="training-search-icon" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              id="training-search"
              type="search"
              className="training-search-input"
              placeholder="Search courses and resources..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
            />
            {localSearchQuery && (
              <button
                type="button"
                className="training-search-clear"
                onClick={() => {
                  setLocalSearchQuery('');
                  const params = new URLSearchParams(searchParams);
                  params.delete('q');
                  setSearchParams(params);
                }}
                aria-label="Clear search"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
        </form>

        <div className="training-category-chips" role="group" aria-label="Filter by category">
          {TRAINING_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`training-chip${activeCategory === cat.id ? ' training-chip-active' : ''}`}
              onClick={() => toggleCategory(cat.id)}
              aria-pressed={activeCategory === cat.id}
              style={{ '--chip-color': cat.color } as React.CSSProperties}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <button className="training-clear-filters" onClick={clearFilters}>
            Clear all filters
          </button>
        )}
      </div>

      {/* Courses section */}
      {filtered.courses.length > 0 && (
        <section className="training-section">
          <h2 className="training-section-title">Courses</h2>
          <div className="training-grid">
            {filtered.courses.map((course) => (
              <TrainingCard
                key={course.id}
                item={course}
                onClick={() => navigate(`/training/course/${course.slug}`)}
                completionPercentage={getCourseCompletionPercentage(course.id, course.lessons.length)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Resources section */}
      {filtered.resources.length > 0 && (
        <section className="training-section">
          <h2 className="training-section-title">Resources</h2>
          <div className="training-grid">
            {filtered.resources.map((resource) => (
              <TrainingCard
                key={resource.id}
                item={resource}
                onClick={() => navigate(`/training/resource/${resource.slug}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* No results */}
      {filtered.courses.length === 0 && filtered.resources.length === 0 && (
        <div className="training-empty">
          <p>No training content found matching your criteria.</p>
          <button className="training-clear-filters" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      )}

      <PageFooter />
    </div>
  );
}
