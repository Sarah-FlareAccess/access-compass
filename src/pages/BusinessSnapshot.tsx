import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { initializeSession, updateBusinessSnapshot, getSession, getDiscoveryData } from '../utils/session';
import { useAuth } from '../contexts/AuthContext';
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
  { value: 'micro', label: 'Micro', description: '0-4 staff' },
  { value: 'small', label: 'Small', description: '5-19 staff' },
  { value: 'medium', label: 'Medium', description: '20-199 staff' },
  { value: 'large', label: 'Large', description: '200+ staff' },
];

export default function BusinessSnapshotPage() {
  usePageTitle('Organisation Details');
  const navigate = useNavigate();
  const { accessState } = useAuth();
  const [validationError, setValidationError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (validationError) errorRef.current?.focus();
  }, [validationError]);
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
    } else if (accessState.organisation?.name) {
      // Pre-fill org name from Supabase organisation
      setFormData(prev => ({
        ...prev,
        organisation_name: accessState.organisation!.name,
      }));
    }
  }, [navigate, accessState.organisation]);

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

    if (missing.length > 0) {
      setValidationError(`Please complete the following: ${missing.join(', ')}.`);
      return;
    }

    setValidationError(null);

    // Save to session
    updateBusinessSnapshot(formData);

    // Show pricing before discovery so users know the cost upfront
    navigate('/pricing');
  };

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-container">
          <h1>Let's get started</h1>
          <p className="helper-text">First, a few details about your organisation</p>

          {validationError && <div id="snapshot-error" className="message error-message" role="alert" ref={errorRef} tabIndex={-1}>{validationError}</div>}

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
                autoComplete="organization"
                aria-invalid={!!validationError && !formData.organisation_name}
                aria-describedby={validationError ? 'snapshot-error' : undefined}
              />
            </div>

            {/* Organisation Size */}
            <fieldset className="form-group">
              <legend>
                Organisation size <span className="required">*</span>
              </legend>
              <div className="bubble-select size-bubbles" role="radiogroup">
                {organisationSizeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`bubble-option ${formData.organisation_size === option.value ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, organisation_size: option.value })}
                    role="radio"
                    aria-checked={formData.organisation_size === option.value}
                  >
                    <span className="bubble-label">{option.label}</span>
                    <span className="bubble-description">{option.description}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Business Types - Multi-select */}
            <fieldset className="form-group">
              <legend>
                What type of organisation are you? <span className="required">*</span>
              </legend>
              <p className="field-helper">Select all that apply</p>
              <div className="bubble-select type-bubbles" role="group">
                {businessTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`bubble-option ${formData.business_types.includes(option.value) ? 'selected' : ''}`}
                    onClick={() => toggleBusinessType(option.value)}
                    aria-pressed={formData.business_types.includes(option.value)}
                  >
                    <span className="bubble-icon" aria-hidden="true">{option.icon}</span>
                    <div className="bubble-content">
                      <span className="bubble-label">{option.label}</span>
                      <span className="bubble-description">{option.examples}</span>
                    </div>
                  </button>
                ))}
              </div>
            </fieldset>

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
