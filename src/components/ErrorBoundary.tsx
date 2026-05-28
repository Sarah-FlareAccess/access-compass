import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] Caught:', error, errorInfo);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div role="alert" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: '#FFF6F0',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <div style={{
          maxWidth: '560px',
          padding: '2rem',
          background: '#fff',
          border: '1px solid rgba(62, 43, 47, 0.12)',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(62, 43, 47, 0.08)',
        }}>
          <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.75rem', color: '#3E2B2F' }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: '1rem', lineHeight: 1.5, color: '#5F4A4D', margin: '0 0 1.5rem' }}>
            Access Compass hit an unexpected error. Your saved data is safe. Try refreshing the page. If this keeps happening, let us know what you were doing and we'll fix it.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 18px',
                background: '#490E67',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
            >
              Refresh
            </button>
            <a
              href="mailto:support@accesscompass.com.au?subject=Access%20Compass%20crash%20report"
              style={{
                padding: '10px 18px',
                background: '#fff',
                color: '#3E2B2F',
                border: '1px solid rgba(62, 43, 47, 0.2)',
                borderRadius: '6px',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '0.95rem',
              }}
            >
              Report a problem
            </a>
          </div>
          {import.meta.env.DEV && this.state.error && (
            <pre style={{
              marginTop: '1.5rem',
              padding: '0.75rem',
              background: '#FFF1F2',
              border: '1px solid rgba(220, 38, 38, 0.2)',
              borderRadius: '6px',
              fontSize: '0.75rem',
              overflow: 'auto',
              color: '#7F1D1D',
              maxHeight: '200px',
            }}>
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      </div>
    );
  }
}
