/**
 * Confetti Celebration Component
 *
 * A lightweight confetti animation for celebrating achievements
 * like completing modules or reaching milestones.
 */

import { useEffect, useState, useCallback } from 'react';
import './Confetti.css';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  rotation: number;
  scale: number;
  animationDuration: number;
  animationDelay: number;
  shape: 'circle' | 'square' | 'rectangle';
}

interface ConfettiProps {
  isActive: boolean;
  duration?: number; // How long the confetti runs (ms)
  pieceCount?: number; // Number of confetti pieces
  onComplete?: () => void;
}

// Brand-inspired confetti colors
const CONFETTI_COLORS = [
  '#490E67', // amethyst-diamond
  '#6b21a8', // purple light
  '#CC7700', // aussie-dark
  '#e68a00', // orange light
  '#22c55e', // success green
  '#f59e0b', // amber
  '#ec4899', // pink
  '#3b82f6', // blue
];

const SHAPES = ['circle', 'square', 'rectangle'] as const;

export function Confetti({
  isActive,
  duration = 5000, // Increased from 3000ms for longer celebration
  pieceCount = 80,  // Increased from 50 for more impact
  onComplete
}: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const generatePieces = useCallback(() => {
    const newPieces: ConfettiPiece[] = [];

    for (let i = 0; i < pieceCount; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100, // Random horizontal position (%)
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 360,
        scale: 0.7 + Math.random() * 0.8, // Larger: 0.7 to 1.5 (was 0.5-1.3)
        animationDuration: 3.5 + Math.random() * 2.5, // Slower: 3.5-6 seconds (was 2-4)
        animationDelay: Math.random() * 1.2, // Staggered: 0-1.2s delay (was 0-0.5s)
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      });
    }

    return newPieces;
  }, [pieceCount]);

  useEffect(() => {
    if (isActive) {
      setPieces(generatePieces());
      setIsVisible(true);

      // Hide confetti after duration
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isActive, duration, generatePieces, onComplete]);

  // Clean up pieces after animation
  useEffect(() => {
    if (!isVisible && pieces.length > 0) {
      const cleanupTimer = setTimeout(() => {
        setPieces([]);
      }, 500);

      return () => clearTimeout(cleanupTimer);
    }
  }, [isVisible, pieces.length]);

  if (!isVisible && pieces.length === 0) return null;

  return (
    <div className={`confetti-container ${isVisible ? 'active' : 'fading'}`}>
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className={`confetti-piece confetti-${piece.shape}`}
          style={{
            left: `${piece.x}%`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
            animationDuration: `${piece.animationDuration}s`,
            animationDelay: `${piece.animationDelay}s`,
          }}
        />
      ))}
    </div>
  );
}

// Hook for easy confetti triggering
export function useConfetti() {
  const [showConfetti, setShowConfetti] = useState(false);

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
  }, []);

  const handleConfettiComplete = useCallback(() => {
    setShowConfetti(false);
  }, []);

  return {
    showConfetti,
    triggerConfetti,
    handleConfettiComplete,
  };
}
