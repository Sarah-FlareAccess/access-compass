import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import '../styles/landing.css';

export default function Landing() {
  usePageTitle('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="landing-page">
      {/* Header Navigation */}
      <header className="landing-header">
        <div className="container header-container">
          <div className="logo">
            <img src="/images/access-compass-logo.png" alt="Access Compass" className="logo-img" />
          </div>

          {/* Mobile hamburger button */}
          <button
            className="landing-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="landing-nav-menu"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={`landing-hamburger ${mobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          <nav className={`header-nav ${mobileMenuOpen ? 'mobile-open' : ''}`} id="landing-nav-menu">
            <Link to="/pricing" className="nav-link" onClick={closeMobileMenu}>Pricing</Link>
            <a href="mailto:hello@accesscompass.com.au" className="nav-link" onClick={closeMobileMenu}>Contact</a>
            <Link to="/login" className="nav-link" onClick={closeMobileMenu}>Login</Link>
            <Link to="/disclaimer" className="btn btn-nav" onClick={closeMobileMenu}>Get started</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        {/* Directional background elements - decorative only */}
        <div className="hero-compass-bg" aria-hidden="true">
          <div className="compass-marks"></div>
          <div className="compass-needle"></div>
          <div className="guide-arc"></div>
        </div>
        {/* Visible directional line: compass -> CTA -> down */}
        <div className="hero-directional-line" aria-hidden="true"></div>

        <div className="container hero-layout">
          <div className="hero-content">
            <h1>Understand, plan and act on accessibility</h1>
            <p className="hero-subheading">
              Access Compass is Australia's guided self-assessment platform for accessibility and inclusion. Covering 37 modules and 800+ questions across the full visitor journey, it gives businesses, venues, and councils a clear, prioritised path from intent to action.
            </p>

            {/* CTA Button */}
            <Link to="/disclaimer" className="btn btn-primary btn-large hero-cta">
              Start your accessibility check
            </Link>

            {/* Trust signal */}
            <p className="hero-trust">
              Built on Australian Standards, the Disability Discrimination Act, and universal design principles by <strong>Flare Access</strong>, accessibility and inclusion consultants.
            </p>
          </div>
        </div>
      </section>

      {/* What You Get - Outcomes focused */}
      <section className="benefits-section">
        <div className="container">
          <h2>What you'll achieve</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <span className="benefit-icon">🧭</span>
              <h3>Clarity on where you stand</h3>
              <p>A structured assessment across your full customer journey identifies your strengths, gaps, and priorities. No compliance expertise needed.</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">📋</span>
              <h3>A plan you can act on</h3>
              <p>Every finding comes with prioritised recommendations, practical how-to guidance, and links to Australian standards. Your Disability Inclusion Action Plan (DIAP) takes shape as you go.</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">📸</span>
              <h3>Evidence that stands up</h3>
              <p>Capture photos, documents, and notes alongside each question. Your report and evidence library are ready for leadership, funding applications, auditors, and council requirements.</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">📈</span>
              <h3>Measurable progress over time</h3>
              <p>Re-assess to track improvement. Compare runs side by side, assign actions across your team, and build a culture where accessibility is everyone's responsibility.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section - Multiple personas */}
      <section className="audience-section">
        <div className="container">
          <h2>Built for every stage and scale</h2>

          <div className="persona-grid">
            <div className="persona-card">
              <h3>Individual businesses</h3>
              <p>Cafes, shops, venues, clinics, gyms. Start with a free check on 3 modules, or go deeper with a full assessment and action plan. No consultants needed to begin.</p>
            </div>
            <div className="persona-card">
              <h3>Multi-site operators</h3>
              <p>Franchise networks, shopping centres, hotel groups. Assess multiple sites, compare performance, and standardise your approach to accessibility across locations.</p>
            </div>
            <div className="persona-card">
              <h3>Event organisers</h3>
              <p>Festivals, markets, conferences, sporting events. Meet permit requirements, assess temporary venues, and demonstrate accessibility planning to councils and sponsors.</p>
            </div>
            <div className="persona-card persona-card-highlight">
              <h3>Councils and authorities</h3>
              <p>Provision assessments to businesses across your LGA. Track compliance for event permits, tourism grants, and DDA programs. See aggregate data across your region without accessing individual answers.</p>
            </div>
          </div>

          <div className="industry-section">
            <p className="audience-stage">Industries using Access Compass</p>
            <div className="audience-grid" role="list" aria-label="Industries served">
              <span className="audience-item" role="listitem">Tourism and Attractions</span>
              <span className="audience-item" role="listitem">Hospitality</span>
              <span className="audience-item" role="listitem">Events and Venues</span>
              <span className="audience-item" role="listitem">Retail</span>
              <span className="audience-item" role="listitem">Health and Wellness</span>
              <span className="audience-item" role="listitem">Local Government</span>
              <span className="audience-item" role="listitem">Education and Training</span>
              <span className="audience-item" role="listitem">Leisure and Recreation</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-section">
        <div className="container">
          <h2>How it works</h2>

          <div className="steps-list">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Tell us about your business</h3>
                <p>Answer a few questions about your industry, venue type, and what matters most. We'll recommend the modules most relevant to your situation.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Choose your depth</h3>
                <p>Take a Pulse Check for a high-level baseline, or a Deep Dive for comprehensive coverage. Both produce tailored recommendations. Start with one and go deeper later.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Work through the assessment</h3>
                <p>Answer questions about your current setup at your own pace. Flag anything you're unsure about and we'll tell you how to check. Upload photos and evidence as you go.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Get your report and action plan</h3>
                <p>Receive a prioritised report showing what to act on now, plan next, or consider later. Your Disability Inclusion Action Plan (DIAP) is structured and ready to share.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3>Use the Resource Hub to take action</h3>
                <p>Each recommendation links to practical guidance: how-to guides, checklists, worked examples, supplier options, and Australian standards references.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">6</div>
              <div className="step-content">
                <h3>Track, assign, and re-assess</h3>
                <p>Assign actions to team members, track completion on your dashboard, and re-assess to measure improvement over time. Export your progress for stakeholders at any point.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform highlights */}
      <section className="platform-section">
        <div className="container">
          <h2>What's inside</h2>
          <div className="platform-grid">
            <div className="platform-item">
              <strong>37 modules</strong>
              <span>Covering before arrival through to organisational commitment and events</span>
            </div>
            <div className="platform-item">
              <strong>800+ questions</strong>
              <span>Spanning mandatory requirements, best practice, and universal design</span>
            </div>
            <div className="platform-item">
              <strong>Resource Hub</strong>
              <span>How-to guides, checklists, and real examples for every recommendation</span>
            </div>
            <div className="platform-item">
              <strong>DIAP workspace</strong>
              <span>Build your Disability Inclusion Action Plan as you assess</span>
            </div>
            <div className="platform-item">
              <strong>Evidence library</strong>
              <span>Upload photos and documents alongside each question</span>
            </div>
            <div className="platform-item">
              <strong>Team collaboration</strong>
              <span>Assign modules, track activity, and share progress with your team</span>
            </div>
            <div className="platform-item">
              <strong>Re-assessment</strong>
              <span>Run again to compare results side by side and track improvement</span>
            </div>
            <div className="platform-item">
              <strong>Authority portal</strong>
              <span>For councils: provision programs, enrol businesses, view aggregate data</span>
            </div>
          </div>
        </div>
      </section>

      {/* Journey reinforcement */}
      <section className="journey-section">
        <div className="container">
          <p className="value-statement">
            <strong>Accessibility is a journey, not a destination.</strong>
            {' '}Access Compass supports progress over perfection, helping you make meaningful improvements one step at a time, within your capacity and budget.
          </p>

          {/* Final CTA */}
          <div className="features-cta">
            <Link to="/disclaimer" className="btn btn-primary btn-large">
              Start your accessibility check
            </Link>
            <p className="cta-subtext">Free for up to 3 modules. No credit card required.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <p className="footer-brand">
            Access Compass is a <a href="https://flareaccess.com.au" target="_blank" rel="noopener noreferrer">Flare Access</a> product designed to help organisations understand, prioritise and take action on accessibility and inclusion.
          </p>
          <p className="footer-links">
            <Link to="/accessibility">Accessibility Statement</Link>
            <Link to="/pricing">Pricing</Link>
          </p>
          <p className="footer-copyright">
            © {new Date().getFullYear()} Flare Access. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
