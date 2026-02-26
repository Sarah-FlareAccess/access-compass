import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, updateConstraints, saveActions, saveClarifications } from '../utils/session';
import type { BudgetRange, Capacity, Timeframe, Constraints as ConstraintsType } from '../types';
import { usePageTitle } from '../hooks/usePageTitle';
import '../styles/form-page.css';

export default function Constraints() {
  usePageTitle('Constraints');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ConstraintsType>({
    budget_range: '' as BudgetRange,
    capacity: '' as Capacity,
    timeframe: '' as Timeframe,
    additional_notes: '',
  });

  useEffect(() => {
    const session = getSession();
    if (!session || !session.selected_modules?.length) {
      navigate('/modules');
      return;
    }

    // Pre-fill if exists
    if (session.constraints && session.constraints.budget_range) {
      setFormData(session.constraints);
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.budget_range || !formData.capacity || !formData.timeframe) {
      alert('Please complete all required fields');
      return;
    }

    setIsLoading(true);

    // Save constraints
    updateConstraints(formData);

    // Simulate API call to Claude (in real implementation, this would call the backend)
    setTimeout(() => {
      // For MVP, generate mock actions
      generateMockActions();
      setIsLoading(false);
      navigate('/dashboard');
    }, 2000);
  };

  const generateMockActions = () => {
    const mockActions = [
      {
        id: '1',
        session_id: getSession()?.session_id || '',
        priority: 'act_now' as const,
        category: 'Physical access',
        title: 'Add temporary ramp at entrance',
        why_matters:
          'Level access allows wheelchair users and people with mobility aids to enter independently without assistance.',
        effort: 'low' as const,
        cost_band: '$0-500' as const,
        how_to_steps: [
          'Measure the height difference at your entrance',
          'Contact local accessibility equipment suppliers for temporary ramp options',
          'Ensure ramp has non-slip surface and complies with gradient requirements (1:14 max)',
        ],
        example:
          'A café like yours installed a portable aluminum ramp that can be moved when deliveries arrive.',
        status: 'not_started' as const,
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        session_id: getSession()?.session_id || '',
        priority: 'act_now' as const,
        category: 'Online and bookings',
        title: 'Create accessibility info page on website',
        why_matters:
          'Customers can plan their visit with confidence when they know what to expect.',
        effort: 'low' as const,
        cost_band: '$0-500' as const,
        how_to_steps: [
          'Create a dedicated "Accessibility" page on your website',
          'Include information about parking, entrance access, and facilities',
          'Add photos showing accessible features',
        ],
        example:
          'Include details like: "We have level access via our side entrance, accessible parking 20m from door, and wheelchair-accessible bathroom."',
        status: 'not_started' as const,
        created_at: new Date().toISOString(),
      },
    ];

    saveActions(mockActions);

    // Generate mock clarifications
    const mockClarifications = [
      {
        id: '1',
        session_id: getSession()?.session_id || '',
        question: 'Do you have an accessible bathroom?',
        module: 'Physical access',
        why_matters:
          'Knowing your doorway width helps determine if wheelchair users can access your bathroom independently',
        how_to_check:
          'Use a tape measure to measure the narrowest point of the doorway. You need at least 850mm clear width when the door is open.',
        resolved: false,
      },
    ];

    saveClarifications(mockClarifications);
  };

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-container">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <h2>Creating your action plan...</h2>
              <p>This usually takes 3-8 seconds</p>
            </div>
          ) : (
            <>
              <h1>Help us prioritise realistically</h1>
              <p className="helper-text">
                We want to suggest actions that actually work for your situation
              </p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="budget_range">
                    What's your realistic budget for accessibility improvements this year?{' '}
                    <span className="required">*</span>
                  </label>
                  <select
                    id="budget_range"
                    value={formData.budget_range}
                    onChange={(e) =>
                      setFormData({ ...formData, budget_range: e.target.value as BudgetRange })
                    }
                    required
                  >
                    <option value="">Select budget range</option>
                    <option value="under_500">Under $500</option>
                    <option value="500_2k">$500 - $2,000</option>
                    <option value="2k_10k">$2,000 - $10,000</option>
                    <option value="10k_plus">$10,000+</option>
                    <option value="not_sure">Not sure yet</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="capacity">
                    What's your capacity to implement changes?{' '}
                    <span className="required">*</span>
                  </label>
                  <select
                    id="capacity"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value as Capacity })
                    }
                    required
                  >
                    <option value="">Select capacity</option>
                    <option value="diy">I can do most things myself</option>
                    <option value="some_support">
                      I can do some things myself, but need support for complex items
                    </option>
                    <option value="hire_help">I'll need to hire someone for most items</option>
                    <option value="not_sure">Not sure yet</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="timeframe">
                    When do you want to start taking action? <span className="required">*</span>
                  </label>
                  <select
                    id="timeframe"
                    value={formData.timeframe}
                    onChange={(e) =>
                      setFormData({ ...formData, timeframe: e.target.value as Timeframe })
                    }
                    required
                  >
                    <option value="">Select timeframe</option>
                    <option value="now">Now (this month)</option>
                    <option value="soon">Soon (next 3 months)</option>
                    <option value="later">Later this year</option>
                    <option value="exploring">Just exploring for now</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="additional_notes">Anything else we should know?</label>
                  <span className="field-hint">e.g., upcoming renovations, specific customer feedback, tight deadlines...</span>
                  <textarea
                    id="additional_notes"
                    maxLength={500}
                    value={formData.additional_notes}
                    onChange={(e) =>
                      setFormData({ ...formData, additional_notes: e.target.value })
                    }
                    rows={4}
                  />
                  <div className="char-count">
                    {formData.additional_notes?.length || 0}/500
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Get my priorities
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
