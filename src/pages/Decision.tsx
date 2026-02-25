// ============================================
// ACCESS COMPASS - DECISION PAGE (PAYWALL)
// ============================================
// Two-state single-page flow:
// State 1: Pathway choice (Pulse vs Deep Dive) - no pricing
// State 2: Commitment (org size, pricing, auth) - revealed on same page
// ============================================
//
// TODO: PRE-LAUNCH PAYMENT INTEGRATION
// ============================================
// The following payment logic needs to be implemented before launch:
//
// 1. ENTITLEMENT CHECKING
//    - Check user's current subscription tier (gov, enterprise, pay-as-you-go)
//    - Government users: Full access to all modules
//    - Enterprise users: Full access based on subscription
//    - Pay-as-you-go users: Need to pay for additional modules
//
// 2. MODULE ACCESS LOGIC
//    - Show which modules are "included" in current package
//    - Show which modules require "additional cost" for upgrades
//    - Calculate upgrade cost based on module bundle differences
//
// 3. UPGRADE FLOW FOR PAY-AS-YOU-GO USERS
//    - Display clear pricing for module additions
//    - Handle payment processing (Stripe integration)
//    - Update user entitlements after successful payment
//
// 4. SUBSCRIPTION MANAGEMENT
//    - Handle subscription changes (upgrades/downgrades)
//    - Prorate charges for mid-cycle changes
//    - Display subscription status and renewal info
//
// 5. DIFFERENT USER TYPE HANDLING
//    - Government: hasGovernmentAccess flag → bypass payment
//    - Enterprise: Check organisation subscription level
//    - Individual: Pay-as-you-go with module-based pricing
//
// ============================================

import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getSession } from '../utils/session';
import { calculatePrice } from '../lib/pricingEngine';
import type { BusinessSizeTier, ModuleBundle, AccessLevel } from '../types/access';
import { usePageTitle } from '../hooks/usePageTitle';
import './Decision.css';

// ============================================
// CONSTANTS
// ============================================

