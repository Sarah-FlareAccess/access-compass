import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/login.css';

type AuthMode = 'signin' | 'forgot';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, resetPassword, isAuthenticated, isLoading: authLoading } = useAuth();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Redirect if already authenticated
  const from = (location.state as { from?: string })?.from || '/dashboard';

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, from]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="login-page">
        <div className="container">
          <div className="login-card">
            <p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render login form if authenticated (will redirect via useEffect)
  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message || 'Failed to sign in. Please check your credentials.');
        } else {
          navigate(from, { replace: true });
        }
      } else if (mode === 'forgot') {
        const { error } = await resetPassword(email);
        if (error) {
          setError(error.message || 'Failed to send reset email.');
        } else {
          setSuccessMessage('Check your email for password reset instructions.');
          setMode('signin');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setSuccessMessage(null);
    if (newMode === 'forgot') {
      setPassword('');
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-card">
          <div className="login-header">
            <span className="login-icon">🧭</span>
            <h1>
              {mode === 'signin' && 'Welcome back'}
              {mode === 'forgot' && 'Reset password'}
            </h1>
            <p className="login-subtitle">
              {mode === 'signin' && 'Sign in to continue your accessibility journey'}
              {mode === 'forgot' && "Enter your email and we'll send you a reset link"}
            </p>
          </div>

          {error && (
            <div className="login-message login-error" role="alert">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="login-message login-success" role="status">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <span className="field-hint">you@example.com</span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {mode === 'signin' && (
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <span className="field-hint">Enter your password</span>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
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
            )}

            {mode === 'signin' && (
              <div className="forgot-link-container">
                <button
                  type="button"
                  className="text-link"
                  onClick={() => switchMode('forgot')}
                >
                  Forgot your password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-large login-submit"
              disabled={isLoading}
            >
              {isLoading ? 'Please wait...' : (
                <>
                  {mode === 'signin' && 'Sign in'}
                  {mode === 'forgot' && 'Send reset link'}
                </>
              )}
            </button>
          </form>

          <div className="login-switch">
            {mode === 'signin' && (
              <p>
                Don't have an account?{' '}
                <Link to="/disclaimer" className="text-link">
                  Create one
                </Link>
              </p>
            )}
            {mode === 'forgot' && (
              <p>
                Remember your password?{' '}
                <button type="button" className="text-link" onClick={() => switchMode('signin')}>
                  Sign in
                </button>
              </p>
            )}
          </div>

          <div className="login-back">
            <Link to="/" className="text-link">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
