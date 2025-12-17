import { Link } from 'react-router-dom';
import '../styles/landing.css';

export default function Landing() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Clear, practical accessibility priorities for your business</h1>
          <p className="hero-subheading">
            Plain English. No expertise required. Built for the visitor economy.
          </p>

          {/* 3-Step Visual */}
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-icon">✓</div>
              <div className="step-title">Select areas</div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-icon">💬</div>
              <div className="step-title">Answer questions</div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-icon">📄</div>
              <div className="step-title">Get your action plan</div>
            </div>
          </div>

          <div className="time-estimate">
            <span>⏱️ 10–15 minutes</span>
          </div>

          {/* Trust Cues */}
          <div className="trust-cues">
            <div className="trust-cue">
              <span className="checkmark">✓</span>
              <span>Not a compliance certificate</span>
            </div>
            <div className="trust-cue">
              <span className="checkmark">✓</span>
              <span>Designed for Australian businesses</span>
            </div>
          </div>

          {/* CTA Button */}
          <Link to="/start" className="btn btn-primary btn-large">
            Start your free accessibility check
          </Link>
        </div>
      </section>
    </div>
  );
}
