import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import '../styles/pricing.css';

const CheckIcon = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="#490E67" strokeWidth={1.5} />
    <path stroke="#490E67" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12.5l2.5 2.5L16 9.5" />
  </svg>
);

const DashIcon = () => (
  <span style={{ color: '#9B9596', fontSize: '1.25rem', lineHeight: 1 }} aria-hidden="true">—</span>
);

const AddOnBadge = () => (
  <span className="pricing-addon-badge" style={{ backgroundColor: 'transparent', color: '#6B5E61', fontSize: '0.75rem', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', fontWeight: 500, border: '1px solid #9B9596' }}>Add-on</span>
);

type TierFeatures = {
  assessment: string;
  sites: string;
  users: string;
  report: string;
  resourceHub: boolean | string;
  diap: boolean | string;
  comparison: boolean | string;
  training: boolean | string;
  support: string;
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

const featureLabels: { key: keyof TierFeatures; label: string }[] = [
  { key: 'assessment', label: 'Accessibility Self-Assessment' },
  { key: 'sites', label: 'Sites / Venues' },
  { key: 'users', label: 'Users' },
  { key: 'report', label: 'Accessibility Report & Recommendations' },
  { key: 'resourceHub', label: 'Resource Hub' },
  { key: 'diap', label: 'Disability Inclusion Action Plan (DIAP) Management System' },
  { key: 'comparison', label: 'Progress Tracking (Re-assessment)' },
  { key: 'support', label: 'Support' },
];

function renderFeatureValue(value: boolean | string) {
  if (typeof value === 'boolean') {
    return value ? <CheckIcon /> : <DashIcon />;
  }
  if (value === 'add-on') {
    return <AddOnBadge />;
  }
  return <span>{value}</span>;
}

const colors = {
  amethyst: '#490E67',
  sunrise: '#D97706',
  sunriseBright: '#FF9015',
  walnut: '#3E2B2F',
  ivory: '#ECE9E6',
  white: '#FFFFFF',
  ivoryDark: '#C9C4BE',
  textOnWhite: '#2D2226',
  subtleText: '#5C4A4E'
};

const assessmentInfo: Record<string, { title: string; description: string; recommended: string; includes: string[] }> = {
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

function AssessmentInfoButton({ type }: { type: 'pulse' | 'deep' }) {
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
    <span style={{ position: 'relative', display: 'inline-block', marginLeft: '0.35rem', verticalAlign: 'middle' }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label={`Learn more about ${info.title}`}
        style={{
          background: 'none',
          border: '1.5px solid #9B9596',
          borderRadius: '50%',
          width: '18px',
          height: '18px',
          fontSize: '0.7rem',
          fontWeight: 700,
          color: '#5C4A4E',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          lineHeight: 1,
        }}
      >
        ?
      </button>
      {open && (
        <div
          ref={popupRef}
          role="dialog"
          aria-label={`${info.title} details`}
          style={{
            position: 'absolute',
            top: '28px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '320px',
            backgroundColor: '#FFFFFF',
            border: `2px solid ${colors.amethyst}`,
            borderRadius: '12px',
            padding: '1.25rem',
            boxShadow: '0 8px 32px rgba(73, 14, 103, 0.2)',
            zIndex: 100,
            textAlign: 'left',
          }}
        >
          <h4 style={{ margin: '0 0 0.5rem', color: colors.amethyst, fontSize: '1rem' }}>{info.title}</h4>
          <p style={{ margin: '0 0 0.75rem', color: colors.textOnWhite, fontSize: '0.85rem', lineHeight: 1.5 }}>{info.description}</p>
          <p style={{ margin: '0 0 0.75rem', color: colors.sunrise, fontSize: '0.85rem', lineHeight: 1.5, fontWeight: 600 }}>{info.recommended}</p>
          <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.8rem', color: colors.subtleText, lineHeight: 1.7 }}>
            {info.includes.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
          <button
            onClick={() => setOpen(false)}
            style={{
              marginTop: '0.75rem',
              background: 'none',
              border: 'none',
              color: colors.amethyst,
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontWeight: 600,
              padding: 0,
            }}
          >
            Close
          </button>
        </div>
      )}
    </span>
  );
}

const allTiers: Record<string, Tier[]> = {
  individual: [
    {
      name: 'Free',
      price: '$0',
      period: '',
      description: 'Try before you buy',
      highlight: false,
      features: {
        assessment: '1 module (Deep Dive)',
        sites: '1 site / venue',
        users: '1',
        report: 'PDF report',
        resourceHub: false,
        diap: false,
        comparison: false,
        training: false,
        support: 'Self-service'
      }
    },
    {
      name: 'Starter',
      price: '$799',
      period: '3 months',
      description: '3-month access to understand your baseline',
      highlight: false,
      features: {
        assessment: 'Pulse Check (all relevant modules)',
        sites: '1 site / venue',
        users: '1',
        report: 'PDF report',
        resourceHub: '3 months',
        diap: false,
        comparison: 'add-on',
        training: false,
        support: '1\u00d7 30-min consult'
      }
    },
    {
      name: 'Committed',
      price: '$1,200',
      period: 'one-off',
      description: 'Full accessibility review',
      highlight: true,
      features: {
        assessment: 'Deep Dive (all relevant modules)',
        sites: '1 site / venue',
        users: '1',
        report: 'PDF + interactive in-app report',
        resourceHub: '12 months',
        diap: true,
        comparison: 'add-on',
        training: false,
        support: '1\u00d7 30-min consult'
      }
    }
  ],
  multisite: [
    {
      name: 'Multi-Site Pulse',
      price: '$1,900',
      period: '6 months',
      description: 'Baseline across locations',
      highlight: false,
      perSite: '$633/site',
      features: {
        assessment: 'Pulse Check (all relevant modules)',
        sites: 'Up to 3 sites / venues',
        users: '3',
        report: 'PDF report',
        resourceHub: '6 months',
        diap: false,
        comparison: 'add-on',
        training: false,
        support: '1\u00d7 30-min consult'
      }
    },
    {
      name: 'Multi-Site Deep',
      price: '$3,800',
      period: 'one-off',
      description: 'Detailed multi-site review',
      highlight: true,
      perSite: '$1,267/site',
      features: {
        assessment: 'Deep Dive (all relevant modules)',
        sites: 'Up to 3 sites / venues',
        users: '3',
        report: 'PDF + interactive in-app report',
        resourceHub: '12 months',
        diap: 'add-on',
        comparison: '2 per site',
        training: '1 free course',
        support: '1\u00d7 60-min + 3 calls/year'
      }
    },
    {
      name: 'Multi-Site Plus',
      price: '$6,500',
      period: 'one-off',
      description: 'Growing chains and groups',
      highlight: false,
      perSite: '$1,083/site',
      features: {
        assessment: 'Deep Dive (all relevant modules)',
        sites: 'Up to 6 sites / venues',
        users: 'Unlimited',
        report: 'PDF + interactive in-app report',
        resourceHub: '12 months',
        diap: true,
        comparison: '2 per site',
        training: '1 free course',
        support: '1\u00d7 60-min + 6 calls/year'
      }
    },
    {
      name: 'Enterprise',
      price: 'Custom pricing',
      period: '',
      description: 'Pricing and services tailored to maximise impact across large organisations',
      highlight: false,
      features: {
        assessment: 'Deep Dive (all relevant modules)',
        sites: 'Unlimited sites / venues',
        users: 'Unlimited',
        report: 'PDF + interactive in-app report',
        resourceHub: '12 months',
        diap: true,
        comparison: 'Unlimited',
        training: 'All courses',
        support: 'Named consultant'
      }
    }
  ]
};

export default function Pricing() {
  usePageTitle('Pricing');
  const [view, setView] = useState<'individual' | 'multisite'>('individual');

  const currentTiers = allTiers[view];

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
                backgroundColor: view === 'individual' ? colors.amethyst : 'transparent',
                color: view === 'individual' ? colors.white : colors.walnut
              }}
              aria-pressed={view === 'individual'}
            >
              Single Site
            </button>
            <button
              onClick={() => setView('multisite')}
              className="pricing-toggle-btn"
              style={{
                backgroundColor: view === 'multisite' ? colors.amethyst : 'transparent',
                color: view === 'multisite' ? colors.white : colors.walnut
              }}
              aria-pressed={view === 'multisite'}
            >
              Multi-Site & Enterprise
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
                  <div className="pricing-card-badge" style={{ backgroundColor: colors.sunriseBright, color: colors.walnut }}>
                    Most Popular
                  </div>
                )}
                <h3 style={{ color: tier.highlight ? colors.white : colors.walnut }}>
                  {tier.name}
                </h3>
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
                  {tier.features.assessment.includes('Pulse') && <AssessmentInfoButton type="pulse" />}
                  {tier.features.assessment.includes('Deep Dive') && <AssessmentInfoButton type="deep" />}
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
                          {renderFeatureValue(tier.features[key])}
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
            <h2 style={{ color: colors.white }}>Feature Comparison {view === 'individual' ? '— Single Site / Venue' : '— Multi-Site & Enterprise'}</h2>
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
                  <td style={{ color: colors.textOnWhite }}>{label}</td>
                  {currentTiers.map((tier, i) => (
                    <td key={i} style={{ color: colors.textOnWhite }}>
                      {renderFeatureValue(tier.features[key])}
                    </td>
                  ))}
                </tr>
              ))}
              <tr style={{ backgroundColor: colors.white }}>
                <td style={{ color: colors.textOnWhite }}>Training Hub</td>
                <td colSpan={currentTiers.length} style={{ color: colors.subtleText, fontWeight: 500 }}>
                  Coming soon — separate pricing
                </td>
              </tr>
            </tbody>
          </table>

          {/* Comparison - Mobile */}
          <div className="pricing-comparison-mobile">
            {currentTiers.map((tier, i) => (
              <div key={i} className="pricing-mobile-tier">
                <h4 style={{ color: colors.amethyst }}>{tier.name} <span style={{ color: colors.subtleText, fontWeight: 400, fontSize: '0.875rem' }}>{tier.price}</span></h4>
                {featureLabels.map(({ key, label }) => (
                  <div key={key} className="pricing-mobile-row">
                    <span className="pricing-mobile-label" style={{ color: colors.textOnWhite }}>{label}</span>
                    <span style={{ color: colors.textOnWhite }}>
                      {renderFeatureValue(tier.features[key])}
                    </span>
                  </div>
                ))}
                <div className="pricing-mobile-row">
                  <span className="pricing-mobile-label" style={{ color: colors.textOnWhite }}>Training Hub</span>
                  <span style={{ color: colors.subtleText }}>Coming soon</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Individual Modules */}
        <div className="pricing-addons">
          <div className="pricing-addons-inner" style={{ backgroundColor: colors.white, border: `2px solid ${colors.ivoryDark}` }}>
            <h3 style={{ color: colors.walnut }}>
              <span style={{ backgroundColor: colors.amethyst, color: colors.white, width: '1.5rem', height: '1.5rem', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>1</span>
              Individual Modules
            </h3>
            <p style={{ color: colors.subtleText, fontSize: '0.8125rem', marginBottom: '0.75rem' }}>
              Want to focus on specific areas? Purchase individual Deep Dive modules after your free assessment.
            </p>
            <div className="pricing-addons-grid">
              <div className="pricing-addon-item" style={{ color: colors.textOnWhite }}>
                <span>Single module</span>
                <span style={{ fontWeight: 700 }}>$99</span>
              </div>
              <div className="pricing-addon-item" style={{ color: colors.textOnWhite }}>
                <span>3-module bundle</span>
                <span><span style={{ fontWeight: 700 }}>$249</span> <span style={{ color: colors.subtleText, fontSize: '0.75rem' }}>($83/ea)</span></span>
              </div>
              <div className="pricing-addon-item" style={{ color: colors.textOnWhite }}>
                <span>5-module bundle</span>
                <span><span style={{ fontWeight: 700 }}>$379</span> <span style={{ color: colors.subtleText, fontSize: '0.75rem' }}>($76/ea)</span></span>
              </div>
              <div className="pricing-addon-item" style={{ color: colors.subtleText, fontSize: '0.8125rem' }}>
                <span>Module spend credited toward tier upgrades</span>
              </div>
            </div>
          </div>
        </div>

        {/* Add-ons */}
        <div className="pricing-addons">
          <div className="pricing-addons-inner" style={{ backgroundColor: colors.white, border: `2px solid ${colors.ivoryDark}` }}>
            <h3 style={{ color: colors.walnut }}>
              <span style={{ backgroundColor: colors.amethyst, color: colors.white, width: '1.5rem', height: '1.5rem', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>+</span>
              Paid Add-Ons
            </h3>
            <div className="pricing-addons-grid">
              <div className="pricing-addon-item" style={{ color: colors.textOnWhite }}>
                <span>30-min advisory</span>
                <span style={{ fontWeight: 700 }}>$150</span>
              </div>
              <div className="pricing-addon-item" style={{ color: colors.textOnWhite }}>
                <span>60-min advisory</span>
                <span style={{ fontWeight: 700 }}>$250</span>
              </div>
              <div className="pricing-addon-item" style={{ color: colors.textOnWhite }}>
                <span>Comparison run</span>
                <span style={{ color: colors.subtleText }}>TBD</span>
              </div>
              <div className="pricing-addon-item" style={{ color: colors.textOnWhite }}>
                <span>DIAP management</span>
                <span style={{ color: colors.subtleText }}>TBD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Paths */}
        <div className="pricing-upgrades" style={{ backgroundColor: colors.white, border: `2px solid ${colors.amethyst}` }}>
          <h3 style={{ color: colors.amethyst }}>Upgrade Paths — Full credit applied</h3>
          <div className="pricing-upgrades-list">
            {[
              { path: 'Starter \u2192 Committed', credit: '$799' },
              { path: 'Committed \u2192 Multi-Site Deep', credit: '$1,200' },
              { path: 'Multi-Site Pulse \u2192 Deep', credit: '$1,900' },
              { path: 'Multi-Site Deep \u2192 Plus', credit: '$3,800' },
              { path: 'Multi-Site Plus \u2192 Enterprise', credit: '$6,500' }
            ].map((item, i) => (
              <span key={i} className="pricing-upgrade-pill" style={{ backgroundColor: colors.ivory, color: colors.walnut, border: `1px solid ${colors.ivoryDark}` }}>
                {item.path}: <strong style={{ color: colors.amethyst }}>{item.credit}</strong>
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="pricing-cta">
          <Link to="/disclaimer" className="btn btn-primary btn-large">
            Start your accessibility check
          </Link>
        </div>

        {/* Footer note */}
        <div className="pricing-footer-note">
          <p style={{ color: colors.subtleText }}>
            All prices AUD. Payment plans available on select tiers.
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
