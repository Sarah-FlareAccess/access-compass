import { useState } from 'react';
import type { ReviewMode } from '../../types';
import './discovery.css';

interface ReviewModeSelectionProps {
  recommendedMode: ReviewMode;
  onSelect: (mode: ReviewMode) => void;
  onBack: () => void;
  touchpointCount: number;
  reasoning: string;
}

export function ReviewModeSelection({
  recommendedMode,
  onSelect,
  onBack,
  touchpointCount,
  reasoning,
}: ReviewModeSelectionProps) {
  const [selectedMode, setSelectedMode] = useState<ReviewMode>(recommendedMode);

  const handleContinue = () => {
    onSelect(selectedMode);
  };

  return (
    <div className="discovery-page">
      <div className="discovery-container">
        {/* Header */}
        <div className="discovery-header-card">
          <h1 className="discovery-title">Choose your review depth</h1>
          <p className="discovery-subtitle">
            {reasoning}
          </p>
        </div>

        {/* Review Mode Options */}
        <div className="review-mode-section">
          <div className="review-mode-options">
            {/* Foundation Option */}
            <div
              className={`review-mode-option ${selectedMode === 'foundation' ? 'selected' : ''} ${recommendedMode === 'foundation' ? 'recommended' : ''}`}
              onClick={() => setSelectedMode('foundation')}
            >
              {recommendedMode === 'foundation' && (
                <span className="recommended-badge">Recommended</span>
              )}
              <input
                type="radio"
                className="review-mode-radio"
                checked={selectedMode === 'foundation'}
                onChange={() => setSelectedMode('foundation')}
              />
              <div className="review-mode-content">
                <h3 className="review-mode-label">Foundation Review</h3>
                <p className="review-mode-description">
                  Quick assessment of key accessibility areas. Perfect for getting started or time-limited reviews.
                </p>
                <p className="review-mode-details">
                  8-12 questions per module • ~15 min per module • Focus on high-impact items
                </p>
              </div>
            </div>

            {/* Detailed Option */}
            <div
              className={`review-mode-option ${selectedMode === 'detailed' ? 'selected' : ''} ${recommendedMode === 'detailed' ? 'recommended' : ''}`}
              onClick={() => setSelectedMode('detailed')}
            >
              {recommendedMode === 'detailed' && (
                <span className="recommended-badge">Recommended</span>
              )}
              <input
                type="radio"
                className="review-mode-radio"
                checked={selectedMode === 'detailed'}
                onChange={() => setSelectedMode('detailed')}
              />
              <div className="review-mode-content">
                <h3 className="review-mode-label">Detailed Review</h3>
                <p className="review-mode-description">
                  Comprehensive assessment with measurements and evidence gathering. Best for thorough audits.
                </p>
                <p className="review-mode-details">
                  15-20 questions per module • ~25 min per module • Includes measurements & evidence
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Information Card */}
        <div className="discovery-header-card">
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px 0' }}>
            You can change this later
          </h3>
          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
            Start with Foundation to get quick wins, then switch to Detailed for deeper analysis.
            Your progress is saved regardless of which mode you choose.
          </p>
        </div>

        {/* Actions */}
        <div className="discovery-actions-card">
          <div className="discovery-buttons">
            <button className="btn-back" onClick={onBack}>
              ← Back
            </button>
            <button className="btn-continue" onClick={handleContinue}>
              Start {selectedMode === 'foundation' ? 'Foundation' : 'Detailed'} Review →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
