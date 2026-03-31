import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import '../styles/pricing.css';

const CheckIcon = ({ onHighlight = false }: { onHighlight?: boolean }) => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke={onHighlight ? '#FFFFFF' : '#490E67'} strokeWidth={1.5} />
    <path stroke={onHighlight ? '#FFFFFF' : '#490E67'} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12.5l2.5 2.5L16 9.5" />
  </svg>
);

const DashIcon = ({ onHighlight = false }: { onHighlight?: boolean }) => (
  <span style={{ color: onHighlight ? 'rgba(255,255,255,0.4)' : '#9B9596', fontSize: '1.25rem', lineHeight: 1 }} aria-hidden="true">—</span>
);

const AddOnBadge = ({ onHighlight = false }: { onHighlight?: boolean }) => (
  <span className="pricing-addon-badge" style={{
    backgroundColor: 'transparent',
    color: onHighlight ? 'rgba(255,255,255,0.7)' : '#6B5E61',
    fontSize: '0.75rem',
    padding: '0.125rem 0.5rem',
    borderRadius: '0.25rem',
    fontWeight: 500,
    border: onHighlight ? '1px solid rgba(255,255,255,0.4)' : '1px solid #9B9596',
  }}>Add-on</span>
);

type TierFeatures = {
  assessment: string;
  sites: string;
  users: string;
  report: string;
  resourceHub: boolean | string;
  diap: boolean | string;
  comparison: boolean | string;
  training?: boolean | string;
  support: string;
  assessments?: string;
  departments?: boolean | string;
  programs?: string;
  aggregateDashboard?: boolean | string;
  questionGuidance?: boolean | string;
  badgeCertification?: string;
  ownAssessment?: string;
};

type Tier = {
  name: string;
  price: string;
  period: string;
  description: string;
  highlight: boolean;
  perSite?: string;
  features: TierFeatures;
};

const featureLabelsStandard: { key: keyof TierFeatures; label: string }[] = [
  { key: 'assessment', label: 'Accessibility Self-Assessment' },
  { key: 'sites', label: 'Sites / Venues' },
  { key: 'assessments', label: 'Assessments' },
  { key: 'users', label: 'Users / Assessors' },
  { key: 'departments', label: 'Department Breakdown' },
  { key: 'report', label: 'Accessibility Report & Recommendations' },
  { key: 'resourceHub', label: 'Resource Hub' },
  { key: 'diap', label: 'Disability Inclusion Action Plan (DIAP)' },
  { key: 'comparison', label: 'Progress Tracking (Re-assessment)' },
  { key: 'support', label: 'Support' },
];

const featureLabelsAuthority: { key: keyof TierFeatures; label: string }[] = [
  { key: 'ownAssessment', label: 'Own Organisation Assessment (included)' },
  { key: 'assessment', label: 'Business Assessment Type' },
  { key: 'sites', label: 'Business Licenses' },
  { key: 'programs', label: 'Programs (Permits, Grants, Rounds)' },
  { key: 'users', label: 'Authority Portal Users' },
  { key: 'aggregateDashboard', label: 'Aggregate Dashboard (LGA / Region)' },
  { key: 'report', label: 'Reporting' },
  { key: 'resourceHub', label: 'Resource Hub for Businesses' },
  { key: 'diap', label: 'DIAP Management for Businesses' },
  { key: 'comparison', label: 'Progress Tracking (Re-assessment)' },
  { key: 'questionGuidance', label: 'Custom Question Guidance Notes' },
  { key: 'support', label: 'Support' },
];

function renderFeatureValue(value: boolean | string | undefined, onHighlight = false) {
  if (value === undefined || value === null) {
    return <DashIcon onHighlight={onHighlight} />;
  }
  if (typeof value === 'boolean') {
    return value ? <CheckIcon onHighlight={onHighlight} /> : <DashIcon onHighlight={onHighlight} />;
  }
  if (value === 'add-on') {
    return <AddOnBadge onHighlight={onHighlight} />;
  }
  return <span>{value}</span>;
}

const colors = {
  amethyst: '#490E67',
  sunrise: '#8B5E00',
  sunriseBright: '#FF9015',
  walnut: '#3E2B2F',
  ivory: '#ECE9E6',
  white: '#FFFFFF',
  ivoryDark: '#C9C4BE',
  textOnWhite: '#2D2226',
  subtleText: '#5C4A4E'
};

