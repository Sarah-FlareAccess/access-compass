import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeSession, updateBusinessSnapshot, getSession } from '../utils/session';
import type { BusinessSnapshot, BusinessType, UserRole, OrganisationSize } from '../types';
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
];

export default function BusinessSnapshotPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BusinessSnapshot>({
    organisation_name: '',
    organisation_size: '' as OrganisationSize,
    business_types: [],
    user_role: '' as UserRole,
    has_physical_venue: false,
    has_online_presence: false,
    serves_public_customers: false,
  });

  useEffect(() => {
    // Initialize session if needed
    const session = initializeSession();

    // Pre-fill form if data exists
    if (session.business_snapshot && session.business_snapshot.organisation_name) {
      setFormData(session.business_snapshot);
    }
  }, []);

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
    if (
      !formData.organisation_name ||
      !formData.organisation_size ||
      formData.business_types.length === 0 ||
      !formData.user_role
    ) {
      alert('Please complete all required fields');
      return;
    }

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

          <form onSubmit={handleSubmit}>
            {/* Organisation Name */}
            <div className="form-group">
              <label htmlFor="organisation_name">
                Organisation name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="organisation_name"
                value={formData.organisation_name}
                onChange={(e) =>
                  setFormData({ ...formData, organisation_name: e.target.value })
                }
                placeholder="Enter your organisation name"
                required
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
              >
                <option value="">Select your role</option>
                <option value="owner">Owner</option>
                <option value="manager">Manager</option>
                <option value="operations-lead">Operations Lead</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Physical Venue */}
            <div className="form-group">
              <label>
                Do you have a physical venue customers visit? <span className="required">*</span>
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="has_physical_venue"
                    checked={formData.has_physical_venue === true}
                    onChange={() => setFormData({ ...formData, has_physical_venue: true })}
                    required
                  />
                  <span>Yes</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="has_physical_venue"
                    checked={formData.has_physical_venue === false}
                    onChange={() => setFormData({ ...formData, has_physical_venue: false })}
                    required
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            {/* Online Presence */}
            <div className="form-group">
              <label>
                Do you have an online presence (website, booking system)?{' '}
                <span className="required">*</span>
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="has_online_presence"
                    checked={formData.has_online_presence === true}
                    onChange={() => setFormData({ ...formData, has_online_presence: true })}
                    required
                  />
                  <span>Yes</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="has_online_presence"
                    checked={formData.has_online_presence === false}
                    onChange={() => setFormData({ ...formData, has_online_presence: false })}
                    required
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            {/* Public-Facing Customers */}
            <div className="form-group">
              <label>
                Do you serve public-facing customers? <span className="required">*</span>
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="serves_public_customers"
                    checked={formData.serves_public_customers === true}
                    onChange={() => setFormData({ ...formData, serves_public_customers: true })}
                    required
                  />
                  <span>Yes</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="serves_public_customers"
                    checked={formData.serves_public_customers === false}
                    onChange={() =>
                      setFormData({ ...formData, serves_public_customers: false })
                    }
                    required
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-actions">
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
