import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuth } from '../contexts/AuthContext';
import '../styles/login.css';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const recoveryDetected = useRef(false);

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        recoveryDetected.current = true;
        setReady(true);
        setChecking(false);
      }
    });

    // If Supabase auto-detects the token and establishes a session without
    // firing PASSWORD_RECOVERY (e.g. page was already loaded), check after
    // a short delay so we don't show a false "invalid link" error.
    const timeout = setTimeout(async () => {
      if (!recoveryDetected.current) {
        const { data: { session } } = await supabase!.auth.getSession();
        if (session) {
          setReady(true);
        }
        setChecking(false);
      }
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate('/login', { replace: true }), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await updatePassword(password);
      if (error) {
        setError(error.message || 'Failed to update password.');
      } else {
        setSuccess(true);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="login-page">
        <div className="container">
          <div className="login-card">
            <p style={{ textAlign: 'center', padding: '2rem' }}>Verifying reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="login-page">
        <div className="container">
          <div className="login-card">
            <div className="login-header">
              <span className="login-icon">🧭</span>
              <h1>Invalid or expired link</h1>
              <p className="login-subtitle">
                This password reset link is no longer valid. Please request a new one.
              </p>
            </div>
            <div className="login-switch">
              <p>
                <Link to="/login" className="text-link">
                  Back to sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="login-page">
        <div className="container">
          <div className="login-card">
            <div className="login-header">
              <span className="login-icon">🧭</span>
              <h1>Password updated</h1>
              <p className="login-subtitle">
                Your password has been reset successfully. Redirecting to sign in...
              </p>
            </div>
            <div className="login-message login-success" role="status">
              You can now sign in with your new password.
            </div>
            <div className="login-switch">
              <p>
                <Link to="/login" className="text-link">
                  Go to sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-card">
          <div className="login-header">
            <span className="login-icon">🧭</span>
            <h1>Set new password</h1>
            <p className="login-subtitle">
              Enter your new password below
            </p>
          </div>

          {error && (
            <div className="login-message login-error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="new-password">New password</label>
              <span className="field-hint">At least 8 characters</span>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  minLength={8}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password">Confirm password</label>
              <span className="field-hint">Re-enter your new password</span>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  minLength={8}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-large login-submit"
              disabled={isLoading}
            >
              {isLoading ? 'Updating password...' : 'Update password'}
            </button>
          </form>

          <div className="login-back">
            <Link to="/login" className="text-link">
              ← Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
