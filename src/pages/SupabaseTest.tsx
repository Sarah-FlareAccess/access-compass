import { useState } from 'react';
import { testSupabaseConnection, testDatabaseOperations } from '../utils/testSupabase';
import '../styles/form-page.css';

export default function SupabaseTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);

    // Capture console output
    const originalLog = console.log;
    const originalError = console.error;
    const logs: string[] = [];

    console.log = (...args) => {
      const msg = args.join(' ');
      logs.push(msg);
      originalLog(...args);
    };

    console.error = (...args) => {
      const msg = '❌ ' + args.join(' ');
      logs.push(msg);
      originalError(...args);
    };

    try {
      const connectionSuccess = await testSupabaseConnection();

      if (connectionSuccess) {
        logs.push('\n--- Running Database Operations Test ---\n');
        await testDatabaseOperations();
      }
    } catch (err: any) {
      logs.push(`\n❌ Error: ${err.message}`);
    }

    // Restore console
    console.log = originalLog;
    console.error = originalError;

    setResults(logs);
    setIsRunning(false);
  };

  return (
    <div className="form-page">
      <div className="container">
        <div className="form-container">
          <h1>🧪 Supabase Connection Test</h1>
          <p className="helper-text">
            Test your Supabase database connection and verify all tables are set up correctly.
          </p>

          <div style={{ marginBottom: '30px' }}>
            <h3>Before running tests:</h3>
            <ol style={{ lineHeight: '1.8', marginLeft: '20px' }}>
              <li>
                Go to{' '}
                <a
                  href="https://app.supabase.com/project/ibvqlyyvlwnwjcoehjkt/sql/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--deep-purple)', textDecoration: 'underline' }}
                >
                  Supabase SQL Editor
                </a>
              </li>
              <li>
                Copy the contents of <code>database-schema.sql</code> from your project folder
              </li>
              <li>Paste into SQL Editor and click "Run"</li>
              <li>Wait for "Success. No rows returned" message</li>
              <li>Come back here and run the test</li>
            </ol>
          </div>

          <button
            className="btn btn-primary"
            onClick={runTests}
            disabled={isRunning}
            style={{ marginBottom: '30px' }}
          >
            {isRunning ? 'Running Tests...' : 'Run Connection Test'}
          </button>

          {results.length > 0 && (
            <div
              className="card"
              style={{
                background: '#1e1e1e',
                color: '#e0e0e0',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                maxHeight: '500px',
                overflowY: 'auto',
              }}
            >
              <h3 style={{ color: '#fff', marginBottom: '15px' }}>Test Results:</h3>
              {results.map((line, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: '8px',
                    color: line.includes('✅')
                      ? '#4ade80'
                      : line.includes('❌')
                      ? '#f87171'
                      : line.includes('🎉')
                      ? '#60a5fa'
                      : '#e0e0e0',
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '40px', padding: '20px', background: 'var(--ivory)', borderRadius: 'var(--radius-md)' }}>
            <h3>Environment Check:</h3>
            <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', marginTop: '15px' }}>
              <div style={{ marginBottom: '10px' }}>
                <strong>VITE_SUPABASE_URL:</strong>{' '}
                {import.meta.env.VITE_SUPABASE_URL ? (
                  <span style={{ color: 'green' }}>✅ Set</span>
                ) : (
                  <span style={{ color: 'red' }}>❌ Not set</span>
                )}
              </div>
              <div>
                <strong>VITE_SUPABASE_ANON_KEY:</strong>{' '}
                {import.meta.env.VITE_SUPABASE_ANON_KEY ? (
                  <span style={{ color: 'green' }}>✅ Set</span>
                ) : (
                  <span style={{ color: 'red' }}>❌ Not set</span>
                )}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <a href="/" className="btn btn-secondary">
              Back to App
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
