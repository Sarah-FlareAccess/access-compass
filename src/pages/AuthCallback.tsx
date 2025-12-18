// ============================================
// ACCESS COMPASS - AUTH CALLBACK PAGE
// ============================================
// Handles OAuth and magic link callbacks from Supabase
// ============================================

import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { getSession } from '../utils/session';
import { useAuth } from '../hooks/useAuth';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { mergeAnonymousSession, refreshAccessState } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      // Prevent running multiple times
      if (hasRun.current) {
        console.log('[AuthCallback] Already processed, skipping');
        return;
      }
      hasRun.current = true;

      console.log('[AuthCallback] Starting...');

      if (!supabase) {
        console.error('[AuthCallback] Supabase not available');
        setStatus('error');
        setErrorMessage('Authentication service not available');
        return;
      }

      try {
        // Get the code from URL (for OAuth) or check if already signed in
        const code = searchParams.get('code');
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        console.log('[AuthCallback] URL params:', { code: !!code, errorParam });

        // Handle error from OAuth provider
        if (errorParam) {
          console.error('[AuthCallback] OAuth error:', errorParam, errorDescription);
          setStatus('error');
          setErrorMessage(errorDescription || errorParam);
          return;
        }

        // Exchange code for session if present
        if (code) {
          console.log('[AuthCallback] Exchanging code for session...');
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error('[AuthCallback] Exchange error:', error);
            setStatus('error');
            setErrorMessage(error.message);
            return;
          }
          console.log('[AuthCallback] Code exchange successful');
        }

        // Get the current session
        console.log('[AuthCallback] Getting session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        console.log('[AuthCallback] Session result:', {
          hasSession: !!session,
          hasError: !!sessionError,
          userEmail: session?.user?.email
        });

        if (sessionError) {
          console.error('[AuthCallback] Session error:', sessionError);
          setStatus('error');
          setErrorMessage(sessionError.message);
          return;
        }

        if (!session) {
          console.error('[AuthCallback] No session found');
          setStatus('error');
          setErrorMessage('No active session. Please sign in again.');
          return;
        }

        console.log('[AuthCallback] Session established for:', session.user.email);

        // Merge any anonymous session data
        const localSession = getSession();
        if (localSession?.session_id) {
          console.log('[AuthCallback] Merging anonymous session...');
          await mergeAnonymousSession(localSession.session_id);
        }

        // Refresh access state to get latest entitlements
        console.log('[AuthCallback] Refreshing access state...');
        await refreshAccessState();
        console.log('[AuthCallback] Access state refreshed');

        setStatus('success');

        // Redirect to return URL or dashboard
        const returnTo = searchParams.get('returnTo') || '/dashboard';
        console.log('[AuthCallback] Redirecting to:', returnTo);
        setTimeout(() => {
          navigate(returnTo, { replace: true });
        }, 1000);

      } catch (error) {
        console.error('[AuthCallback] Unexpected error:', error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      }
    };

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="auth-callback-page">
      <div className="callback-container">
        {status === 'processing' && (
          <>
            <div className="loading-spinner" />
            <h2>Signing you in...</h2>
            <p>Please wait while we complete the authentication.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="success-icon">✓</div>
            <h2>Success!</h2>
            <p>Redirecting you now...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="error-icon">✕</div>
            <h2>Authentication failed</h2>
            <p>{errorMessage}</p>
            <button onClick={() => navigate('/decision')} className="btn-primary">
              Try again
            </button>
          </>
        )}
      </div>

      <style>{`
        .auth-callback-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--ivory-tusk, #ece9e6);
          padding: 20px;
        }

        .callback-container {
          text-align: center;
          background: white;
          padding: 48px;
          border-radius: 20px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          max-width: 400px;
          width: 100%;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e0e0e0;
          border-top-color: #3a0b52;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 24px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .success-icon {
          width: 64px;
          height: 64px;
          background: #22c55e;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          margin: 0 auto 24px;
        }

        .error-icon {
          width: 64px;
          height: 64px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          margin: 0 auto 24px;
        }

        h2 {
          color: #3a0b52;
          margin: 0 0 12px;
          font-size: 1.5rem;
        }

        p {
          color: var(--text-muted, #6b6360);
          margin: 0 0 24px;
        }

        .btn-primary {
          padding: 14px 28px;
          background: var(--amethyst-diamond, #490E67);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(58, 11, 82, 0.3);
        }
      `}</style>
    </div>
  );
}
