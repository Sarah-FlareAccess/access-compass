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
            <Link to="/disclaimer" className="btn btn-nav" onClick={closeMobileMenu}>Get started free</Link>
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
        <div className="hero-directional-line" aria-hidden="true"></div>

        <div className="container hero-layout">
          <div className="hero-content">
            <h1>Welcome more guests. Reach higher standards. Improve every day.</h1>
            <p className="hero-subheading">
              Australia's guided accessibility platform for businesses, venues, councils and event organisers. Walk through a structured self-assessment, build a prioritised action plan and get the tools to deliver it.
            </p>

            <Link to="/disclaimer" className="btn btn-primary btn-large hero-cta">
              Start your free accessibility check
            </Link>

            <p className="hero-trust">
              Built on Australian Standards, the Disability Discrimination Act and universal design principles by <strong>Flare Access</strong>, accessibility and inclusion consultants.
            </p>
          </div>
        </div>
      </section>

      {/* Problem framing */}
      <section className="problem-section">
        <div className="container">
          <p className="problem-statement">
            Most businesses want to be accessible. The challenge is knowing where to start, what to prioritise and how to make real progress with confidence. Access Compass gives your team the structure, guidance and tools to do it yourselves.
          </p>
        </div>
      </section>

      {/* What You'll Achieve - Outcomes focused */}
      <section className="benefits-section">
        <div className="container">
          <h2>What you'll achieve</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <span className="benefit-icon">🧭</span>
              <h3>Know exactly where you stand</h3>
              <p>Walk your full visitor journey, from website to checkout. Identify what works, where the gaps are, what to fix first.</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">📋</span>
              <h3>A plan your team can own</h3>
              <p>Every finding becomes a prioritised action with guidance, cost estimates and standards references. Allocated across your team, tracked on a shared dashboard.</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">📸</span>
              <h3>Evidence that drives action</h3>
              <p>Photos, documents and quotes captured alongside each finding. Ready when you brief leadership, apply for a grant or prepare for audit.</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">📈</span>
              <h3>Visible progress, every quarter</h3>
              <p>Re-assess to measure improvement and compare side by side. Show your team, board or council exactly what changed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - Two columns, continuous 1-6 */}
      <section className="how-section">
        <div className="container">
          <h2>How it works</h2>

          <div className="how-streams">
            <div className="how-stream">
              <h3 className="stream-label">Assess and plan</h3>
              <div className="steps-list">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>Tell us about your business</h3>
                    <p>Hotel, gym, retail store, tourist attraction, event venue, clinic? Answer a few questions and we recommend the modules most relevant to your customer journey.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>Choose your depth</h3>
                    <p>Take a Pulse Check for a quick baseline, or a Deep Dive for comprehensive coverage. Start light and go deeper when you are ready.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>Walk through the assessment</h3>
                    <p>Answer questions about your venue, services and operations at your own pace. Not sure about something? Flag it and we will tell you how to check. Upload photos as evidence along the way.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="how-stream">
              <h3 className="stream-label">Act and improve</h3>
              <div className="steps-list">
                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h3>Get your report and action plan</h3>
                    <p>A prioritised report shows what to fix now, plan next or consider later. Your action plan structures the work, assigns owners and sets timeframes so nothing falls through the cracks.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">5</div>
                  <div className="step-content">
                    <h3>Use the Resource Hub to make changes</h3>
                    <p>Every recommendation links to practical support: how-to guides, supplier options, cost estimates, worked examples and Australian standards references. This is what turns a report into results.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">6</div>
                  <div className="step-content">
                    <h3>Track progress and re-assess</h3>
                    <p>Mark actions complete, track your team's progress on a shared dashboard and re-assess to measure real improvement. Export a polished summary for stakeholders, funding bodies or your board.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform highlights - outcome-led descriptions */}
      <section className="platform-section">
        <div className="container">
          <h2>More than a checklist</h2>
          <p className="platform-intro">Access Compass is a connected platform that guides you from assessment through to action and improvement. Here is what that looks like.</p>
          <div className="platform-grid">
            <div className="platform-item">
              <strong>50+ guided modules</strong>
              <span>From car park to checkout, website to staff training. Every touchpoint your visitors experience.</span>
            </div>
            <div className="platform-item">
              <strong>1,000+ expert questions</strong>
              <span>Grounded in Australian Standards, the DDA and universal design. Each one explains context and how to check.</span>
            </div>
            <div className="platform-item">
              <strong>Resource Hub</strong>
              <span>How-to guides, supplier options, cost estimates and worked examples linked to every recommendation.</span>
            </div>
            <div className="platform-item">
              <strong>Action planning workspace</strong>
              <span>Your DIAP builds as you assess. Allocate, set deadlines, track, export for stakeholders or grants.</span>
            </div>
            <div className="platform-item">
              <strong>Evidence library</strong>
              <span>Photos, quotes and documents linked to specific actions. Timestamped and ready for any reviewer.</span>
            </div>
            <div className="platform-item">
              <strong>Team dashboard</strong>
              <span>Assign modules to front-of-house, facilities, marketing or others. Track activity in one place.</span>
            </div>
            <div className="platform-item">
              <strong>Progress tracking</strong>
              <span>Re-assess quarterly or annually. Compare results side by side and show measurable progress.</span>
            </div>
            <div className="platform-item">
              <strong>Authority portal</strong>
              <span>Councils and tourism bodies: enrol local businesses, track participation and report on regional progress.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="audience-section">
        <div className="container">
          <h2>Who uses Access Compass</h2>

          <div className="persona-grid">
            <div className="persona-card">
              <h3>Hospitality and accommodation</h3>
              <p>Hotels, restaurants, cafes, bars and tour operators. Assess your booking flow, service, dining and accommodation so every visitor comes back.</p>
            </div>
            <div className="persona-card">
              <h3>Attractions and recreation</h3>
              <p>Museums, galleries, gyms, pools, sporting venues and community centres. Cover your full visitor journey across outdoor spaces, exhibits, amenities and wayfinding.</p>
            </div>
            <div className="persona-card">
              <h3>Major venues and precincts</h3>
              <p>Convention centres, observation decks, mixed-use precincts and multi-tenant complexes. Map accessibility across complex visitor flows, multiple operators and major event spaces.</p>
            </div>
            <div className="persona-card">
              <h3>Events and festivals</h3>
              <p>Festivals, markets, sporting events, comedy and arts events, expos and corporate functions. Demonstrate accessibility planning year on year.</p>
            </div>
            <div className="persona-card">
              <h3>Retail, health and education</h3>
              <p>Shops, clinics, pharmacies, training providers and professional offices. Make your space, staff and systems accessible to every customer.</p>
            </div>
            <div className="persona-card persona-card-highlight">
              <h3>Councils and government</h3>
              <p>Create accessibility programs for your region. Enrol local businesses, track participation across your LGA and report to stakeholders.</p>
            </div>
            <div className="persona-card persona-card-highlight">
              <h3>Industry bodies and associations</h3>
              <p>Tourism boards, hospitality associations, chambers of commerce and franchise networks. Offer programs to your members and benchmark your sector.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey reinforcement */}
      <section className="journey-section">
        <div className="container">
          <p className="value-statement">
            <strong>Accessibility is not a one-off project. It is how you operate.</strong>
            {' '}Access Compass helps you build accessibility into your business the same way you manage safety, hygiene and service quality: with clear standards, practical tools, team accountability and visible progress.
          </p>

          <div className="features-cta">
            <Link to="/disclaimer" className="btn btn-primary btn-large">
              Start your free accessibility check
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
            &copy; {new Date().getFullYear()} Flare Access. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
