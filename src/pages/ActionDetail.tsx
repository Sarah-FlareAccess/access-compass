import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getActionById, updateAction } from '../utils/session';
import type { Action } from '../types';
import { usePageTitle } from '../hooks/usePageTitle';
import '../styles/action-detail.css';

export default function ActionDetail() {
  usePageTitle('Action Detail');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [action, setAction] = useState<Action | null>(null);
  const [diapFields, setDiapFields] = useState({
    owner: '',
    timeframe: '',
    status: 'not_started',
    notes: '',
  });

  useEffect(() => {
    if (!id) {
      navigate('/dashboard');
      return;
    }

    const actionData = getActionById(id);
    if (!actionData) {
      navigate('/dashboard');
      return;
    }

    setAction(actionData);
    setDiapFields({
      owner: actionData.owner || '',
      timeframe: actionData.timeframe || '',
      status: actionData.status || 'not_started',
      notes: actionData.notes || '',
    });
  }, [id, navigate]);

  const handleSave = () => {
    if (!id) return;

    updateAction(id, {
      owner: diapFields.owner,
      timeframe: diapFields.timeframe,
      status: diapFields.status as any,
      notes: diapFields.notes,
    });

    alert('Changes saved!');
    navigate('/dashboard');
  };

  if (!action) return null;

  return (
    <div className="action-detail-page">
      <div className="container">
        <div className="action-detail-container">
          <Link to="/dashboard" className="back-link">
            ← Back to dashboard
          </Link>

          <div className="action-header">
            <span className={`priority-badge priority-${action.priority.replace('_', '-')}`}>
              {action.priority.replace('_', ' ')}
            </span>
            <span className="module-badge">{action.category}</span>
          </div>

          <h1>{action.title}</h1>

          <section className="action-section">
            <h2>Why this matters</h2>
            <p>{action.why_matters}</p>
          </section>

          <section className="action-section">
            <h2>Simple steps</h2>
            <ol className="steps-list">
              {action.how_to_steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="action-section">
            <h2>Example for your business</h2>
            <p className="example-text">{action.example}</p>
          </section>

          <section className="diap-section">
            <h2>Track this action in your DIAP</h2>
            <div className="diap-form">
              <div className="form-group">
                <label>
                  Who's responsible?
                  <span className="field-hint">e.g., Sarah (Manager)</span>
                  <input
                    type="text"
                    value={diapFields.owner}
                    onChange={(e) => setDiapFields({ ...diapFields, owner: e.target.value })}
                  />
                </label>
              </div>

              <div className="form-group">
                <label>
                  Timeframe
                  <select
                    value={diapFields.timeframe}
                    onChange={(e) => setDiapFields({ ...diapFields, timeframe: e.target.value })}
                  >
                    <option value="">Select timeframe</option>
                    <option value="this-month">This month</option>
                    <option value="next-3-months">Next 3 months</option>
                    <option value="this-year">This year</option>
                    <option value="custom">Custom date</option>
                  </select>
                </label>
              </div>

              <div className="form-group">
                <label>
                  Status
                  <select
                    value={diapFields.status}
                    onChange={(e) => setDiapFields({ ...diapFields, status: e.target.value })}
                  >
                    <option value="not_started">Not started</option>
                    <option value="in_progress">In progress</option>
                    <option value="complete">Complete</option>
                    <option value="on_hold">On hold</option>
                  </select>
                </label>
              </div>

              <div className="form-group">
                <label>
                  Notes
                  <span className="field-hint">Add any notes, progress updates, or blockers...</span>
                  <textarea
                    value={diapFields.notes}
                    onChange={(e) => setDiapFields({ ...diapFields, notes: e.target.value })}
                    rows={4}
                    maxLength={1000}
                  />
                </label>
              </div>

              <button className="btn btn-primary" onClick={handleSave}>
                Save changes
              </button>
            </div>
          </section>

          <div className="action-footer">
            <button className="btn btn-primary" onClick={handleSave}>
              Save & return to dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
