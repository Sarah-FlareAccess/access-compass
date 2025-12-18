import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getClarifications, updateClarification } from '../utils/session';
import type { Clarification } from '../types';

export default function ClarifyLater() {
  const [clarifications, setClarifications] = useState<Clarification[]>([]);

  useEffect(() => {
    setClarifications(getClarifications());
  }, []);

  const handleMarkResolved = (id: string) => {
    updateClarification(id, {
      resolved: true,
      resolved_at: new Date().toISOString(),
    });
    setClarifications(getClarifications());
  };

  const unresolvedItems = clarifications.filter((c) => !c.resolved);

  return (
    <div className="form-page">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1>Items to clarify later</h1>
          <span className="badge" style={{ fontSize: '1.1rem', padding: '8px 20px' }}>
            {unresolvedItems.length} items
          </span>
          <p className="helper-text" style={{ marginTop: '15px' }}>
            Questions you weren't sure about—here's how to check each one
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {unresolvedItems.map((clarification) => (
            <div key={clarification.id} className="card">
              <div style={{ marginBottom: '15px' }}>
                <span className="badge secondary" style={{ marginBottom: '10px' }}>
                  {clarification.module}
                </span>
              </div>

              <h3 style={{ marginBottom: '15px', fontSize: '1.2rem' }}>
                {clarification.question}
              </h3>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '8px' }}>Why it matters</h4>
                <p style={{ color: 'var(--text-muted)' }}>{clarification.why_matters}</p>
              </div>

              <div style={{ marginBottom: '20px', background: 'var(--ivory)', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '8px' }}>🔍 How to check</h4>
                <p>{clarification.how_to_check}</p>
              </div>

              {!clarification.resolved && (
                <button
                  className="btn btn-primary"
                  onClick={() => handleMarkResolved(clarification.id)}
                >
                  Mark as resolved
                </button>
              )}
            </div>
          ))}

          {unresolvedItems.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>✅</div>
              <h3>All items resolved!</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>
                Great work clarifying your accessibility features
              </p>
            </div>
          )}
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <Link to="/dashboard" className="btn btn-secondary">
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
