/**
 * Resource Centre Page
 *
 * A standalone, browsable library of accessibility resources, guides,
 * and best practices. Users can explore by category, search, or browse all.
 * Report recommendations link directly to specific resources here.
 */

import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  MapPin,
  Users,
  Settings,
  ArrowLeft,
  Filter,
  X,
} from 'lucide-react';
import { allHelpContent, searchHelp, getHelpByModule, getHelpByDIAPCategory } from '../data/help';
import type { HelpContent, ModuleGroup, DIAPCategory } from '../data/help/types';
import { ResourceCard } from '../components/help/ResourceCard';
import { ResourceDetail } from '../components/help/ResourceDetail';
import './ResourceCentre.css';

// Category configuration
const CATEGORIES: {
  id: ModuleGroup;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    id: 'before-arrival',
    label: 'Before Arrival',
    description: 'Pre-visit information, websites, booking, and transport',
    icon: <BookOpen size={24} />,
    color: '#3b82f6',
  },
  {
    id: 'getting-in',
    label: 'Getting In',
    description: 'Parking, entrances, ramps, and pathways',
    icon: <MapPin size={24} />,
    color: '#22c55e',
  },
  {
    id: 'during-visit',
    label: 'During Visit',
    description: 'Seating, toilets, sensory environment, and signage',
    icon: <Users size={24} />,
    color: '#a855f7',
  },
  {
    id: 'service-support',
    label: 'Service & Support',
    description: 'Staff training, customer service, policies, and procedures',
    icon: <Settings size={24} />,
    color: '#f59e0b',
  },
];

// DIAP category labels
const DIAP_LABELS: Record<DIAPCategory, string> = {
  'physical-access': 'Physical Access',
  'information-communication-marketing': 'Information & Communication',
  'customer-service': 'Customer Service',
  'operations-policy-procedure': 'Operations & Policy',
  'people-culture': 'People & Culture',
};

