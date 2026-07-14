import { useId, useState } from 'react';
import { Sparkles, ChevronDown } from 'lucide-react';
import './FoundingPartnerBanner.css';

const BENEFITS = [
  {
    icon: '🔒',
    title: 'Price lock for 2 years',
    body: 'Your Founding Partner rate is locked for the first 2 years from sign-up. After that, renewals move to the current rate for your tier. Outgrow into a higher tier and the new tier is billed at current rates.',
  },
  {
    icon: '🏅',
    title: 'Founding Partner badge',
    body: 'Opt-in featured logo on accesscompass.com.au, badge for your accessibility statement and named in case studies. Visible recognition as a leader.',
  },
  {
    icon: '✨',
    title: 'First refusal on new offerings',
    body: 'When we launch new add-ons (training certifications, cohort programs, SCORM export), Founding Partners get first access.',
  },
  {
    icon: '📅',
    title: 'Annual accessibility check-in',
    body: 'A 60-minute review each year with our team. Talk through what\'s working, where you\'re stuck and where to focus next year. Included in your subscription.',
  },
] as const;

export function FoundingPartnerBanner() {
  const headingId = useId();
  const [showBenefits, setShowBenefits] = useState(false);

  return (
    <section
      className="founding-partner-banner"
      aria-labelledby={headingId}
    >
      <div className="founding-partner-banner-inner">
        <div className="founding-partner-banner-header">
          <span className="founding-partner-banner-tag" aria-hidden="true">
            <Sparkles size={14} /> LIMITED
          </span>
          <h2 id={headingId} className="founding-partner-banner-title">
            Founding Partner pricing
          </h2>
          <p className="founding-partner-banner-subtitle">
            Current rates are locked in for our first <strong>50 organisations</strong>.
            Join the cohort shaping Access Compass and lock in your rate while we grow.
          </p>
        </div>

        <button
          type="button"
          className="founding-partner-banner-toggle"
          aria-expanded={showBenefits}
          aria-controls={`${headingId}-benefits`}
          onClick={() => setShowBenefits((prev) => !prev)}
        >
          <span>{showBenefits ? 'Hide Founding Partner benefits' : 'See Founding Partner benefits'}</span>
          <ChevronDown size={16} className="founding-partner-banner-toggle-chevron" aria-hidden="true" />
        </button>

        {showBenefits && (
          <ul
            id={`${headingId}-benefits`}
            className="founding-partner-benefits"
            aria-label="Founding Partner benefits"
          >
            {BENEFITS.map((benefit) => (
              <li key={benefit.title} className="founding-partner-benefit">
                <span className="founding-partner-benefit-icon" aria-hidden="true">
                  {benefit.icon}
                </span>
                <div className="founding-partner-benefit-text">
                  <strong className="founding-partner-benefit-title">{benefit.title}</strong>
                  <span className="founding-partner-benefit-body">{benefit.body}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
