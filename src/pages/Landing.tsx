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
              Access Compass is Australia's guided accessibility platform for tourism, hospitality, events, and customer-facing businesses. It walks your team through a structured self-assessment, builds a prioritised action plan, and gives you the tools and resources to actually make it happen.
            </p>

            <Link to="/disclaimer" className="btn btn-primary btn-large hero-cta">
              Start your free accessibility check
            </Link>

            <p className="hero-trust">
              Built on Australian Standards, the Disability Discrimination Act, and universal design principles by <strong>Flare Access</strong>, accessibility and inclusion consultants.
            </p>
          </div>
        </div>
      </section>

      {/* Problem framing */}
      <section className="problem-section">
        <div className="container">
          <p className="problem-statement">
            1 in 5 Australians have a disability. They travel, dine out, attend events, and shop. When your venue, hotel, or attraction is not accessible, you are turning away guests and the people who travel with them. Access Compass helps you fix that, step by step.
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
              <p>Walk through your entire guest journey, from your website and car park to the dining room and checkout. Identify what is working, where the gaps are, and what to prioritise first. A hotel in regional Victoria used their assessment to discover 12 quick wins they could fix in a week.</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">📋</span>
              <h3>A plan your team can own</h3>
              <p>Every finding generates prioritised actions with practical guidance, cost estimates, and Australian standards references. Your Disability Inclusion Action Plan builds itself as you assess, with actions allocated across your team and tracked on a shared dashboard.</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">📸</span>
              <h3>Evidence that drives action</h3>
              <p>Capture photos, upload documents, and build an evidence library alongside each finding. When it is time to brief leadership, apply for a grant, prepare for an audit, or make a business case for renovations, your evidence is organised, timestamped, and ready.</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">📈</span>
              <h3>Visible progress, every quarter</h3>
              <p>Re-assess to measure improvement and compare results side by side. Show your team, board, or council exactly what has changed. A cafe owner ran two assessments three months apart and could show a 40% improvement in their physical access score.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - Two streams */}
      <section className="how-section">
        <div className="container">
          <h2>How it works</h2>

          <div className="how-streams">
            {/* Stream 1: Assess and Plan */}
            <div className="how-stream">
              <h3 className="stream-label">Assess and plan</h3>
              <div className="steps-list">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>Tell us about your business</h3>
                    <p>Are you a hotel, a tourist attraction, a restaurant, an event venue? Answer a few questions and we recommend the modules most relevant to your guest journey.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>Choose your depth</h3>
                    <p>Take a Pulse Check for a quick baseline (great before a busy season), or a Deep Dive for comprehensive coverage. Start light and go deeper when you are ready.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>Walk through the assessment</h3>
                    <p>Answer questions about your venue, services, and operations at your own pace. Not sure about something? Flag it and we will tell you exactly how to check. Upload photos as evidence along the way.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stream 2: Act and Improve */}
            <div className="how-stream">
              <h3 className="stream-label">Act and improve</h3>
              <div className="steps-list">
                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h3>Get your report and action plan</h3>
                    <p>A prioritised report shows what to fix now, plan next, or consider later. Your DIAP structures the actions, assigns owners, and sets timeframes so nothing falls through the cracks.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">5</div>
                  <div className="step-content">
                    <h3>Use the Resource Hub to make changes</h3>
                    <p>Every recommendation links to practical support: how-to guides, supplier options, cost estimates, worked examples from real venues, and Australian standards references. This is what turns a report into results.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">6</div>
                  <div className="step-content">
                    <h3>Track progress and re-assess</h3>
                    <p>Mark actions complete, track your team's progress on a shared dashboard, and run a follow-up assessment to measure real improvement. Export a polished summary for stakeholders, funding bodies, or your board.</p>
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
              <strong>35+ guided modules</strong>
              <span>From car park to checkout, website to staff training. Every touchpoint your guests experience, assessed against real standards and best practice.</span>
            </div>
            <div className="platform-item">
              <strong>850+ expert questions</strong>
              <span>Written by accessibility consultants and grounded in Australian Standards, the DDA, and universal design. Each question includes context, help, and how-to-check guidance.</span>
            </div>
            <div className="platform-item">
              <strong>Resource Hub</strong>
              <span>Do not just find gaps: fix them. Every recommendation links to practical guides, supplier options, cost estimates, and worked examples from real hospitality and tourism businesses.</span>
            </div>
            <div className="platform-item">
              <strong>DIAP workspace</strong>
              <span>Your Disability Inclusion Action Plan builds as you assess. Allocate actions to team members, set deadlines, track completion, and export a professional plan for stakeholders or grant applications.</span>
            </div>
            <div className="platform-item">
              <strong>Evidence library</strong>
              <span>Photograph barriers, upload quotes, attach documents. When a manager asks "where are we at?", your evidence is organised, timestamped, and linked to specific actions.</span>
            </div>
            <div className="platform-item">
              <strong>Team dashboard</strong>
              <span>Assign modules to the right people (front-of-house, facilities, marketing), track activity, and see who is making progress. Accessibility becomes everyone's responsibility, not just one person's job.</span>
            </div>
            <div className="platform-item">
              <strong>Progress tracking</strong>
              <span>Re-assess quarterly or annually and compare results side by side. Show measurable improvement to leadership, council, sponsors, or your own team. Celebrate wins and identify what is next.</span>
            </div>
            <div className="platform-item">
              <strong>Authority portal</strong>
              <span>For councils and tourism bodies: create accessibility programs, enrol local businesses, track completion across your region, and generate aggregate reports for stakeholders.</span>
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
              <h3>Hotels, restaurants, and cafes</h3>
              <p>Guests who cannot find accessibility information will book somewhere else. Assess your booking flow, service, dining, and accommodation, then give your team a clear plan so every guest feels welcome on the first visit and comes back.</p>
            </div>
            <div className="persona-card">
              <h3>Tourist attractions and venues</h3>
              <p>Large sites with diverse visitor needs, from families with prams to guests using wheelchairs. Cover your full visitor journey across outdoor spaces, exhibits, playgrounds, amenities, and wayfinding, and publish an accessibility statement you can stand behind.</p>
            </div>
            <div className="persona-card">
              <h3>Event organisers</h3>
              <p>Festivals, markets, conferences, and sporting events. Demonstrate accessibility planning to councils and sponsors, assess temporary venues, and build a track record across events.</p>
            </div>
            <div className="persona-card">
              <h3>Multi-site operators</h3>
              <p>Franchise networks, shopping centres, hotel groups. Assess multiple locations, compare performance across sites, and standardise your approach to accessibility at scale.</p>
            </div>
            <div className="persona-card persona-card-highlight persona-card-wide">
              <h3>Councils and tourism authorities</h3>
              <p>Create business accessibility programs for your region. Enrol local hospitality businesses, tourism operators, and event organisers. Track participation and completion across your LGA with aggregate dashboards and reporting.</p>
            </div>
          </div>

          <div className="industry-section">
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

      {/* Journey reinforcement */}
      <section className="journey-section">
        <div className="container">
          <p className="value-statement">
            <strong>Accessibility is not a one-off project. It is how you operate.</strong>
            {' '}Access Compass helps you build accessibility into your business the same way you manage safety, hygiene, and service quality: with clear standards, practical tools, team accountability, and visible progress.
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