export function ResourceCentre() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get state from URL params
  const selectedResourceId = searchParams.get('resource');
  const selectedCategory = searchParams.get('category') as ModuleGroup | null;
  const selectedDIAP = searchParams.get('diap') as DIAPCategory | null;
  const searchQuery = searchParams.get('q') || '';

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);

  // Get the selected resource for detail view
  const selectedResource = useMemo(() => {
    if (!selectedResourceId) return null;
    return allHelpContent.find(r => r.questionId === selectedResourceId) || null;
  }, [selectedResourceId]);

  // Filter resources based on search and category
  const filteredResources = useMemo(() => {
    let results = allHelpContent;

    // Apply search filter
    if (searchQuery) {
      results = searchHelp(searchQuery);
    }

    // Apply category filter
    if (selectedCategory) {
      results = results.filter(r => r.moduleGroup === selectedCategory);
    }

    // Apply DIAP filter
    if (selectedDIAP) {
      results = results.filter(r => r.diapCategory === selectedDIAP);
    }

    return results;
  }, [searchQuery, selectedCategory, selectedDIAP]);

  // Group resources by category for display
  const resourcesByCategory = useMemo(() => {
    const grouped: Record<ModuleGroup, HelpContent[]> = {
      'before-arrival': [],
      'getting-in': [],
      'during-visit': [],
      'service-support': [],
    };

    filteredResources.forEach(resource => {
      grouped[resource.moduleGroup].push(resource);
    });

    return grouped;
  }, [filteredResources]);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (localSearchQuery) {
      params.set('q', localSearchQuery);
    } else {
      params.delete('q');
    }
    setSearchParams(params);
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: ModuleGroup | null) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    params.delete('resource'); // Clear resource selection
    setSearchParams(params);
  };

  // Handle DIAP filter
  const handleDIAPSelect = (diapId: DIAPCategory | null) => {
    const params = new URLSearchParams(searchParams);
    if (diapId) {
      params.set('diap', diapId);
    } else {
      params.delete('diap');
    }
    params.delete('resource');
    setSearchParams(params);
  };

  // Handle resource selection
  const handleResourceSelect = (resourceId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('resource', resourceId);
    setSearchParams(params);
  };

  // Handle back from detail view
  const handleBackFromDetail = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('resource');
    setSearchParams(params);
  };

  // Clear all filters
  const clearFilters = () => {
    setLocalSearchQuery('');
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedDIAP;

  // If showing resource detail
  if (selectedResource) {
    return (
      <div className="resource-centre">
        <div className="resource-centre-header">
          <button className="btn-back" onClick={handleBackFromDetail}>
            <ArrowLeft size={20} />
            <span>Back to Resources</span>
          </button>
        </div>
        <ResourceDetail
          resource={selectedResource}
          onNavigateToResource={handleResourceSelect}
        />
      </div>
    );
  }

  // Main browse view
  return (
    <div className="resource-centre">
      {/* Header */}
      <div className="resource-centre-header">
        <div className="resource-centre-title-section">
          <h1>Resource Centre</h1>
          <p className="resource-centre-subtitle">
            Guides, tips, and best practices for improving accessibility at your venue
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="resource-centre-controls">
        <form className="resource-search-form" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search resources..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="search-input"
            />
            {localSearchQuery && (
              <button
                type="button"
                className="search-clear"
                onClick={() => {
                  setLocalSearchQuery('');
                  const params = new URLSearchParams(searchParams);
                  params.delete('q');
                  setSearchParams(params);
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button type="submit" className="btn-search">
            Search
          </button>
        </form>

        <button
          className={`btn-filter ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} />
          <span>Filters</span>
          {hasActiveFilters && <span className="filter-badge" />}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="resource-filters">
          <div className="filter-section">
            <h3>Category</h3>
            <div className="filter-chips">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`filter-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(selectedCategory === cat.id ? null : cat.id)}
                  style={{ '--chip-color': cat.color } as React.CSSProperties}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>DIAP Focus Area</h3>
            <div className="filter-chips">
              {(Object.keys(DIAP_LABELS) as DIAPCategory[]).map(diap => (
                <button
                  key={diap}
                  className={`filter-chip ${selectedDIAP === diap ? 'active' : ''}`}
                  onClick={() => handleDIAPSelect(selectedDIAP === diap ? null : diap)}
                >
                  <span>{DIAP_LABELS[diap]}</span>
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <button className="btn-clear-filters" onClick={clearFilters}>
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Results Summary */}
      {hasActiveFilters && (
        <div className="resource-results-summary">
          <span>{filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} found</span>
          {searchQuery && <span className="search-term">for "{searchQuery}"</span>}
        </div>
      )}

      {/* Category Cards (when no filters active) */}
      {!hasActiveFilters && (
        <div className="resource-categories">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className="category-card"
              onClick={() => handleCategorySelect(cat.id)}
              style={{ '--category-color': cat.color } as React.CSSProperties}
            >
              <div className="category-icon">{cat.icon}</div>
              <div className="category-content">
                <h3>{cat.label}</h3>
                <p>{cat.description}</p>
                <span className="category-count">
                  {resourcesByCategory[cat.id].length} resources
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Resource List */}
      {(hasActiveFilters || selectedCategory) && (
        <div className="resource-list">
          {filteredResources.length === 0 ? (
            <div className="no-results">
              <p>No resources found matching your criteria.</p>
              <button className="btn-secondary" onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className="resource-grid">
              {filteredResources.map(resource => (
                <ResourceCard
                  key={resource.questionId}
                  resource={resource}
                  onClick={() => handleResourceSelect(resource.questionId)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Featured Resources (when no filters) */}
      {!hasActiveFilters && (
        <div className="featured-resources">
          <h2>Popular Resources</h2>
          <div className="resource-grid">
            {allHelpContent.slice(0, 6).map(resource => (
              <ResourceCard
                key={resource.questionId}
                resource={resource}
                onClick={() => handleResourceSelect(resource.questionId)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ResourceCentre;
