import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, getActions, getClarifications } from '../utils/session';
import type { Action, Clarification } from '../types';
import '../styles/dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [actions, setActions] = useState<Action[]>([]);
  const [clarifications, setClarifications] = useState<Clarification[]>([]);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession || !currentSession.session_id) {
      navigate('/');
      return;
    }

    setSession(currentSession);
    setActions(getActions());
    setClarifications(getClarifications().filter((c) => !c.resolved));
  }, [navigate]);

  const actNowActions = actions.filter((a) => a.priority === 'act_now');
  const planNextActions = actions.filter((a) => a.priority === 'plan_next');
  const considerLaterActions = actions.filter((a) => a.priority === 'consider_later');

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Here are your accessibility priorities</h1>
          <p className="subtext">
            Based on your responses, here's what matters most for your{' '}
            {session?.business_snapshot?.business_type?.replace(/-/g, ' ')}
          </p>
        </div>

        {/* Main Content - 3 Columns */}
        <div className="priorities-grid">
          {/* Act Now Column */}
          <div className="priority-column act-now">
            <div className="column-header">
              <h2>🟢 Act now</h2>
              <span className="count">{actNowActions.length} actions</span>
            </div>
            <p className="column-subtext">High impact, achievable with your budget</p>

            <div className="action-cards">
              {actNowActions.map((action) => (
                <Link to={`/action/${action.id}`} key={action.id} className="action-card">
                  <h3>{action.title}</h3>
                  <p className="why-preview">
                    {action.why_matters.substring(0, 100)}
                    {action.why_matters.length > 100 ? '...' : ''}
                  </p>
                  <div className="action-meta">
                    <span className={`badge effort-${action.effort}`}>{action.effort}</span>
                    <span className="badge cost">{action.cost_band}</span>
                  </div>
                </Link>
              ))}
              {actNowActions.length === 0 && (
                <div className="empty-state">No actions in this priority</div>
              )}
            </div>
          </div>

          {/* Plan Next Column */}
          <div className="priority-column plan-next">
            <div className="column-header">
              <h2>🟡 Plan next</h2>
              <span className="count">{planNextActions.length} actions</span>
            </div>
            <p className="column-subtext">Prioritise these in the next 3-6 months</p>

            <div className="action-cards">
              {planNextActions.map((action) => (
                <Link to={`/action/${action.id}`} key={action.id} className="action-card">
                  <h3>{action.title}</h3>
                  <p className="why-preview">
                    {action.why_matters.substring(0, 100)}
                    {action.why_matters.length > 100 ? '...' : ''}
                  </p>
                  <div className="action-meta">
                    <span className={`badge effort-${action.effort}`}>{action.effort}</span>
                    <span className="badge cost">{action.cost_band}</span>
                  </div>
                </Link>
              ))}
              {planNextActions.length === 0 && (
                <div className="empty-state">No actions in this priority</div>
              )}
            </div>
          </div>

          {/* Consider Later Column */}
          <div className="priority-column consider-later">
            <div className="column-header">
              <h2>🔵 Consider later</h2>
              <span className="count">{considerLaterActions.length} actions</span>
            </div>
            <p className="column-subtext">Longer-term improvements for future planning</p>

            <div className="action-cards">
              {considerLaterActions.map((action) => (
                <Link to={`/action/${action.id}`} key={action.id} className="action-card">
                  <h3>{action.title}</h3>
                  <p className="why-preview">
                    {action.why_matters.substring(0, 100)}
                    {action.why_matters.length > 100 ? '...' : ''}
                  </p>
                  <div className="action-meta">
                    <span className={`badge effort-${action.effort}`}>{action.effort}</span>
                    <span className="badge cost">{action.cost_band}</span>
                  </div>
                </Link>
              ))}
              {considerLaterActions.length === 0 && (
                <div className="empty-state">No actions in this priority</div>
              )}
            </div>
          </div>
        </div>

        {/* Side Panels */}
        <div className="side-panels">
          {clarifications.length > 0 && (
            <div className="panel">
              <div className="panel-icon">❓</div>
              <h3>Items to clarify later</h3>
              <div className="panel-count">{clarifications.length} items</div>
              <p>Questions you weren't sure about—we'll help you check these</p>
              <Link to="/clarify" className="btn btn-secondary">
                Review items
              </Link>
            </div>
          )}

          <div className="panel">
            <div className="panel-icon">✅</div>
            <h3>Modules reviewed</h3>
            <ul className="modules-list">
              {session?.selected_modules?.map((module: string) => (
                <li key={module}>✓ {module.replace(/-/g, ' ')}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="dashboard-actions">
          <Link to="/diap" className="btn btn-secondary">
            View full DIAP
          </Link>
          <Link to="/export" className="btn btn-secondary">
            Export summary
          </Link>
        </div>
      </div>
    </div>
  );
}
