import { Link } from 'react-router-dom';
import '../styles/landing.css';

export default function Landing() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        {/* Directional background elements - decorative only */}
        <div className="hero-compass-bg" aria-hidden="true">
          <div className="compass-marks"></div>
          <div className="compass-needle"></div>
          <div className="guide-arc"></div>
        </div>
        {/* Visible directional line: compass → CTA → down */}
        <div className="hero-directional-line" aria-hidden="true"></div>

        <div className="container hero-layout">
          <div className="hero-content">
            <h1>Make your business more accessible — step by step</h1>
            <p className="hero-subheading">
              Access Compass cuts through the complexity — giving you a clear, prioritised action plan tailored to your business, your budget, and your capacity. No expertise required. Just practical next steps you can actually take.
            </p>

            {/* CTA Button */}
            <Link to="/disclaimer" className="btn btn-primary btn-large hero-cta">
              Start your accessibility check
            </Link>

            {/* Trust signal */}
            <p className="hero-trust">
              Built by access consultants and universal design experts who understand your business needs.
            </p>
          </div>
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
              <h3>Built for busy people</h3>
              <p>Start now, save your progress, and come back anytime. Work at your own pace.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="audience-section">
        <div className="container">
          <h2>Who it's for</h2>
          <p className="audience-intro">
            Access Compass is designed for customer-facing businesses ready to welcome more people.
          </p>
          <p className="audience-stage">
            Whether you're just beginning your accessibility journey or looking to advance your progress, we'll meet you where you are.
          </p>
          <div className="audience-grid">
            <div className="audience-item">Hospitality</div>
            <div className="audience-item">Retail</div>
            <div className="audience-item">Accommodation</div>
            <div className="audience-item">Tourism</div>
            <div className="audience-item">Events</div>
            <div className="audience-item">Recreation</div>
            <div className="audience-item">Health & Wellness</div>
            <div className="audience-item">Professional Services</div>
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
        </div>
      </section>

      {/* Journey reinforcement - after process explanation */}
      <section className="journey-section">
        <div className="container">
          <p className="value-statement">
            <strong>Accessibility is a journey, not a one-off task.</strong>
            {' '}Access Compass supports progress over perfection, helping you make meaningful improvements one step at a time, within your capacity.
          </p>

          {/* Final CTA */}
          <div className="features-cta">
            <Link to="/disclaimer" className="btn btn-primary btn-large">
              Start your accessibility check
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
