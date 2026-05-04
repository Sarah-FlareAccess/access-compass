import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import { getSession, getDiscoveryData } from '../utils/session';
import { setSelectedTier } from '../utils/selectedTier';
import '../styles/pricing.css';

const CheckIcon = ({ onHighlight = false }: { onHighlight?: boolean }) => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke={onHighlight ? '#FFFFFF' : '#490E67'} strokeWidth={1.5} />
    <path stroke={onHighlight ? '#FFFFFF' : '#490E67'} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12.5l2.5 2.5L16 9.5" />
  </svg>
);

const DashIcon = ({ onHighlight = false }: { onHighlight?: boolean }) => (
  <span style={{ color: onHighlight ? 'rgba(255,255,255,0.85)' : '#6B6366', fontSize: '1.25rem', lineHeight: 1 }} aria-hidden="true">&mdash;</span>
);

const AddOnBadge = ({ onHighlight = false }: { onHighlight?: boolean }) => (
  <span className="pricing-addon-badge" style={{
    backgroundColor: 'transparent',
    color: onHighlight ? '#FFFFFF' : '#5C4A4E',
    fontSize: '0.75rem',
    padding: '0.125rem 0.5rem',
    borderRadius: '0.25rem',
    fontWeight: 600,
    border: onHighlight ? '1px solid rgba(255,255,255,0.85)' : '1px solid #6B6366',
  }}>Add-on</span>
);

type TierFeatures = {
  assessment: string;
  sites: string;
  users: string;
  report: string;
  resourceHub: boolean | string;
  diap: boolean | string;
  comparison: boolean | string;
  training?: boolean | string;
  support: string;
  assessments?: string;
  departments?: boolean | string;
  programs?: string;
  aggregateDashboard?: boolean | string;
  diapImport?: boolean | string;
  teamAllocation?: boolean | string;
  diapDepartments?: boolean | string;
  stakeholderReporting?: boolean | string;
  evidenceLibrary?: boolean | string;
  businessGroupIncluded?: boolean | string;
  seatExpansion?: string;
  siteExpansion?: string;
  groups?: string;
  businessAccess?: string;
  zones?: string;
  zoneReporting?: boolean | string;
  crossZoneTrends?: boolean | string;
  coBrandedSummary?: boolean | string;
  consultantTime?: string;
};

type Tier = {
  name: string;
  price: string;
  period: string;
  description: string;
  whoFor?: string;
  highlight: boolean;
  perSite?: string;
  features: TierFeatures;
};

// Info bubble content for features that need explanation
const featureInfoContent: Record<string, { title: string; description: string; examples?: string[] }> = {
  diap: {
    title: 'Disability Inclusion Action Plan (DIAP)',
    description: 'A structured plan for improving accessibility across your organisation. Import your existing DIAP, assign actions to team members, track progress and export reports for your board or stakeholders.',
  },
  diapForBusinesses: {
    title: 'DIAP for Businesses',
    description: 'Each business in your group gets its own Disability Inclusion Action Plan (DIAP) based on their assessment results. They manage their own actions and improvements. You see their overall progress from your network dashboard, but individual action items stay private to each business.',
  },
  diapImport: {
    title: 'DIAP Import (Guided Flow)',
    description: 'Step-by-step import from Excel or CSV. Map your columns to Access Compass fields, preview items before committing and reverse the import if the results are not right.',
  },
  teamAllocation: {
    title: 'Team Allocation and Consolidated Emails',
    description: 'Assign modules and action plan items to team members. Generate a single summary email with all assignments for each person, rather than sending individual emails for every item.',
  },
  diapDepartments: {
    title: 'Department-Level DIAP Sections',
    description: 'Organise your action plan by department (e.g. Events, Parks, Customer Service). Each department sees their own items while leadership sees the full plan.',
  },
  stakeholderReporting: {
    title: 'Stakeholder and Board Reporting',
    description: 'Export professional PDF reports showing your DIAP progress for council meetings, board papers or funding acquittals.',
  },
  businessGroupIncluded: {
    title: 'Business Group Included',
    description: 'Create a group of businesses (e.g. suppliers, grant recipients, regional venues), select which modules they complete and track their progress from your dashboard.',
    examples: [
      'Grant recipients completing 3 modules as part of funding acquittal',
      'Regional venues completing a full accessibility assessment',
      'Suppliers completing a pre-qualification accessibility review',
    ],
  },
  seatExpansion: {
    title: 'Seat Expansion',
    description: 'Need more users mid-year? Add seats without waiting for renewal. Cost is pro-rated for the remaining months in your subscription period.',
  },
  siteExpansion: {
    title: 'Site Expansion',
    description: 'Need to assess more venues mid-year? Add sites without upgrading your tier. Cost is pro-rated for the remaining months in your subscription period.',
  },
  comparison: {
    title: 'Progress Tracking (Re-assessment)',
    description: 'Run the same assessment again after improvements and compare results side by side to measure progress over time.',
  },
  groups: {
    title: 'Groups',
    description: 'A group is a collection of businesses you are managing together. Each group has its own set of modules, businesses and progress dashboard. You can run multiple groups at once with different purposes.',
    examples: [
      'Approved supplier accessibility review (5 modules per supplier)',
      'Event vendor compliance check (event-specific modules)',
      'Tenant accessibility assessment (full assessment per tenant)',
      'Contractor pre-qualification review (3 modules)',
    ],
  },
  businessAccess: {
    title: 'Business Access',
    description: 'Each business in your group gets their own Access Compass account. They complete the modules you have selected and you track their progress. They keep their data after the group ends.',
  },
  aggregateDashboard: {
    title: 'Network Dashboard',
    description: 'See aggregate progress across all businesses in your groups. Who has started, who has completed, completion rates by module and overall trends.',
  },
  ownAssessment: {
    title: 'Own Organisation Assessment',
    description: 'Your plan includes assessment of your own venues and operations, separate from the businesses in your groups.',
  },
  training: {
    title: 'Consultation',
    description: 'One-on-one sessions with an accessibility specialist. Includes preparation and follow-up notes. Available for your team or for businesses in your groups.',
  },
  zones: {
    title: 'Zones',
    description: 'Distinct areas within a single complex. Use zones when your venue has meaningfully different spaces that warrant separate assessment.',
    examples: [
      'Stadium: members areas, public stands, catering precincts, function rooms, on-site museum',
      'Convention centre: exhibition halls, function rooms, plazas, loading docks',
      'Integrated resort: hotel, restaurants, gaming floor, theatre, pools, event spaces',
      'Airport precinct: terminal zones, retail, food court, transport interchange',
    ],
  },
  zoneReporting: {
    title: 'Zone-Based Reporting',
    description: 'Assessment and action plan organised by zone. Report accessibility status for each zone separately, alongside the full complex view.',
  },
  crossZoneTrends: {
    title: 'Cross-Zone Trend Analysis',
    description: 'Compare accessibility performance across zones and track improvements over time. Identify which zones are leading, which need attention and how your complex is moving as a whole.',
  },
  coBrandedSummary: {
    title: 'Co-Branded Public Summary',
    description: 'A public-facing summary of your accessibility commitments and progress, co-branded with Access Compass. Suitable for your website, annual report or community communications.',
  },
  consultantTime: {
    title: 'Consultant Check-Ins and Time',
    description: 'Scheduled sessions with an Access Compass accessibility specialist, included in your plan. Use for strategic guidance, progress reviews or working through complex areas with your team.',
  },
};

const featureLabelsStandard: { key: keyof TierFeatures; label: string; infoKey?: string }[] = [
  { key: 'assessment', label: 'Accessibility Self-Assessment' },
  { key: 'sites', label: 'Sites / Venues' },
  { key: 'assessments', label: 'Assessments' },
  { key: 'users', label: 'Users / Assessors' },
  { key: 'departments', label: 'Department Breakdown' },
  { key: 'report', label: 'Accessibility Report & Recommendations' },
  { key: 'resourceHub', label: 'Resource Hub' },
  { key: 'diap', label: 'Disability Inclusion Action Plan (DIAP)', infoKey: 'diap' },
  { key: 'teamAllocation', label: 'Team Allocation + Consolidated Emails', infoKey: 'teamAllocation' },
  { key: 'evidenceLibrary', label: 'Evidence Library' },
  { key: 'comparison', label: 'Progress Tracking (Re-assessment)', infoKey: 'comparison' },
  { key: 'training', label: 'Consultation', infoKey: 'training' },
  { key: 'support', label: 'Support' },
];

