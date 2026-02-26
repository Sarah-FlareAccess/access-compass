import type { BadgeLevel } from '../hooks/useBadgeProgress';
import './AccessBadge.css';

interface AccessBadgeProps {
  level: BadgeLevel;
  organisationName?: string;
  completionDate?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LEVEL_CONFIG: Record<Exclude<BadgeLevel, 'none'>, {
  label: string;
  outerColor: string;
  innerColor: string;
  ribbonColor: string;
  textColor: string;
}> = {
  bronze: {
    label: 'Bronze',
    outerColor: '#92400e',
    innerColor: '#b45309',
    ribbonColor: '#78350f',
    textColor: '#fef3c7',
  },
  silver: {
    label: 'Silver',
    outerColor: '#4b5563',
    innerColor: '#6b7280',
    ribbonColor: '#374151',
    textColor: '#f3f4f6',
  },
  gold: {
    label: 'Gold',
    outerColor: '#92400e',
    innerColor: '#d97706',
    ribbonColor: '#78350f',
    textColor: '#fffbeb',
  },
  platinum: {
    label: 'Platinum',
    outerColor: '#490E67',
    innerColor: '#6b21a8',
    ribbonColor: '#3a0b52',
    textColor: '#faf5ff',
  },
};

const SIZES = { sm: 80, md: 140, lg: 200 };

export function AccessBadge({ level, organisationName, completionDate, size = 'md' }: AccessBadgeProps) {
  if (level === 'none') return null;

  const config = LEVEL_CONFIG[level];
  const px = SIZES[size];
  const year = completionDate
    ? new Date(completionDate).getFullYear()
    : new Date().getFullYear();

  const ariaLabel = `Access Compass Assessed: ${config.label} level${organisationName ? ` for ${organisationName}` : ''}, ${year}`;

  return (
    <div
      className={`access-badge access-badge-${size} access-badge-${level}`}
      role="img"
      aria-label={ariaLabel}
    >
      <svg
        viewBox="0 0 200 200"
        width={px}
        height={px}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        {/* Outer ring */}
        <circle cx="100" cy="100" r="96" fill="none" stroke={config.outerColor} strokeWidth="6" />
        <circle cx="100" cy="100" r="88" fill="none" stroke={config.outerColor} strokeWidth="1.5" />

        {/* Inner fill */}
        <circle cx="100" cy="100" r="85" fill={config.innerColor} />

        {/* Compass/checkmark icon */}
        <g transform="translate(100, 72)">
          {/* Compass circle */}
          <circle cx="0" cy="0" r="28" fill="none" stroke={config.textColor} strokeWidth="2.5" />
          {/* Compass needle */}
          <polygon points="0,-22 5,0 0,22 -5,0" fill={config.textColor} opacity="0.5" />
          <polygon points="0,-22 5,0 -5,0" fill={config.textColor} />
          {/* Centre dot */}
          <circle cx="0" cy="0" r="3" fill={config.textColor} />
          {/* Checkmark overlay */}
          <polyline
            points="-10,2 -3,10 12,-8"
            fill="none"
            stroke={config.textColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Circular text: ACCESS COMPASS ASSESSED */}
        <defs>
          <path id={`badge-text-path-${level}`} d="M 100,100 m -62,0 a 62,62 0 1,1 124,0 a 62,62 0 1,1 -124,0" />
        </defs>
        <text fill={config.textColor} fontSize="11" fontWeight="700" letterSpacing="2.5">
          <textPath href={`#badge-text-path-${level}`} startOffset="12%">
            ACCESS COMPASS ASSESSED
          </textPath>
        </text>

        {/* Bottom ribbon */}
        <rect x="50" y="155" width="100" height="24" rx="3" fill={config.ribbonColor} />
        <text
          x="100"
          y="171"
          textAnchor="middle"
          fill={config.textColor}
          fontSize="12"
          fontWeight="700"
          letterSpacing="1.5"
        >
          {config.label.toUpperCase()} {year}
        </text>

        {/* Level indicator dots */}
        {(['bronze', 'silver', 'gold', 'platinum'] as const).map((l, i) => {
          const lvlOrder = ['bronze', 'silver', 'gold', 'platinum'];
          const achieved = lvlOrder.indexOf(level) >= i;
          return (
            <circle
              key={l}
              cx={78 + i * 16}
              cy="188"
              r="4"
              fill={achieved ? config.textColor : 'transparent'}
              stroke={config.textColor}
              strokeWidth="1.5"
            />
          );
        })}
      </svg>
    </div>
  );
}
