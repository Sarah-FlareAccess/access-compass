import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { initializeSession, updateBusinessSnapshot, getSession, getDiscoveryData } from '../utils/session';
import type { BusinessSnapshot, BusinessType, UserRole, OrganisationSize } from '../types';
import { usePageTitle } from '../hooks/usePageTitle';
import '../styles/form-page.css';

interface BusinessTypeOption {
  value: BusinessType;
  label: string;
  examples: string;
  icon: string;
}

const businessTypeOptions: BusinessTypeOption[] = [
  {
    value: 'attractions',
    label: 'Attractions',
    examples: 'Museums, galleries, parks, tours, and visitor attractions',
    icon: '🏛️',
  },
  {
    value: 'leisure-recreation',
    label: 'Leisure & Recreation',
    examples: 'Sports facilities, cinemas, entertainment venues, and recreation centres',
    icon: '🎯',
  },
  {
    value: 'hospitality',
    label: 'Hospitality',
    examples: 'Hotels, restaurants, cafes, bars, and accommodation',
    icon: '🍽️',
  },
  {
    value: 'events-venues',
    label: 'Events & Venues',
    examples: 'Conference centres, theatres, stadiums, and event spaces',
    icon: '🎭',
  },
  {
    value: 'retail',
    label: 'Retail',
    examples: 'Shops, shopping centres, and retail services',
    icon: '🛍️',
  },
  {
    value: 'local-government',
    label: 'Local Government',
    examples: 'Council facilities, public buildings, and community services',
    icon: '🏢',
  },
  {
    value: 'health-wellness',
    label: 'Health & Wellness',
    examples: 'Gyms, spas, wellness centres, and health services',
    icon: '💪',
  },
  {
    value: 'education-training',
    label: 'Education & Training',
    examples: 'Schools, training centres, and educational facilities',
    icon: '🎓',
  },
];

const organisationSizeOptions: { value: OrganisationSize; label: string; description: string }[] = [
  { value: 'small', label: 'Small', description: '1-20 staff' },
  { value: 'medium', label: 'Medium', description: '21-100 staff' },
  { value: 'large', label: 'Large', description: '100+ staff' },
  { value: 'enterprise', label: 'Enterprise', description: 'Multi-site or precinct' },
];

export default function BusinessSnapshotPage() {
  usePageTitle('Organisation Details');
  const navigate = useNavigate();
  const [validationError, setValidationError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BusinessSnapshot>({
    organisation_name: '',
    organisation_size: '' as OrganisationSize,
    business_types: [],
    user_role: '' as UserRole,
    has_physical_venue: false,
    has_online_presence: false,
    serves_public_customers: false,
    has_online_services: false,
  });

  useEffect(() => {
    // Check if user has existing progress - if so, go to dashboard
    const existingSession = getSession();
    const discoveryData = getDiscoveryData();

    // If user has selected modules and has discovery data, they're returning - go to dashboard
    if (
      existingSession?.selected_modules &&
      existingSession.selected_modules.length > 0 &&
      discoveryData?.recommended_modules &&
      discoveryData.recommended_modules.length > 0
    ) {
      console.log('[BusinessSnapshot] Returning user with progress, redirecting to dashboard');
      navigate('/dashboard');
      return;
    }

    // Initialize session if needed
    const session = initializeSession();

    // Pre-fill form if data exists
    if (session.business_snapshot && session.business_snapshot.organisation_name) {
      setFormData(session.business_snapshot);
    }
  }, [navigate]);

  const toggleBusinessType = (type: BusinessType) => {
    setFormData((prev) => ({
      ...prev,
      business_types: prev.business_types.includes(type)
        ? prev.business_types.filter((t) => t !== type)
        : [...prev.business_types, type],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    const missing: string[] = [];
    if (!formData.organisation_name) missing.push('Organisation name');
    if (!formData.organisation_size) missing.push('Organisation size');
    if (formData.business_types.length === 0) missing.push('Organisation type');
    if (!formData.user_role) missing.push('Your role');

    if (missing.length > 0) {
      setValidationError(`Please complete the following: ${missing.join(', ')}.`);
      return;
    }

    setValidationError(null);

    // Save to session
    updateBusinessSnapshot(formData);

    // Navigate to discovery (touchpoint-based module recommendations)
    navigate('/discovery');
  };

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-container">
          <h1>Let's get started</h1>
          <p className="helper-text">First, a few details about your organisation</p>

          {validationError && <div id="snapshot-error" className="message error-message" role="alert">{validationError}</div>}

          <form onSubmit={handleSubmit}>
            {/* Organisation Name */}
            <div className="form-group">
              <label htmlFor="organisation_name">
                Organisation name <span className="required">*</span>
              </label>
              <span className="field-hint">Enter your organisation name</span>
              <input
                type="text"
                id="organisation_name"
                value={formData.organisation_name}
                onChange={(e) =>
                  setFormData({ ...formData, organisation_name: e.target.value })
                }
                required
                aria-invalid={!!validationError && !formData.organisation_name}
                aria-describedby={validationError ? 'snapshot-error' : undefined}
              />
            </div>

            {/* Organisation Size */}
            <div className="form-group">
              <label>
                Organisation size <span className="required">*</span>
              </label>
              <div className="bubble-select size-bubbles">
                {organisationSizeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`bubble-option ${formData.organisation_size === option.value ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, organisation_size: option.value })}
                  >
                    <span className="bubble-label">{option.label}</span>
                    <span className="bubble-description">{option.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Business Types - Multi-select */}
            <div className="form-group">
              <label>
                What type of organisation are you? <span className="required">*</span>
              </label>
              <p className="field-helper">Select all that apply</p>
              <div className="bubble-select type-bubbles">
                {businessTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`bubble-option ${formData.business_types.includes(option.value) ? 'selected' : ''}`}
                    onClick={() => toggleBusinessType(option.value)}
                  >
                    <span className="bubble-icon">{option.icon}</span>
                    <div className="bubble-content">
                      <span className="bubble-label">{option.label}</span>
                      <span className="bubble-description">{option.examples}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* User Role */}
            <div className="form-group">
              <label htmlFor="user_role">
                Your role <span className="required">*</span>
              </label>
              <select
                id="user_role"
                value={formData.user_role}
                onChange={(e) =>
                  setFormData({ ...formData, user_role: e.target.value as UserRole })
                }
                required
                aria-invalid={!!validationError && !formData.user_role}
                aria-describedby={validationError ? 'snapshot-error' : undefined}
              >
                <option value="">Select your role</option>
                <option value="owner">Owner</option>
                <option value="manager">Manager</option>
                <option value="operations-lead">Operations Lead</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="form-actions">
              <Link to="/disclaimer" className="btn btn-secondary">
                ← Back
              </Link>
              <button type="submit" className="btn btn-primary">
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