const featureLabelsOrgAccessibility: { key: keyof TierFeatures; label: string; infoKey?: string }[] = [
  { key: 'diap', label: 'DIAP Management', infoKey: 'diap' },
  { key: 'diapImport', label: 'DIAP Import (Guided Flow + Undo)', infoKey: 'diapImport' },
  { key: 'teamAllocation', label: 'Team Allocation + Consolidated Emails', infoKey: 'teamAllocation' },
  { key: 'diapDepartments', label: 'Department-Level DIAP Sections', infoKey: 'diapDepartments' },
  { key: 'stakeholderReporting', label: 'Stakeholder / Board Reporting (PDF)', infoKey: 'stakeholderReporting' },
  { key: 'assessment', label: 'Self-Assessment Modules' },
  { key: 'sites', label: 'Own Sites / Venues' },
  { key: 'users', label: 'User Seats' },
  { key: 'report', label: 'Accessibility Report' },
  { key: 'resourceHub', label: 'Resource Hub' },
  { key: 'evidenceLibrary', label: 'Evidence Library' },
  { key: 'comparison', label: 'Progress Tracking (Re-assessment)', infoKey: 'comparison' },
  { key: 'businessGroupIncluded', label: 'Business Group Included', infoKey: 'businessGroupIncluded' },
  { key: 'seatExpansion', label: 'Seat Expansion (Mid-Cycle)', infoKey: 'seatExpansion' },
  { key: 'siteExpansion', label: 'Site Expansion (Mid-Cycle)', infoKey: 'siteExpansion' },
  { key: 'training', label: 'Consultation', infoKey: 'training' },
  { key: 'support', label: 'Support' },
];

const featureLabelsMajorVenue: { key: keyof TierFeatures; label: string; infoKey?: string }[] = [
  { key: 'assessment', label: 'Accessibility Self-Assessment' },
  { key: 'zones', label: 'Zones within Complex', infoKey: 'zones' },
  { key: 'users', label: 'User Seats' },
  { key: 'diap', label: 'Disability Inclusion Action Plan (DIAP)', infoKey: 'diap' },
  { key: 'diapImport', label: 'DIAP Import (Guided Flow + Undo)', infoKey: 'diapImport' },
  { key: 'teamAllocation', label: 'Team Allocation + Consolidated Emails', infoKey: 'teamAllocation' },
  { key: 'evidenceLibrary', label: 'Evidence Library' },
  { key: 'zoneReporting', label: 'Zone-Based Reporting', infoKey: 'zoneReporting' },
  { key: 'crossZoneTrends', label: 'Cross-Zone Trend Analysis', infoKey: 'crossZoneTrends' },
  { key: 'diapDepartments', label: 'Department-Level DIAP Sections', infoKey: 'diapDepartments' },
  { key: 'stakeholderReporting', label: 'Stakeholder / Board Reporting (PDF)', infoKey: 'stakeholderReporting' },
  { key: 'coBrandedSummary', label: 'Co-Branded Public Summary', infoKey: 'coBrandedSummary' },
  { key: 'businessGroupIncluded', label: 'Business Group Included', infoKey: 'businessGroupIncluded' },
  { key: 'comparison', label: 'Progress Tracking (Re-assessment)', infoKey: 'comparison' },
  { key: 'consultantTime', label: 'Consultant Check-Ins', infoKey: 'consultantTime' },
  { key: 'resourceHub', label: 'Resource Hub' },
  { key: 'seatExpansion', label: 'Seat Expansion (Mid-Cycle)', infoKey: 'seatExpansion' },
  { key: 'training', label: 'Additional Consultation', infoKey: 'training' },
  { key: 'support', label: 'Support' },
];

const featureLabelsBusinessGroups: { key: keyof TierFeatures; label: string; infoKey?: string }[] = [
  { key: 'assessment', label: 'Business Assessment Type' },
  { key: 'businessAccess', label: 'Business Access', infoKey: 'businessAccess' },
  { key: 'groups', label: 'Groups (Grants, Events, Supply Chain)', infoKey: 'groups' },
  { key: 'users', label: 'Authority Portal Users' },
  { key: 'aggregateDashboard', label: 'Network Dashboard', infoKey: 'aggregateDashboard' },
  { key: 'report', label: 'Reporting' },
  { key: 'resourceHub', label: 'Resource Hub for Businesses' },
  { key: 'diap', label: 'DIAP for Businesses', infoKey: 'diapForBusinesses' },
  { key: 'comparison', label: 'Progress Tracking (Re-assessment)', infoKey: 'comparison' },
  { key: 'training', label: 'Consultation (per business)', infoKey: 'training' },
  { key: 'support', label: 'Your Support (Authority / Council)' },
];

function renderFeatureValue(value: boolean | string | undefined, onHighlight = false) {
  if (value === undefined || value === null) {
    return <DashIcon onHighlight={onHighlight} />;
  }
  if (typeof value === 'boolean') {
    return value ? <CheckIcon onHighlight={onHighlight} /> : <DashIcon onHighlight={onHighlight} />;
  }
  if (value === 'add-on') {
    return <AddOnBadge onHighlight={onHighlight} />;
  }
  return <span>{value}</span>;
}

const colors = {
  amethyst: '#490E67',
  sunrise: '#8B5E00',
  sunriseBright: '#FF9015',
  walnut: '#3E2B2F',
  ivory: '#ECE9E6',
  white: '#FFFFFF',
  ivoryDark: '#847C71',
  textOnWhite: '#2D2226',
  subtleText: '#5C4A4E'
};

const assessmentInfo: Record<string, { title: string; description: string; recommended?: string; includes: string[] }> = {
  'site': {
    title: 'What counts as a site?',
    description: 'A site is one physical location or address. A venue with multiple areas, departments or zones within the same location counts as one site.',
    includes: [
      'A stadium (arena, museum, function rooms, offices, food areas) = 1 site',
      'A council town hall = 1 site',
      'A shopping centre (all levels and zones) = 1 site',
      'A council with a town hall + library at different addresses = 2 sites',
      'A hotel chain with 3 properties = 3 sites',
    ],
  },
  'pulse': {
    title: 'Pulse Check',
    description: 'A focused overview of each accessibility area. Key questions that identify your biggest gaps quickly.',
    recommended: 'Recommended if you want a quick baseline, are new to accessibility or need to prioritise where to start.',
    includes: [
      'Key questions per module (not exhaustive)',
      'High-level gap identification',
      'PDF report with priorities',
      'Actionable next steps',
    ],
  },
  'deep': {
    title: 'Deep Dive',
    description: 'A thorough, detailed review of every accessibility area. Covers best practices and nuanced scenarios across each module.',
    recommended: 'Recommended if you want a comprehensive understanding, are working toward a DIAP or need detailed evidence for stakeholders.',
    includes: [
      'All questions per module (comprehensive)',
      'Best-practice coverage across each area',
      'Detailed PDF + interactive in-app report',
      'Priority ratings with timeframes',
      'Evidence and notes capture',
    ],
  },
};

// Reusable info bubble component (WCAG AA: keyboard accessible, focus-visible, aria)
function InfoBubble({ infoKey, onHighlight = false }: { infoKey: string; onHighlight?: boolean }) {
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const info = featureInfoContent[infoKey];

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const focusTimer = window.setTimeout(() => closeBtnRef.current?.focus(), 0);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === 'Tab' && popupRef.current) {
        const focusables = popupRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        close();
      }
    };

    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClick);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [open, close]);

  if (!info) return null;

  const bubbleId = `info-bubble-${infoKey}`;

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <button
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        aria-label={`More information about ${info.title}`}
        aria-expanded={open}
        aria-controls={open ? bubbleId : undefined}
        className={`assessment-info-btn${onHighlight ? ' on-highlight' : ''}`}
      >
        i
      </button>
      {open && createPortal(
        <>
          <div className="assessment-popup-overlay" onClick={close} />
          <div
            ref={popupRef}
            id={bubbleId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${bubbleId}-title`}
            className="assessment-popup"
          >
            <div className="assessment-popup-header">
              <h4 id={`${bubbleId}-title`}>{info.title}</h4>
              <button ref={closeBtnRef} onClick={close} aria-label="Close dialog" className="assessment-popup-close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="assessment-popup-desc">{info.description}</p>
            {info.examples && (
              <>
                <p className="assessment-popup-list-label">For example:</p>
                <ul className="assessment-popup-list">
                  {info.examples.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </>
            )}
          </div>
        </>,
        document.body
      )}
    </span>
  );
}

function AssessmentInfoButton({ type, onHighlight = false }: { type: 'pulse' | 'deep' | 'site' | 'both'; onHighlight?: boolean }) {
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const isBoth = type === 'both';
  const info = isBoth ? null : assessmentInfo[type];
  const pulseInfo = assessmentInfo['pulse'];
  const deepInfo = assessmentInfo['deep'];

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const focusTimer = window.setTimeout(() => closeBtnRef.current?.focus(), 0);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === 'Tab' && popupRef.current) {
        const focusables = popupRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        close();
      }
    };

    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClick);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [open, close]);

  const dialogId = `assessment-dialog-${type}`;
  const triggerLabel = isBoth ? 'Pulse Check and Deep Dive' : info!.title;

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        aria-label={`Learn more about ${triggerLabel}`}
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        className={`assessment-info-btn${onHighlight ? ' on-highlight' : ''}`}
      >
        ?
      </button>
      {open && createPortal(
        <>
          <div className="assessment-popup-overlay" onClick={close} />
          <div
            ref={popupRef}
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${dialogId}-title`}
            className="assessment-popup"
          >
            <div className="assessment-popup-header">
              <h4 id={`${dialogId}-title`}>{isBoth ? 'Pulse Check and Deep Dive' : info!.title}</h4>
              <button ref={closeBtnRef} onClick={close} aria-label="Close dialog" className="assessment-popup-close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            {isBoth ? (
              <>
                <p className="assessment-popup-desc">Both assessment modes are included. Use Pulse Check for a quick baseline or Deep Dive for a thorough, detailed review. Choose the right mode for each assessment based on what you need.</p>
                <h5 className="assessment-popup-subtitle">{pulseInfo.title}</h5>
                <p className="assessment-popup-desc">{pulseInfo.description}</p>
                <h5 className="assessment-popup-subtitle">{deepInfo.title}</h5>
                <p className="assessment-popup-desc">{deepInfo.description}</p>
              </>
            ) : (
              <>
                <p className="assessment-popup-desc">{info!.description}</p>
                {info!.recommended && <p className="assessment-popup-recommended">{info!.recommended}</p>}
                <p className="assessment-popup-list-label">{type === 'site' ? 'For example:' : 'Includes:'}</p>
                <ul className="assessment-popup-list">
                  {info!.includes.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </>
            )}
          </div>
        </>,
        document.body
      )}
    </>
  );
}

