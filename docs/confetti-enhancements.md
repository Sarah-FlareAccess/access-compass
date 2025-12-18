# Confetti Celebration Component Enhancements

## Overview

Enhanced the confetti celebration animation for better visibility and accessibility compliance.

## Changes Made

### Visibility Improvements

| Property | Before | After |
|----------|--------|-------|
| Circle size | ~10px | 18px |
| Square size | ~10px | 16px |
| Rectangle size | ~8x16px | 12x24px |
| Piece count | 50 | 80 |
| Scale range | 0.5-1.3x | 0.7-1.5x |
| Duration | 3 seconds | 5 seconds |
| Fall speed | 2-4 seconds | 3.5-6 seconds |
| Entrance delay | 0-0.5s | 0-1.2s (staggered) |

### Visual Enhancements

- **Glow effect**: Added `box-shadow: 0 0 6px currentColor` for better contrast against backgrounds
- **Sparkle burst**: Brief radial flash effect at animation start
- **Brand colors**: Purple (#490E67), orange (#CC7700), green (#22c55e), amber (#f59e0b), pink (#ec4899), blue (#3b82f6)

### Accessibility (WCAG 2.1 Compliance)

Added `prefers-reduced-motion` media query support for users with vestibular disorders:

```css
@media (prefers-reduced-motion: reduce) {
  .confetti-piece {
    animation: confetti-pulse 2s ease-in-out forwards;
  }
}
```

**Reduced motion behavior:**
- Falling animation disabled
- Pieces appear statically across the screen (at 30% height)
- Gentle pulse/fade effect instead of movement
- Sparkle burst disabled

## Files Modified

- `src/components/Confetti.tsx` - Component logic and defaults
- `src/components/Confetti.css` - Styling, animations, and accessibility

## Usage

```tsx
import { Confetti, useConfetti } from './components/Confetti';

function MyComponent() {
  const { showConfetti, triggerConfetti, handleConfettiComplete } = useConfetti();

  return (
    <>
      <button onClick={triggerConfetti}>Celebrate!</button>
      <Confetti
        isActive={showConfetti}
        onComplete={handleConfettiComplete}
        duration={5000}  // optional, default 5000ms
        pieceCount={80}  // optional, default 80
      />
    </>
  );
}
```

## Testing

1. **Standard view**: Trigger celebration and verify pieces are visible and fall slowly
2. **Reduced motion**: Enable "Reduce motion" in OS settings and verify gentle pulse effect
3. **Mobile**: Verify slightly faster animation and smaller pieces for performance