const assessmentInfo: Record<string, { title: string; description: string; recommended?: string; includes: string[] }> = {
  'site': {
    title: 'What counts as a site?',
    description: 'A site is one physical location or address. A venue with multiple areas, departments, or zones within the same location counts as one site.',
    includes: [
      'MCG (arena, museum, function rooms, offices, food areas) = 1 site',
      'A council town hall = 1 site',
      'A shopping centre (all levels and zones) = 1 site',
      'A council with a town hall + library at different addresses = 2 sites',
      'A hotel chain with 3 properties = 3 sites',
    ],
  },
  'pulse': {
    title: 'Pulse Check',
    description: 'A focused overview of each accessibility area. Key questions that identify your biggest gaps quickly.',
    recommended: 'Recommended if you want a quick baseline, are new to accessibility, or need to prioritise where to start.',
    includes: [
      'Key questions per module (not exhaustive)',
      'High-level gap identification',
      'PDF report with priorities',
      'Actionable next steps',
    ],
  },
  'deep': {
    title: 'Deep Dive',
    description: 'A thorough, detailed review of every accessibility area. Covers compliance requirements, best practices, and nuanced scenarios.',
    recommended: 'Recommended if you want a comprehensive understanding, are working toward a DIAP, or need detailed evidence for stakeholders.',
    includes: [
      'All questions per module (comprehensive)',
      'Compliance and best-practice coverage',
      'Detailed PDF + interactive in-app report',
      'Priority ratings with timeframes',
      'Evidence and notes capture',
    ],
  },
};

function AssessmentInfoButton({ type, onHighlight = false }: { type: 'pulse' | 'deep' | 'site'; onHighlight?: boolean }) {
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const info = assessmentInfo[type];

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label={`Learn more about ${info.title}`}
        className={`assessment-info-btn${onHighlight ? ' on-highlight' : ''}`}
      >
        ?
      </button>
      {open && (
        <>
          <div className="assessment-popup-overlay" onClick={() => setOpen(false)} />
          <div
            ref={popupRef}
            role="dialog"
            aria-label={`${info.title} details`}
            className="assessment-popup"
          >
            <div className="assessment-popup-header">
              <h4>{info.title}</h4>
              <button onClick={() => setOpen(false)} aria-label="Close" className="assessment-popup-close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="assessment-popup-desc">{info.description}</p>
            {info.recommended && <p className="assessment-popup-recommended">{info.recommended}</p>}
            <ul className="assessment-popup-list">
              {info.includes.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        </>
      )}
    </>
  );
}