// --- TIER DATA ---

const individualTiers: Tier[] = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    description: 'See where you stand',
    whoFor: 'Small single-site businesses, cafes or venues starting out on accessibility.',
    highlight: false,
    features: {
      assessment: '3 modules (Deep Dive)',
      sites: '1 site / venue',
      assessments: '1',
      users: '1',
      departments: false,
      report: 'PDF report (scoped to 3 modules)',
      resourceHub: false,
      diap: false,
      comparison: false,
      training: 'Add-on: from $300',
      support: 'Self-service'
    }
  },
  {
    name: 'Starter',
    price: '$399',
    period: '6 months',
    description: 'Understand your baseline across all areas',
    whoFor: 'Single-site businesses committing to improvement with a structured baseline.',
    highlight: false,
    features: {
      assessment: 'Pulse Check (all relevant modules)',
      sites: '1 site / venue',
      assessments: '1',
      users: '1',
      departments: false,
      report: 'PDF report',
      resourceHub: '6 months',
      diap: false,
      comparison: false,
      training: 'Add-on: from $300',
      support: 'Self-service'
    }
  },
  {
    name: 'Committed',
    price: '$899',
    period: '12 months',
    description: 'Comprehensive review with action planning',
    whoFor: 'Single-site businesses with ongoing DIAP needs, renewable year-on-year.',
    highlight: true,
    features: {
      assessment: 'Deep Dive (all relevant modules)',
      sites: '1 site / venue',
      assessments: '1',
      users: '1',
      departments: false,
      report: 'PDF + interactive in-app report',
      resourceHub: '12 months',
      diap: true,
      comparison: '1 re-assessment',
      training: 'Add-on: from $300',
      support: 'Self-service'
    }
  }
];

const multisiteTiers: Tier[] = [
  {
    name: 'Multi-Site Pulse',
    price: '$999',
    period: '6 months',
    description: 'Baseline across locations',
    whoFor: 'Chains or groups with 2-3 venues wanting a quick first pass.',
    highlight: false,
    perSite: '$333/site',
    features: {
      assessment: 'Pulse Check (all relevant modules)',
      sites: 'Up to 3 sites / venues',
      assessments: '1 per site',
      users: '3',
      departments: false,
      report: 'PDF report',
      resourceHub: '6 months',
      diap: false,
      comparison: false,
      training: 'Add-on: from $300',
      support: 'Self-service'
    }
  },
  {
    name: 'Multi-Site Deep',
    price: '$1,999',
    period: '12 months',
    description: 'Detailed multi-site review',
    whoFor: 'Chains or groups (up to 3 venues) doing a full Deep Dive with DIAP.',
    highlight: true,
    perSite: '$666/site',
    features: {
      assessment: 'Deep Dive (all relevant modules)',
      sites: 'Up to 3 sites / venues',
      assessments: '1 per site',
      users: '3',
      departments: false,
      report: 'PDF + interactive in-app report',
      resourceHub: '12 months',
      diap: true,
      comparison: '1 per site',
      training: 'Add-on: from $300',
      support: 'Email support'
    }
  },
  {
    name: 'Multi-Site Plus',
    price: '$3,499',
    period: '12 months',
    description: 'Growing chains and groups',
    whoFor: 'Hotel, gym, restaurant or retail chains with up to 6 commercial venues.',
    highlight: false,
    perSite: '$583/site',
    features: {
      assessment: 'Deep Dive (all relevant modules)',
      sites: 'Up to 6 sites / venues',
      assessments: '1 per site',
      users: '6',
      departments: false,
      report: 'PDF + interactive in-app report',
      resourceHub: '12 months',
      diap: 'Full (assign, track, export)',
      teamAllocation: true,
      evidenceLibrary: true,
      comparison: '1 per site',
      training: 'Add-on: from $300',
      support: 'Email support + quarterly check-ins'
    }
  }
];

const majorVenueTiers: Tier[] = [
  {
    name: 'Premier Venue',
    price: '$7,900',
    period: '12 months',
    description: 'Mid-size single complex with zone-based assessment',
    whoFor: 'Regional stadiums, mid-size convention centres, major theatres, significant museums, integrated hotel-conference complexes.',
    highlight: false,
    features: {
      assessment: 'Deep Dive (all relevant modules)',
      sites: '1 complex',
      zones: 'Up to 10 zones',
      users: '6',
      diap: 'Full (assign, track, export)',
      diapImport: true,
      teamAllocation: true,
      evidenceLibrary: true,
      zoneReporting: true,
      crossZoneTrends: false,
      diapDepartments: false,
      stakeholderReporting: 'Basic (PDF summary)',
      coBrandedSummary: false,
      businessGroupIncluded: false,
      comparison: '1 per year',
      consultantTime: '2 check-ins per year',
      report: 'PDF + interactive in-app report',
      resourceHub: '12 months',
      seatExpansion: '$500/seat',
      training: 'Add-on: from $300',
      support: 'Priority email + onboarding'
    }
  },
  {
    name: 'Major Venue',
    price: '$14,900',
    period: '12 months',
    description: 'Flagship single complex with full board reporting and supplier group',
    whoFor: 'Flagship stadiums, major convention and exhibition centres, integrated resort complexes, major state galleries and museums, airport precincts.',
    highlight: true,
    features: {
      assessment: 'Deep Dive (all relevant modules)',
      sites: '1 complex',
      zones: 'Unlimited zones',
      users: '12',
      diap: 'Full (assign, track, export)',
      diapImport: true,
      teamAllocation: true,
      evidenceLibrary: true,
      zoneReporting: true,
      crossZoneTrends: true,
      diapDepartments: true,
      stakeholderReporting: 'Full (branded, board-ready)',
      coBrandedSummary: 'Optional',
      businessGroupIncluded: '1 Lite group (up to 10 businesses)',
      comparison: 'Unlimited',
      consultantTime: 'Quarterly + 4 hours consultation',
      report: 'PDF + interactive + cross-zone summary',
      resourceHub: '12 months',
      seatExpansion: '$400/seat',
      training: 'Add-on: from $300',
      support: 'Named consultant + priority onboarding'
    }
  }
];

