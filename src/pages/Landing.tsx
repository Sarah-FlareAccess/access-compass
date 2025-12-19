import { Link } from 'react-router-dom';
import '../styles/landing.css';

export default function Landing() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-layout">
          {/* Compass visual element */}
          <div className="hero-compass" aria-hidden="true">
            <div className="compass-ring">
              <div className="compass-needle"></div>
            </div>
          </div>

          <div className="hero-content">
            <h1>Understand accessibility in your business</h1>
            <p className="hero-subheading">
              Clear, practical priorities so you can take confident action.
            </p>

            {/* Quick info badges */}
            <div className="hero-badges">
              <span className="hero-badge">10-15 min check</span>
              <span className="hero-badge">Instant priorities</span>
              <span className="hero-badge">Free to start</span>
            </div>

            {/* CTA Button */}
            <Link to="/disclaimer" className="btn btn-primary btn-large">
              Start your accessibility check
            </Link>

            {/* Who it's for */}
            <p className="hero-audience">
              Built for cafes, retail, tourism, and service businesses across Australia.
            </p>
          </div>
        </div>
      </section>

      {/* Value proposition bridge */}
      <section className="value-bridge">
        <div className="container">
          <p className="value-statement">
            <strong>Accessibility is a journey, not a one-off task.</strong>
            {' '}Access Compass helps you make meaningful progress—step by step, within your capacity.
          </p>
        </div>
      </section>

      {/* What You Get - 4 Cards */}
      <section className="benefits-section">
        <div className="container">
          <h2>What you'll get</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <span className="benefit-icon">🎯</span>
              <h3>Personalised priorities</h3>
              <p>Recommendations tailored to your business type, not generic checklists.</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">📋</span>
              <h3>Actionable report</h3>
              <p>A downloadable summary you can share with your team or stakeholders.</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">💡</span>
              <h3>Practical guidance</h3>
              <p>Clear explanations of what to do and why it matters for your customers.</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">🚀</span>
              <h3>Quick to complete</h3>
              <p>Most businesses finish in 15 minutes. Start now, come back anytime.</p>
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
                <p>Answer simple questions about your customer experience, physical space, and digital presence.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Get your priorities</h3>
                <p>We analyse your responses and show you what matters most for your specific situation.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Take action with confidence</h3>
                <p>Download your report, share it with stakeholders, and start making improvements that count.</p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="features-cta">
            <Link to="/disclaimer" className="btn btn-primary btn-large">
              Start your accessibility check
            </Link>
            <p className="cta-note">Takes about 15 minutes. No signup required.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