const allTiers: Record<string, Tier[]> = {
  individual: [
    {
      name: 'Free',
      price: '$0',
      period: '',
      description: 'See where you stand',
      highlight: false,
      features: {
        assessment: '3 modules (Deep Dive)',
        sites: '1 site / venue',
        assessments: '1',
        users: '1',
        departments: false,
        report: 'PDF report (scoped to 3 modules)',
        resourceHub: false,
        diap: false,
        comparison: false,
        training: false,
        support: 'Self-service'
      }
    },
    {
      name: 'Starter',
      price: '$399',
      period: '6 months',
      description: 'Understand your baseline across all areas',
      highlight: false,
      features: {
        assessment: 'Pulse Check (all relevant modules)',
        sites: '1 site / venue',
        assessments: '1',
        users: '1',
        departments: false,
        report: 'PDF report',
        resourceHub: '6 months',
        diap: false,
        comparison: false,
        training: false,
        support: 'Self-service'
      }
    },
    {
      name: 'Committed',
      price: '$699',
      period: '12 months',
      description: 'Comprehensive review with action planning',
      highlight: true,
      features: {
        assessment: 'Deep Dive (all relevant modules)',
        sites: '1 site / venue',
        assessments: '1',
        users: '1',
        departments: false,
        report: 'PDF + interactive in-app report',
        resourceHub: '12 months',
        diap: true,
        comparison: '1 re-assessment',
        training: false,
        support: '1\u00d7 60-min consult'
      }
    }
  ],
  multisite: [
    {
      name: 'Multi-Site Pulse',
      price: '$999',
      period: '6 months',
      description: 'Baseline across locations',
      highlight: false,
      perSite: '$333/site',
      features: {
        assessment: 'Pulse Check (all relevant modules)',
        sites: 'Up to 3 sites / venues',
        assessments: '1 per site',
        users: '3',
        departments: false,
        report: 'PDF report',
        resourceHub: '6 months',
        diap: false,
        comparison: false,
        training: false,
        support: '1\u00d7 30-min consult'
      }
    },
    {
      name: 'Multi-Site Deep',
      price: '$1,799',
      period: '12 months',
      description: 'Detailed multi-site review',
      highlight: true,
      perSite: '$600/site',
      features: {
        assessment: 'Deep Dive (all relevant modules)',
        sites: 'Up to 3 sites / venues',
        assessments: '1 per site',
        users: '3',
        departments: false,
        report: 'PDF + interactive in-app report',
        resourceHub: '12 months',
        diap: true,
        comparison: '1 per site',
        training: false,
        support: '1\u00d7 60-min consult'
      }
    },
    {
      name: 'Multi-Site Plus',
      price: '$2,999',
      period: '12 months',
      description: 'Growing chains and groups',
      highlight: false,
      perSite: '$500/site',
      features: {
        assessment: 'Deep Dive (all relevant modules)',
        sites: 'Up to 6 sites / venues',
        assessments: '1 per site',
        users: '6',
        departments: false,
        report: 'PDF + interactive in-app report',
        resourceHub: '12 months',
        diap: true,
        comparison: '1 per site',
        training: false,
        support: '1\u00d7 60-min + quarterly check-ins'
      }
    },
    {
      name: 'Large Organisation',
      price: 'Custom pricing',
      period: '',
      description: 'For complex venues, precincts, shopping centres, and multi-department organisations',
      highlight: false,
      features: {
        assessment: 'Deep Dive (all relevant modules)',
        sites: 'Unlimited sites, departments, or event spaces',
        assessments: 'Unlimited',
        users: 'Unlimited assessors',
        departments: 'Per-department breakdown',
        report: 'PDF + interactive + cross-department summary',
        resourceHub: '12 months',
        diap: true,
        comparison: 'Unlimited',
        training: false,
        support: 'Named consultant + onboarding'
      }
    }
  ],
  authority: [
    {
      name: 'Essentials',
      price: '$4,000 + from $99/business',
      period: '/year',
      description: 'Track accessibility compliance across your LGA or network',
      highlight: false,
      perSite: 'Pulse Check assessment per business',
      features: {
        ownAssessment: '1 site (Deep Dive)',
        assessment: 'Pulse Check (scoped modules)',
        sites: 'Unlimited business licenses',
        programs: '1 active program',
        users: '3 admin users',
        aggregateDashboard: 'Completion tracking',
        report: 'Aggregate PDF + per-business summary',
        questionGuidance: false,
        resourceHub: '30 days per business',
        diap: false,
        comparison: false,
        support: 'Email + onboarding call'
      }
    },
    {
      name: 'Pro',
      price: '$8,900 + $349/business',
      period: '/year',
      description: 'Active program management with tools for your businesses',
      highlight: true,
      perSite: 'Deep Dive assessment per business (12 months)',
      features: {
        ownAssessment: '1 site (Deep Dive)',
        assessment: 'Deep Dive (scoped modules)',
        sites: 'Unlimited business licenses',
        programs: 'Up to 5 active programs',
        users: '10 admin users',
        aggregateDashboard: 'Full aggregate with trends',
        report: 'Aggregate + per-business + program reports',
        questionGuidance: true,
        resourceHub: 'Included for businesses',
        diap: 'Included for businesses',
        comparison: '1 per business',
        support: 'Priority email + quarterly review'
      }
    },
    {
      name: 'Enterprise & Partnerships',
      price: 'Contact us',
      period: '',
      description: 'For venue operators, franchise networks, industry associations, state bodies, and tourism boards',
      highlight: false,
      features: {
        ownAssessment: 'Unlimited sites (Deep Dive)',
        assessment: 'Configurable per program',
        sites: 'Unlimited businesses',
        programs: 'Unlimited programs',
        users: 'Unlimited',
        aggregateDashboard: 'Custom reporting + API access',
        report: 'Full suite + exportable data + white-label',
        questionGuidance: true,
        resourceHub: 'Included for businesses',
        diap: 'Included for businesses',
        comparison: 'Unlimited',
        support: 'Dedicated partnership manager + SSO + integrations'
      }
    }
  ]
};