const orgAccessibilityTiers: Tier[] = [
  {
    name: 'Core',
    price: '$4,900',
    period: '12 months',
    description: 'Move your DIAP from document to living system: import, assign, track, report.',
    whoFor: 'Regional councils, small statutory authorities, single-campus TAFEs, arts orgs with public DIAP. Scope to one focus area per financial year.',
    highlight: false,
    features: {
      diap: 'Full (import, assign, track, export)',
      diapImport: true,
      teamAllocation: true,
      diapDepartments: false,
      stakeholderReporting: 'Basic',
      assessment: 'All modules (Pulse + Deep Dive)',
      sites: '6 sites / venues',
      users: '3',
      report: 'PDF + interactive in-app report',
      resourceHub: '12 months',
      evidenceLibrary: true,
      comparison: '1 re-assessment',
      businessGroupIncluded: false,
      seatExpansion: '$400/seat',
      siteExpansion: '$400/site',
      training: 'Add-on: from $300',
      support: 'Email + guided onboarding'
    }
  },
  {
    name: 'Professional',
    price: '$8,900',
    period: '12 months',
    description: 'Multi-department DIAP management with department-level sections',
    whoFor: 'Mid-size metro councils, public hospitals, multi-team state authorities, university disability services.',
    highlight: true,
    features: {
      diap: 'Full (import, assign, track, export)',
      diapImport: true,
      teamAllocation: true,
      diapDepartments: true,
      stakeholderReporting: 'Full (branded)',
      assessment: 'All modules (Pulse + Deep Dive)',
      sites: '12 sites / venues',
      users: '8',
      report: 'PDF + interactive + department summary',
      resourceHub: '12 months',
      evidenceLibrary: true,
      comparison: 'Unlimited',
      businessGroupIncluded: '1 Lite group (up to 10 businesses)',
      seatExpansion: '$300/seat',
      siteExpansion: '$300/site',
      training: 'Add-on: from $300',
      support: 'Priority email + onboarding + quarterly check-in'
    }
  },
  {
    name: 'Enterprise',
    price: 'from $15,000',
    period: '12 months',
    description: 'For large councils, state and federal departments, universities, health networks and school systems.',
    whoFor: 'Large metros, state/federal departments, multi-campus universities, health networks, school systems.',
    highlight: false,
    features: {
      diap: 'Full (import, assign, track, export)',
      diapImport: true,
      teamAllocation: true,
      diapDepartments: true,
      stakeholderReporting: 'Custom templates',
      assessment: 'All modules (Pulse + Deep Dive)',
      sites: 'Negotiated',
      users: 'Negotiated',
      report: 'Custom + co-branded',
      resourceHub: '12 months',
      evidenceLibrary: true,
      comparison: 'Unlimited',
      businessGroupIncluded: 'Negotiated',
      seatExpansion: 'Per contract',
      siteExpansion: 'Per contract',
      training: 'Add-on: from $300',
      support: 'Dedicated support + consultant access'
    }
  }
];

const businessGroupsTiers: Tier[] = [
  {
    name: 'Essentials',
    price: '$4,900',
    period: '12 months',
    description: 'Quick baseline across your LGA or network',
    whoFor: 'Councils, chambers or regional tourism boards running a short capacity-building program.',
    highlight: false,
    perSite: '+ from $149 per business',
    features: {
      assessment: 'Pulse Check (scoped modules)',
      businessAccess: 'Up to 20 businesses',
      groups: '1 active group',
      users: '3',
      aggregateDashboard: 'Completion tracking',
      report: 'Completion summary export',
      resourceHub: '30 days per business',
      diap: false,
      comparison: false,
      training: 'Add-on: from $300',
      support: 'Email + onboarding call',
      sites: 'Up to 20 businesses',
    }
  },
  {
    name: 'Standard',
    price: '$7,900',
    period: '12 months',
    description: 'Comprehensive assessment with action planning for your businesses',
    whoFor: 'Councils, venue operators or property groups running a structured supplier or tenant group.',
    highlight: true,
    perSite: '+ from $349 per business',
    features: {
      assessment: 'Deep Dive (scoped modules)',
      businessAccess: 'Up to 50 businesses',
      groups: 'Up to 2 active groups',
      users: '5',
      aggregateDashboard: 'Completion tracking',
      report: 'Aggregate + per-group reporting',
      resourceHub: '6 months per business',
      diap: 'Included for businesses',
      comparison: false,
      training: 'Add-on: from $300',
      support: 'Email + onboarding call',
      sites: 'Up to 50 businesses',
    }
  },
  {
    name: 'Pro',
    price: '$14,900',
    period: '12 months',
    description: 'Full-service with ongoing improvement tracking',
    whoFor: 'Large councils, property groups and authorities running multiple groups across a region or network.',
    highlight: false,
    perSite: '+ from $499 per business',
    features: {
      assessment: 'Deep Dive (scoped modules)',
      businessAccess: 'Up to 100 businesses',
      groups: 'Up to 5 active groups',
      users: '10',
      aggregateDashboard: 'Full aggregate with trends',
      report: 'Aggregate + per-business + group reports',
      resourceHub: '12 months per business',
      diap: 'Included for businesses',
      comparison: '1 re-assessment per business',
      training: 'Add-on: from $300',
      support: 'Priority email + quarterly review',
      sites: 'Up to 100 businesses',
    }
  },
  {
    name: 'Enterprise & Partnerships',
    price: 'Contact us',
    period: '',
    description: 'For state bodies, franchise networks, industry associations and tourism boards',
    whoFor: 'State/federal bodies, franchise networks, industry peak bodies with accreditation schemes.',
    highlight: false,
    features: {
      assessment: 'Configurable per group',
      businessAccess: 'Negotiated',
      groups: 'Unlimited',
      users: 'Negotiated',
      aggregateDashboard: 'Custom reporting + API access',
      report: 'Full suite + exportable + co-branded reports',
      resourceHub: 'Included for businesses',
      diap: 'Included for businesses',
      comparison: 'Unlimited',
      training: 'Add-on: from $300',
      support: 'Dedicated partnership manager + SSO',
      sites: 'Negotiated',
    }
  }
];

