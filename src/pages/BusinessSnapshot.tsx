import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeSession, updateBusinessSnapshot, getSession } from '../utils/session';
import type { BusinessSnapshot, BusinessType, UserRole } from '../types';
import '../styles/form-page.css';

export default function BusinessSnapshotPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BusinessSnapshot>({
    business_type: '' as BusinessType,
    user_role: '' as UserRole,
    has_physical_venue: false,
    has_online_presence: false,
    serves_public_customers: false,
  });

  useEffect(() => {
    // Initialize session if needed
    const session = initializeSession();

    // Pre-fill form if data exists
    if (session.business_snapshot && session.business_snapshot.business_type) {
      setFormData(session.business_snapshot);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    if (
      !formData.business_type ||
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
          <h1>Tell us about your business</h1>
          <p className="helper-text">This helps us show only what's relevant to you</p>

          <form onSubmit={handleSubmit}>
            {/* Business Type */}
            <div className="form-group">
              <label htmlFor="business_type">
                Business type <span className="required">*</span>
              </label>
              <select
                id="business_type"
                value={formData.business_type}
                onChange={(e) =>
                  setFormData({ ...formData, business_type: e.target.value as BusinessType })
                }
                required
              >
                <option value="">Select your business type</option>
                <option value="cafe-restaurant">Café/Restaurant</option>
                <option value="accommodation">Accommodation</option>
                <option value="tour-operator">Tour Operator</option>
                <option value="attraction-museum-gallery">Attraction/Museum/Gallery</option>
                <option value="visitor-centre">Visitor Centre</option>
                <option value="other">Other</option>
              </select>
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
