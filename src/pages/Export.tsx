import { Link, useNavigate } from 'react-router-dom';
import { getActions, getSession, clearSession } from '../utils/session';
import { useState } from 'react';
import NavBar from '../components/NavBar';

export default function Export() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleExport = (type: 'summary' | 'full') => {
    alert(`${type === 'summary' ? 'Priority Summary' : 'Full DIAP'} export would download here. PDF generation will be implemented with jsPDF library.`);
  };

  const handleStartAgain = () => {
    if (window.confirm('This will clear your current session and start fresh. Continue?')) {
      clearSession();
      navigate('/');
    }
  };

  return (
    <>
      <NavBar />
      <div className="form-page">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1>Export your action plan</h1>
          <p className="helper-text">Download and share your priorities with your team</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px' }}>
          {/* Priority Summary */}
          <div className="card">
            <div style={{ fontSize: '3rem', marginBottom: '20px', textAlign: 'center' }}>📄</div>
            <h2>1-Page Priority Summary</h2>
            <p style={{ color: 'var(--steel-gray)', marginBottom: '20px' }}>
              Quick overview of your 'Act now' actions—perfect for team briefings
            </p>
            <div style={{ marginBottom: '15px' }}>
              <strong>Format:</strong> PDF
            </div>
            <div style={{ marginBottom: '20px' }}>
              <strong>Size:</strong> ~200 KB
            </div>
            <button className="btn btn-primary" onClick={() => handleExport('summary')}>
              Download summary
            </button>
          </div>

          {/* Full DIAP */}
          <div className="card">
            <div style={{ fontSize: '3rem', marginBottom: '20px', textAlign: 'center' }}>📊</div>
            <h2>Complete DIAP Action Plan</h2>
            <p style={{ color: 'var(--steel-gray)', marginBottom: '20px' }}>
              Full table with all actions, owners, timeframes, and status—ready to share with
              stakeholders
            </p>
            <div style={{ marginBottom: '15px' }}>
              <strong>Format:</strong> PDF
            </div>
            <div style={{ marginBottom: '20px' }}>
              <strong>Size:</strong> ~400 KB
            </div>
            <button className="btn btn-primary" onClick={() => handleExport('full')}>
              Download full DIAP
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div
          className="card"
          style={{
            border: '2px solid var(--warm-orange)',
            background: 'rgba(230, 119, 0, 0.05)',
            marginBottom: '40px',
          }}
        >
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '1.5rem' }}>ℹ️</div>
            <div>
              <strong style={{ display: 'block', marginBottom: '10px' }}>Important disclaimer</strong>
              <p style={{ margin: 0 }}>
                This guidance is for information only. It is not legal advice, a compliance
                certificate, or a substitute for professional accessibility auditing. Actions are
                suggestions based on your responses.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/dashboard" className="btn btn-secondary">
            Back to dashboard
          </Link>
          <button className="btn btn-secondary" onClick={handleStartAgain}>
            Start again
          </button>
        </div>
      </div>
      </div>
    </>
  );
}
