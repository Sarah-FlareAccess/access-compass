import { Link } from 'react-router-dom';
import { PageFooter } from '../components/PageFooter';
import '../styles/static-page.css';

export default function AccessibilityStatement() {
  return (
    <div className="static-page">
      <main className="static-page-content" tabIndex={-1}>
        <Link to="/dashboard" className="static-page-back">&larr; Back to Dashboard</Link>
        <h1>Accessibility Statement</h1>
        <p className="statement-intro">
          Access Compass is built by Flare Access. As an accessibility platform, we hold ourselves
          to the same standards we help our customers achieve.
        </p>

        <section>
          <h2>Our commitment</h2>
          <p>
            We are committed to ensuring Access Compass is accessible to the widest possible audience,
            regardless of ability, disability, or technology. We actively work to meet or exceed
            Web Content Accessibility Guidelines (WCAG) 2.2 Level AA conformance across all areas
            of our platform.
          </p>
        </section>

        <section>
          <h2>Standards we follow</h2>
          <ul>
            <li>WCAG 2.2 Level AA as our baseline target</li>
            <li>WAI-ARIA authoring practices for interactive components</li>
            <li>Australian Disability Discrimination Act 1992 (DDA)</li>
            <li>Inclusive design principles throughout our development process</li>
          </ul>
        </section>

        <section>
          <h2>What we have done</h2>
          <ul>
            <li>Keyboard navigation support across all interactive elements</li>
            <li>Visible focus indicators for keyboard users</li>
            <li>Semantic HTML with appropriate ARIA attributes</li>
            <li>Colour contrast meeting WCAG AA ratios (minimum 4.5:1 for text, 3:1 for UI components)</li>
            <li>Skip-to-content link for screen reader users</li>
            <li>Form inputs with visible labels, clear error messages, and descriptive hints</li>
            <li>Responsive design that works across devices and screen sizes</li>
            <li>No content that relies solely on colour to convey meaning</li>
            <li>Alt text on all meaningful images</li>
            <li>Logical heading hierarchy on all pages</li>
          </ul>
        </section>

        <section>
          <h2>Known limitations</h2>
          <p>
            We are continually improving. Some areas we are actively working on:
          </p>
          <ul>
            <li>Converting remaining pixel-based font sizes to relative units (rem) for better text scaling</li>
            <li>Improving reflow behaviour at very narrow viewport widths (320px)</li>
            <li>Adding captions to training videos (placeholder videos are currently in use)</li>
            <li>Screen reader testing across additional browser and assistive technology combinations</li>
          </ul>
        </section>

        <section>
          <h2>Feedback and contact</h2>
          <p>
            We welcome your feedback on the accessibility of Access Compass. If you encounter
            any barriers or have suggestions for improvement, please contact us:
          </p>
          <ul className="contact-list">
            <li>
              <strong>Email:</strong>{' '}
              <a href="mailto:accessibility@flareaccess.com.au">accessibility@flareaccess.com.au</a>
            </li>
            <li>
              <strong>General support:</strong>{' '}
              <a href="mailto:support@accesscompass.com.au">support@accesscompass.com.au</a>
            </li>
          </ul>
          <p>
            We aim to respond to accessibility feedback within 2 business days and to resolve
            reported issues as quickly as possible.
          </p>
        </section>

        <section>
          <h2>Complaints</h2>
          <p>
            If you are not satisfied with our response, you can lodge a complaint with the
            Australian Human Rights Commission (AHRC) under the Disability Discrimination Act 1992.
          </p>
          <ul className="contact-list">
            <li>
              <strong>Website:</strong>{' '}
              <a href="https://humanrights.gov.au/complaints" target="_blank" rel="noopener noreferrer">
                humanrights.gov.au/complaints
              </a>
            </li>
            <li>
              <strong>Phone:</strong> 1300 656 419
            </li>
            <li>
              <strong>National Relay Service:</strong> 133 677
            </li>
          </ul>
        </section>

        <section>
          <h2>Review</h2>
          <p>
            This statement was last reviewed on 29 March 2026. We review and update this statement
            at least every 12 months, or whenever significant changes are made to the platform.
          </p>
        </section>
      </main>
      <PageFooter />
    </div>
  );
}
