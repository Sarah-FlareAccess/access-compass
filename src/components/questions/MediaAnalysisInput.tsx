/**
 * MediaAnalysisInput Component
 *
 * Allows users to upload photos, documents, or URLs for AI-powered
 * accessibility analysis of various materials and environments.
 */

import { useState, useRef, useCallback } from 'react';
import type {
  MediaAnalysisType,
  MediaAnalysisResult,
  MediaInputType,
  MediaAnalysisStatus,
  CriterionResult,
} from '../../types/mediaAnalysis';
import {
  MEDIA_TYPE_OPTIONS,
  MEDIA_CATEGORY_LABELS,
} from '../../types/mediaAnalysis';
import { getMediaAnalysisConfig } from '../../data/mediaAnalysisCriteria';
import { analyzeWithWave, isWaveApiEnabled } from '../../utils/waveApi';
import './media-analysis.css';

interface MediaAnalysisInputProps {
  /** Pre-selected analysis type (optional) */
  preselectedType?: MediaAnalysisType;
  /** Callback when analysis is complete */
  onAnalysisComplete: (result: MediaAnalysisResult) => void;
  /** Callback to skip analysis */
  onSkip: () => void;
  /** Existing analysis result to display */
  currentValue?: MediaAnalysisResult;
  /** Hint text to display */
  hint?: string;
}

