import { useId, useState } from 'react';
import { Sparkles, ChevronDown } from 'lucide-react';
import './FoundingPartnerBanner.css';

const BENEFITS = [
  {
    icon: '🔒',
    title: 'Price lock for two years',
    body: 'Your Founding Partner rate is locked for the first two years from sign-up. After that, renewals move to the current rate for your edition. Move up an edition and the new edition is billed at current rates.',
  },
  {
    icon: '🤝',
    title: 'Founding Partner Advisory Group',
    body: 'Help shape the future of accessibility governance in Australia through roadmap sessions and direct input to the product team. Founding Partners are recognised publicly as founding members of the platform.',
  },
  {
    icon: '🚀',
    title: 'Priority access to new capabilities',
    body: 'Be first to new platform capabilities, optional modules and services as they are introduced, ahead of general release.',
  },
  {
    icon: '📅',
    title: 'Annual Governance Review',
    body: 'A structured session each year with our team to assess progress and set your next priorities. Included in your subscription.',
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
            The first <strong>50 organisations</strong> can lock today's pricing for two years while the platform continues to grow.
            Future customers move onto our standard pricing as new capabilities and services are introduced.
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
