import { useId, useState } from 'react';
import { Sparkles } from 'lucide-react';
import './FoundingPartnerBanner.css';

const BENEFITS = [
  {
    icon: '🔒',
    title: 'Price lock for life of subscription',
    body: 'Your Founding Partner rate stays your renewal rate forever, on the tier you signed up for. Outgrow into a higher tier and the new tier moves to current rates.',
  },
  {
    icon: '🎙️',
    title: 'Roadmap voice',
    body: 'Quarterly Founding Partner call. Hear what\'s coming, tell us what to build next, and shape new modules before they ship.',
  },
  {
    icon: '👋',
    title: 'Lead consultant access',
    body: 'Support comes from our lead access consultant, not a ticket queue. Direct line for questions, escalations and onboarding help.',
  },
  {
    icon: '🏅',
    title: 'Founding Partner badge',
    body: 'Opt-in featured logo on accesscompass.com.au, badge for your accessibility statement, and named in case studies. Visible recognition as a leader.',
  },
  {
    icon: '✨',
    title: 'First refusal on new offerings',
    body: 'When we launch new add-ons (training certifications, cohort programs, SCORM export), Founding Partners get first access at locked-in rates.',
  },
  {
    icon: '📅',
    title: 'Annual accessibility check-in',
    body: 'A 60-minute review each year with our team. Talk through what\'s working, where you\'re stuck, and where to focus next year. Included in your subscription.',
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
          {showBenefits ? 'Hide Founding Partner benefits' : 'See Founding Partner benefits'}
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