export default function Pricing() {
  usePageTitle('Pricing');
  const [view, setView] = useState<'individual' | 'multisite' | 'authority'>('individual');

  const currentTiers = allTiers[view];
  const featureLabels = view === 'authority' ? featureLabelsAuthority : featureLabelsStandard;

  const viewLabels: Record<string, string> = {
    individual: 'Single Site / Venue',
    multisite: 'Multi-Site & Organisations',
    authority: 'Councils, Authorities & Enterprise',
  };

  return (
    <div className="landing-page">
      <header className="pricing-page-header">
        <div className="container header-container">
          <div className="logo">
            <Link to="/">
              <img src="/images/access-compass-logo.png" alt="Access Compass - Home" className="logo-img" />
            </Link>
          </div>
          <nav className="header-nav">
            <a href="mailto:hello@accesscompass.com.au" className="nav-link">Contact</a>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/disclaimer" className="btn btn-nav">Get started</Link>
          </nav>
        </div>
      </header>

      <div className="pricing-content" style={{ backgroundColor: colors.ivory }}>
        {/* Header */}
        <div className="pricing-header">
          <h1 style={{ color: colors.walnut }}>Pricing Plans</h1>
          <p style={{ color: colors.subtleText }}>35+ modules covering every touchpoint of your visitor journey. Choose the right plan to get started.</p>
        </div>

        {/* View Toggle */}
        <div className="pricing-toggle">
          <div className="pricing-toggle-inner" style={{ backgroundColor: colors.white, border: `2px solid ${colors.ivoryDark}` }}>
            <button
              onClick={() => setView('individual')}
              className="pricing-toggle-btn"
              style={{
                backgroundColor: view === 'individual' ? '#ea0b3f' : 'transparent',
                color: view === 'individual' ? '#FFFFFF' : colors.walnut
              }}
              aria-pressed={view === 'individual'}
            >
              Single Site
            </button>
            <button
              onClick={() => setView('multisite')}
              className="pricing-toggle-btn"
              style={{
                backgroundColor: view === 'multisite' ? '#ea0b3f' : 'transparent',
                color: view === 'multisite' ? '#FFFFFF' : colors.walnut
              }}
              aria-pressed={view === 'multisite'}
            >
              Multi-Site & Organisations
            </button>
            <button
              onClick={() => setView('authority')}
              className="pricing-toggle-btn"
              style={{
                backgroundColor: view === 'authority' ? '#ea0b3f' : 'transparent',
                color: view === 'authority' ? '#FFFFFF' : colors.walnut
              }}
              aria-pressed={view === 'authority'}
            >
              Councils, Authorities & Enterprise
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-cards">
          <div className="pricing-cards-grid">
            {currentTiers.map((tier, i) => (
              <div
                key={i}
                className={`pricing-card${tier.highlight ? ' highlighted' : ''}`}
                style={{
                  backgroundColor: tier.highlight ? colors.amethyst : colors.white,
                  border: tier.highlight ? `3px solid ${colors.sunriseBright}` : `2px solid ${colors.ivoryDark}`,
                  boxShadow: tier.highlight ? '0 16px 32px rgba(73, 14, 103, 0.3)' : '0 2px 8px rgba(62, 43, 47, 0.1)'
                }}
              >
                {tier.highlight && (
                  <div className="pricing-card-badge" style={{ backgroundColor: colors.sunriseBright, color: '#1A0F11' }}>
                    Most Popular
                  </div>
                )}
                <h2 style={{ color: tier.highlight ? colors.white : colors.walnut, fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  {tier.name}
                </h2>
                <p className="pricing-card-desc" style={{ color: tier.highlight ? '#E0D4E5' : colors.subtleText }}>
                  {tier.description}
                </p>
                <div className="pricing-card-price">
                  <span style={{ color: tier.highlight ? colors.white : colors.amethyst }}>
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="price-period" style={{ color: tier.highlight ? '#C9B8D0' : colors.subtleText }}>
                      {tier.period}
                    </span>
                  )}
                </div>
                {tier.perSite && (
                  <div className="pricing-card-persite" style={{ color: tier.highlight ? colors.sunriseBright : colors.sunrise }}>
                    {tier.perSite}
                  </div>
                )}
                <div
                  className="pricing-card-assessment"
                  style={{
                    borderTop: tier.highlight ? '2px solid rgba(255,255,255,0.3)' : `2px solid ${colors.ivoryDark}`,
                    color: tier.highlight ? '#E0D4E5' : colors.subtleText
                  }}
                >
                  {tier.features.assessment}
                  {tier.features.assessment.includes('Pulse') && <AssessmentInfoButton type="pulse" onHighlight={tier.highlight} />}
                  {tier.features.assessment.includes('Deep Dive') && <AssessmentInfoButton type="deep" onHighlight={tier.highlight} />}
                </div>
                <details className="pricing-card-details">
                  <summary style={{ color: tier.highlight ? '#E0D4E5' : colors.amethyst }}>
                    What's included
                  </summary>
                  <div className="pricing-card-features" style={{ borderTop: tier.highlight ? '1px solid rgba(255,255,255,0.2)' : `1px solid ${colors.ivoryDark}` }}>
                    {featureLabels.map(({ key, label }) => (
                      <div key={key} className="pricing-card-feature-row">
                        <span className="pricing-card-feature-label" style={{ color: tier.highlight ? '#C9B8D0' : colors.subtleText }}>{label}</span>
                        <span style={{ color: tier.highlight ? colors.white : colors.textOnWhite }}>
                          {renderFeatureValue(tier.features[key], tier.highlight)}
                        </span>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table - Desktop */}
        <div className="pricing-comparison" style={{ backgroundColor: colors.white, border: `2px solid ${colors.ivoryDark}` }}>
          <div className="pricing-comparison-header" style={{ backgroundColor: colors.amethyst }}>
            <h3 style={{ color: colors.white, fontSize: '1.125rem', fontWeight: 700 }}>Feature Comparison — {viewLabels[view]}</h3>
          </div>
          <table>
            <thead>
              <tr style={{ backgroundColor: colors.walnut }}>
                <th style={{ color: colors.white }}>Feature</th>
                {currentTiers.map((tier, i) => (
                  <th key={i} style={{ color: colors.white }}>{tier.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureLabels.map(({ key, label }, idx) => (
                <tr key={key} style={{ backgroundColor: idx % 2 === 1 ? colors.ivory : colors.white }}>
                  <td style={{ color: colors.textOnWhite, position: 'relative' }}>
                    {label}
                    {key === 'ownAssessment' && <AssessmentInfoButton type="site" />}
                  </td>
                  {currentTiers.map((tier, i) => (
                    <td key={i} style={{ color: colors.textOnWhite }}>
                      {renderFeatureValue(tier.features[key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Comparison - Mobile */}
          <div className="pricing-comparison-mobile">
            {currentTiers.map((tier, i) => (
              <div key={i} className="pricing-mobile-tier">
                <h4 style={{ color: colors.amethyst }}>{tier.name} <span style={{ color: colors.subtleText, fontWeight: 400, fontSize: '0.875rem' }}>{tier.price}</span></h4>
                {featureLabels.map(({ key, label }) => (
                  <div key={key} className="pricing-mobile-row">
                    <span className="pricing-mobile-label" style={{ color: colors.textOnWhite, position: 'relative' }}>
                      {label}
                      {key === 'ownAssessment' && <AssessmentInfoButton type="site" />}
                    </span>
                    <span style={{ color: colors.textOnWhite }}>
                      {renderFeatureValue(tier.features[key])}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Authority info panel (only shown on authority view) */}
        {view === 'authority' && (
          <>
            <div className="pricing-addons">
              <div className="pricing-addons-inner" style={{ backgroundColor: colors.white, border: `2px solid ${colors.amethyst}` }}>
                <h3 style={{ color: colors.walnut }}>How it works</h3>
                <div style={{ fontSize: '0.875rem', color: colors.subtleText, lineHeight: 1.7 }}>
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong style={{ color: colors.textOnWhite }}>1. Create programs</strong> for permits, grants, or compliance rounds, each with a tailored set of modules.
                  </p>
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong style={{ color: colors.textOnWhite }}>2. Businesses complete their assessment.</strong> You choose who pays: authority-funded, business-funded, or co-funded.
                  </p>
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong style={{ color: colors.textOnWhite }}>3. Track progress</strong> via your aggregate dashboard. See completion rates, score bands, and trends across your region.
                  </p>
                  <p style={{ marginBottom: '0' }}>
                    <strong style={{ color: colors.textOnWhite }}>4. Privacy by design.</strong> You see completion status and score bands. Individual answers and evidence remain private to each business.
                  </p>
                </div>
              </div>
            </div>

            {/* License pricing */}
            <div className="pricing-addons">
              <div className="pricing-addons-inner" style={{ backgroundColor: colors.white, border: `2px solid ${colors.ivoryDark}` }}>
                <h3 style={{ color: colors.walnut }}>Business license pricing</h3>
                <p style={{ color: colors.subtleText, fontSize: '0.8125rem', marginBottom: '0.75rem' }}>
                  Each business needs a license to complete their assessment. Paid by the authority or by the business directly, depending on your program.
                </p>
                <div className="pricing-addons-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                  <div className="pricing-addon-item" style={{ color: colors.textOnWhite }}>
                    <span>Assessment only (Pulse, scoped modules)</span>
                    <span><span style={{ fontWeight: 700 }}>$99</span><span style={{ color: colors.subtleText, fontSize: '0.75rem' }}>/business</span></span>
                  </div>
                  <div className="pricing-addon-item" style={{ color: colors.textOnWhite }}>
                    <span>Assessment only (Deep Dive, scoped modules)</span>
                    <span><span style={{ fontWeight: 700 }}>$199</span><span style={{ color: colors.subtleText, fontSize: '0.75rem' }}>/business</span></span>
                  </div>
                  <div className="pricing-addon-item" style={{ color: colors.textOnWhite }}>
                    <span>Cohort license (Deep Dive + Resource Hub + DIAP, 12mo)</span>
                    <span><span style={{ fontWeight: 700 }}>$349</span><span style={{ color: colors.subtleText, fontSize: '0.75rem' }}>/business</span></span>
                  </div>
                </div>
                <p style={{ color: colors.subtleText, fontSize: '0.75rem', marginTop: '0.75rem' }}>
                  Assessment-only licenses include a scoped PDF report. Businesses funding their own license pay standard individual rates. Payment plans available.
                </p>
              </div>
            </div>

            {/* Authority add-ons */}
            <div className="pricing-addons">
              <div className="pricing-addons-inner" style={{ backgroundColor: colors.white, border: `2px solid ${colors.ivoryDark}` }}>
                <h3 style={{ color: colors.walnut }}>
                  <span style={{ backgroundColor: colors.amethyst, color: colors.white, width: '1.5rem', height: '1.5rem', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>+</span>
                  Add-ons
                </h3>
                <div className="pricing-addons-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                  <div className="pricing-addon-item" style={{ color: colors.textOnWhite }}>
                    <span>Additional own sites/departments</span>
                    <span style={{ fontWeight: 700 }}>$500/site/yr</span>
                  </div>
                  <div className="pricing-addon-item" style={{ color: colors.textOnWhite }}>
                    <span>Additional programs</span>
                    <span style={{ fontWeight: 700 }}>$1,000/program/yr</span>
                  </div>
                  <div className="pricing-addon-item" style={{ color: colors.textOnWhite }}>
                    <span>Additional admin seats</span>
                    <span style={{ fontWeight: 700 }}>$500/seat/yr</span>
                  </div>
                  <div className="pricing-addon-item" style={{ color: colors.textOnWhite }}>
                    <span>60-min advisory session</span>
                    <span style={{ fontWeight: 700 }}>$450</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Individual Modules (hidden on authority view) */}
        {view !== 'authority' && (
          <div className="pricing-addons">
            <div className="pricing-addons-inner" style={{ backgroundColor: colors.white, border: `2px solid ${colors.ivoryDark}` }}>
              <h3 style={{ color: colors.walnut }}>
                <span style={{ backgroundColor: colors.amethyst, color: colors.white, width: '1.5rem', height: '1.5rem', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>1</span>
                Individual Modules
              </h3>
              <p style={{ color: colors.subtleText, fontSize: '0.8125rem', marginBottom: '0.75rem' }}>
                Just want to check a specific area? Each module includes the Deep Dive assessment, PDF report, and 30 days of relevant Resource Hub access.
              </p>
              <div className="pricing-addons-grid">
                <div className="pricing-addon-item" style={{ color: colors.textOnWhite }}>
                  <span>Single module</span>
                  <span style={{ fontWeight: 700 }}>$49</span>
                </div>
                <div className="pricing-addon-item" style={{ color: colors.textOnWhite }}>
                  <span>3-module bundle</span>
                  <span><span style={{ fontWeight: 700 }}>$129</span> <span style={{ color: colors.subtleText, fontSize: '0.75rem' }}>($43/ea)</span></span>
                </div>
                <div className="pricing-addon-item" style={{ color: colors.textOnWhite }}>
                  <span>5-module bundle</span>
                  <span><span style={{ fontWeight: 700 }}>$199</span> <span style={{ color: colors.subtleText, fontSize: '0.75rem' }}>($40/ea)</span></span>
                </div>
                <div className="pricing-addon-item" style={{ color: colors.subtleText, fontSize: '0.8125rem' }}>
                  <span>Spend credited toward Starter or Committed upgrade</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add-ons (hidden on authority view) */}
        {view !== 'authority' && (
          <div className="pricing-addons">
            <div className="pricing-addons-inner" style={{ backgroundColor: colors.white, border: `2px solid ${colors.ivoryDark}` }}>
              <h3 style={{ color: colors.walnut }}>
                <span style={{ backgroundColor: colors.amethyst, color: colors.white, width: '1.5rem', height: '1.5rem', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>+</span>
                Paid Add-Ons
              </h3>
              <div className="pricing-addons-grid">
                <div className="pricing-addon-item" style={{ color: colors.textOnWhite }}>
                  <span>30-min advisory</span>
                  <span style={{ fontWeight: 700 }}>$250</span>
                </div>
                <div className="pricing-addon-item" style={{ color: colors.textOnWhite }}>
                  <span>60-min advisory</span>
                  <span style={{ fontWeight: 700 }}>$450</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Paths (hidden on authority view) */}
        {view !== 'authority' && (
          <div className="pricing-upgrades" style={{ backgroundColor: colors.white, border: `2px solid ${colors.amethyst}` }}>
            <h3 style={{ color: colors.amethyst }}>Upgrade Paths — Full credit applied</h3>
            <div className="pricing-upgrades-list">
              {[
                { path: 'Starter \u2192 Committed', credit: '$399' },
                { path: 'Committed \u2192 Multi-Site Deep', credit: '$699' },
                { path: 'Multi-Site Pulse \u2192 Deep', credit: '$999' },
                { path: 'Multi-Site Deep \u2192 Plus', credit: '$1,799' },
                { path: 'Multi-Site Plus \u2192 Large Organisation', credit: '$2,999' }
              ].map((item, i) => (
                <span key={i} className="pricing-upgrade-pill" style={{ backgroundColor: colors.ivory, color: colors.walnut, border: `1px solid ${colors.ivoryDark}` }}>
                  {item.path}: <strong style={{ color: colors.amethyst }}>{item.credit}</strong>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="pricing-cta">
          {view === 'authority' ? (
            <a href="mailto:hello@accesscompass.com.au?subject=Council%20%2F%20Authority%20enquiry" className="btn btn-primary btn-large">
              Contact us about authority partnerships
            </a>
          ) : (
            <Link to="/disclaimer" className="btn btn-primary btn-large">
              Start your accessibility check
            </Link>
          )}
        </div>

        {/* Footer note */}
        <div className="pricing-footer-note">
          <p style={{ color: colors.subtleText }}>
            All prices AUD. Payment plans available on all paid tiers (3 instalments, 0% interest).
          </p>
        </div>
      </div>

      <footer className="landing-footer">
        <div className="container">
          <p className="footer-brand">
            Access Compass is a <a href="https://flareaccess.com.au" target="_blank" rel="noopener noreferrer">Flare Access</a> product designed to help organisations understand, prioritise and take action on accessibility.
          </p>
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Flare Access. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
