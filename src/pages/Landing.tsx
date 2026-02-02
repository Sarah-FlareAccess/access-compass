import { Link } from 'react-router-dom';
import '../styles/landing.css';

export default function Landing() {
  return (
    <div className="landing-page">
      {/* Header Navigation */}
      <header className="landing-header">
        <div className="container header-container">
          <div className="logo">
            <span className="logo-icon">🧭</span>
            <span className="logo-text">Access Compass</span>
          </div>
          <nav className="header-nav">
            <a href="mailto:hello@accesscompass.com.au" className="nav-link">Contact</a>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/disclaimer" className="btn btn-nav">Get started</Link>
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
        {/* Visible directional line: compass → CTA → down */}
        <div className="hero-directional-line" aria-hidden="true"></div>

        <div className="container hero-layout">
          <div className="hero-content">
            <h1>Make your business more accessible, step by step</h1>
            <p className="hero-subheading">
              Access Compass cuts through the complexity, giving you a clear, prioritised action plan tailored to your business, your budget, and your capacity. No expertise required. Just practical next steps you can actually take.
            </p>

            {/* CTA Button */}
            <Link to="/disclaimer" className="btn btn-primary btn-large hero-cta">
              Start your accessibility check
            </Link>

            {/* Trust signal */}
            <p className="hero-trust">
              Built by <strong>Flare Access</strong>. Accessibility and inclusion consultants helping businesses like yours turn intent into confident, practical action.
            </p>
          </div>
        </div>
      </section>

      {/* What You Get - 4 Cards - Outcomes focused */}
      <section className="benefits-section">
        <div className="container">
          <h2>What you'll get</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <span className="benefit-icon">🧭</span>
              <h3>Clarity on where to start</h3>
              <p>No more guessing or getting overwhelmed by compliance documents. We guide you through your customer journey, so you understand what matters at each touchpoint. No more uncertainty, just clear priorities for your situation.</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">💪</span>
              <h3>Confidence to take action</h3>
              <p>Every recommendation is backed by Australian standards, universal design and best practice with real-world examples — so you can move forward knowing you're on the right track.</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">📋</span>
              <h3>Evidence of action</h3>
              <p>Turn good intentions into demonstrable action. Your report documents where you are, what you're doing, and your opportunities ahead — ready for leadership, funding applications, and budget discussions.</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">📈</span>
              <h3>Visible progress, together</h3>
              <p>Give your whole team access to a shared plan. Track what's done, see what's next, and build a culture where accessibility is everyone's responsibility.</p>
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
          <div className="audience-grid" role="list" aria-label="Business types we serve">
            <span className="audience-item" role="listitem">Attractions</span>
            <span className="audience-item" role="listitem">Leisure & Recreation</span>
            <span className="audience-item" role="listitem">Hospitality</span>
            <span className="audience-item" role="listitem">Events & Venues</span>
            <span className="audience-item" role="listitem">Retail</span>
            <span className="audience-item" role="listitem">Local Government</span>
            <span className="audience-item" role="listitem">Health & Wellness</span>
            <span className="audience-item" role="listitem">Education & Training</span>
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
                <h3>Select what's relevant to you</h3>
                <p>Choose the accessibility areas that matter most — from physical access and signage to customer service and online bookings. Focus on one area or tackle several at once.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Choose your depth</h3>
                <p>Go with a quick Pulse Check for a snapshot of where you stand, or take a Deep Dive for a comprehensive review. Either way, you'll get clear, tailored recommendations.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Answer at your own pace</h3>
                <p>Work through questions about your current setup — answer what you know, and flag anything you're unsure about. We'll provide guidance to help you check those items later.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Get a prioritised action plan</h3>
                <p>Receive recommendations organised by impact — what to act on now, plan next, or consider later. Your plan is tailored to your situation, so you know exactly where to start.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3>Access the Resource Centre</h3>
                <p>Every recommendation links to practical support — how-to guides, checklists, real examples, and Australian standards references. Everything you need to move from plan to action.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">6</div>
              <div className="step-content">
                <h3>Track progress and share your plan</h3>
                <p>Assign owners, set timeframes, and mark items complete as you go. Export a polished summary to share with your team, leadership, or include in funding applications.</p>
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

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <p className="footer-brand">
            Access Compass is a <a href="https://flareaccess.com.au" target="_blank" rel="noopener noreferrer">Flare Access</a> product designed to help organisations understand, prioritise and take action on accessibility.
          </p>
          <p className="footer-copyright">
            © {new Date().getFullYear()} Flare Access. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
