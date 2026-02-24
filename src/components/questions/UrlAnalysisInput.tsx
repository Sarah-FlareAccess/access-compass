/**
 * URL Analysis Input Component
 *
 * Allows users to input a URL and receive AI-powered feedback
 * on their accessibility information page.
 * Results are saved for the report without displaying during the checklist.
 */

import { useState, useEffect } from 'react';
import {
  useUrlAnalysis,
  type UrlAnalysisResult,
} from '../../hooks/useUrlAnalysis';
import './url-analysis.css';

interface UrlAnalysisInputProps {
  currentValue?: {
    url: string;
    analysisDate: string;
    overallScore: number;
    overallStatus: 'excellent' | 'good' | 'needs-improvement' | 'missing';
    summary: string;
    strengths: string[];
    improvements: string[];
    parameterResults: Array<{
      parameterId: string;
      parameterName: string;
      status: 'excellent' | 'good' | 'needs-improvement' | 'missing';
      score: number;
      feedback: string;
      suggestions?: string[];
      evidenceFound?: string[];
    }>;
    disclaimer: string;
  };
  onSubmit: (result: UrlAnalysisResult) => void;
  onSkip: () => void;
}

export function UrlAnalysisInput({ currentValue, onSubmit, onSkip }: UrlAnalysisInputProps) {
  const [url, setUrl] = useState(currentValue?.url || '');
  const [analyzed, setAnalyzed] = useState(!!currentValue);
  const [analysisResult, setAnalysisResult] = useState<UrlAnalysisResult | null>(
    currentValue || null
  );
  const { isAnalyzing, error, analyzeUrl, reset } = useUrlAnalysis();

  // If we have a currentValue, mark as analyzed
  useEffect(() => {
    if (currentValue) {
      setAnalyzed(true);
      setAnalysisResult(currentValue as UrlAnalysisResult);
    }
  }, [currentValue]);

  const handleAnalyze = async () => {
    if (!url.trim()) return;

    // Ensure URL has protocol
    let urlToAnalyze = url.trim();
    if (!urlToAnalyze.startsWith('http://') && !urlToAnalyze.startsWith('https://')) {
      urlToAnalyze = 'https://' + urlToAnalyze;
      setUrl(urlToAnalyze);
    }

    const analysisResultData = await analyzeUrl(urlToAnalyze);
    if (analysisResultData) {
      setAnalyzed(true);
      setAnalysisResult(analysisResultData);
    }
  };

  const handleSubmit = () => {
    if (analysisResult) {
      onSubmit(analysisResult);
    }
  };

  const handleChange = () => {
    reset();
    setAnalyzed(false);
    setAnalysisResult(null);
    setUrl('');
  };

  // Input mode
  if (!analyzed) {
    return (
      <div className="url-analysis-input">
        <div className="url-input-container">
          <label htmlFor="url-analysis-field">Website URL to analyse</label>
          <span className="field-hint">e.g., https://yourwebsite.com/accessibility</span>
          <div className="url-input-wrapper">
            <span className="url-input-icon">🔗</span>
            <input
              type="url"
              id="url-analysis-field"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://"
              className="url-input-field"
              disabled={isAnalyzing}
            />
          </div>
          {error && <p className="url-error">{error}</p>}
        </div>

        <div className="url-input-actions">
          <button
            className="btn-analyze"
            onClick={handleAnalyze}
            disabled={!url.trim() || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <span className="analyzing-spinner"></span>
                Analysing...
              </>
            ) : (
              <>
                <span className="analyze-icon">🔍</span>
                Analyse & Save
              </>
            )}
          </button>
          <button className="btn-skip-analysis" onClick={onSkip}>
            Skip this step
          </button>
        </div>

        <div className="url-input-note">
          <p>
            We'll review your accessibility information and save the analysis for your report.
            The detailed feedback will be included when you export your results.
          </p>
        </div>
      </div>
    );
  }

  // Confirmation mode - simple success message
  if (analysisResult) {
    return (
      <div className="url-analysis-confirmation">
        <div className="confirmation-icon">
          <span>✓</span>
        </div>

        <div className="confirmation-content">
          <h4>Accessibility Information Analysed</h4>
          <div className="analyzed-url">
            <span className="url-label">Page:</span>
            <a href={analysisResult.url} target="_blank" rel="noopener noreferrer" className="url-link">
              {analysisResult.url}
            </a>
          </div>
          <p className="confirmation-message">
            Your accessibility information has been analysed and the detailed feedback
            has been saved. You'll see the full analysis in your report.
          </p>
        </div>

        <div className="confirmation-actions">
          <button className="btn-change-url" onClick={handleChange}>
            Analyse Different URL
          </button>
          <button className="btn-continue-confirmed" onClick={handleSubmit}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default UrlAnalysisInput;
