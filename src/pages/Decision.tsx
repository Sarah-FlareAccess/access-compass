// ============================================
// ACCESS COMPASS - DECISION PAGE (PAYWALL)
// ============================================
// Two-state single-page flow:
// State 1: Pathway choice (Pulse vs Deep Dive) - no pricing
// State 2: Commitment (org size, pricing, auth) - revealed on same page
// ============================================

import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getSession } from '../utils/session';
import { calculatePrice, isPurchasable } from '../lib/pricingEngine';
import type { BusinessSizeTier, ModuleBundle, AccessLevel } from '../types/access';
import './Decision.css';

// ============================================
// CONSTANTS
// ============================================

const CONSULT_BOOKING_URL = import.meta.env.VITE_CONSULT_BOOKING_URL || '#';
const SALES_BOOKING_URL = import.meta.env.VITE_SALES_BOOKING_URL || CONSULT_BOOKING_URL;

const SIZE_TIER_OPTIONS: { value: BusinessSizeTier; label: string; description: string }[] = [
  { value: 'small', label: 'Small', description: '1-20 staff' },
  { value: 'medium', label: 'Medium', description: '21-100 staff' },
  { value: 'large', label: 'Large', description: '100+ staff' },
  { value: 'enterprise', label: 'Enterprise', description: 'Multi-site or precinct' },
];

type DecisionStep = 'pathway-choice' | 'commitment' | 'login' | 'signup' | 'forgot-password' | 'invite-code';

// ============================================
// COMPONENT
// ============================================

