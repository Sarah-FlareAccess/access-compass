import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/disclaimer.css';

export default function Disclaimer() {
  const navigate = useNavigate();
  const [understood, setUnderstood] = useState(false);

  const handleContinue = () => {
    if (understood) {
      // Store that user has accepted disclaimer
      sessionStorage.setItem('disclaimer_accepted', 'true');
      navigate('/start');
    }
  };

  return (
    <div className="disclaimer-page">
      <div className="container">
        <div className="disclaimer-card">
          <h1>Before you begin</h1>
          <p className="disclaimer-intro">
            Access Compass by Flare Access is:
          </p>

          <ul className="disclaimer-list is-list">
            <li>A guided self-review and action planning tool</li>
            <li>Designed to help you identify and prioritise access improvements</li>
            <li>A starting point for building more accessible experiences</li>
          </ul>

          <p className="disclaimer-intro not-intro">
            It is not:
          </p>

          <ul className="disclaimer-list not-list">
            <li>A compliance audit</li>
            <li>A certification or accreditation</li>
            <li>Legal verification or professional sign-off</li>
            <li>A substitute for professional accessibility advice</li>
          </ul>

          <div className="professional-note">
            <p>
              For complex issues or compliance verification, we recommend engaging a qualified access consultant or relevant professional.
            </p>
          </div>

          <div className="understanding-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={understood}
                onChange={(e) => setUnderstood(e.target.checked)}
              />
              <span className="checkbox-text">
                I understand that Access Compass is a self-review tool designed to help me plan accessibility improvements. It does not provide compliance certification or replace professional accessibility advice.
              </span>
            </label>
          </div>

          <div className="disclaimer-actions">
            <Link to="/" className="btn btn-secondary">
              ← Back
            </Link>
            <button
              className="btn btn-primary"
              onClick={handleContinue}
              disabled={!understood}
            >
              I understand, continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
