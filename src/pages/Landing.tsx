import { Link } from 'react-router-dom';
import '../styles/landing.css';

export default function Landing() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Understand accessibility in your business</h1>
          <p className="hero-subheading">
            Clear, practical accessibility priorities for your business so you can take confident action.
          </p>

          <div className="hero-message">
            <p className="journey-text">
              Accessibility is a journey, not a one-off task
            </p>
            <p className="support-text">
              Access Compass supports gradual, meaningful improvement—helping you reduce barriers over time, within your capacity.
            </p>
          </div>

          {/* CTA Button */}
          <Link to="/start" className="btn btn-primary btn-large">
            Start your free accessibility check
          </Link>

          <p className="action-text">
            Take your next steps with confidence
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>How Access Compass helps</h2>
          <p className="features-intro">
            Move from insight to action with practical tools and support designed for real-world capacity.
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <span>1</span>
              </div>
              <h3>Guided Self-Review</h3>
              <p>
                Understand where accessibility matters across your business experience.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <span>2</span>
              </div>
              <h3>Clear priorities, not overwhelm</h3>
              <p>
                Know what will make the biggest difference first.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <span>3</span>
              </div>
              <h3>Practical reports and plans</h3>
              <p>
                Turn your insights into documents and plans you can actually use.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <span>4</span>
              </div>
              <h3>Next step support and resources</h3>
              <p>
                Access curated guides, examples, tools and expert support to help you implement improvements, brief staff or suppliers and build confidence across your organisation and customers.
              </p>
            </div>
          </div>

          {/* Secondary CTA */}
          <div className="features-cta">
            <Link to="/start" className="btn btn-primary btn-large">
              Get started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
