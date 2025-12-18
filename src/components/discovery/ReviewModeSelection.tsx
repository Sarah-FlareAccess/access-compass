import { useState, useMemo } from 'react';
import type { ReviewMode, CalibrationData, OrganisationSize } from '../../types';
import './discovery.css';

interface ReviewModeSelectionProps {
  recommendedMode: ReviewMode;
  onSelect: (mode: ReviewMode) => void;
  onBack: () => void;
  touchpointCount: number;
  reasoning: string;
  calibrationData?: CalibrationData | null;
  organisationSize?: OrganisationSize;
}

export function ReviewModeSelection({
  recommendedMode,
  onSelect,
  onBack,
  calibrationData,
  organisationSize,
}: ReviewModeSelectionProps) {
  const [selectedMode, setSelectedMode] = useState<ReviewMode>(recommendedMode);

  // Generate smart recommendation message based on calibration data
  const smartRecommendation = useMemo(() => {
    if (!calibrationData) return null;

    const { budget, workApproach, timing } = calibrationData;

    // Determine if Deep Dive is more appropriate
    const deepDiveSignals: string[] = [];
    const pulseCheckSignals: string[] = [];

    // Budget signals
    if (budget === 'significant' || budget === 'moderate') {
      deepDiveSignals.push('investment capacity');
    } else if (budget === 'minimal') {
      pulseCheckSignals.push('focused budget');
    }

    // Work approach signals
    if (workApproach === 'with-team' || workApproach === 'external-support') {
      deepDiveSignals.push('team involvement');
    } else if (workApproach === 'myself') {
      pulseCheckSignals.push('working independently');
    }

    // Timing signals
    if (timing === 'now' || timing === 'next-3-months') {
      deepDiveSignals.push('action readiness');
    } else if (timing === 'later') {
      pulseCheckSignals.push('exploratory stage');
    }

    // Organisation size factor
    if (organisationSize === 'large' || organisationSize === 'medium') {
      deepDiveSignals.push('organisation scale');
    }

    // Determine recommendation
    const recommendDeepDive = deepDiveSignals.length >= 2;

    if (recommendDeepDive && deepDiveSignals.length > 0) {
      return {
        mode: 'deep-dive' as ReviewMode,
        message: 'Based on what you\'ve told us, most organisations like yours choose Deep Dive.',
      };
    } else if (pulseCheckSignals.length >= 2) {
      return {
        mode: 'pulse-check' as ReviewMode,
        message: 'Based on what you\'ve told us, Pulse Check is a great way to get started.',
      };
    }

    return null;
  }, [calibrationData, organisationSize]);

  const handleContinue = () => {
    onSelect(selectedMode);
  };

  return (
    <div className="discovery-page">
      <div className="discovery-container">
        {/* Header */}
        <div className="discovery-header-card">
          <h1 className="discovery-title">Select your pathway</h1>
          <p className="discovery-subtitle">
            Choose the level of support that fits where you're at right now.
          </p>
          {smartRecommendation && (
            <p className="smart-recommendation">
              {smartRecommendation.message}
            </p>
          )}
        </div>

        {/* Review Mode Cards - Side by Side */}
        <div className="pathway-cards">
          {/* Pulse Check */}
          <div
            className={`pathway-card ${selectedMode === 'pulse-check' ? 'selected' : ''}`}
            onClick={() => setSelectedMode('pulse-check')}
          >
            <div className="pathway-header">
              <input
                type="radio"
                className="pathway-radio"
                checked={selectedMode === 'pulse-check'}
                onChange={() => setSelectedMode('pulse-check')}
              />
              <div>
                <h3 className="pathway-name">Pulse Check</h3>
                <p className="pathway-tagline">Get clear direction fast</p>
              </div>
            </div>

            <div className="pathway-body">
              <p className="pathway-intro">
                A quick compass check that shows:
              </p>
              <ul className="pathway-benefits">
                <li>where you're already doing well</li>
                <li>the most important gaps holding customers back</li>
                <li>the top actions that will make the biggest difference right now</li>
              </ul>

              <div className="pathway-outcomes">
                <p className="outcomes-label">You'll walk away with:</p>
                <ul className="outcomes-list">
                  <li>clear, prioritised actions</li>
                  <li>confidence about what to do next</li>
                  <li>a practical starting point you can share with your team</li>
                </ul>
              </div>

              <div className="pathway-best-for">
                <span className="best-for-label">Best for:</span>
                <span className="best-for-text">getting started, limited time, first pass, small or straightforward sites</span>
              </div>
            </div>
          </div>

          {/* Deep Dive */}
          <div
            className={`pathway-card pathway-featured ${selectedMode === 'deep-dive' ? 'selected' : ''}`}
            onClick={() => setSelectedMode('deep-dive')}
          >
            <div className="pathway-header">
              <input
                type="radio"
                className="pathway-radio"
                checked={selectedMode === 'deep-dive'}
                onChange={() => setSelectedMode('deep-dive')}
              />
              <div>
                <h3 className="pathway-name">Deep Dive</h3>
                <p className="pathway-tagline">Build a structured plan you can actually deliver</p>
              </div>
            </div>

            <div className="pathway-body">
              <p className="pathway-intro">
                A detailed navigation guide that helps you:
              </p>
              <ul className="pathway-benefits">
                <li>translate gaps into clear actions and responsibilities</li>
                <li>track progress over time</li>
                <li>build a realistic, staged roadmap for improvement</li>
              </ul>

              <div className="pathway-outcomes">
                <p className="outcomes-label">You'll walk away with:</p>
                <ul className="outcomes-list">
                  <li>a structured DIAP-style action plan</li>
                  <li>assigned actions, timeframes and evidence</li>
                  <li>a comprehensive roadmap you can use for planning, funding or upgrades</li>
                </ul>
              </div>

              <div className="pathway-best-for">
                <span className="best-for-label">Best for:</span>
                <span className="best-for-text">complex sites, planning ahead, multiple barriers, deeper implementation</span>
              </div>
            </div>
          </div>
        </div>

        {/* One-line comparison */}
        <div className="pathway-comparison">
          <div className="comparison-item">
            <span className="comparison-name">Pulse Check:</span>
            <span className="comparison-text">"Show me where to start."</span>
          </div>
          <div className="comparison-item">
            <span className="comparison-name">Deep Dive:</span>
            <span className="comparison-text">"Help me plan and deliver real change."</span>
          </div>
        </div>

        {/* Reassurance */}
        <div className="pathway-reassurance">
          <p>
            You can change your pathway at any time. Start with Pulse Check to get quick direction,
            then move to Deep Dive when you're ready to go further. Your progress is always saved.
          </p>
        </div>

        {/* Actions */}
        <div className="discovery-actions-card">
          <div className="discovery-buttons">
            <button className="btn-back" onClick={onBack}>
              ← Back
            </button>
            <button className="btn-continue" onClick={handleContinue}>
              Continue with {selectedMode === 'pulse-check' ? 'Pulse Check' : 'Deep Dive'} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
