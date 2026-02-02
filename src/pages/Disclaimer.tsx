import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/disclaimer.css';

type Step = 'disclaimer' | 'auth' | 'organisation' | 'complete';
type OrgOption = 'none' | 'invite' | 'create';

export default function Disclaimer() {
  const navigate = useNavigate();
  const {
    signIn,
    signUp,
    isAuthenticated,
    isLoading: authLoading,
    accessState,
    joinOrganisation,
    createOrganisation,
    user,
  } = useAuth();

  // Step management
  const [currentStep, setCurrentStep] = useState<Step>('disclaimer');

  // Disclaimer state
  const [understood, setUnderstood] = useState(false);

  // Auth state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);

  // Organisation state
  const [orgOption, setOrgOption] = useState<OrgOption>('none');
  const [inviteCode, setInviteCode] = useState('');
  const [orgName, setOrgName] = useState('');
  const [orgSize, setOrgSize] = useState<'small' | 'medium' | 'large' | 'enterprise'>('small');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // When user becomes authenticated while on disclaimer or auth step, move to organisation step
  useEffect(() => {
    // Wait for auth to finish loading before making decisions
    if (authLoading) return;

    if (isAuthenticated && (currentStep === 'disclaimer' || currentStep === 'auth')) {
      console.log('[Disclaimer] User authenticated, checking organisation status...');
      setIsSubmitting(false);
      setError(null);

      // If returning user already has an org, go to start page (handles session properly)
      if (accessState.organisation) {
        console.log('[Disclaimer] Returning user with org, redirecting to start:', accessState.organisation.name);
        navigate('/start');
        return;
      }

      // New user or user without org - go to organisation step
      console.log('[Disclaimer] User needs organisation, moving to organisation step');
      setCurrentStep('organisation');
    }
  }, [isAuthenticated, authLoading, currentStep, accessState.organisation, navigate]);

  // Check org status when authenticated - only skip if user ALREADY has an org (returning user)
  useEffect(() => {
    const checkOrgStatus = async () => {
      console.log('[Disclaimer] checkOrgStatus:', { isAuthenticated, currentStep, hasOrg: !!accessState.organisation, authLoading });

      // Wait for auth to finish loading before making decisions
      if (authLoading) {
        console.log('[Disclaimer] Auth still loading, waiting...');
        return;
      }

      if (isAuthenticated && currentStep === 'organisation') {
        // If user already has an org (returning user), go to start page
        if (accessState.organisation) {
          console.log('[Disclaimer] Returning user with org, redirecting to start:', accessState.organisation.name);
          navigate('/start');
          return;
        }
        // Don't auto-join here - let user choose their path on the organisation step
        console.log('[Disclaimer] User has no org, showing organisation selection');
      }
    };

    checkOrgStatus();
  }, [isAuthenticated, currentStep, accessState.organisation, authLoading, navigate]);

  // Pre-fill contact email when user is available
  useEffect(() => {
    if (user?.email && !contactEmail) {
      setContactEmail(user.email);
    }
  }, [user?.email, contactEmail]);

  const handleContinue = () => {
    sessionStorage.setItem('disclaimer_accepted', 'true');
    navigate('/start');
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setIsSubmitting(false);
          return;
        }
        if (password.length < 8) {
          setError('Password must be at least 8 characters.');
          setIsSubmitting(false);
          return;
        }

        const { error } = await signUp(email, password);
        if (error) {
          setError(error.message || 'Failed to create account.');
        } else {
          setSuccessMessage('Check your email for a confirmation link, then sign in below.');
          setIsSignUp(false);
          setPassword('');
          setConfirmPassword('');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message || 'Failed to sign in. Please check your credentials.');
        } else {
          // Move to organisation step
          setCurrentStep('organisation');
          setError(null);
          setSuccessMessage(null);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinWithCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { error, organisation } = await joinOrganisation(inviteCode);
      if (error) {
        setError(error);
      } else {
        setSuccessMessage(`You've joined ${organisation?.name}`);
        setCurrentStep('complete');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Disclaimer] handleCreateOrg called', { orgName, orgSize, contactEmail, contactName });
    setError(null);
    setIsSubmitting(true);

    try {
      console.log('[Disclaimer] Calling createOrganisation...');
      const { error, organisation } = await createOrganisation({
        name: orgName,
        size: orgSize,
        contactEmail,
        contactName,
      });
      console.log('[Disclaimer] createOrganisation result:', { error, organisation });

      if (error) {
        setError(error);
      } else {
        setSuccessMessage(`${organisation?.name} has been created!`);
        setCurrentStep('complete');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setSuccessMessage(null);
    setPassword('');
    setConfirmPassword('');
  };

  // If authenticated and has org, skip to complete
  useEffect(() => {
    console.log('[Disclaimer] Skip check:', { isAuthenticated, hasOrg: !!accessState.organisation, currentStep });
    if (isAuthenticated && accessState.organisation && currentStep === 'disclaimer') {
      console.log('[Disclaimer] Skipping to complete - user has org:', accessState.organisation.name);
      setCurrentStep('complete');
    }
  }, [isAuthenticated, accessState.organisation, currentStep]);

  // Loading state
  if (authLoading) {
    return (
      <div className="disclaimer-page">
        <div className="container">
          <div className="disclaimer-card">
            <p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="disclaimer-page">
      <div className="container">
        <div className="disclaimer-card">
          {/* Step 1: Disclaimer */}
          {currentStep === 'disclaimer' && !isAuthenticated && (
            <>
              <h1>Before you begin</h1>
              <p className="disclaimer-intro">
                Access Compass by Flare Access is:
              </p>

              <ul className="disclaimer-list is-list">
                <li>A guided self-review and action planning tool</li>
                <li>Designed to help you identify and prioritise access improvements</li>
                <li>A starting point for building more accessible experiences</li>
              </ul>

              <p className="disclaimer-intro not-intro">
                It is not:
              </p>

              <ul className="disclaimer-list not-list">
                <li>A compliance audit</li>
                <li>A certification or accreditation</li>
                <li>Legal verification or professional sign-off</li>
                <li>A substitute for professional accessibility advice</li>
              </ul>

              <div className="professional-note">
                <p>
                  For complex issues or compliance verification, we recommend engaging a qualified access consultant or relevant professional.
                </p>
              </div>

              <div className="understanding-section">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={understood}
                    onChange={(e) => setUnderstood(e.target.checked)}
                  />
                  <span className="checkbox-text">
                    I understand that Access Compass is a self-review tool designed to help me plan accessibility improvements. It does not provide compliance certification or replace professional accessibility advice.
                  </span>
                </label>
              </div>

              <div className="disclaimer-actions">
                <Link to="/" className="btn btn-secondary">
                  ← Back
                </Link>
                <button
                  className="btn btn-primary"
                  onClick={() => setCurrentStep('auth')}
                  disabled={!understood}
                >
                  I understand, continue
                </button>
              </div>
            </>
          )}

          {/* Step 2: Authentication */}
          {currentStep === 'auth' && (
            <>
              <h1>{isSignUp ? 'Create your account' : 'Sign in'}</h1>
              <p className="auth-subtitle">
                {isSignUp
                  ? 'Your account saves your progress so you can return anytime.'
                  : 'Welcome back! Sign in to continue your accessibility journey.'}
              </p>

              {error && (
                <div className="auth-message auth-error" role="alert">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="auth-message auth-success" role="status">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="email">Email address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete={isSignUp ? 'new-password' : 'current-password'}
                      placeholder={isSignUp ? 'Min 8 characters' : 'Enter your password'}
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

                {isSignUp && (
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        placeholder="Confirm your password"
                        minLength={8}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary auth-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Please wait...' : (isSignUp ? 'Create account' : 'Sign in')}
                </button>
              </form>

              <div className="auth-switch">
                {isSignUp ? (
                  <p>
                    Already have an account?{' '}
                    <button type="button" className="text-link" onClick={toggleAuthMode}>
                      Sign in
                    </button>
                  </p>
                ) : (
                  <p>
                    Don't have an account?{' '}
                    <button type="button" className="text-link" onClick={toggleAuthMode}>
                      Create one
                    </button>
                  </p>
                )}
              </div>

              <div className="disclaimer-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setCurrentStep('disclaimer')}
                >
                  ← Back
                </button>
              </div>
            </>
          )}

          {/* Step 3: Organisation */}
          {currentStep === 'organisation' && (
            <>
              <div className="step-header-with-action">
                <h1>Join or create an organisation</h1>
                <button
                  type="button"
                  className="text-link logout-link"
                  onClick={() => {
                    console.log('[Disclaimer] Forcing sign out - clearing all local storage');
                    // Force clear all Supabase auth data from localStorage
                    Object.keys(localStorage).forEach(key => {
                      if (key.startsWith('sb-') || key.includes('supabase')) {
                        localStorage.removeItem(key);
                      }
                    });
                    sessionStorage.clear();
                    // Reload the page
                    window.location.href = '/disclaimer';
                  }}
                >
                  Sign out
                </button>
              </div>
              <p className="auth-subtitle">
                Connect with your team to share progress and collaborate on accessibility improvements.
              </p>

              {error && (
                <div className="auth-message auth-error" role="alert">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="auth-message auth-success" role="status">
                  {successMessage}
                </div>
              )}

              {orgOption === 'none' && (
                <div className="org-options">
                  <button
                    type="button"
                    className="org-option-card"
                    onClick={() => setOrgOption('create')}
                  >
                    <div className="org-option-icon-wrapper create">
                      <span className="org-option-icon">+</span>
                    </div>
                    <div className="org-option-text">
                      <span className="org-option-title">Create new organisation</span>
                      <span className="org-option-desc">
                        Set up your organisation and invite your team to collaborate
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="org-option-card"
                    onClick={() => setOrgOption('invite')}
                  >
                    <div className="org-option-icon-wrapper join">
                      <span className="org-option-icon">&#8594;</span>
                    </div>
                    <div className="org-option-text">
                      <span className="org-option-title">I have an invite code</span>
                      <span className="org-option-desc">
                        Join your team's existing organisation with a code
                      </span>
                    </div>
                  </button>
                </div>
              )}

              {orgOption === 'invite' && (
                <form onSubmit={handleJoinWithCode} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="inviteCode">Invite code</label>
                    <input
                      type="text"
                      id="inviteCode"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      required
                      placeholder="Enter your invite code"
                      style={{ textTransform: 'uppercase' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary auth-submit"
                    disabled={isSubmitting || !inviteCode}
                  >
                    {isSubmitting ? 'Joining...' : 'Join organisation'}
                  </button>

                  <button
                    type="button"
                    className="text-link"
                    onClick={() => { setOrgOption('none'); setError(null); }}
                    style={{ marginTop: '1rem', display: 'block', textAlign: 'center', width: '100%' }}
                  >
                    ← Back to options
                  </button>
                </form>
              )}

              {orgOption === 'create' && (
                <form onSubmit={handleCreateOrg} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="orgName">Organisation name</label>
                    <input
                      type="text"
                      id="orgName"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      required
                      placeholder="Your organisation name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="orgSize">Organisation size</label>
                    <select
                      id="orgSize"
                      value={orgSize}
                      onChange={(e) => setOrgSize(e.target.value as typeof orgSize)}
                      required
                    >
                      <option value="small">Small (1-10 employees)</option>
                      <option value="medium">Medium (11-50 employees)</option>
                      <option value="large">Large (51-200 employees)</option>
                      <option value="enterprise">Enterprise (200+ employees)</option>
                    </select>
                    <p className="field-hint">This determines how many team members can be invited</p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="contactName">Your name</label>
                    <input
                      type="text"
                      id="contactName"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contactEmail">Contact email</label>
                    <input
                      type="email"
                      id="contactEmail"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                      placeholder="contact@example.com"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary auth-submit"
                    disabled={isSubmitting || !orgName || !contactName || !contactEmail}
                  >
                    {isSubmitting ? 'Creating...' : 'Create organisation'}
                  </button>

                  <button
                    type="button"
                    className="text-link"
                    onClick={() => { setOrgOption('none'); setError(null); }}
                    style={{ marginTop: '1rem', display: 'block', textAlign: 'center', width: '100%' }}
                  >
                    ← Back to options
                  </button>
                </form>
              )}

              <div className="disclaimer-actions" style={{ marginTop: orgOption === 'none' ? '2rem' : '0' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    // Sign out and go back to start
                    Object.keys(localStorage).forEach(key => {
                      if (key.startsWith('sb-') || key.includes('supabase')) {
                        localStorage.removeItem(key);
                      }
                    });
                    sessionStorage.clear();
                    window.location.href = '/disclaimer';
                  }}
                >
                  ← Back
                </button>
              </div>
            </>
          )}

          {/* Step 4: Complete */}
          {currentStep === 'complete' && (
            <>
              <div className="complete-section">
                <span className="complete-icon">✓</span>
                <h1>You're all set!</h1>

                {accessState.organisation && (
                  <p className="complete-org">
                    Organisation: <strong>{accessState.organisation.name}</strong>
                  </p>
                )}

                {successMessage && (
                  <div className="auth-message auth-success" role="status">
                    {successMessage}
                  </div>
                )}
              </div>

              <div className="disclaimer-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleContinue}
                >
                  Continue to setup
                </button>
              </div>

              <div className="complete-signout">
                <button
                  type="button"
                  className="text-link logout-link"
                  onClick={() => {
                    console.log('[Disclaimer] Forcing sign out - clearing all local storage');
                    // Force clear all Supabase auth data from localStorage
                    Object.keys(localStorage).forEach(key => {
                      if (key.startsWith('sb-') || key.includes('supabase')) {
                        localStorage.removeItem(key);
                      }
                    });
                    sessionStorage.clear();
                    // Reload the page
                    window.location.href = '/disclaimer';
                  }}
                >
                  Sign out and start over
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
