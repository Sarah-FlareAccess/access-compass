import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getSession, getDiscoveryData } from '../utils/session';
import { isSupabaseEnabled } from '../utils/supabase';
import { fetchRecords } from '../utils/cloudSync';
import { usePageTitle } from '../hooks/usePageTitle';
import '../styles/login.css';

type AuthMode = 'signin' | 'forgot';

export default function Login() {
  usePageTitle('Sign In');
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, resetPassword, isAuthenticated, isLoading: authLoading, user } = useAuth();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  // Determine where to redirect based on user progress
  const getResumeRoute = (): string => {
    const explicitFrom = (location.state as { from?: string })?.from;
    if (explicitFrom) return explicitFrom;

    const session = getSession();
    const discovery = getDiscoveryData();

    if (!session?.business_snapshot?.organisation_name) {
      return '/start';
    }

    // User has selected modules = they have a working dashboard
    if (session?.selected_modules?.length) {
      return '/dashboard';
    }

    const hasCompletedDiscovery = discovery?.discovery_data?.selectedTouchpoints &&
      discovery.discovery_data.selectedTouchpoints.length > 0;

    if (!hasCompletedDiscovery && !discovery?.recommended_modules?.length) {
      return '/discovery';
    }

    return '/decision';
  };

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    // If localStorage has data, route based on progress
    const session = getSession();
    if (session?.business_snapshot?.organisation_name) {
      navigate(getResumeRoute(), { replace: true });
      return;
    }

    // localStorage is empty (e.g. after password reset or device switch).
    // Check if this user has cloud data before sending to /start.
    if (isSupabaseEnabled() && user?.id) {
      fetchRecords('sessions', user.id).then(({ data }) => {
        if (data && data.length > 0) {
          // User has cloud data, send to dashboard (cloud sync will restore it)
          navigate('/dashboard', { replace: true });
        } else {
          // Truly new user, start from beginning
          navigate(getResumeRoute(), { replace: true });
        }
      }).catch(() => {
        navigate(getResumeRoute(), { replace: true });
      });
    } else {
      navigate(getResumeRoute(), { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="login-page">
        <div className="container">
          <div className="login-card">
            <p style={{ textAlign: 'center', padding: '2rem' }} aria-live="polite">Loading...</p>
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
          const msg = error.message?.toLowerCase() || '';
          if (msg.includes('invalid') || msg.includes('credentials')) {
            setError('Unable to sign in. Please check your email and password are correct. If you just created an account, make sure you have confirmed your email by clicking the link we sent you.');
          } else if (msg.includes('not found') || msg.includes('no user')) {
            setError('No account found with that email address. Please check your email or create a new account.');
          } else if (msg.includes('too many') || msg.includes('rate')) {
            setError('Too many sign-in attempts. Please wait a few minutes before trying again.');
          } else {
            setError(error.message || 'Unable to sign in. Please check your email and password, then try again.');
          }
        } else {
          navigate(getResumeRoute(), { replace: true });
        }
      } else if (mode === 'forgot') {
        const { error } = await resetPassword(email);
        if (error) {
          setError(error.message || 'Unable to send reset email. Please check that the email address is correct.');
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
            <img src="/images/access-compass-logo.png" alt="Access Compass" className="login-logo" />
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
            <div id="login-error" className="login-message login-error" role="alert" ref={errorRef} tabIndex={-1}>
              {error}
            </div>
          )}

          {successMessage && (
            <div className="login-message login-success" role="status">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form" aria-busy={isLoading}>
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
                aria-invalid={!!error}
                aria-describedby={error ? 'login-error' : undefined}
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
                    aria-invalid={!!error}
                    aria-describedby={error ? 'login-error' : undefined}
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