export default function Decision() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    isAuthenticated,
    isLoading: authLoading,
    accessState,
    signIn,
    signUp,
    resetPassword,
    joinOrganisation,
    mergeAnonymousSession,
  } = useAuth();

  // ============================================
  // LOCAL STATE
  // ============================================

  const [step, setStep] = useState<DecisionStep>('pathway-choice');
  const [selectedPathway, setSelectedPathway] = useState<AccessLevel | null>(null);
  const [selectedTier, setSelectedTier] = useState<BusinessSizeTier>('small');
  const [selectedBundle] = useState<ModuleBundle>('core');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // ============================================
  // SESSION DATA
  // ============================================

  const session = getSession();
  const returnTo = searchParams.get('returnTo') || '/dashboard';

  // Get recommendation from session (passed from ReviewModeSelection)
  const recommendedMode = searchParams.get('recommended') as AccessLevel | null;

  // Debug logging
  useEffect(() => {
    console.log('Decision page state:', {
      step,
      recommendedMode,
      isAuthenticated,
      authLoading,
      hasAccess: accessState.hasAccess
    });
  }, [step, recommendedMode, isAuthenticated, authLoading, accessState]);

  // ============================================
  // INITIALIZE TIER FROM SESSION
  // ============================================

  useEffect(() => {
    const orgSize = session?.business_snapshot?.organisation_size;
    if (orgSize && SIZE_TIER_OPTIONS.some(opt => opt.value === orgSize)) {
      setSelectedTier(orgSize as BusinessSizeTier);
    }
  }, [session]);

  // ============================================
  // REDIRECT IF ALREADY HAS ACCESS
  // ============================================

  useEffect(() => {
    if (!authLoading && isAuthenticated && accessState.hasAccess) {
      navigate(returnTo, { replace: true });
    }
  }, [authLoading, isAuthenticated, accessState, navigate, returnTo]);

  // ============================================
  // PRICING CALCULATIONS
  // ============================================

  const pricing = useMemo(() => {
    if (!selectedPathway) return null;
    const bundle = selectedPathway === 'pulse' ? selectedBundle : 'full';
    return calculatePrice(selectedTier, selectedPathway, bundle);
  }, [selectedTier, selectedPathway, selectedBundle]);

  // ============================================
  // HANDLERS
  // ============================================

  const handlePathwaySelect = (pathway: AccessLevel) => {
    setSelectedPathway(pathway);
    setStep('commitment');
    // Smooth scroll to commitment section
    setTimeout(() => {
      document.getElementById('commitment-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleProceed = async () => {
    if (!isAuthenticated) {
      setStep('login');
      return;
    }

    if (!selectedPathway) return;

    if (isPurchasable(selectedTier, selectedPathway)) {
      const bundle = selectedPathway === 'pulse' ? selectedBundle : 'full';
      const checkoutUrl = `/checkout?tier=${selectedTier}&level=${selectedPathway}&bundle=${bundle}`;
      navigate(checkoutUrl);
    } else {
      window.open(SALES_BOOKING_URL, '_blank');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[handleSignIn] Starting signin for:', email);
    setIsProcessing(true);
    setError(null);

    try {
      console.log('[handleSignIn] Calling signIn...');
      const { error: signInError } = await signIn(email, password);
      console.log('[handleSignIn] SignIn result:', { error: signInError });

      if (signInError) {
        console.error('[handleSignIn] SignIn error:', signInError);
        setError(signInError.message);
        setIsProcessing(false);
        return;
      }

      console.log('[handleSignIn] SignIn successful');

      if (session?.session_id) {
        console.log('[handleSignIn] Merging anonymous session...');
        await mergeAnonymousSession(session.session_id);
      }

      setIsProcessing(false);
      setStep('commitment');
    } catch (err) {
      console.error('[handleSignIn] Exception:', err);
      setError('Failed to sign in. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[handleSignUp] Starting signup for:', email);
    setIsProcessing(true);
    setError(null);

    try {
      console.log('[handleSignUp] Calling signUp...');
      const { error: signUpError } = await signUp(email, password);
      console.log('[handleSignUp] SignUp result:', { error: signUpError });

      if (signUpError) {
        console.error('[handleSignUp] SignUp error:', signUpError);
        setError(signUpError.message);
        setIsProcessing(false);
        return;
      }

      console.log('[handleSignUp] SignUp successful');
      setSuccessMessage('Account created! You can now sign in.');
      setIsProcessing(false);
      setStep('login');
    } catch (err) {
      console.error('[handleSignUp] Exception:', err);
      setError('Failed to create account. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    const { error: resetError } = await resetPassword(email);

    if (resetError) {
      setError(resetError.message);
      setIsProcessing(false);
      return;
    }

    setSuccessMessage('Check your email for password reset instructions.');
    setIsProcessing(false);
    setStep('login');
  };

  const handleJoinOrg = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Joining org. Auth state:', { isAuthenticated, inviteCode });

    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      setError('Please sign in first to join an organisation');
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log('Calling joinOrganisation...');
      const { error: joinError, organisation } = await joinOrganisation(inviteCode);

      console.log('Join result:', { joinError, organisation });

      if (joinError) {
        setError(joinError);
        setIsProcessing(false);
        return;
      }

      if (accessState.hasAccess) {
        console.log('Has access, navigating to dashboard');
        navigate(returnTo, { replace: true });
      } else {
        console.log('Joined but no access yet');
        setSuccessMessage(`Joined ${organisation?.name}. You can now proceed.`);
        setStep('pathway-choice');
      }

      setIsProcessing(false);
    } catch (err) {
      console.error('Join org error:', err);
      setError('Failed to join organisation. Please try again.');
      setIsProcessing(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const handleChangePathway = () => {
    setStep('pathway-choice');
    setSelectedPathway(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============================================
  // RENDER: PATHWAY CHOICE (State 1)
  // ============================================

  const renderPathwayChoice = () => (
    <>
      {/* Header */}
      <div className="decision-header">
        <h1>Select your pathway</h1>
        <p className="decision-subtitle">
          Choose the level of support that fits where you're at right now.
        </p>
      </div>

      {/* Recommendation Banner */}
      {recommendedMode && (
        <div className="recommendation-banner">
          <span className="recommendation-icon">💡</span>
          <p>
            Based on what you've told us, <strong>{recommendedMode === 'pulse' ? 'Pulse Check' : 'Deep Dive'}</strong> is recommended for your organisation.
          </p>
        </div>
      )}

      {/* Pathway Cards */}
      <div className="pathway-cards-simple">
        {/* Pulse Check */}
        <div className={`pathway-card-simple ${selectedPathway === 'pulse' ? 'selected' : ''}`}>
          <h2>Pulse Check</h2>
          <p className="pathway-outcome">Get clear direction fast</p>
          <ul className="pathway-outcomes">
            <li>Identify quick wins and priorities</li>
            <li>Practical action plan with resources</li>
            <li>Progress tracking dashboard</li>
            <li>Self-guided with expert-curated content</li>
          </ul>
          <button
            className="btn-pathway-simple"
            onClick={() => handlePathwaySelect('pulse')}
          >
            Continue with Pulse Check →
          </button>
        </div>

        {/* Deep Dive */}
        <div className={`pathway-card-simple ${selectedPathway === 'deep_dive' ? 'selected' : ''}`}>
          <div className="pathway-badge-simple">Most comprehensive</div>
          <h2>Deep Dive</h2>
          <p className="pathway-outcome">Build a structured plan you can deliver</p>
          <ul className="pathway-outcomes">
            <li>Everything in Pulse Check, plus:</li>
            <li>Full DIAP (Disability Inclusion Action Plan) builder</li>
            <li>Multi-site and precinct management</li>
            <li>Consultation session included</li>
          </ul>
          <button
            className="btn-pathway-simple btn-deep-dive"
            onClick={() => handlePathwaySelect('deep_dive')}
          >
            Continue with Deep Dive →
          </button>
        </div>
      </div>

      {/* Reassurance */}
      <div className="pathway-reassurance">
        <p>
          You can always upgrade from Pulse Check to Deep Dive later. Your progress is always saved.
        </p>
      </div>
    </>
  );

  // ============================================
  // RENDER: COMMITMENT (State 2 - revealed)
  // ============================================

  const renderCommitment = () => {
    if (!selectedPathway || !pricing) return null;

    return (
      <div id="commitment-section" className="commitment-section">
        <div className="commitment-divider" />

        <div className="commitment-header">
          <h2>You've selected: {selectedPathway === 'pulse' ? 'Pulse Check' : 'Deep Dive'}</h2>
          <button className="link-btn-small" onClick={handleChangePathway}>
            Change pathway
          </button>
        </div>

        {/* Organisation Size Selector */}
        <div className="tier-selector">
          <label className="tier-label">Your organisation size:</label>
          <div className="tier-options">
            {SIZE_TIER_OPTIONS.map((tier) => (
              <button
                key={tier.value}
                className={`tier-option ${selectedTier === tier.value ? 'selected' : ''}`}
                onClick={() => setSelectedTier(tier.value)}
                type="button"
              >
                <span className="tier-option-label">{tier.label}</span>
                <span className="tier-option-desc">{tier.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="commitment-pricing">
          <div className="price-display">
            {pricing.isPurchasable ? (
              <>
                <span className="price-amount-large">{pricing.label}</span>
                <span className="price-suffix-large">AUD + GST</span>
              </>
            ) : (
              <>
                <span className="price-starting">From</span>
                <span className="price-amount-large">$10,000</span>
                <span className="price-suffix-large">AUD + GST (enterprise and precinct)</span>
              </>
            )}
          </div>

          <div className="commitment-inclusions">
            <h4>What's included:</h4>
            <ul>
              {pricing.inclusions.map((item, i) => (
                <li key={i}>
                  <span className="inclusion-check">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Proceed Button - Auth bypassed for development */}
        <div className="commitment-actions">
          <button
            className="btn-primary-large"
            onClick={() => navigate('/dashboard')}
            disabled={isProcessing}
          >
            Continue to Dashboard →
          </button>
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER: AUTH VIEWS
  // ============================================

  const renderLoginView = () => (
    <div className="decision-page">
      <div className="auth-container">
        <button className="back-btn" onClick={() => { clearMessages(); setStep('commitment'); }}>
          ← Back
        </button>

        <h2>Sign in</h2>
        <p className="auth-subtitle">Sign in to continue with your purchase</p>

        {error && <div className="message error-message">{error}</div>}
        {successMessage && <div className="message success-message">{successMessage}</div>}

        <form onSubmit={handleSignIn} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={isProcessing}>
            {isProcessing ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="auth-links">
          <button
            className="link-btn"
            onClick={() => { clearMessages(); setStep('forgot-password'); }}
          >
            Forgot password?
          </button>
        </div>

        <div className="auth-switch">
          <p>
            Don't have an account?{' '}
            <button className="link-btn" onClick={() => { clearMessages(); setStep('signup'); }}>
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );

  const renderSignupView = () => (
    <div className="decision-page">
      <div className="auth-container">
        <button className="back-btn" onClick={() => { clearMessages(); setStep('commitment'); }}>
          ← Back
        </button>

        <h2>Create account</h2>
        <p className="auth-subtitle">Create an account to get started</p>

        {error && <div className="message error-message">{error}</div>}
        {successMessage && <div className="message success-message">{successMessage}</div>}

        <form onSubmit={handleSignUp} className="auth-form">
          <div className="form-group">
            <label htmlFor="signup-email">Email</label>
            <input
              type="email"
              id="signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="signup-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                minLength={8}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <span className="field-hint">Minimum 8 characters</span>
          </div>

          <button type="submit" className="btn-primary" disabled={isProcessing}>
            {isProcessing ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            Already have an account?{' '}
            <button className="link-btn" onClick={() => { clearMessages(); setStep('login'); }}>
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );

  const renderForgotPasswordView = () => (
    <div className="decision-page">
      <div className="auth-container">
        <button className="back-btn" onClick={() => { clearMessages(); setStep('login'); }}>
          ← Back to sign in
        </button>

        <h2>Reset password</h2>
        <p className="auth-subtitle">Enter your email to receive reset instructions</p>

        {error && <div className="message error-message">{error}</div>}
        {successMessage && <div className="message success-message">{successMessage}</div>}

        <form onSubmit={handleResetPassword} className="auth-form">
          <div className="form-group">
            <label htmlFor="reset-email">Email</label>
            <input
              type="email"
              id="reset-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isProcessing}>
            {isProcessing ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
      </div>
    </div>
  );

  const renderInviteCodeView = () => (
    <div className="decision-page">
      <div className="auth-container">
        <button className="back-btn" onClick={() => { clearMessages(); setStep('pathway-choice'); }}>
          ← Back
        </button>

        <h2>Organisation access</h2>
        <p className="auth-subtitle">Enter your organisation's invite code</p>

        {error && <div className="message error-message">{error}</div>}
        {successMessage && <div className="message success-message">{successMessage}</div>}

        {!isAuthenticated && (
          <div className="message info-message">
            You'll need to sign in first to join an organisation.
          </div>
        )}

        <form onSubmit={handleJoinOrg} className="auth-form">
          <div className="form-group">
            <label htmlFor="inviteCode">Invite code</label>
            <input
              type="text"
              id="inviteCode"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="e.g., COMPANY2024"
              required
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isProcessing || !isAuthenticated}
          >
            {isProcessing
              ? 'Joining...'
              : isAuthenticated
              ? 'Join organisation'
              : 'Sign in first'}
          </button>
        </form>

        {!isAuthenticated && (
          <div className="auth-switch">
            <button className="link-btn" onClick={() => { clearMessages(); setStep('login'); }}>
              Sign in to continue →
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // ============================================
  // LOADING STATE - Don't block UI while auth loads
  // ============================================

  // All views can render while auth is loading in the background
  // Auth state will be checked when needed (e.g., when submitting forms)

  // ============================================
  // RENDER AUTH VIEWS (separate pages)
  // ============================================

  if (step === 'login') return renderLoginView();
  if (step === 'signup') return renderSignupView();
  if (step === 'forgot-password') return renderForgotPasswordView();
  if (step === 'invite-code') return renderInviteCodeView();

  // ============================================
  // RENDER MAIN SINGLE-PAGE FLOW
  // ============================================

  return (
    <div className="decision-page">
      <div className="decision-container">
        {renderPathwayChoice()}
        {step === 'commitment' && renderCommitment()}

        {/* Consultation CTA */}
        <div className="consultation-cta">
          <p>Not sure which option is right for you?</p>
          <a href={CONSULT_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="link-btn">
            Book a quick chat (free) →
          </a>
        </div>

        {/* Back to Discovery */}
        <div className="back-link-wrapper">
          <Link to="/discovery" className="back-link">← Back to discovery</Link>
        </div>
      </div>
    </div>
  );
}
