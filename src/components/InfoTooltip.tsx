/**
 * InfoTooltip
 *
 * Small accessible info bubble for explaining tricky UX (e.g. why a count reads
 * 0). Shows on hover AND keyboard focus; the trigger is a real button with an
 * aria-label and the bubble is linked via aria-describedby. WCAG AA.
 */

import { useId } from 'react';
import { Info } from 'lucide-react';
import '../styles/info-tooltip.css';

interface InfoTooltipProps {
  /** The explanatory text shown in the bubble. */
  text: string;
  /** Accessible label for the trigger (defaults to "More information"). */
  label?: string;
}

export function InfoTooltip({ text, label = 'More information' }: InfoTooltipProps) {
  const id = useId();
  return (
    <span className="info-tooltip">
      <button
        type="button"
        className="info-tooltip__trigger"
        aria-label={label}
        aria-describedby={id}
      >
        <Info size={15} aria-hidden="true" />
      </button>
      <span role="tooltip" id={id} className="info-tooltip__bubble">
        {text}
      </span>
    </span>
  );
}
