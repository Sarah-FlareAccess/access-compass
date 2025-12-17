import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getActions } from '../utils/session';
import type { Action } from '../types';

export default function DIAPWorkspace() {
  const [actions, setActions] = useState<Action[]>([]);

  useEffect(() => {
    setActions(getActions());
  }, []);

  const totalActions = actions.length;
  const inProgress = actions.filter((a) => a.status === 'in_progress').length;
  const completed = actions.filter((a) => a.status === 'complete').length;
  const notStarted = actions.filter((a) => a.status === 'not_started').length;

  return (
    <div className="form-page">
      <div className="container">
        <h1>Your Disability Inclusion Action Plan</h1>
        <p className="helper-text">Track and manage all your accessibility actions</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', margin: '30px 0' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3>Total actions</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--deep-purple)' }}>{totalActions}</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3>In progress</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#f59e0b' }}>{inProgress}</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3>Completed</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#22c55e' }}>{completed}</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3>Not started</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--steel-gray)' }}>{notStarted}</div>
          </div>
        </div>

        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Priority</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Action</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Owner</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {actions.map((action) => (
                <tr key={action.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge priority-${action.priority.replace('_', '-')}`}>
                      {action.priority.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>{action.title}</td>
                  <td style={{ padding: '12px' }}>{action.owner || '—'}</td>
                  <td style={{ padding: '12px' }}>
                    <span className="badge">{action.status.replace('_', ' ')}</span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <Link to={`/action/${action.id}`} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <Link to="/export" className="btn btn-secondary">
            Export DIAP
          </Link>
          <Link to="/dashboard" className="btn btn-secondary">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
