/**
 * Resource Centre Page
 *
 * A standalone, browsable library of accessibility resources, guides,
 * and best practices. Users can explore by category, search, or browse all.
 * Report recommendations link directly to specific resources here.
 */

import { useState, useMemo } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
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
  ChevronRight,
  Scale,
  ExternalLink,
  Briefcase,
  Calendar,
  Info,
  Eye,
  Bus,
  Phone,
  FileSearch,
  Globe,
  Ticket,
  Video,
  MessageCircle,
  Car,
  DoorOpen,
  Signpost,
  ListOrdered,
  Armchair,
  Table2,
  Sofa,
  Heart,
  SlidersHorizontal,
  Bath,
  Lightbulb,
  Wrench,
  Volume2,
  ShoppingCart,
  ClipboardCheck,
  Headphones,
  GraduationCap,
  FileText,
  HandHelping,
  Megaphone,
  Accessibility,
  BarChart3,
  Building2,
  Utensils,
  Waypoints,
  AlertTriangle,
  Smartphone,
  Image,
  CreditCard,
  ArrowUpDown,
  BedDouble,
  Mic,
  ZoomIn,
  Type,
  Mail,
  Bell,
  Star,
  HeartPulse,
  Footprints,
  Package,
  Waves,
  UtensilsCrossed,
  Presentation,
  type LucideIcon,
} from 'lucide-react';
import { allHelpContent, searchHelp, getHelpByQuestionId } from '../data/help';
import type { HelpContent, ModuleGroup, DIAPCategory } from '../data/help/types';
import { ResourceDetail } from '../components/help/ResourceDetail';
import { PageFooter } from '../components/PageFooter';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { usePageTitle } from '../hooks/usePageTitle';
import { MODULES } from '../lib/recommendationEngine';
import { accessModules } from '../data/accessModules';
import { PageGuide, type GuideFeature } from '../components/PageGuide';
import './ResourceCentre.css';

const RESOURCE_FEATURES: GuideFeature[] = [
  { icon: Search, title: 'Search all resources', description: 'Find guides using keyword search across all resource articles.' },
  { icon: BookOpen, title: 'Browse by category', description: 'Explore resources organised by 6 accessibility topic categories.' },
  { icon: Lock, title: 'Unlock content', description: 'Complete modules to unlock detailed resource guides and checklists.' },
  { icon: Filter, title: 'DIAP category filter', description: 'Filter resources by DIAP category like physical access or customer service.' },
  { icon: Scale, title: 'Standards and legislation', description: 'Access external links to Australian laws, codes, and guidelines.' },
];

