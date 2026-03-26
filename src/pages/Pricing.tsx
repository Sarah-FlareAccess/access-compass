import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import '../styles/pricing.css';

const CheckIcon = () => (
  <svg width="20" height="20" fill="none" stroke="#490E67" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" fill="none" stroke="#9B9596" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const AddOnBadge = () => (
  <span className="pricing-addon-badge" style={{ backgroundColor: '#3E2B2F', color: '#FFFFFF', fontSize: '0.75rem', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', fontWeight: 700 }}>Add-on</span>
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
  { key: 'assessment', label: 'Assessment' },
  { key: 'sites', label: 'Sites' },
  { key: 'users', label: 'Users' },
  { key: 'report', label: 'Report' },
  { key: 'resourceHub', label: 'Resource Hub' },
  { key: 'diap', label: 'DIAP' },
  { key: 'comparison', label: 'Comparison Runs' },
  { key: 'support', label: 'Support' },
];

function renderFeatureValue(value: boolean | string) {
  if (typeof value === 'boolean') {
    return value ? <CheckIcon /> : <XIcon />;
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
        sites: '1',
        users: '1',
        report: 'PDF',
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
      period: 'one-off',
      description: 'Understand your baseline',
      highlight: false,
      features: {
        assessment: 'Pulse Check (all relevant modules)',
        sites: '1',
        users: '1',
        report: 'PDF',
        resourceHub: '3 months',
        diap: false,
        comparison: 'add-on',
        training: false,
        support: '1\u00d7 30-min consult'
      }
    },
    {
      name: 'Committed',
      price: '$1,500',
      period: 'one-off',
      description: 'Full accessibility review',
      highlight: true,
      features: {
        assessment: 'Deep Dive (all relevant modules)',
        sites: '1',
        users: '1',
        report: 'PDF + in-app',
        resourceHub: '12 months',
        diap: 'add-on',
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
      period: 'one-off',
      description: 'Baseline across locations',
      highlight: false,
      perSite: '$633/site',
      features: {
        assessment: 'Pulse Check (all relevant modules)',
        sites: 'Up to 3',
        users: '3',
        report: 'PDF',
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
        sites: 'Up to 3',
        users: '3',
        report: 'PDF + in-app',
        resourceHub: '12 months',
        diap: 'add-on',
        comparison: '2 included',
        training: '1 free course',
        support: '1\u00d7 60-min + 3 calls/year'
      }
    },
    {
      name: 'Enterprise',
      price: '$6k\u2013$15k',
      period: 'custom',
      description: 'Organisations & councils',
      highlight: false,
      features: {
        assessment: 'Deep Dive (all relevant modules)',
        sites: 'Unlimited',
        users: 'Unlimited',
        report: 'PDF + in-app',
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
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table - Desktop */}
        <div className="pricing-comparison" style={{ backgroundColor: colors.white, border: `2px solid ${colors.ivoryDark}` }}>
          <div className="pricing-comparison-header" style={{ backgroundColor: colors.amethyst }}>
            <h2 style={{ color: colors.white }}>Feature Comparison</h2>
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
              { path: 'Committed \u2192 Multi-Site Deep', credit: '$1,500' },
              { path: 'Multi-Site Pulse \u2192 Deep', credit: '$1,900' },
              { path: 'Multi-Site Deep \u2192 Enterprise', credit: '$3,800' }
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