const CONSULT_BOOKING_URL = import.meta.env.VITE_CONSULT_BOOKING_URL || '#';

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
  usePageTitle('Get Started');
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
  // TODO: PRE-LAUNCH - Re-enable this redirect once payment is integrated
  // Currently disabled so users can always select their pathway (Pulse/Deep Dive)
  // After payment integration, this should redirect users who already have access

  // useEffect(() => {
  //   if (!authLoading && isAuthenticated && accessState.hasAccess) {
  //     navigate(returnTo, { replace: true });
  //   }
  // }, [authLoading, isAuthenticated, accessState, navigate, returnTo]);

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
        const msg = signInError.message?.toLowerCase() || '';
        if (msg.includes('invalid') || msg.includes('credentials')) {
          setError('The email or password you entered is incorrect. Please check both fields and try again.');
        } else if (msg.includes('not found') || msg.includes('no user')) {
          setError('No account found with that email address. Please check your email or create a new account.');
        } else if (msg.includes('too many') || msg.includes('rate')) {
          setError('Too many sign-in attempts. Please wait a few minutes before trying again.');
        } else {
          setError(signInError.message || 'Unable to sign in. Please check your email and password, then try again.');
        }
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
        const msg = signUpError.message?.toLowerCase() || '';
        if (msg.includes('already') || msg.includes('exists')) {
          setError('An account with this email already exists. Please sign in instead, or use a different email.');
        } else if (msg.includes('password') && (msg.includes('weak') || msg.includes('short') || msg.includes('length'))) {
          setError('Password must be at least 8 characters. Please choose a stronger password.');
        } else if (msg.includes('email') && msg.includes('invalid')) {
          setError('Please enter a valid email address (e.g. you@example.com).');
        } else {
          setError(signUpError.message || 'Unable to create account. Please check your details and try again.');
        }
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
      setError(resetError.message || 'Unable to send reset email. Please check that the email address is correct.');
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
      {/* Hero Header */}
      <div className="pathway-hero pathway-hero-light">
        <div className="pathway-hero-content">
          <h1>Choose your accessibility path</h1>
          <p className="pathway-hero-subtitle">
            Two pathways, one goal. Pick the approach that fits where you're at right now.
          </p>
        </div>
      </div>

      {/* Recommendation Banner */}
      {recommendedMode && (
        <div className="recommendation-banner-new">
          <div className="recommendation-icon-wrap">
            <span className="recommendation-icon">💡</span>
          </div>
          <div className="recommendation-content">
            <span className="recommendation-label">Based on your discovery</span>
            <p>
              <strong>{recommendedMode === 'pulse' ? 'Pulse Check' : 'Deep Dive'}</strong> looks like a great fit for your organisation.
            </p>
          </div>
        </div>
      )}

      {/* Pathway Cards */}
      <div className="pathway-choice-grid">
        {/* Pulse Check */}
        <div className={`pathway-choice-card pulse ${selectedPathway === 'pulse' ? 'selected' : ''} ${recommendedMode === 'pulse' ? 'recommended' : ''}`}>
          <div className="pathway-choice-header">
            <div className="pathway-icon-circle pulse">
              <span>⚡</span>
            </div>
            <div className="pathway-meta">
              <h2>Pulse Check</h2>
              <span className="pathway-tagline-new">Quick wins, clear direction</span>
            </div>
          </div>

          <p className="pathway-description">
            Get a snapshot of where you stand and a practical action plan to start making progress immediately.
          </p>

          <div className="pathway-features">
            <div className="pathway-feature">
              <span className="feature-icon">✓</span>
              <span>Identify quick wins and priorities</span>
            </div>
            <div className="pathway-feature">
              <span className="feature-icon">✓</span>
              <span>Practical action plan with resources</span>
            </div>
            <div className="pathway-feature">
              <span className="feature-icon">✓</span>
              <span>Progress tracking dashboard</span>
            </div>
            <div className="pathway-feature">
              <span className="feature-icon">✓</span>
              <span>Self-guided, expert-curated content</span>
            </div>
          </div>

          <div className="pathway-ideal">
            <span className="ideal-label">Ideal for</span>
            <span className="ideal-text">Getting started or limited resources</span>
          </div>

          <button
            className="btn-pathway-choice pulse"
            onClick={() => handlePathwaySelect('pulse')}
          >
            <span>Start with Pulse Check</span>
            <span className="btn-arrow">→</span>
          </button>
        </div>

        {/* Deep Dive */}
        <div className={`pathway-choice-card deep ${selectedPathway === 'deep_dive' ? 'selected' : ''} ${recommendedMode === 'deep_dive' ? 'recommended' : ''}`}>
          <div className="pathway-choice-badge">Most Comprehensive</div>
          <div className="pathway-choice-header">
            <div className="pathway-icon-circle deep">
              <span>🎯</span>
            </div>
            <div className="pathway-meta">
              <h2>Deep Dive</h2>
              <span className="pathway-tagline-new">Full strategy, expert support</span>
            </div>
          </div>

          <p className="pathway-description">
            Build a comprehensive Disability Inclusion Action Plan with professional guidance and ongoing support.
          </p>

          <div className="pathway-features">
            <div className="pathway-feature highlight">
              <span className="feature-icon">★</span>
              <span>Everything in Pulse Check, plus:</span>
            </div>
            <div className="pathway-feature">
              <span className="feature-icon">✓</span>
              <span>Full DIAP builder with templates</span>
            </div>
            <div className="pathway-feature">
              <span className="feature-icon">✓</span>
              <span>Multi-site and precinct management</span>
            </div>
            <div className="pathway-feature">
              <span className="feature-icon">✓</span>
              <span>Consultation session included</span>
            </div>
          </div>

          <div className="pathway-ideal">
            <span className="ideal-label">Ideal for</span>
            <span className="ideal-text">Serious commitment or compliance needs</span>
          </div>

          <button
            className="btn-pathway-choice deep"
            onClick={() => handlePathwaySelect('deep_dive')}
          >
            <span>Go Deep Dive</span>
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </div>

      {/* Reassurance */}
      <div className="pathway-reassurance-new">
        <div className="reassurance-icon">🔄</div>
        <p>
          <strong>No pressure.</strong> You can always upgrade from Pulse Check to Deep Dive later. Your progress is always saved.
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

        {/* Organisation Size Selector and Pricing - HIDDEN FOR NOW */}
        {false && (
          <>
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

            <div className="commitment-pricing">
              <div className="price-display">
                {pricing?.isPurchasable ? (
                  <>
                    <span className="price-amount-large">{pricing?.label}</span>
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
                <h3>What's included:</h3>
                <ul>
                  {pricing?.inclusions.map((item, i) => (
                    <li key={i}>
                      <span className="inclusion-check">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {/* Proceed Button - Auth bypassed for development */}
        {/*
          TODO: PRE-LAUNCH - Replace this with proper payment/entitlement flow:
          1. Check if user has entitlement for selected pathway
          2. If gov/enterprise user → proceed directly
          3. If pay-as-you-go → show payment modal/checkout
          4. After payment success → update entitlements, then proceed
          5. Handle upgrade scenarios (Pulse → Deep Dive)
        */}
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

        {error && <div id="decision-login-error" className="message error-message" role="alert">{error}</div>}
        {successMessage && <div className="message success-message" role="status">{successMessage}</div>}

        <form onSubmit={handleSignIn} className="auth-form" aria-busy={isProcessing}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <span className="field-hint">you@example.com</span>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              aria-invalid={!!error}
              aria-describedby={error ? 'decision-login-error' : undefined}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <span className="field-hint">Your password</span>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                aria-invalid={!!error}
                aria-describedby={error ? 'decision-login-error' : undefined}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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

        {error && <div id="decision-signup-error" className="message error-message" role="alert">{error}</div>}
        {successMessage && <div className="message success-message" role="status">{successMessage}</div>}

        <form onSubmit={handleSignUp} className="auth-form" aria-busy={isProcessing}>
          <div className="form-group">
            <label htmlFor="signup-email">Email</label>
            <span className="field-hint">you@example.com</span>
            <input
              type="email"
              id="signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              aria-invalid={!!error}
              aria-describedby={error ? 'decision-signup-error' : undefined}
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-password">Password</label>
            <span className="field-hint">Create a password (minimum 8 characters)</span>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="signup-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
                autoComplete="new-password"
                aria-invalid={!!error}
                aria-describedby={error ? 'decision-signup-error' : undefined}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
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

        {error && <div id="decision-reset-error" className="message error-message" role="alert">{error}</div>}
        {successMessage && <div className="message success-message" role="status">{successMessage}</div>}

        <form onSubmit={handleResetPassword} className="auth-form" aria-busy={isProcessing}>
          <div className="form-group">
            <label htmlFor="reset-email">Email</label>
            <span className="field-hint">you@example.com</span>
            <input
              type="email"
              id="reset-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              aria-invalid={!!error}
              aria-describedby={error ? 'decision-reset-error' : undefined}
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

        {error && <div id="decision-invite-error" className="message error-message" role="alert">{error}</div>}
        {successMessage && <div className="message success-message" role="status">{successMessage}</div>}

        {!isAuthenticated && (
          <div className="message info-message">
            You'll need to sign in first to join an organisation.
          </div>
        )}

        <form onSubmit={handleJoinOrg} className="auth-form" aria-busy={isProcessing}>
          <div className="form-group">
            <label htmlFor="inviteCode">Invite code</label>
            <span className="field-hint">e.g., COMPANY2024</span>
            <input
              type="text"
              id="inviteCode"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              required
              autoComplete="off"
              aria-invalid={!!error}
              aria-describedby={error ? 'decision-invite-error' : undefined}
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

        {/* Back to adjust modules */}
        <div className="back-link-wrapper">
          <Link to="/discovery?modules=true" className="back-link">← Back to adjust modules</Link>
        </div>
      </div>
    </div>
  );
}