// File type mappings
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const DOCUMENT_TYPES = ['application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function MediaAnalysisInput({
  preselectedType,
  onAnalysisComplete,
  onSkip,
  currentValue,
  hint,
}: MediaAnalysisInputProps) {
  const [selectedType, setSelectedType] = useState<MediaAnalysisType | null>(
    preselectedType || null
  );
  const [inputType, setInputType] = useState<MediaInputType | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MediaAnalysisResult | null>(
    currentValue || null
  );
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get config for selected type
  const config = selectedType ? getMediaAnalysisConfig(selectedType) : null;

  // Group options by category
  const groupedOptions = MEDIA_TYPE_OPTIONS.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, typeof MEDIA_TYPE_OPTIONS>);

  // Handle type selection
  const handleTypeSelect = (type: MediaAnalysisType) => {
    setSelectedType(type);
    setInputType(null);
    setFile(null);
    setFilePreview(null);
    setUrlInput('');
    setError(null);
    setAnalysisResult(null);
  };

  // Handle input type selection
  const handleInputTypeSelect = (type: MediaInputType) => {
    setInputType(type);
    setFile(null);
    setFilePreview(null);
    setUrlInput('');
    setError(null);
  };

  // Handle file selection
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selectedFile = files[0];
    setError(null);

    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('File is too large. Maximum size is 10MB.');
      return;
    }

    // Check file type
    const isPhoto = PHOTO_TYPES.includes(selectedFile.type);
    const isDocument = DOCUMENT_TYPES.includes(selectedFile.type);

    if (!isPhoto && !isDocument) {
      setError('Unsupported file type. Please upload an image or PDF.');
      return;
    }

    setFile(selectedFile);

    // Create preview for images
    if (isPhoto) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  }, []);

  // Handle URL input
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlInput(e.target.value);
    setError(null);
  };

  // Validate URL
  const validateUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  // Perform analysis (uses WAVE for websites, mock for others)
  const performAnalysis = async () => {
    if (!selectedType || !config) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      let result: MediaAnalysisResult;

      // Use WAVE API for website analysis
      if (selectedType === 'website-wave' && urlInput) {
        const waveResult = await analyzeWithWave(urlInput);

        result = {
          id: `ma_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          analysisType: selectedType,
          inputType: 'url',
          url: urlInput,
          analysisDate: waveResult.analysisDate,
          analysisVersion: waveResult.isLiveAnalysis ? '1.0.0-wave' : '1.0.0-wave-simulated',
          overallScore: waveResult.overallScore,
          overallStatus: waveResult.overallStatus,
          summary: waveResult.summary,
          criteriaResults: waveResult.detailedIssues.map((issue, idx) => ({
            criterionId: `wave_${idx}`,
            criterionName: issue.description,
            standard: issue.wcagCriteria || 'WCAG 2.1',
            status: issue.severity === 'error' ? 'needs-improvement' as const : 'good' as const,
            score: issue.severity === 'error' ? 50 : 75,
            finding: `${issue.count} instance(s) found`,
            recommendation: issue.severity === 'error' ? 'Address this accessibility issue' : undefined,
            reference: issue.wcagCriteria,
          })),
          strengths: waveResult.strengths,
          improvements: waveResult.improvements,
          quickWins: waveResult.quickWins,
          standardsAssessed: ['WCAG 2.1 AA', 'Section 508'],
          needsProfessionalReview: waveResult.overallScore < 60,
          professionalReviewReason: waveResult.overallScore < 60
            ? 'Multiple accessibility issues detected. Professional review recommended for comprehensive remediation.'
            : undefined,
          disclaimer: waveResult.disclaimer,
        };
      } else {
        // Simulate API delay for mock analysis
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1500));

        // Generate mock analysis result for other types
        result = generateMockAnalysis(selectedType, config, file, urlInput);
      }

      setAnalysisResult(result);
      onAnalysisComplete(result);
    } catch (err) {
      setError('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Check if ready to analyze
  const canAnalyze = () => {
    if (!selectedType || !inputType) return false;
    if (inputType === 'url' && !validateUrl(urlInput)) return false;
    if ((inputType === 'photo' || inputType === 'document' || inputType === 'screenshot') && !file) return false;
    return true;
  };

  // Reset and start over
  const handleReset = () => {
    setSelectedType(preselectedType || null);
    setInputType(null);
    setFile(null);
    setFilePreview(null);
    setUrlInput('');
    setAnalysisResult(null);
    setError(null);
  };

  // If we have a result, show it
  if (analysisResult) {
    return (
      <div className="media-analysis-result">
        <div className="result-header">
          <div className="result-type">
            <span className="result-icon">{config?.icon || '📊'}</span>
            <span className="result-type-name">{config?.name || 'Analysis'}</span>
          </div>
          <div className={`result-score score-${analysisResult.overallStatus}`}>
            <span className="score-value">{analysisResult.overallScore}/100</span>
            <span className="score-label">{formatStatus(analysisResult.overallStatus)}</span>
          </div>
        </div>

        {filePreview && (
          <div className="result-preview">
            <img src={filePreview} alt="Analyzed content" />
          </div>
        )}

        {analysisResult.url && (
          <div className="result-url">
            <a href={analysisResult.url} target="_blank" rel="noopener noreferrer">
              {analysisResult.url}
            </a>
          </div>
        )}

        <div className="result-summary">
          <p>{analysisResult.summary}</p>
        </div>

        <div className="result-standards">
          <span className="standards-label">Standards assessed:</span>
          {analysisResult.standardsAssessed.map((standard, idx) => (
            <span key={idx} className="standard-badge">{standard}</span>
          ))}
        </div>

        {analysisResult.strengths.length > 0 && (
          <div className="result-section result-strengths">
            <h4>Strengths</h4>
            <ul>
              {analysisResult.strengths.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {analysisResult.improvements.length > 0 && (
          <div className="result-section result-improvements">
            <h4>Areas for Improvement</h4>
            <ul>
              {analysisResult.improvements.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {analysisResult.quickWins.length > 0 && (
          <div className="result-section result-quickwins">
            <h4>Quick Wins</h4>
            <ul>
              {analysisResult.quickWins.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {analysisResult.needsProfessionalReview && (
          <div className="result-professional">
            <strong>Professional Review Recommended</strong>
            <p>{analysisResult.professionalReviewReason}</p>
          </div>
        )}

        <div className="result-disclaimer">
          <p>{analysisResult.disclaimer}</p>
        </div>

        <div className="result-actions">
          <button className="btn-secondary" onClick={handleReset}>
            Analyze Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="media-analysis-input">
      {hint && <p className="media-analysis-hint">{hint}</p>}

      {/* Step 1: Select material type */}
      {!selectedType && (
        <div className="type-selection">
          <h4>What would you like to analyze?</h4>
          <p className="type-selection-help">
            Select the type of material or environment you want to check for accessibility
          </p>

          {Object.entries(groupedOptions).map(([category, options]) => (
            <div key={category} className="type-category">
              <h5>{MEDIA_CATEGORY_LABELS[category as keyof typeof MEDIA_CATEGORY_LABELS]}</h5>
              <div className="type-options">
                {options.map((option) => (
                  <button
                    key={option.value}
                    className="type-option-btn"
                    onClick={() => handleTypeSelect(option.value)}
                  >
                    <span className="type-option-label">{option.label}</span>
                    <span className="type-option-desc">{option.description}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button className="btn-skip" onClick={onSkip}>
            Skip this analysis
          </button>
        </div>
      )}

      {/* Step 2: Select input method */}
      {selectedType && !inputType && config && (
        <div className="input-selection">
          <button className="btn-back" onClick={() => setSelectedType(null)}>
            ← Back to type selection
          </button>

          <div className="selected-type-header">
            <span className="selected-type-icon">{config.icon}</span>
            <div>
              <h4>{config.name}</h4>
              <p>{config.description}</p>
            </div>
          </div>

          <h5>How would you like to provide the content?</h5>

          <div className="input-options">
            {config.acceptedInputTypes.includes('photo') && (
              <button
                className="input-option-btn"
                onClick={() => handleInputTypeSelect('photo')}
              >
                <span className="input-icon">📷</span>
                <span className="input-label">Upload Photo</span>
              </button>
            )}
            {config.acceptedInputTypes.includes('screenshot') && (
              <button
                className="input-option-btn"
                onClick={() => handleInputTypeSelect('screenshot')}
              >
                <span className="input-icon">📱</span>
                <span className="input-label">Upload Screenshot</span>
              </button>
            )}
            {config.acceptedInputTypes.includes('document') && (
              <button
                className="input-option-btn"
                onClick={() => handleInputTypeSelect('document')}
              >
                <span className="input-icon">📄</span>
                <span className="input-label">Upload Document</span>
              </button>
            )}
            {config.acceptedInputTypes.includes('url') && (
              <button
                className="input-option-btn"
                onClick={() => handleInputTypeSelect('url')}
              >
                <span className="input-icon">🔗</span>
                <span className="input-label">Enter URL</span>
              </button>
            )}
          </div>

          <button className="btn-skip" onClick={onSkip}>
            Skip this analysis
          </button>
        </div>
      )}

      {/* Step 3: Provide content */}
      {selectedType && inputType && config && (
        <div className="content-input">
          <button className="btn-back" onClick={() => setInputType(null)}>
            ← Back to input selection
          </button>

          <div className="selected-type-header">
            <span className="selected-type-icon">{config.icon}</span>
            <div>
              <h4>{config.name}</h4>
              <p>{config.examplePrompt}</p>
            </div>
          </div>

          {/* File upload */}
          {(inputType === 'photo' || inputType === 'screenshot' || inputType === 'document') && (
            <div className="file-upload-section">
              <input
                ref={fileInputRef}
                type="file"
                accept={config.acceptedFileTypes?.join(',') || 'image/*,application/pdf'}
                onChange={handleFileSelect}
                className="file-input-hidden"
                id="media-file-input"
              />

              {!file ? (
                <label htmlFor="media-file-input" className="file-upload-label">
                  <div className="upload-icon">
                    {inputType === 'photo' && '📷'}
                    {inputType === 'screenshot' && '📱'}
                    {inputType === 'document' && '📄'}
                  </div>
                  <span className="upload-text">
                    Click to upload or drag and drop
                  </span>
                  <span className="upload-hint">
                    {inputType === 'document' ? 'PDF files up to 10MB' : 'JPG, PNG, WebP up to 10MB'}
                  </span>
                </label>
              ) : (
                <div className="file-selected">
                  {filePreview && (
                    <div className="file-preview">
                      <img src={filePreview} alt="Preview" />
                    </div>
                  )}
                  <div className="file-info">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <button
                    className="btn-remove-file"
                    onClick={() => {
                      setFile(null);
                      setFilePreview(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}

          {/* URL input */}
          {inputType === 'url' && (
            <div className="url-input-section">
              <input
                type="url"
                value={urlInput}
                onChange={handleUrlChange}
                placeholder={
                  selectedType === 'social-media-url'
                    ? 'https://instagram.com/p/...'
                    : selectedType === 'website-wave'
                    ? 'https://www.example.com'
                    : 'https://...'
                }
                className="url-input"
              />
              {selectedType === 'website-wave' && (
                <p className="wave-notice">
                  <strong>Note:</strong> {isWaveApiEnabled()
                    ? 'Live WAVE API analysis enabled.'
                    : 'Using simulated analysis (WAVE API not configured). Set VITE_WAVE_API_KEY in .env to enable live analysis.'}
                </p>
              )}
            </div>
          )}

          {error && <p className="analysis-error">{error}</p>}

          <div className="analysis-actions">
            <button
              className="btn-analyze"
              onClick={performAnalysis}
              disabled={!canAnalyze() || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <span className="spinner"></span>
                  Analyzing...
                </>
              ) : (
                'Analyze for Accessibility'
              )}
            </button>
            <button className="btn-skip" onClick={onSkip}>
              Skip
            </button>
          </div>

          <div className="standards-info">
            <p>
              <strong>Standards checked:</strong>{' '}
              {config.standards.join(', ')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper to format status
function formatStatus(status: MediaAnalysisStatus): string {
  switch (status) {
    case 'excellent':
      return 'Excellent';
    case 'good':
      return 'Good';
    case 'needs-improvement':
      return 'Needs Improvement';
    case 'poor':
      return 'Poor';
    case 'not-assessable':
      return 'Unable to Assess';
    default:
      return status;
  }
}

// Generate mock analysis (to be replaced with real AI integration)
function generateMockAnalysis(
  type: MediaAnalysisType,
  config: ReturnType<typeof getMediaAnalysisConfig>,
  file: File | null,
  url: string
): MediaAnalysisResult {
  // Generate random scores for each criterion
  const criteriaResults: CriterionResult[] = config.criteria.map((criterion) => {
    const score = Math.floor(Math.random() * 40) + 60; // 60-100 range
    const status = scoreToStatus(score);

    return {
      criterionId: criterion.id,
      criterionName: criterion.name,
      standard: criterion.standard,
      status,
      score,
      finding: generateFinding(criterion.name, status),
      recommendation: status !== 'excellent' ? generateRecommendation(criterion.name) : undefined,
      reference: criterion.reference,
    };
  });

  // Calculate overall score (weighted average)
  const totalWeight = config.criteria.reduce((sum, c) => sum + c.weight, 0);
  const weightedSum = criteriaResults.reduce((sum, result, idx) => {
    return sum + result.score * config.criteria[idx].weight;
  }, 0);
  const overallScore = Math.round(weightedSum / totalWeight);
  const overallStatus = scoreToStatus(overallScore);

  // Generate strengths and improvements
  const strengths = criteriaResults
    .filter((r) => r.status === 'excellent' || r.status === 'good')
    .slice(0, 4)
    .map((r) => `${r.criterionName}: ${r.finding}`);

  const improvements = criteriaResults
    .filter((r) => r.status === 'needs-improvement' || r.status === 'poor')
    .slice(0, 4)
    .map((r) => r.recommendation || `Improve ${r.criterionName.toLowerCase()}`);

  const quickWins = criteriaResults
    .filter((r) => r.status === 'needs-improvement')
    .slice(0, 2)
    .map((r) => `Quick fix: ${r.recommendation || r.criterionName}`);

  // Professional review needed if score is low or certain issues found
  const needsProfessionalReview = overallScore < 50 ||
    criteriaResults.some(r => r.status === 'poor' && config.criteria.find(c => c.id === r.criterionId)?.weight > 20);

  return {
    id: `ma_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    analysisType: type,
    inputType: file ? (PHOTO_TYPES.includes(file.type) ? 'photo' : 'document') : 'url',
    fileName: file?.name,
    fileSize: file?.size,
    url: url || undefined,
    analysisDate: new Date().toISOString(),
    analysisVersion: '1.0.0-mock',
    overallScore,
    overallStatus,
    summary: generateSummary(config.name, overallStatus, overallScore),
    criteriaResults,
    strengths,
    improvements,
    quickWins,
    standardsAssessed: config.standards,
    needsProfessionalReview,
    professionalReviewReason: needsProfessionalReview
      ? 'Some aspects require expert assessment for accurate evaluation against accessibility standards.'
      : undefined,
    disclaimer: `This is an automated accessibility assessment based on ${config.standards.join(', ')}. Results are indicative only and should be verified by a qualified accessibility professional. This analysis does not constitute legal advice or certification of compliance.`,
  };
}

function scoreToStatus(score: number): MediaAnalysisStatus {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'needs-improvement';
  return 'poor';
}

function generateFinding(criterionName: string, status: MediaAnalysisStatus): string {
  const findings: Record<MediaAnalysisStatus, string[]> = {
    excellent: [
      `${criterionName} meets or exceeds accessibility standards`,
      `Strong implementation of ${criterionName.toLowerCase()}`,
      `${criterionName} is well-executed`,
    ],
    good: [
      `${criterionName} is mostly compliant with minor room for improvement`,
      `${criterionName} meets basic requirements`,
      `Acceptable ${criterionName.toLowerCase()} with some enhancements possible`,
    ],
    'needs-improvement': [
      `${criterionName} needs attention to meet accessibility standards`,
      `Some gaps identified in ${criterionName.toLowerCase()}`,
      `${criterionName} partially meets requirements`,
    ],
    poor: [
      `Significant issues with ${criterionName.toLowerCase()}`,
      `${criterionName} does not meet accessibility standards`,
      `Major improvements needed for ${criterionName.toLowerCase()}`,
    ],
    'not-assessable': [
      `Unable to fully assess ${criterionName.toLowerCase()} from provided content`,
    ],
  };

  const options = findings[status];
  return options[Math.floor(Math.random() * options.length)];
}

function generateRecommendation(criterionName: string): string {
  return `Review and improve ${criterionName.toLowerCase()} to better meet accessibility standards`;
}

function generateSummary(
  typeName: string,
  status: MediaAnalysisStatus,
  score: number
): string {
  const summaries: Record<MediaAnalysisStatus, string> = {
    excellent: `This ${typeName.toLowerCase()} demonstrates excellent accessibility practices with a score of ${score}/100. It meets or exceeds standards across most criteria assessed.`,
    good: `This ${typeName.toLowerCase()} shows good accessibility with a score of ${score}/100. Most criteria are met with some minor improvements possible.`,
    'needs-improvement': `This ${typeName.toLowerCase()} has room for improvement with a score of ${score}/100. Several accessibility criteria need attention to better serve all users.`,
    poor: `This ${typeName.toLowerCase()} requires significant accessibility improvements with a score of ${score}/100. Multiple barriers were identified that may affect users with disabilities.`,
    'not-assessable': `Unable to fully assess this ${typeName.toLowerCase()}. Please ensure the provided content is clear and complete.`,
  };

  return summaries[status];
}