// Category configuration
const CATEGORIES: {
  id: ModuleGroup | 'standards';
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  emoji: string;
  ccClass: string;
}[] = [
  {
    id: 'before-arrival',
    label: 'Before Arrival',
    description: 'Pre-visit information, websites, booking, and transport',
    icon: <BookOpen size={20} />,
    color: '#4B2D8F',
    emoji: '🌐',
    ccClass: 'cc1',
  },
  {
    id: 'getting-in',
    label: 'Getting In',
    description: 'Parking, entrances, ramps, and pathways',
    icon: <MapPin size={20} />,
    color: '#2ECC8E',
    emoji: '🚪',
    ccClass: 'cc2',
  },
  {
    id: 'during-visit',
    label: 'During Visit',
    description: 'Seating, toilets, sensory environment, and signage',
    icon: <Users size={20} />,
    color: '#F59E0B',
    emoji: '🏛️',
    ccClass: 'cc3',
  },
  {
    id: 'service-support',
    label: 'Service & Support',
    description: 'Staff training, customer service, policies, and procedures',
    icon: <Settings size={20} />,
    color: '#EF4444',
    emoji: '🤝',
    ccClass: 'cc4',
  },
  {
    id: 'organisational-commitment',
    label: 'Organisation',
    description: 'Policies, employment, training, and inclusive culture',
    icon: <Briefcase size={20} />,
    color: '#06B6D4',
    emoji: '🏢',
    ccClass: 'cc5',
  },
  {
    id: 'events',
    label: 'Events',
    description: 'Accessible events, conferences, and community activities',
    icon: <Calendar size={20} />,
    color: '#8B5CF6',
    emoji: '🎪',
    ccClass: 'cc6',
  },
  {
    id: 'standards',
    label: 'Key Standards & Legislation',
    description: 'Australian laws, building codes, and international guidelines',
    icon: <Scale size={20} />,
    color: '#374151',
    emoji: '⚖️',
    ccClass: 'cc7',
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

// Module lookups
const MODULE_NAMES: Record<string, string> = {};
MODULES.forEach(m => { MODULE_NAMES[m.id] = m.name; });

const MODULE_ICONS: Record<string, string> = {};
accessModules.forEach(m => { MODULE_ICONS[m.id] = m.icon; });

const MODULE_DESCS: Record<string, string> = {};
accessModules.forEach(m => { MODULE_DESCS[m.id] = m.description; });

const RESOURCE_ICON_RULES: [RegExp, LucideIcon][] = [
  // --- Highly specific compound patterns (checked first) ---
  [/pre.?visit.*info|info.*before.*visit/i, Globe],
  [/screen reader/i, Accessibility],
  [/alt text|image desc/i, Image],
  [/text contrast|readab/i, Type],
  [/zoom|text resiz|reflow/i, ZoomIn],
  [/mobile accessib/i, Smartphone],
  [/online.*book|book.*online/i, Ticket],
  [/online.*review/i, Star],
  [/social media.*image/i, Image],
  [/event.*plan/i, Calendar],
  [/sensory.*safe|neurodivergent/i, Headphones],
  [/inclusive.*activity|activity.*design/i, Accessibility],
  [/guest.*alert|guest.*communicat/i, Bell],
  [/aquatic|pool|swim/i, Waves],
  [/floor surface|slip/i, Footprints],
  [/lift|escalator|elevator/i, ArrowUpDown],
  [/grab rail|transfer space/i, Bath],
  [/large print|readable material/i, Type],
  [/alternative.*format|format.*alternative|on.?site.*format/i, FileText],
  [/room.*essential|accessible room/i, BedDouble],
  [/kitchenette|in.?room.*amenit/i, UtensilsCrossed],
  [/accommodation.*follow|re.?entry/i, ClipboardCheck],
  [/path from parking/i, Waypoints],
  [/staff.*parking|parking.*guidance/i, Users],
  [/entrance.*lift/i, ArrowUpDown],
  [/accessible.*email|digital.*document/i, Mail],
  [/navigat.*venue|venue.*independen/i, Waypoints],
  [/health|wellness|treatment|spa/i, HeartPulse],
  [/return.*delivery|delivery.*channel/i, Package],
  [/national relay|NRS/i, Phone],
  [/speech.*differ|AAC/i, MessageCircle],
  [/marketing.*imag|representation.*market|disability.*stereotyp|marketing.*material|marketing.*positive|marketing.*social/i, Megaphone],
  [/accessible.*market/i, Megaphone],
  [/customer.*program|loyalty/i, Users],
  [/customer.*prefer|notification/i, Bell],
  [/complaint|grievance/i, Megaphone],
  [/pricing|concession|companion card/i, CreditCard],
  [/payment|pay.*accessib/i, CreditCard],
  [/priority access/i, Star],
  [/speaker|presenter/i, Mic],
  [/vision access|low vision|blind/i, Eye],
  [/sound.*environ|acoustic/i, Volume2],
  [/follow.*up.*request|following up/i, ClipboardCheck],
  [/positive.*framing/i, MessageCircle],
  [/welcoming.*environ|carer|intersectional/i, Heart],
  [/leadership|representation/i, Users],
  [/employment.*track|disability.*employ/i, Briefcase],
  [/contract/i, Briefcase],
  [/performance.*review|accessib.*performance/i, BarChart3],
  [/engagement.*recognition|sharing.*learn/i, Presentation],
  [/accessible route|active experience/i, Waypoints],
  [/taps.*fittings|doors.*taps/i, Bath],
  [/signage.*contrast.*alarm|contrast.*emergency/i, AlertTriangle],

  // --- Standard single-keyword rules ---
  [/parking/i, Car],
  [/path|aisle|ramp|stair|route/i, Waypoints],
  [/entrance|door|entry|getting in/i, DoorOpen],
  [/wayfinding|signage/i, Signpost],
  [/queue/i, ListOrdered],
  [/seating|chair|wheelchair space/i, Armchair],
  [/table|counter|writing surface/i, Table2],
  [/furniture|circulation/i, Sofa],
  [/animal|dog|pet/i, Heart],
  [/storage|control|locker|switch/i, SlidersHorizontal],
  [/toilet|bathroom|washroom|change facilit|shower/i, Bath],
  [/lighting/i, Lightbulb],
  [/equipment|device|assistive tech/i, Wrench],
  [/hearing|audio.*descri|loop|caption/i, Volume2],
  [/retail|shop|checkout/i, ShoppingCart],
  [/food|drink|menu|dining|cafe|restaurant/i, Utensils],
  [/booking|ticket|reserv/i, Ticket],
  [/video|caption.*video/i, Video],
  [/communication|language|plain language|easy read/i, MessageCircle],
  [/transport|travel|bus|taxi|train|drop.?off/i, Bus],
  [/contact|phone|email|chat/i, Phone],
  [/staff|employee|team|workforce|volunteer/i, Users],
  [/training|learn|course/i, GraduationCap],
  [/policy|procedure|governance|DIAP/i, FileText],
  [/feedback/i, Megaphone],
  [/emergency|evacuation|fire/i, AlertTriangle],
  [/access.*page|review.*page/i, FileSearch],
  [/familiarisati/i, Eye],
  [/inclusion|diversity|equity/i, Accessibility],
  [/sensory/i, Headphones],
  [/support|assist/i, HandHelping],
  [/report|metric|benchmark/i, BarChart3],
  [/building|facility|venue|premises/i, Building2],
  [/event|conference|performance/i, Calendar],
  [/procure|tender|supplier|vendor/i, Briefcase],
  [/recruit|hiring|workplace/i, Accessibility],
  [/website|web|online|digital/i, Globe],
  [/social media/i, Megaphone],
];

function getResourceIcon(title: string): LucideIcon {
  for (const [pattern, icon] of RESOURCE_ICON_RULES) {
    if (pattern.test(title)) return icon;
  }
  return Info;
}

function getResourceTags(resource: HelpContent): { label: string; type: string }[] {
  const tags: { label: string; type: string }[] = [];
  if (resource.solutions && resource.solutions.length > 0) tags.push({ label: 'Checklist', type: 'checklist' });
  if (resource.examples && resource.examples.length > 0) tags.push({ label: 'Examples', type: 'examples' });
  if (resource.standardsReference) tags.push({ label: 'Standards', type: 'standards' });
  return tags;
}

function getMostCommonTagKey(resources: HelpContent[]): string {
  const counts: Record<string, number> = {};
  resources.forEach(r => {
    const key = getResourceTags(r).map(t => t.type).sort().join(',');
    counts[key] = (counts[key] || 0) + 1;
  });
  let maxKey = '';
  let maxCount = 0;
  for (const [key, count] of Object.entries(counts)) {
    if (count > maxCount) { maxCount = count; maxKey = key; }
  }
  return maxKey;
}

export function ResourceCentre() {
  usePageTitle('Resource Hub');
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { progress } = useModuleProgress();

  const referrer = (location.state as { from?: string; returnTo?: string })?.from;
  const returnTo = (location.state as { returnTo?: string })?.returnTo;

  // Get state from URL params
  const selectedResourceId = searchParams.get('resource');
  const selectedCategory = searchParams.get('category') as ModuleGroup | 'standards' | null;
  const selectedDIAP = searchParams.get('diap') as DIAPCategory | null;
  const searchQuery = searchParams.get('q') || '';

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const isModuleCompleted = (moduleCode: string): boolean => {
    return progress[moduleCode]?.status === 'completed';
  };

  const selectedResource = useMemo(() => {
    if (!selectedResourceId) return null;
    return getHelpByQuestionId(selectedResourceId) || null;
  }, [selectedResourceId]);

  const filteredResources = useMemo(() => {
    let results = allHelpContent;
    if (searchQuery) {
      results = searchHelp(searchQuery);
    }
    if (selectedCategory && selectedCategory !== 'standards') {
      results = results.filter(r => r.moduleGroup === selectedCategory);
    }
    if (selectedDIAP) {
      results = results.filter(r => r.diapCategory === selectedDIAP);
    }
    return results;
  }, [searchQuery, selectedCategory, selectedDIAP]);

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

  const resourcesByModule = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'standards' || searchQuery) return [];
    const grouped: Record<string, HelpContent[]> = {};
    filteredResources.forEach(r => {
      if (!grouped[r.moduleCode]) grouped[r.moduleCode] = [];
      grouped[r.moduleCode].push(r);
    });
    const moduleOrder = MODULES.map(m => m.id);
    return moduleOrder
      .filter(id => grouped[id] && grouped[id].length > 0)
      .map(id => ({ moduleCode: id, moduleName: MODULE_NAMES[id] || id, resources: grouped[id] }));
  }, [filteredResources, selectedCategory, searchQuery]);

  const searchResultsByModule = useMemo(() => {
    if (!searchQuery && !selectedDIAP) return [];
    const grouped: Record<string, HelpContent[]> = {};
    filteredResources.forEach(r => {
      if (!grouped[r.moduleCode]) grouped[r.moduleCode] = [];
      grouped[r.moduleCode].push(r);
    });
    const moduleOrder = MODULES.map(m => m.id);
    return moduleOrder
      .filter(id => grouped[id] && grouped[id].length > 0)
      .map(id => ({ moduleCode: id, moduleName: MODULE_NAMES[id] || id, resources: grouped[id] }));
  }, [filteredResources, searchQuery, selectedDIAP]);

  const totalUnlocked = useMemo(() => {
    return allHelpContent.filter(r => progress[r.moduleCode]?.status === 'completed').length;
  }, [progress]);

  const categoryStats = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'standards') return { resourceCount: 0, moduleCount: 0 };
    const catResources = allHelpContent.filter(r => r.moduleGroup === selectedCategory);
    const modules = new Set(catResources.map(r => r.moduleCode));
    return { resourceCount: catResources.length, moduleCount: modules.size };
  }, [selectedCategory]);

  const toggleGroup = (moduleCode: string) => {
    setExpandedGroups(prev => ({ ...prev, [moduleCode]: !prev[moduleCode] }));
  };

  const isGroupExpanded = (moduleCode: string, index: number): boolean => {
    if (expandedGroups[moduleCode] !== undefined) return expandedGroups[moduleCode];
    return index === 0;
  };

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

  const handleCategorySelect = (categoryId: ModuleGroup | 'standards' | null) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    params.delete('resource');
    setSearchParams(params);
  };

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

  const handleResourceSelect = (resourceId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('resource', resourceId);
    setSearchParams(params);
  };

  const handleBackFromDetail = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('resource');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setLocalSearchQuery('');
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedDIAP;

  const backLabels: Record<string, string> = {
    report: 'Back to Report',
    diap: 'Back to DIAP',
    review: 'Back to Review',
    dashboard: 'Back to Dashboard',
  };
  const backLabel = (referrer && backLabels[referrer]) || 'Back to Resources';
  const handleBack = returnTo ? () => navigate(returnTo) : referrer ? () => navigate(-1) : handleBackFromDetail;

  // === DETAIL VIEW ===
  if (selectedResource) {
    const resourceUnlocked = isModuleCompleted(selectedResource.moduleCode);

    if (!resourceUnlocked) {
      const moduleName = MODULE_NAMES[selectedResource.moduleCode] || selectedResource.moduleCode;
      return (
        <div className="resource-centre">
          <div className="resource-centre-header">
            <button className="btn-back" onClick={handleBack}>
              <ArrowLeft size={20} />
              <span>{backLabel}</span>
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
          <button className="btn-back" onClick={handleBack}>
            <ArrowLeft size={20} />
            <span>{backLabel}</span>
          </button>
        </div>
        <ResourceDetail
          resource={selectedResource}
          onNavigateToResource={handleResourceSelect}
        />
      </div>
    );
  }

  // === SHARED JSX PIECES ===

  const filterPanel = showFilters && (
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
  );

  const resultsSummary = (
    <div className="resource-results-summary" role="status" aria-live="polite">
      <span>{filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} found</span>
      {searchQuery && <span className="search-term">for &ldquo;{searchQuery}&rdquo;</span>}
    </div>
  );

  const searchResultsGrid = (
    <div className="resource-list">
      {filteredResources.length === 0 ? (
        <div className="no-results">
          <p>No resources found matching your criteria.</p>
          <button className="btn-secondary" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="search-results-grouped">
          {searchResultsByModule.map(group => {
            const commonTagKey = getMostCommonTagKey(group.resources);
            return (
              <div key={group.moduleCode} className="search-result-group">
                <div className="search-result-group-header">
                  <span className="module-emoji" aria-hidden="true">{MODULE_ICONS[group.moduleCode] || '📄'}</span>
                  <span className="search-result-group-name">{group.moduleName}</span>
                  <span className="search-result-group-count">{group.resources.length}</span>
                </div>
                <ul className="resource-row-list">
                  {group.resources.map(resource => {
                    const unlocked = isModuleCompleted(resource.moduleCode);
                    const tags = getResourceTags(resource);
                    const tagKey = tags.map(t => t.type).sort().join(',');
                    const showTags = tagKey !== commonTagKey;
                    return (
                      <li key={resource.questionId}>
                        <button
                          className={`resource-row ${!unlocked ? 'locked' : ''}`}
                          onClick={() => handleResourceSelect(resource.questionId)}
                        >
                          <div className="resource-row-info">
                            <span className="resource-row-title">{resource.title}</span>
                            <span className="resource-row-summary">{resource.summary}</span>
                            {showTags && tags.length > 0 && (
                              <div className="resource-row-tags">
                                {tags.map(t => (
                                  <span key={t.type} className={`tag-pill tag-${t.type}`}>{t.label}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          {!unlocked && (
                            <span className="lock-badge">
                              <Lock size={11} aria-hidden="true" /> Locked
                            </span>
                          )}
                          <ChevronRight size={16} className="resource-row-arrow" aria-hidden="true" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const searchInput = (
    <div className="search-input-wrapper">
      <label htmlFor="resource-search" className="sr-only">Search resources</label>
      <Search size={20} className="search-icon" aria-hidden="true" />
      <input
        type="text"
        id="resource-search"
        placeholder="Search resources..."
        value={localSearchQuery}
        onChange={(e) => setLocalSearchQuery(e.target.value)}
        className="search-input"
      />
      {localSearchQuery && (
        <button
          type="button"
          className="search-clear"
          aria-label="Clear search"
          onClick={() => {
            setLocalSearchQuery('');
            const params = new URLSearchParams(searchParams);
            params.delete('q');
            setSearchParams(params);
          }}
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );

  const currentCategory = CATEGORIES.find(c => c.id === selectedCategory);

  // === MAIN BROWSE VIEW ===
  return (
    <div className="resource-centre">
      {selectedCategory ? (
        <>
          {/* === CATEGORY BANNER === */}
          <section className="cat-banner">
            {referrer && (
              <button className="btn-back-banner" onClick={handleBack}>
                <ArrowLeft size={16} />
                <span>{backLabel}</span>
              </button>
            )}
            <nav aria-label="Breadcrumb" className="breadcrumb">
              <ol>
                <li>
                  <button className="breadcrumb-link" onClick={() => handleCategorySelect(null)}>
                    Resource Hub
                  </button>
                </li>
                <li aria-current="page">{currentCategory?.label}</li>
              </ol>
            </nav>
            <span className="cat-emoji" aria-hidden="true">{currentCategory?.emoji}</span>
            <h1>{currentCategory?.label}</h1>
            <p className="cat-desc">{currentCategory?.description}</p>
            {selectedCategory !== 'standards' && (
              <dl className="cat-stats">
                <div>
                  <dt>Resources</dt>
                  <dd>{categoryStats.resourceCount}</dd>
                </div>
                <div>
                  <dt>Modules</dt>
                  <dd>{categoryStats.moduleCount}</dd>
                </div>
              </dl>
            )}
          </section>

          {/* === CATEGORY BODY === */}
          <div className="cat-body">
            <div className="cat-search-row">
              <form className="resource-search-form" role="search" onSubmit={handleSearch}>
                {searchInput}
                <button type="submit" className="btn-search">Search</button>
              </form>
              <button
                className={`btn-filter ${showFilters ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} />
                <span>Filters</span>
                {selectedDIAP && <span className="filter-badge" />}
              </button>
            </div>

            {filterPanel}

            {searchQuery && resultsSummary}
            {searchQuery && searchResultsGrid}

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

            {selectedCategory !== 'standards' && !searchQuery && (
              resourcesByModule.length === 0 ? (
                <div className="no-results">
                  <p>No resources found for this category.</p>
                  <button className="btn-secondary" onClick={clearFilters}>
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="module-list">
                  {resourcesByModule.map((group, groupIndex) => {
                    const expanded = isGroupExpanded(group.moduleCode, groupIndex);
                    const headerId = `module-header-${group.moduleCode}`;
                    const panelId = `module-panel-${group.moduleCode}`;
                    return (
                      <div key={group.moduleCode} className={`module-item ${expanded ? 'open' : ''}`}>
                        <h2 style={{ margin: 0 }}>
                          <button
                            id={headerId}
                            className="module-item-header"
                            onClick={() => toggleGroup(group.moduleCode)}
                            aria-expanded={expanded}
                            aria-controls={panelId}
                          >
                            <span className="module-number">{group.moduleCode}</span>
                            <span className="module-emoji" aria-hidden="true">{MODULE_ICONS[group.moduleCode] || '📄'}</span>
                            <div className="module-info">
                              <span className="module-name">{group.moduleName}</span>
                              <span className="module-meta-desc">{MODULE_DESCS[group.moduleCode] || ''}</span>
                            </div>
                            <span className="module-count-badge">
                              {group.resources.length}
                            </span>
                            <ChevronDown size={18} className="module-chevron" />
                          </button>
                        </h2>
                        {expanded && (
                          <div id={panelId} role="region" aria-labelledby={headerId} className="module-panel">
                            <div className="resource-card-grid">
                              {group.resources.map((resource) => {
                                const unlocked = isModuleCompleted(resource.moduleCode);
                                const IconComponent = getResourceIcon(resource.title);
                                return (
                                  <button
                                    key={resource.questionId}
                                    className={`resource-card-tile ${!unlocked ? 'locked' : ''}`}
                                    onClick={() => handleResourceSelect(resource.questionId)}
                                  >
                                    <div className="resource-card-icon" aria-hidden="true">
                                      <IconComponent size={22} />
                                    </div>
                                    <span className="resource-card-title">{resource.title}</span>
                                    <span className="resource-card-summary">{resource.summary}</span>
                                    {!unlocked && (
                                      <span className="lock-badge">
                                        <Lock size={11} aria-hidden="true" /> Locked
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        </>
      ) : (
        <>
          {/* === HUB HERO === */}
          <section className="hub-hero">
            <span className="hub-eyebrow">Resource Hub</span>
            <h1>Everything you need to <em>improve access</em></h1>
            <p className="hub-subtitle">
              Guides, tips, and best practices for improving accessibility at your venue
            </p>

            <div className="hub-search-row">
              <form className="resource-search-form" role="search" onSubmit={handleSearch}>
                {searchInput}
                <button type="submit" className="btn-search">Search</button>
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

            <dl className="hub-stats">
              <div>
                <dt>Resources</dt>
                <dd>{allHelpContent.length}</dd>
              </div>
              <div>
                <dt>Unlocked</dt>
                <dd>{totalUnlocked}</dd>
              </div>
              <div>
                <dt>Categories</dt>
                <dd>{CATEGORIES.length - 1}</dd>
              </div>
            </dl>
          </section>

          <PageGuide pageId="resources" features={RESOURCE_FEATURES} />

          {/* === HUB BODY === */}
          <div className="hub-body">
            {filterPanel}

            {(searchQuery || selectedDIAP) && resultsSummary}
            {(searchQuery || selectedDIAP) && searchResultsGrid}

            {!searchQuery && !selectedDIAP && (
              <>
                <h2 className="section-label">Browse by category</h2>
                <div className="cat-grid">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      className={`cat-card ${cat.ccClass}`}
                      onClick={() => handleCategorySelect(cat.id)}
                    >
                      <div className="cat-card-icon-wrap">{cat.icon}</div>
                      <h3 className="cat-card-name">{cat.label}</h3>
                      <p className="cat-card-desc">{cat.description}</p>
                      <div className="cat-card-footer">
                        <span className="cat-card-count">
                          {cat.id === 'standards'
                            ? `${KEY_STANDARDS.length} references`
                            : `${resourcesByCategory[cat.id as ModuleGroup].length} resources`
                          }
                        </span>
                        <ChevronRight size={16} className="cat-card-arrow" aria-hidden="true" />
                      </div>
                    </button>
                  ))}
                </div>

                <section className="featured-section">
                  <h2>Popular Resources</h2>
                  <div className="featured-grid">
                    {allHelpContent.slice(0, 3).map((resource, i) => {
                      const unlocked = isModuleCompleted(resource.moduleCode);
                      const tags = getResourceTags(resource);
                      return (
                        <button
                          key={resource.questionId}
                          className={`featured-card ${i === 0 ? 'featured-main' : 'featured-side'} ${!unlocked ? 'locked' : ''}`}
                          onClick={() => handleResourceSelect(resource.questionId)}
                        >
                          {!unlocked && (
                            <span className="featured-lock-badge">
                              <Lock size={11} aria-hidden="true" /> Locked
                            </span>
                          )}
                          {tags.length > 0 && (
                            <div className="featured-card-tags">
                              {tags.map(t => (
                                <span key={t.type} className={`tag-pill tag-${t.type}`}>{t.label}</span>
                              ))}
                            </div>
                          )}
                          <h3 className="featured-card-title">{resource.title}</h3>
                          <p className="featured-card-summary">{resource.summary}</p>
                          <span className="featured-card-action">
                            View resource <ChevronRight size={14} aria-hidden="true" />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              </>
            )}
          </div>
        </>
      )}

      <PageFooter />
    </div>
  );
}

export default ResourceCentre;
