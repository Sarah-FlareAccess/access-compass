/**
 * Resource Centre Page
 *
 * A standalone, browsable library of accessibility resources, guides,
 * and best practices. Users can explore by category, search, or browse all.
 * Report recommendations link directly to specific resources here.
 */

import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  BookOpen,
  MapPin,
  Users,
  Settings,
  ArrowLeft,
  Filter,
  X,
  Lock,
  ChevronDown,
  Scale,
  ExternalLink,
  Briefcase,
  Calendar,
} from 'lucide-react';
import { allHelpContent, searchHelp } from '../data/help';
import type { HelpContent, ModuleGroup, DIAPCategory } from '../data/help/types';
import { ResourceCard } from '../components/help/ResourceCard';
import { ResourceDetail } from '../components/help/ResourceDetail';
import { PageFooter } from '../components/PageFooter';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { MODULES } from '../lib/recommendationEngine';
import { accessModules } from '../data/accessModules';
import './ResourceCentre.css';

// Category configuration
const CATEGORIES: {
  id: ModuleGroup | 'standards';
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
  {
    id: 'organisational-commitment',
    label: 'Organisation',
    description: 'Policies, employment, training, and inclusive culture',
    icon: <Briefcase size={24} />,
    color: '#e11d48',
  },
  {
    id: 'events',
    label: 'Events',
    description: 'Accessible events, conferences, and community activities',
    icon: <Calendar size={24} />,
    color: '#0ea5e9',
  },
  {
    id: 'standards',
    label: 'Key Standards & Legislation',
    description: 'Australian laws, building codes, and international guidelines',
    icon: <Scale size={24} />,
    color: '#0d9488',
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

const KEY_STANDARDS: { label: string; description: string; url: string }[] = [
  {
    label: 'Disability Discrimination Act 1992',
    description: 'Core federal law prohibiting discrimination on the basis of disability in goods, services, and facilities.',
    url: 'https://www.legislation.gov.au/C2004A04426/latest/text',
  },
  {
    label: 'Premises Standards 2010',
    description: 'Disability standards for access to buildings and facilities, amended 2024 to reference AS 1428.1:2021.',
    url: 'https://www.legislation.gov.au/F2010L00668/latest/text',
  },
  {
    label: 'National Construction Code (NCC)',
    description: 'Australia\'s building code incorporating the Premises Standards for new buildings and renovations.',
    url: 'https://ncc.abcb.gov.au/',
  },
  {
    label: 'WCAG 2.1 AA',
    description: 'Web Content Accessibility Guidelines from W3C, the international standard for website and digital accessibility.',
    url: 'https://www.w3.org/TR/WCAG21/',
  },
  {
    label: 'AHRC Guidelines on Digital Access',
    description: 'Advisory guidelines from the Australian Human Rights Commission on equal access to digital goods and services.',
    url: 'https://humanrights.gov.au/our-work/disability-rights/world-wide-web-access-disability-discrimination-act-advisory-notes',
  },
  {
    label: 'UN Convention on the Rights of Persons with Disabilities',
    description: 'International treaty Australia ratified, establishing the rights framework underpinning domestic disability law.',
    url: 'https://www.un.org/development/desa/disabilities/convention-on-the-rights-of-persons-with-disabilities.html',
  },
];

// Module name lookup for lock overlay
const MODULE_NAMES: Record<string, string> = {};
MODULES.forEach(m => { MODULE_NAMES[m.id] = m.name; });

// Module icon lookup (emoji from accessModules)
const MODULE_ICONS: Record<string, string> = {};
accessModules.forEach(m => { MODULE_ICONS[m.id] = m.icon; });

export function ResourceCentre() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { progress } = useModuleProgress();

  // Get state from URL params
  const selectedResourceId = searchParams.get('resource');
  const selectedCategory = searchParams.get('category') as ModuleGroup | 'standards' | null;
  const selectedDIAP = searchParams.get('diap') as DIAPCategory | null;
  const searchQuery = searchParams.get('q') || '';

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Check if a resource's module is completed
  const isModuleCompleted = (moduleCode: string): boolean => {
    return progress[moduleCode]?.status === 'completed';
  };

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

    // Apply category filter (skip for 'standards' pseudo-category)
    if (selectedCategory && selectedCategory !== 'standards') {
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
      'organisational-commitment': [],
      'events': [],
    };

    filteredResources.forEach(resource => {
      grouped[resource.moduleGroup].push(resource);
    });

    return grouped;
  }, [filteredResources]);

  // Group resources by module for accordion view (category browsing only)
  const resourcesByModule = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'standards' || searchQuery) return [];
    const grouped: Record<string, HelpContent[]> = {};
    filteredResources.forEach(r => {
      if (!grouped[r.moduleCode]) grouped[r.moduleCode] = [];
      grouped[r.moduleCode].push(r);
    });
    // Order by MODULES array order
    const moduleOrder = MODULES.map(m => m.id);
    return moduleOrder
      .filter(id => grouped[id] && grouped[id].length > 0)
      .map(id => ({ moduleCode: id, moduleName: MODULE_NAMES[id] || id, resources: grouped[id] }));
  }, [filteredResources, selectedCategory, searchQuery]);

  const toggleGroup = (moduleCode: string) => {
    setExpandedGroups(prev => ({ ...prev, [moduleCode]: !prev[moduleCode] }));
  };

  const isGroupExpanded = (moduleCode: string, index: number): boolean => {
    if (expandedGroups[moduleCode] !== undefined) return expandedGroups[moduleCode];
    return index === 0;
  };

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
  const handleCategorySelect = (categoryId: ModuleGroup | 'standards' | null) => {
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
    const resourceUnlocked = isModuleCompleted(selectedResource.moduleCode);

    if (!resourceUnlocked) {
      const moduleName = MODULE_NAMES[selectedResource.moduleCode] || selectedResource.moduleCode;
      return (
        <div className="resource-centre">
          <div className="resource-centre-header">
            <button className="btn-back" onClick={handleBackFromDetail}>
              <ArrowLeft size={20} />
              <span>Back to Resources</span>
            </button>
          </div>
          <div className="resource-locked-detail">
            <Lock size={48} />
            <h2>Resource Locked</h2>
            <p>
              Complete the <strong>{moduleName}</strong> module ({selectedResource.moduleCode}) to unlock this resource guide.
            </p>
            <p className="resource-locked-hint">
              Resource guides become available once you have completed the related module checklist.
            </p>
          </div>
        </div>
      );
    }

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
          <h1>Resource Hub</h1>
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
              aria-label="Search resources"
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
                  {cat.id === 'standards'
                    ? `${KEY_STANDARDS.length} references`
                    : (() => {
                        const items = resourcesByCategory[cat.id as ModuleGroup];
                        const count = items.length;
                        const unlocked = items.filter(r => isModuleCompleted(r.moduleCode)).length;
                        return `${count} resource${count !== 1 ? 's' : ''}${count > 0 && unlocked < count ? ` (${unlocked} unlocked)` : ''}`;
                      })()
                  }
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Back button (when browsing a category) */}
      {selectedCategory && !searchQuery && (
        <button className="btn-back" onClick={() => handleCategorySelect(null)}>
          <ArrowLeft size={20} />
          <span>Back to Resource Hub</span>
        </button>
      )}

      {/* Category Heading (when browsing a category, not searching) */}
      {selectedCategory && !searchQuery && (() => {
        const cat = CATEGORIES.find(c => c.id === selectedCategory);
        if (!cat) return null;
        return (
          <div className="category-heading" style={{ '--category-color': cat.color } as React.CSSProperties}>
            <div className="category-heading-icon">{cat.icon}</div>
            <div>
              <h2 className="category-heading-title">{cat.label}</h2>
              <p className="category-heading-desc">{cat.description}</p>
            </div>
          </div>
        );
      })()}

      {/* Standards click-through view */}
      {selectedCategory === 'standards' && !searchQuery && (
        <div className="resource-list">
          <div className="key-standards-grid">
            {KEY_STANDARDS.map(standard => (
              <a key={standard.label} href={standard.url} target="_blank" rel="noopener noreferrer" className="key-standard-card">
                <h3>{standard.label}</h3>
                <p>{standard.description}</p>
                <span className="key-standard-link">View document <ExternalLink size={14} /></span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Category browsing (dashboard-style collapsible groups + card grid) */}
      {selectedCategory && selectedCategory !== 'standards' && !searchQuery && (
        <div className="resource-list">
          {resourcesByModule.length === 0 ? (
            <div className="no-results">
              <p>No resources found matching your criteria.</p>
              <button className="btn-secondary" onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className="resource-modules">
              {resourcesByModule.map((group, groupIndex) => {
                const expanded = isGroupExpanded(group.moduleCode, groupIndex);
                const groupUnlocked = isModuleCompleted(group.moduleCode);
                return (
                  <section key={group.moduleCode} className={`module-group-card ${groupUnlocked ? 'completed' : ''}`}>
                    <button
                      className={`module-group-header ${expanded ? 'expanded' : ''}`}
                      onClick={() => toggleGroup(group.moduleCode)}
                      aria-expanded={expanded}
                    >
                      <span className="module-group-icon">{MODULE_ICONS[group.moduleCode] || '📄'}</span>
                      <div className="module-group-info">
                        <h3 className="module-group-title">{group.moduleName}</h3>
                        <span className="module-group-meta">
                          <span className="module-group-code">{group.moduleCode}</span>
                          <span>{group.resources.length} resource{group.resources.length !== 1 ? 's' : ''}</span>
                        </span>
                      </div>
                      <ChevronDown size={20} className="module-group-chevron" />
                    </button>
                    {expanded && (
                      <div className="resource-tile-grid">
                        {group.resources.map(resource => {
                          const unlocked = isModuleCompleted(resource.moduleCode);
                          return (
                            <button
                              key={resource.questionId}
                              className={`resource-tile ${unlocked ? 'unlocked' : 'locked'}`}
                              onClick={() => handleResourceSelect(resource.questionId)}
                            >
                              <div className="resource-tile-content">
                                {!unlocked && (
                                  <div className="resource-tile-header">
                                    <span className="resource-tile-icon">{MODULE_ICONS[resource.moduleCode] || '📄'}</span>
                                    <span className="resource-tile-badge badge-locked">
                                      <Lock size={11} /> Locked
                                    </span>
                                  </div>
                                )}
                                <h4 className="resource-tile-title">{resource.title}</h4>
                                <p className="resource-tile-desc">{resource.summary}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Search results / DIAP-only filter — keep card grid */}
      {hasActiveFilters && !selectedCategory && (
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
              {filteredResources.map(resource => {
                const unlocked = isModuleCompleted(resource.moduleCode);
                return (
                  <div key={resource.questionId} className={`resource-card-wrapper ${!unlocked ? 'locked' : ''}`}>
                    <ResourceCard
                      resource={resource}
                      onClick={() => handleResourceSelect(resource.questionId)}
                    />
                    {!unlocked && (
                      <div className="resource-lock-overlay">
                        <Lock size={20} />
                        <span>Complete {MODULE_NAMES[resource.moduleCode] || resource.moduleCode} to unlock</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Search results within a category — card grid */}
      {selectedCategory && searchQuery && (
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
              {filteredResources.map(resource => {
                const unlocked = isModuleCompleted(resource.moduleCode);
                return (
                  <div key={resource.questionId} className={`resource-card-wrapper ${!unlocked ? 'locked' : ''}`}>
                    <ResourceCard
                      resource={resource}
                      onClick={() => handleResourceSelect(resource.questionId)}
                    />
                    {!unlocked && (
                      <div className="resource-lock-overlay">
                        <Lock size={20} />
                        <span>Complete {MODULE_NAMES[resource.moduleCode] || resource.moduleCode} to unlock</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Featured Resources (when no filters) */}
      {!hasActiveFilters && (
        <div className="featured-resources">
          <h2>Popular Resources</h2>
          <div className="resource-grid">
            {allHelpContent.slice(0, 6).map(resource => {
              const unlocked = isModuleCompleted(resource.moduleCode);
              return (
                <div key={resource.questionId} className={`resource-card-wrapper ${!unlocked ? 'locked' : ''}`}>
                  <ResourceCard
                    resource={resource}
                    onClick={() => handleResourceSelect(resource.questionId)}
                  />
                  {!unlocked && (
                    <div className="resource-lock-overlay">
                      <Lock size={20} />
                      <span>Complete {MODULE_NAMES[resource.moduleCode] || resource.moduleCode} to unlock</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <PageFooter />
    </div>
  );
}

export default ResourceCentre;