export default function Pricing() {
  usePageTitle('Pricing');
  const navigate = useNavigate();
  const [view, setView] = useState<'individual' | 'multisite' | 'majorvenue' | 'authority'>('individual');
  const [showGroupPrompt, setShowGroupPrompt] = useState<string | null>(null);

  const session = getSession();
  const discovery = getDiscoveryData();
  const isOnboarding = !!session?.business_snapshot?.organisation_name &&
    !discovery?.discovery_data?.selectedTouchpoints?.length;

  const handleSelectTier = (tierName: string, _tierView: string) => {
    // Show the business groups prompt before proceeding
    setShowGroupPrompt(tierName);
  };

  const proceedWithTier = (tierName: string) => {
    setShowGroupPrompt(null);
    setSelectedTier(tierName, view);
    if (isOnboarding) {
      navigate('/discovery');
    } else {
      navigate('/disclaimer');
    }
  };

  const currentTiers =
    view === 'individual' ? individualTiers :
    view === 'multisite' ? multisiteTiers :
    view === 'majorvenue' ? majorVenueTiers :
    orgAccessibilityTiers;

  const featureLabels =
    view === 'authority' ? featureLabelsOrgAccessibility :
    view === 'majorvenue' ? featureLabelsMajorVenue :
    featureLabelsStandard;

  const viewLabels: Record<string, string> = {
    individual: 'Single Site / Venue',
    multisite: 'Multi-Site Chains & Groups',
    majorvenue: 'Major Venue (Single Complex)',
    authority: 'Councils & Authorities',
  };

  // Keyboard / focus management for Business Groups prompt dialog
  const promptDialogRef = useRef<HTMLDivElement>(null);
  const promptPrimaryRef = useRef<HTMLButtonElement>(null);
  const promptTriggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!showGroupPrompt) return;

    promptTriggerRef.current = document.activeElement as HTMLElement | null;

    const focusTimer = window.setTimeout(() => {
      promptPrimaryRef.current?.focus();
    }, 0);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowGroupPrompt(null);
        return;
      }
      if (e.key === 'Tab' && promptDialogRef.current) {
        const focusables = promptDialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKey);
      promptTriggerRef.current?.focus?.();
    };
  }, [showGroupPrompt]);

  return (
    <div className="landing-page">
      <header className="pricing-page-header">
        <div className="container header-container">
          <div className="logo">
            <Link to="/">
              <img src="/images/access-compass-logo.png" alt="Access Compass - Home" className="logo-img" />
            </Link>
          </div>
          <nav className="header-nav">
            <a href="mailto:hello@accesscompass.com.au" className="nav-link">Contact</a>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/disclaimer" className="btn btn-nav">Get started</Link>
          </nav>
        </div>
      </header>

      <div className="pricing-content" style={{ backgroundColor: colors.ivory }}>
        {/* Header */}
        <div className="pricing-header">
          <h1 style={{ color: colors.walnut }}>Pricing Plans</h1>
          <p style={{ color: colors.subtleText }}>45+ modules covering every touchpoint of your visitor journey and business operations: staff, policies, procurement and more.</p>
          <details className="pricing-helper-details" style={{ marginTop: '0.5rem', maxWidth: '44rem', marginLeft: 'auto', marginRight: 'auto', fontSize: '0.8125rem', color: colors.subtleText }}>
            <summary style={{ cursor: 'pointer', color: colors.amethyst, fontWeight: 600, display: 'inline-block', listStyle: 'none', padding: '0.25rem 0.5rem' }}>
              Not sure which tab?
            </summary>
            <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.125rem', textAlign: 'left', display: 'inline-block', lineHeight: 1.6 }}>
              <li>Business or commercial operator &mdash; <strong>Single Site</strong>, <strong>Multi-Site</strong> or <strong>Major Venue</strong></li>
              <li>Council, public authority, university or health network &mdash; <strong>Authorities</strong></li>
              <li>Running a supplier, tenant or grant group &mdash; see <a href="#extend-network" style={{ color: colors.amethyst, fontWeight: 700 }}>Business Groups</a> below</li>
            </ul>
          </details>
        </div>

        {/* View Toggle */}
        <div className="pricing-toggle" role="group" aria-label="Pricing view selector">
          <span className="pricing-toggle-label">Choose your pricing view</span>
          <div className="pricing-toggle-inner" style={{ backgroundColor: colors.white, border: `2px solid ${colors.ivoryDark}` }}>
            <button
              onClick={() => setView('individual')}
              className="pricing-toggle-btn"
              style={{
                backgroundColor: view === 'individual' ? '#ea0b3f' : 'transparent',
                color: view === 'individual' ? '#FFFFFF' : colors.walnut
              }}
              aria-pressed={view === 'individual'}
            >
              Single Site
            </button>
            <button
              onClick={() => setView('multisite')}
              className="pricing-toggle-btn"
              style={{
                backgroundColor: view === 'multisite' ? '#ea0b3f' : 'transparent',
                color: view === 'multisite' ? '#FFFFFF' : colors.walnut
              }}
              aria-pressed={view === 'multisite'}
            >
              Multi-Site
            </button>
            <button
              onClick={() => setView('majorvenue')}
              className="pricing-toggle-btn"
              style={{
                backgroundColor: view === 'majorvenue' ? '#ea0b3f' : 'transparent',
                color: view === 'majorvenue' ? '#FFFFFF' : colors.walnut
              }}
              aria-pressed={view === 'majorvenue'}
            >
              Major Venue
            </button>
            <button
              onClick={() => setView('authority')}
              className="pricing-toggle-btn"
              style={{
                backgroundColor: view === 'authority' ? '#ea0b3f' : 'transparent',
                color: view === 'authority' ? '#FFFFFF' : colors.walnut
              }}
              aria-pressed={view === 'authority'}
            >
              Authorities
            </button>
          </div>
        </div>

        {/* Tab intro / router callout */}
        {view === 'multisite' && (
          <div className="pricing-tab-intro" role="note" style={{ maxWidth: '64rem', margin: '0 auto 2rem', padding: '1rem 1.25rem', backgroundColor: '#FFF4E6', border: `1px solid ${colors.sunriseBright}`, borderRadius: '0.5rem' }}>
            <p style={{ margin: 0, fontSize: '0.875rem', color: colors.walnut, lineHeight: 1.5 }}>
              <strong>Are you a council, authority or public organisation?</strong> Multi-Site plans don't include DIAP import or board/stakeholder reporting. See the{' '}
              <button onClick={() => setView('authority')} style={{ background: 'none', border: 'none', color: colors.amethyst, fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', padding: 0, font: 'inherit' }}>Authorities tab</button>.
            </p>
          </div>
        )}
        {view === 'majorvenue' && (
          <div className="pricing-tab-intro" style={{ maxWidth: '64rem', margin: '0 auto 2rem', padding: '1.25rem 1.5rem', backgroundColor: colors.white, border: `2px solid ${colors.amethyst}`, borderRadius: '0.5rem' }}>
            <h3 style={{ margin: '0 0 0.375rem', fontSize: '1.0625rem', fontWeight: 700, color: colors.walnut }}>Major Venue plans</h3>
            <p style={{ margin: 0, fontSize: '0.9375rem', color: colors.subtleText, lineHeight: 1.55 }}>
              For flagship single-complex venues with board accountability, public reputation and formal accessibility programs. Zone-based assessment, stakeholder reporting and consultant support are included.
            </p>
          </div>
        )}
        {view === 'authority' && (
          <div className="pricing-tab-intro" style={{ maxWidth: '64rem', margin: '0 auto 2rem', padding: '1.25rem 1.5rem', backgroundColor: colors.white, border: `2px solid ${colors.amethyst}`, borderRadius: '0.5rem' }}>
            <h3 style={{ margin: '0 0 0.375rem', fontSize: '1.0625rem', fontWeight: 700, color: colors.walnut }}>For organisations with a formal DIAP or statutory obligation</h3>
            <p style={{ margin: 0, fontSize: '0.9375rem', color: colors.subtleText, lineHeight: 1.55 }}>
              For councils, state and federal departments, universities, health networks and organisations with accountability to a board, elected body or community.
            </p>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="pricing-cards">
          <div className="pricing-cards-grid">
            {currentTiers.map((tier, i) => (
              <div
                key={i}
                className={`pricing-card${tier.highlight ? ' highlighted' : ''}`}
                style={{
                  backgroundColor: tier.highlight ? colors.amethyst : colors.white,
                  border: tier.highlight ? `3px solid ${colors.sunriseBright}` : `2px solid ${colors.ivoryDark}`,
                  boxShadow: tier.highlight ? '0 16px 32px rgba(73, 14, 103, 0.3)' : '0 2px 8px rgba(62, 43, 47, 0.1)'
                }}
              >
                {tier.highlight && (
                  <div className="pricing-card-badge" style={{ backgroundColor: colors.sunriseBright, color: '#1A0F11' }}>
                    Most Popular
                  </div>
                )}
                <h2 style={{ color: tier.highlight ? colors.white : colors.walnut, fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  {tier.name}
                </h2>
                <p className="pricing-card-desc" style={{ color: tier.highlight ? '#E0D4E5' : colors.subtleText }}>
                  {tier.description}
                </p>
                <div className="pricing-card-price">
                  <span style={{ color: tier.highlight ? colors.white : colors.amethyst }}>
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="price-period" style={{ color: tier.highlight ? '#C9B8D0' : colors.subtleText }}>
                      {tier.period}
                    </span>
                  )}
                </div>
                {tier.perSite && (
                  <div className="pricing-card-persite" style={{ color: tier.highlight ? colors.sunriseBright : colors.sunrise }}>
                    {tier.perSite}
                  </div>
                )}
                {tier.whoFor && (
                  <div className="pricing-card-whofor" style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem 0.625rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.8125rem',
                    lineHeight: 1.55,
                    fontWeight: 500,
                    backgroundColor: tier.highlight ? 'rgba(255,255,255,0.14)' : colors.ivory,
                    color: tier.highlight ? '#FFFFFF' : colors.textOnWhite,
                  }}>
                    <strong style={{ color: tier.highlight ? colors.sunriseBright : colors.amethyst, fontWeight: 800, display: 'block', marginBottom: '0.25rem', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Who this is for</strong>
                    {tier.whoFor}
                  </div>
                )}
                <div
                  className="pricing-card-assessment"
                  style={{
                    borderTop: tier.highlight ? '2px solid rgba(255,255,255,0.3)' : `2px solid ${colors.ivoryDark}`,
                    color: tier.highlight ? '#E0D4E5' : colors.subtleText
                  }}
                >
                  {tier.features.assessment}
                  {tier.features.assessment.includes('Pulse') && tier.features.assessment.includes('Deep Dive')
                    ? <AssessmentInfoButton type="both" onHighlight={tier.highlight} />
                    : tier.features.assessment.includes('Deep Dive')
                      ? <AssessmentInfoButton type="deep" onHighlight={tier.highlight} />
                      : tier.features.assessment.includes('Pulse') && <AssessmentInfoButton type="pulse" onHighlight={tier.highlight} />
                  }
                </div>
                <details className="pricing-card-details">
                  <summary style={{ color: tier.highlight ? '#E0D4E5' : colors.amethyst }}>
                    What's included
                  </summary>
                  <div className="pricing-card-features" style={{ borderTop: tier.highlight ? '1px solid rgba(255,255,255,0.2)' : `1px solid ${colors.ivoryDark}` }}>
                    {featureLabels.map(({ key, label, infoKey }) => (
                      <div key={key} className="pricing-card-feature-row">
                        <span className="pricing-card-feature-label" style={{ color: tier.highlight ? '#C9B8D0' : colors.subtleText }}>
                          {label}
                          {infoKey && <InfoBubble infoKey={infoKey} onHighlight={tier.highlight} />}
                        </span>
                        <span style={{ color: tier.highlight ? colors.white : colors.textOnWhite }}>
                          {renderFeatureValue(tier.features[key], tier.highlight)}
                        </span>
                      </div>
                    ))}
                  </div>
                </details>
                {tier.price === 'Contact us' || tier.price === 'Custom pricing' || tier.price.startsWith('from ') ? (
                  <a
                    className="pricing-card-select-btn"
                    href="mailto:hello@accesscompass.com.au?subject=Enterprise%20%2F%20Partnership%20enquiry"
                    style={{
                      marginTop: '1.25rem', width: '100%', padding: '0.9375rem 1.5rem',
                      borderRadius: '0.5rem', border: `2px solid ${colors.amethyst}`,
                      backgroundColor: colors.amethyst, color: '#FFFFFF',
                      fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer',
                      display: 'block', textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box',
                      boxShadow: '0 3px 8px rgba(73, 14, 103, 0.25)',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    }}
                  >
                    Contact us
                  </a>
                ) : (
                  <button
                    className="pricing-card-select-btn"
                    onClick={() => handleSelectTier(tier.name, view)}
                    style={{
                      marginTop: '1.25rem', width: '100%', padding: '0.9375rem 1.5rem',
                      borderRadius: '0.5rem',
                      border: tier.highlight ? `2px solid ${colors.sunriseBright}` : `2px solid ${colors.amethyst}`,
                      backgroundColor: tier.highlight ? colors.sunriseBright : colors.amethyst,
                      color: tier.highlight ? '#1A0F11' : '#FFFFFF',
                      fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer',
                      boxShadow: tier.highlight ? '0 4px 12px rgba(255, 144, 21, 0.35)' : '0 3px 8px rgba(73, 14, 103, 0.25)',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    }}
                  >
                    Select {tier.name}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table - Desktop */}
        <div className="pricing-comparison" style={{ backgroundColor: colors.white, border: `2px solid ${colors.ivoryDark}` }}>
          <div className="pricing-comparison-header" style={{ backgroundColor: colors.amethyst }}>
            <h3 style={{ color: colors.white, fontSize: '1.125rem', fontWeight: 700 }}>Feature Comparison: {viewLabels[view]}</h3>
          </div>
          <table>
            <thead>
              <tr style={{ backgroundColor: colors.walnut }}>
                <th scope="col" style={{ color: colors.white }}>Feature</th>
                {currentTiers.map((tier, i) => (
                  <th key={i} scope="col" style={{ color: colors.white }}>{tier.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureLabels.map(({ key, label, infoKey }, idx) => (
                <tr key={key} style={{ backgroundColor: idx % 2 === 1 ? colors.ivory : colors.white }}>
                  <td style={{ color: colors.textOnWhite, position: 'relative' }}>
                    {label}
                    {(key as string) === 'ownAssessment' && <AssessmentInfoButton type="site" />}
                    {infoKey && <InfoBubble infoKey={infoKey} />}
                  </td>
                  {currentTiers.map((tier, i) => (
                    <td key={i} style={{ color: colors.textOnWhite }}>
                      {renderFeatureValue(tier.features[key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Comparison - Mobile */}
          <div className="pricing-comparison-mobile">
            {currentTiers.map((tier, i) => (
              <div key={i} className="pricing-mobile-tier">
                <h4 style={{ color: colors.amethyst }}>{tier.name} <span style={{ color: colors.subtleText, fontWeight: 400, fontSize: '0.875rem' }}>{tier.price}</span></h4>
                {featureLabels.map(({ key, label, infoKey }) => (
                  <div key={key} className="pricing-mobile-row">
                    <span className="pricing-mobile-label" style={{ color: colors.textOnWhite, position: 'relative' }}>
                      {label}
                      {(key as string) === 'ownAssessment' && <AssessmentInfoButton type="site" />}
                      {infoKey && <InfoBubble infoKey={infoKey} />}
                    </span>
                    <span style={{ color: colors.textOnWhite }}>
                      {renderFeatureValue(tier.features[key])}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ============ + Business Groups (all views) ============ */}
        {(
          <>
            {/* Extend to your network divider */}
            <div className="pricing-extend-divider" id="extend-network">
              <div className="pricing-extend-line" />
              <span className="pricing-extend-label">+ Extend to your network</span>
              <div className="pricing-extend-line" />
            </div>

            {/* Business Groups intro */}
            <div className="pricing-addons pricing-addons-wide">
              <div className="pricing-addons-inner" style={{ backgroundColor: colors.white, border: `2px solid ${colors.amethyst}`, padding: '1.25rem 1.5rem' }}>
                <h3 style={{ color: colors.walnut, marginBottom: '0.375rem' }}>Business Groups</h3>
                <p style={{ color: colors.subtleText, fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                  {view !== 'authority'
                    ? <>Require suppliers, procurement partners, tenants or contractors to complete accessibility assessments. Create groups (e.g. approved supplier review, event vendor compliance, tenant accessibility), select the relevant modules and track their progress from your dashboard. <InfoBubble infoKey="groups" /></>
                    : <>Create groups of businesses across your region or network (e.g. grant recipients, capacity-building initiatives, regional supplier groups), assign assessment modules and track their progress from your dashboard. <InfoBubble infoKey="groups" /></>
                  }
                </p>
                <p style={{ color: colors.walnut, fontSize: '0.8125rem', marginTop: '0.75rem', marginBottom: '0.5rem', padding: '0.625rem 0.75rem', backgroundColor: colors.ivory, borderLeft: `3px solid ${colors.sunriseBright}`, borderRadius: '0.25rem' }}>
                  <strong>Eligibility:</strong> Business Groups are for Micro, Small and Medium businesses (under 200 FTE). Large venues (stadiums, convention centres, major cultural institutions) see the{' '}
                  <button onClick={() => setView('majorvenue')} style={{ background: 'none', border: 'none', color: colors.amethyst, fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', padding: 0, font: 'inherit' }}>Major Venue</button> tab.
                </p>
                <p style={{ color: colors.subtleText, fontSize: '0.8125rem', marginTop: 0, marginBottom: 0, lineHeight: 1.55 }}>
                  Business Groups covers the businesses you manage. To assess your own venues, add a Single Site, Multi-Site, Major Venue or Authorities plan alongside.
                </p>
              </div>
            </div>

            {/* Business Groups tier cards */}
            <div className="pricing-cards pricing-cards-wide">
              <div className="pricing-cards-grid pricing-cards-grid-4col">
                {businessGroupsTiers.map((tier, i) => (
                  <div
                    key={i}
                    className={`pricing-card${tier.highlight ? ' highlighted' : ''}`}
                    style={{
                      backgroundColor: tier.highlight ? colors.amethyst : colors.white,
                      border: tier.highlight ? `3px solid ${colors.sunriseBright}` : `2px solid ${colors.ivoryDark}`,
                      boxShadow: tier.highlight ? '0 16px 32px rgba(73, 14, 103, 0.3)' : '0 2px 8px rgba(62, 43, 47, 0.1)'
                    }}
                  >
                    {tier.highlight && (
                      <div className="pricing-card-badge" style={{ backgroundColor: colors.sunriseBright, color: '#1A0F11' }}>
                        Most Popular
                      </div>
                    )}
                    <h2 style={{ color: tier.highlight ? colors.white : colors.walnut, fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                      {tier.name}
                    </h2>
                    <p className="pricing-card-desc" style={{ color: tier.highlight ? '#E0D4E5' : colors.subtleText }}>
                      {tier.description}
                    </p>
                    <div className="pricing-card-price">
                      <span style={{ color: tier.highlight ? colors.white : colors.amethyst }}>
                        {tier.price}
                      </span>
                    </div>
                    {tier.perSite && (
                      <div className="pricing-card-persite" style={{ color: tier.highlight ? colors.sunriseBright : colors.sunrise }}>
                        {tier.perSite}
                      </div>
                    )}
                    {tier.whoFor && (
                      <div className="pricing-card-whofor" style={{
                        marginTop: '0.5rem',
                        padding: '0.5rem 0.625rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.8125rem',
                        lineHeight: 1.55,
                        fontWeight: 500,
                        backgroundColor: tier.highlight ? 'rgba(255,255,255,0.14)' : colors.ivory,
                        color: tier.highlight ? '#FFFFFF' : colors.textOnWhite,
                      }}>
                        <strong style={{ color: tier.highlight ? colors.sunriseBright : colors.amethyst, fontWeight: 800, display: 'block', marginBottom: '0.25rem', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Who this is for</strong>
                        {tier.whoFor}
                      </div>
                    )}
                    <div
                      className="pricing-card-assessment"
                      style={{
                        borderTop: tier.highlight ? '2px solid rgba(255,255,255,0.3)' : `2px solid ${colors.ivoryDark}`,
                        color: tier.highlight ? '#E0D4E5' : colors.subtleText
                      }}
                    >
                      {tier.features.assessment}
                      {tier.features.assessment.includes('Pulse') && tier.features.assessment.includes('Deep Dive')
                        ? <AssessmentInfoButton type="both" onHighlight={tier.highlight} />
                        : tier.features.assessment.includes('Deep Dive')
                          ? <AssessmentInfoButton type="deep" onHighlight={tier.highlight} />
                          : tier.features.assessment.includes('Pulse') && <AssessmentInfoButton type="pulse" onHighlight={tier.highlight} />
                      }
                    </div>
                    <details className="pricing-card-details">
                      <summary style={{ color: tier.highlight ? '#E0D4E5' : colors.amethyst }}>
                        What's included
                      </summary>
                      <div className="pricing-card-features" style={{ borderTop: tier.highlight ? '1px solid rgba(255,255,255,0.2)' : `1px solid ${colors.ivoryDark}` }}>
                        {featureLabelsBusinessGroups.map(({ key, label, infoKey }) => (
                          <div key={key} className="pricing-card-feature-row">
                            <span className="pricing-card-feature-label" style={{ color: tier.highlight ? '#C9B8D0' : colors.subtleText }}>
                              {label}
                              {infoKey && <InfoBubble infoKey={infoKey} onHighlight={tier.highlight} />}
                            </span>
                            <span style={{ color: tier.highlight ? colors.white : colors.textOnWhite }}>
                              {renderFeatureValue(tier.features[key], tier.highlight)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </details>
                    <a
                      className="pricing-card-select-btn"
                      href={`mailto:hello@accesscompass.com.au?subject=${encodeURIComponent(`Business Groups enquiry: ${tier.name}`)}`}
                      style={{
                        marginTop: '1.25rem', width: '100%', padding: '0.9375rem 1.5rem',
                        borderRadius: '0.5rem',
                        border: tier.highlight ? `2px solid ${colors.sunriseBright}` : `2px solid ${colors.amethyst}`,
                        backgroundColor: tier.highlight ? colors.sunriseBright : colors.amethyst,
                        color: tier.highlight ? '#1A0F11' : '#FFFFFF',
                        fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer',
                        display: 'block', textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box',
                        boxShadow: tier.highlight ? '0 4px 12px rgba(255, 144, 21, 0.35)' : '0 3px 8px rgba(73, 14, 103, 0.25)',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      }}
                    >
                      Talk to us
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Groups comparison table */}
            <div className="pricing-comparison pricing-comparison-wide" style={{ backgroundColor: colors.white, border: `2px solid ${colors.ivoryDark}` }}>
              <div className="pricing-comparison-header" style={{ backgroundColor: colors.amethyst }}>
                <h3 style={{ color: colors.white, fontSize: '1.125rem', fontWeight: 700 }}>Feature Comparison: Business Groups</h3>
              </div>
              <table>
                <thead>
                  <tr style={{ backgroundColor: colors.walnut }}>
                    <th scope="col" style={{ color: colors.white }}>Feature</th>
                    {businessGroupsTiers.map((tier, i) => (
                      <th key={i} scope="col" style={{ color: colors.white }}>{tier.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {featureLabelsBusinessGroups.map(({ key, label, infoKey }, idx) => (
                    <tr key={key} style={{ backgroundColor: idx % 2 === 1 ? colors.ivory : colors.white }}>
                      <td style={{ color: colors.textOnWhite, position: 'relative' }}>
                        {label}
                        {(key as string) === 'ownAssessment' && <AssessmentInfoButton type="site" />}
                        {infoKey && <InfoBubble infoKey={infoKey} />}
                      </td>
                      {businessGroupsTiers.map((tier, i) => (
                        <td key={i} style={{ color: colors.textOnWhite }}>
                          {renderFeatureValue(tier.features[key])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pricing-comparison-mobile">
                {businessGroupsTiers.map((tier, i) => (
                  <div key={i} className="pricing-mobile-tier">
                    <h4 style={{ color: colors.amethyst }}>{tier.name} <span style={{ color: colors.subtleText, fontWeight: 400, fontSize: '0.875rem' }}>{tier.price}</span></h4>
                    {featureLabelsBusinessGroups.map(({ key, label, infoKey }) => (
                      <div key={key} className="pricing-mobile-row">
                        <span className="pricing-mobile-label" style={{ color: colors.textOnWhite, position: 'relative' }}>
                          {label}
                          {(key as string) === 'ownAssessment' && <AssessmentInfoButton type="site" />}
                          {infoKey && <InfoBubble infoKey={infoKey} />}
                        </span>
                        <span style={{ color: colors.textOnWhite }}>
                          {renderFeatureValue(tier.features[key])}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* How it works */}
            <div className="pricing-addons pricing-addons-wide">
              <div className="pricing-addons-inner" style={{ backgroundColor: colors.white, border: `2px solid ${colors.amethyst}` }}>
                <h3 style={{ color: colors.walnut }}>How Business Groups work</h3>
                <div style={{ fontSize: '0.875rem', color: colors.subtleText, lineHeight: 1.7 }}>
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong style={{ color: colors.textOnWhite }}>1. Create groups</strong> for grants, events, supply chain reviews or capacity building initiatives. <InfoBubble infoKey="groups" />
                  </p>
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong style={{ color: colors.textOnWhite }}>2. Businesses complete their assessment.</strong> You choose who pays: authority-funded, business-funded or co-funded. <InfoBubble infoKey="businessAccess" />
                  </p>
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong style={{ color: colors.textOnWhite }}>3. Track progress</strong> via your network dashboard. <InfoBubble infoKey="aggregateDashboard" />
                  </p>
                  <p style={{ marginBottom: '0' }}>
                    <strong style={{ color: colors.textOnWhite }}>4. Privacy by design.</strong> You see completion status and score bands. Individual answers remain private to each business.
                  </p>
                </div>
              </div>
            </div>

            {/* Events persona — route event organisers to the right tier */}
            <div className="pricing-addons pricing-addons-wide" id="events-persona">
              <div className="pricing-addons-inner" style={{ backgroundColor: colors.white, border: `1px solid ${colors.ivoryDark}`, padding: '1.5rem 1.75rem' }}>
                <h3 style={{ color: colors.walnut, marginBottom: '0.5rem' }}>Running an event? Here's where you fit.</h3>
                <p style={{ color: colors.subtleText, fontSize: '0.875rem', marginBottom: '1rem', maxWidth: '42rem' }}>
                  Access Compass has dedicated event modules (planning, venue, communication, sensory access, on-the-day operations). The right tier depends on event scale and recurrence.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.625rem' }}>
                  {[
                    {
                      title: 'One-off small event',
                      examples: 'Suburb fair, school fete, single-show production, single-day pop-up (under ~1,000 attendees)',
                      tier: 'Single Site Starter ($399)',
                      view: 'individual' as const,
                    },
                    {
                      title: 'Recurring annual event',
                      examples: 'Council festival, sports day, community gala, recurring single-venue conference (up to ~10,000 attendees)',
                      tier: 'Single Site Committed ($899)',
                      view: 'individual' as const,
                    },
                    {
                      title: 'Touring or multi-city event',
                      examples: 'Multi-city festival tour, travelling exhibition, conference with city-by-city legs',
                      tier: 'Multi-Site Pulse / Deep / Plus ($999–$3,499)',
                      view: 'multisite' as const,
                    },
                    {
                      title: 'Mid flagship festival or convention',
                      examples: 'Regional festival, mid-size convention, civic-led major program',
                      tier: 'Premier Venue ($7,900)',
                      view: 'majorvenue' as const,
                    },
                    {
                      title: 'Major festival or precinct event',
                      examples: 'Fringe Festival, Melbourne Fashion Week, Splendour, Vivid, Royal Show, AFL Grand Final precinct',
                      tier: 'Major Venue ($14,900)',
                      view: 'majorvenue' as const,
                    },
                  ].map((row) => (
                    <li
                      key={row.title}
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        backgroundColor: colors.ivory,
                        borderRadius: '8px',
                        border: `1px solid ${colors.ivoryDark}`,
                      }}
                    >
                      <div style={{ flex: '1 1 18rem', minWidth: 0 }}>
                        <p style={{ margin: 0, color: colors.textOnWhite, fontWeight: 600, fontSize: '0.9375rem' }}>{row.title}</p>
                        <p style={{ margin: '0.125rem 0 0', color: colors.subtleText, fontSize: '0.8125rem' }}>{row.examples}</p>
                      </div>
                      <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: colors.amethyst, fontWeight: 700, fontSize: '0.8125rem' }}>{row.tier}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setView(row.view);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          style={{
                            padding: '0.375rem 0.75rem',
                            border: `1px solid ${colors.amethyst}`,
                            background: 'transparent',
                            color: colors.amethyst,
                            borderRadius: '6px',
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          View tier
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <p style={{ color: colors.subtleText, fontSize: '0.75rem', marginTop: '0.875rem', marginBottom: 0, fontStyle: 'italic' }}>
                  Major events also benefit from the organisation modules (information register, training at scale, supplier accessibility, volunteer/contractor management). All Major Venue tiers include the full module set.
                </p>
              </div>
            </div>

            {/* Multi-Brand Enterprise footer CTA */}
            <div className="pricing-addons pricing-addons-wide">
              <div className="pricing-addons-inner" style={{ backgroundColor: colors.white, border: `2px solid ${colors.amethyst}`, textAlign: 'center', padding: '2rem' }}>
                <h3 style={{ color: colors.walnut, marginBottom: '0.5rem' }}>Managing multiple brands, regions or portfolios?</h3>
                <p style={{ color: colors.subtleText, fontSize: '0.875rem', marginBottom: '0.75rem', maxWidth: '36rem', marginLeft: 'auto', marginRight: 'auto' }}>
                  Multi-Brand Enterprise is a negotiated arrangement for property groups, franchise networks, state and federal bodies, universities, health networks and organisations needing staff training, grant tracking, event permitting, supplier assessments or state-framework reporting.
                </p>
                <p style={{ color: colors.amethyst, fontWeight: 700, fontSize: '0.9375rem', marginBottom: '1rem' }}>From $18,000/yr</p>
                <a
                  href="mailto:hello@accesscompass.com.au?subject=Multi-Brand%20Enterprise%20enquiry"
                  className="btn btn-primary"
                  style={{ display: 'inline-block' }}
                >
                  Talk to us about Enterprise
                </a>
              </div>
            </div>

            {/* Deflection footer */}
            <div className="pricing-addons pricing-addons-wide">
              <div className="pricing-addons-inner" style={{ backgroundColor: colors.ivory, border: `1px solid ${colors.ivoryDark}`, padding: '1.5rem 1.75rem' }}>
                <h3 style={{ color: colors.walnut, marginBottom: '0.5rem', fontSize: '1rem' }}>Not quite the right fit? You may belong elsewhere.</h3>
                <ul style={{ color: colors.subtleText, fontSize: '0.8125rem', lineHeight: 1.65, paddingLeft: '1.125rem', margin: 0 }}>
                  <li><strong style={{ color: colors.textOnWhite }}>Peak body or industry association members</strong> &mdash; ask your association about member-discount access.</li>
                  <li><strong style={{ color: colors.textOnWhite }}>Chambers of commerce</strong> &mdash; Business Groups or partner program, depending on scale.</li>
                  <li><strong style={{ color: colors.textOnWhite }}>Consultants running accessibility work for clients</strong> &mdash; partner / reseller program.</li>
                  <li><strong style={{ color: colors.textOnWhite }}>Insurers offering accessibility support to insureds</strong> &mdash; distribution partner.</li>
                  <li><strong style={{ color: colors.textOnWhite }}>Peak bodies or industry associations yourselves</strong> &mdash; referral / member-benefit model, not Authority tiers.</li>
                </ul>
                <p style={{ color: colors.walnut, fontSize: '0.8125rem', marginTop: '0.75rem', marginBottom: 0 }}>
                  <a href="mailto:hello@accesscompass.com.au?subject=Partner%20or%20alternative%20fit%20enquiry" style={{ color: colors.amethyst, fontWeight: 700 }}>Talk to us about any of these</a>.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Individual Modules (hidden on authority view) */}
        {view !== 'authority' && view !== 'majorvenue' && (
          <div className="pricing-addons">
            <div className="pricing-addons-inner" style={{ backgroundColor: colors.white, border: `2px solid ${colors.ivoryDark}` }}>
              <h3 style={{ color: colors.walnut }}>
                <span style={{ backgroundColor: colors.amethyst, color: colors.white, width: '1.5rem', height: '1.5rem', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>1</span>
                Individual Modules
              </h3>
              <p style={{ color: colors.subtleText, fontSize: '0.8125rem', marginBottom: '0.75rem' }}>
                Just want to check a specific area? Each module includes the Deep Dive assessment, PDF report and 30 days of relevant Resource Hub access.
              </p>
              <div className="pricing-addons-grid">
                <div className="pricing-addon-item" style={{ color: colors.textOnWhite }}>
                  <span>Single module</span>
                  <span style={{ fontWeight: 700 }}>$49</span>
                </div>
                <div className="pricing-addon-item" style={{ color: colors.textOnWhite }}>
                  <span>3-module bundle</span>
                  <span><span style={{ fontWeight: 700 }}>$129</span> <span style={{ color: colors.subtleText, fontSize: '0.75rem' }}>($43/ea)</span></span>
                </div>
                <div className="pricing-addon-item" style={{ color: colors.textOnWhite }}>
                  <span>5-module bundle</span>
                  <span><span style={{ fontWeight: 700 }}>$199</span> <span style={{ color: colors.subtleText, fontSize: '0.75rem' }}>($40/ea)</span></span>
                </div>
                <div className="pricing-addon-item" style={{ color: colors.subtleText, fontSize: '0.8125rem' }}>
                  <span>Spend credited toward Starter or Committed upgrade</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Paths (hidden on authority view) */}
        {view !== 'authority' && view !== 'majorvenue' && (
          <div className="pricing-upgrades" style={{ backgroundColor: colors.white, border: `2px solid ${colors.amethyst}` }}>
            <h3 style={{ color: colors.amethyst }}>Upgrade Paths: Full credit applied</h3>
            <div className="pricing-upgrades-list">
              {[
                { path: 'Starter \u2192 Committed', credit: '$399' },
                { path: 'Committed \u2192 Multi-Site Deep', credit: '$899' },
                { path: 'Multi-Site Pulse \u2192 Deep', credit: '$999' },
                { path: 'Multi-Site Deep \u2192 Plus', credit: '$1,999' },
                { path: 'Multi-Site Plus \u2192 Premier Venue', credit: '$3,499' },
                { path: 'Premier Venue \u2192 Major Venue', credit: '$7,900' }
              ].map((item, i) => (
                <span key={i} className="pricing-upgrade-pill" style={{ backgroundColor: colors.ivory, color: colors.walnut, border: `1px solid ${colors.ivoryDark}` }}>
                  {item.path}: <strong style={{ color: colors.amethyst }}>{item.credit}</strong>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        {view !== 'authority' && view !== 'majorvenue' && (
          <div className="pricing-cta">
            <p style={{ color: colors.subtleText, fontSize: '0.9375rem' }}>
              Select a plan above to get started
            </p>
          </div>
        )}

        {/* Business Groups prompt dialog */}
        {showGroupPrompt && (
          <>
            <div className="pricing-prompt-overlay" onClick={() => setShowGroupPrompt(null)} />
            <div
              ref={promptDialogRef}
              className="pricing-prompt-dialog"
              role="dialog"
              aria-labelledby="prompt-dialog-title"
              aria-describedby="prompt-dialog-desc"
              aria-modal="true"
            >
              <button
                onClick={() => setShowGroupPrompt(null)}
                aria-label="Close dialog"
                className="pricing-prompt-close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
              <h3 id="prompt-dialog-title" style={{ color: colors.walnut, margin: '0 0 0.5rem', fontSize: '1.125rem' }}>
                Before you continue...
              </h3>
              <p id="prompt-dialog-desc" style={{ color: colors.subtleText, fontSize: '0.9375rem', margin: '0 0 1rem', lineHeight: 1.6 }}>
                Do you also manage suppliers, partners or businesses that need to demonstrate accessibility? With <strong>Business Groups</strong>, you can assign assessment modules and track their progress from your dashboard.
              </p>
              <div className="pricing-prompt-actions">
                <button
                  ref={promptPrimaryRef}
                  onClick={() => proceedWithTier(showGroupPrompt)}
                  className="pricing-prompt-btn-secondary"
                >
                  No, continue with {showGroupPrompt}
                </button>
                <a
                  href={`mailto:hello@accesscompass.com.au?subject=${encodeURIComponent(`${showGroupPrompt} + Business Groups enquiry`)}`}
                  className="pricing-prompt-btn-primary"
                  onClick={() => setShowGroupPrompt(null)}
                >
                  Yes, tell me more
                </a>
              </div>
            </div>
          </>
        )}

        {/* Footer note */}
        <div className="pricing-footer-note">
          <p style={{ color: colors.subtleText }}>
            All prices AUD. Payment plans available on all paid tiers (3 instalments, 0% interest).
          </p>
        </div>
      </div>

      <footer className="landing-footer">
        <div className="container">
          <p className="footer-brand">
            Access Compass is a <a href="https://flareaccess.com.au" target="_blank" rel="noopener noreferrer">Flare Access</a> product designed to help organisations understand, prioritise and take action on accessibility.
          </p>
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Flare Access. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
