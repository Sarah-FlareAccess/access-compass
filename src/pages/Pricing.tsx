import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import { getSession, getDiscoveryData } from '../utils/session';
import { setSelectedTier } from '../utils/selectedTier';
import { FoundingPartnerBanner } from '../components/FoundingPartnerBanner';
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
  note?: string;
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
    recommended: 'Recommended if you want to know where you stand without a full Deep Dive yet. Good fit for: a regional council scoping next year DIAP focus area; a small hospitality group baselining three properties; a single-site venue deciding where to start.',
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
    recommended: 'Recommended if you are committing to action and need detailed evidence. Good fit for: an authority preparing a public DIAP across departments; a flagship venue gathering board-ready evidence; a single-site business publishing a renewable DIAP.',
    includes: [
      'All questions per module (comprehensive)',
      'Best-practice coverage across each area',
      'Detailed PDF + interactive in-app report',
      'Priority ratings with timeframes',
      'Evidence and notes capture',
    ],
  },
};

const tierDetailContent: Record<string, { title: string; situation: string; audience: string; examples: string[] }> = {
  'Free': {
    title: 'Free',
    situation: 'You know accessibility matters and want to see what an assessment actually looks like before you spend anything.',
    audience: 'Best for sole traders, micro-businesses or community groups testing the waters at no cost.',
    examples: [
      'A corner cafe just starting out',
      'A single artisan retail shop',
      'A community hall committee just starting to think about access',
      'A sole-trader tour guide or experience operator',
    ],
  },
  'Starter': {
    title: 'Starter',
    situation: 'You understand why accessibility matters but have no clear picture of where your venue actually stands today.',
    audience: 'Best for single-venue businesses that want a Pulse Check across every relevant area, so they know where to focus next.',
    examples: [
      'An independent restaurant or cafe wanting a structured first look',
      'A single-shop retailer wanting to know where they stand',
      'A boutique hotel building an accessibility position',
      'A small tour operator or community arts venue starting their journey',
      'A single-site clinic or wellness studio',
    ],
  },
  'Committed': {
    title: 'Committed',
    situation: 'You want accessibility to live in your business, not sit in a folder. You need an action plan you can publish, share with your board or grant funders, and renew year on year.',
    audience: 'Best for single-venue operators making accessibility part of how they run, with a full Deep Dive and a living action plan.',
    examples: [
      'A walking tour or boat dining experience formalising accessibility year on year',
      'A community theatre publishing a public action plan',
      'A single-location retail destination making accessibility part of how they trade',
      'An owner-operator boutique hotel that markets on inclusion',
      'A regional gallery preparing for a board accessibility review',
    ],
  },
  'Multi-Site Pulse': {
    title: 'Multi-Site Pulse',
    situation: 'You run a few venues and want to know how each one is doing on accessibility. You need a starting point across the group before you decide where to invest.',
    audience: 'Best for small groups with two or three venues that want a Pulse Check on every site in one program.',
    examples: [
      'A three-property boutique hotel group',
      'A small retail chain across two or three stores',
      'A regional tour operator with a few branded experiences',
      'A two-clinic allied health practice',
      'A small hospitality group with a handful of venues',
    ],
  },
  'Multi-Site Deep': {
    title: 'Multi-Site Deep',
    situation: 'You have a few venues and you are ready to act, not just baseline. You need a full Deep Dive and action plan for each site, but coordinated as one program rather than three separate projects.',
    audience: 'Best for small groups with two or three venues running coordinated action plans across their sites.',
    examples: [
      'A boutique hotel group activating action plans across three properties',
      'A small retail group rolling out one accessibility program across stores',
      'A multi-experience tourism operator coordinating tours and trails as one program',
      'A multi-clinic health network coordinating accessibility across sites',
      'A small hospitality group post-grant or post-incident',
    ],
  },
  'Multi-Site Plus': {
    title: 'Multi-Site Plus',
    situation: 'You operate a real chain across multiple sites and need one accessibility program that covers them all, with team allocation, evidence and a full action plan.',
    audience: 'Best for mid-size chains with up to six commercial venues running accessibility as a coordinated group operation.',
    examples: [
      'A hotel chain with four to six properties',
      'A regional retail chain across multiple stores',
      'A multi-studio fitness brand',
      'A regional tourism operator running multiple experiences across a state',
      'A multi-clinic health network across a state',
    ],
  },
  'Premier Venue': {
    title: 'Premier Venue',
    situation: 'You are one venue, but the venue IS the operation. Your accessibility is a public statement and you answer to a board, sponsors and a community of stakeholders.',
    audience: 'Best for mid-size destination venues that need civic-grade accessibility on a single complex with up to ten zones.',
    examples: [
      'A regional stadium or sports precinct',
      'A mid-size convention or exhibition centre',
      'A major regional theatre',
      'A significant museum or gallery',
      'An integrated hotel and conference complex',
      'A premium retail or tourism precinct',
    ],
  },
  'Major Venue': {
    title: 'Major Venue',
    situation: 'Your brand is on the line every day. You need governance-grade accessibility evidence, board-ready reporting, and a program that can survive a public-incident inquiry.',
    audience: 'Best for flagship venues where one accessibility incident becomes news, with unlimited zones, department-level DIAP and named consultant support.',
    examples: [
      'A flagship national or state stadium',
      'A major convention and exhibition centre',
      'An integrated resort or precinct complex',
      'A major state gallery or museum',
      'A flagship retail destination or shopping precinct',
      'A major airport precinct or transport hub',
    ],
  },
  'Core': {
    title: 'Core',
    situation: 'You are responsible for delivering on DIAP commitments at a regional or smaller-authority scale, on a modest budget and without a big consultancy on the books.',
    audience: 'Best for regional councils and smaller authorities running a focused DIAP program, scoping one focus area per financial year.',
    examples: [
      'A regional or rural council',
      'A regional tourism board or destination authority',
      'A smaller statutory authority',
      'A single-campus TAFE',
      'An arts organisation with a public DIAP',
    ],
  },
  'Professional': {
    title: 'Professional',
    situation: 'Your DIAP spans multiple teams and venues, and you need it coordinated across departments rather than living in one office.',
    audience: 'Best for mid-size metropolitan authorities coordinating accessibility across departments and sites, with department-level DIAP sections and a board-ready report.',
    examples: [
      'A mid-size metro council',
      'A regional tourism authority covering multiple LGAs',
      'A public hospital or local health district',
      'A multi-team state authority',
      'A university disability services unit',
    ],
  },
  'Enterprise': {
    title: 'Enterprise',
    situation: 'You manage accessibility at portfolio scale, across many sites, many teams and often multiple DIAPs. You need this to work for a strategic policy roll-out, not a single team.',
    audience: 'Best for large metropolitan, state and federal bodies running accessibility across teams, sites and DIAPs at portfolio scale.',
    examples: [
      'A large metropolitan council',
      'A state tourism body or major destination authority',
      'A state or federal department',
      'A multi-campus university',
      'A health network or hospital group',
      'A school system or education authority',
    ],
  },
  'Essentials': {
    title: 'Essentials',
    situation: 'You want to run a structured accessibility uplift for the businesses in your area, with reporting you can take back to your board, members or funder.',
    audience: 'Best for councils, chambers and tourism boards running a short, time-boxed program with up to twenty local businesses.',
    examples: [
      'A council economic development team running a small-business uplift',
      'A chamber of commerce delivering a member program',
      'A regional tourism board piloting an inclusive cohort',
      'A retail precinct association running a main-street program',
      'A grant-funded local business support initiative',
    ],
  },
  'Standard': {
    title: 'Standard',
    situation: 'You have tenants, suppliers or members who need to meet a shared accessibility standard, and you need a structured way to verify and track that with an audit trail.',
    audience: 'Best for venue operators, property groups and councils running a structured supplier or tenant program with up to fifty businesses.',
    examples: [
      'A venue operator running an accessibility program for tenants',
      'A property group setting standards across retail tenants',
      'A council enrolling food-precinct or main-street operators',
      'A tourism precinct coordinating accommodation, retail and experience providers',
      'A large festival coordinating concessionaires',
    ],
  },
  'Pro': {
    title: 'Pro',
    situation: 'You have proven the cohort model and now need to run several programs in parallel across a region or network, with cross-group reporting.',
    audience: 'Best for large councils, property groups and authorities running multiple accessibility programs concurrently, up to one hundred businesses across up to five active groups.',
    examples: [
      'A large council running parallel programs across precincts (retail, food, tourism)',
      'A property group rolling out programs across multiple retail centres',
      'A regional tourism authority covering several LGAs and operator types',
      'A major festival or precinct programming multiple business cohorts',
    ],
  },
  'Enterprise & Partnerships': {
    title: 'Enterprise & Partnerships',
    situation: 'You are setting a sector-wide or national accessibility standard, often as part of an accreditation or certification program for your industry or network.',
    audience: 'Best for state and federal bodies, franchise networks and industry peak bodies delivering accessibility as part of a sector-wide accreditation or certification.',
    examples: [
      'A national tourism body setting industry-wide standards',
      'A retail or franchise network setting accreditation across stores',
      'A state or federal industry body',
      'An industry peak body offering certification',
      'A national hospitality, tourism or retail association',
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

function TierDetailButton({ tierName, onHighlight = false }: { tierName: string; onHighlight?: boolean }) {
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const detail = tierDetailContent[tierName];

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

  if (!detail) return null;

  const dialogId = `tier-detail-${tierName.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        aria-label={`More about who ${detail.title} is for`}
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
              <h4 id={`${dialogId}-title`}>{detail.title}: who this is for</h4>
              <button ref={closeBtnRef} onClick={close} aria-label="Close dialog" className="assessment-popup-close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="assessment-popup-desc">{detail.situation}</p>
            <p className="assessment-popup-recommended">{detail.audience}</p>
            <p className="assessment-popup-list-label">Typical examples:</p>
            <ul className="assessment-popup-list">
              {detail.examples.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
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
    whoFor: 'A free first look. Start small, no commitment.',
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
    whoFor: 'Know where you stand, so you know where to focus next.',
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
    whoFor: 'Your living action plan for one venue, renewed every year.',
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
    whoFor: 'Know where each venue stands, so you know where to focus first.',
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
    whoFor: 'Coordinated action plans across two or three venues, one program.',
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
    whoFor: 'One program across every venue in your group, up to six sites.',
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
    whoFor: 'When one site is the whole operation.',
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
      stakeholderReporting: 'Tailored report (select assessment, sections)',
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
    whoFor: 'Governance-grade accessibility for flagship venues.',
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
      stakeholderReporting: 'Tailored report + branding on request',
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
    description: 'Move your action plan from document to living system: import, assign, track, report.',
    whoFor: 'For regional councils and smaller authorities running their accessibility action plan.',
    highlight: false,
    features: {
      diap: 'Full (import, assign, track, export)',
      diapImport: true,
      teamAllocation: true,
      diapDepartments: false,
      stakeholderReporting: 'Tailored report (select assessment, sections)',
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
    description: 'Multi-department action plan management with department-level sections',
    whoFor: 'For mid-size authorities coordinating across departments and venues.',
    highlight: true,
    features: {
      diap: 'Full (import, assign, track, export)',
      diapImport: true,
      teamAllocation: true,
      diapDepartments: true,
      stakeholderReporting: 'Tailored report (select assessment, department, sections)',
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
    whoFor: 'For large authorities running accessibility at portfolio scale.',
    highlight: false,
    features: {
      diap: 'Full (import, assign, track, export)',
      diapImport: true,
      teamAllocation: true,
      diapDepartments: true,
      stakeholderReporting: 'Tailored report + branding on request',
      assessment: 'All modules (Pulse + Deep Dive)',
      sites: 'Negotiated',
      users: 'Negotiated',
      report: 'Custom + co-branded',
      resourceHub: '12 months',
      evidenceLibrary: true,
      comparison: 'Unlimited',
      businessGroupIncluded: 'Negotiated',
      seatExpansion: 'Negotiated',
      siteExpansion: 'Negotiated',
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
    whoFor: 'Run a cohort accessibility program for your local businesses.',
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
    whoFor: 'Hold your tenants or suppliers to a shared accessibility standard.',
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
    whoFor: 'Run several accessibility programs in parallel across your network.',
    highlight: false,
    perSite: '+ from $499 per business',
    note: 'Higher business counts available, talk to us.',
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
    whoFor: 'Set a sector-wide accessibility standard for your industry or network.',
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
        </div>

        {/* Founding Partner banner */}
        <FoundingPartnerBanner />

        {/* View Toggle */}
        <div className="pricing-toggle" role="group" aria-label="Pricing view selector">
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
                {tier.note && (
                  <div style={{
                    marginTop: '0.375rem',
                    fontSize: '0.75rem',
                    fontStyle: 'italic',
                    color: tier.highlight ? '#E0D4E5' : colors.subtleText,
                  }}>
                    {tier.note}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                      <strong style={{ color: tier.highlight ? colors.sunriseBright : colors.amethyst, fontWeight: 800, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Who this is for</strong>
                      <TierDetailButton tierName={tier.name} onHighlight={tier.highlight} />
                    </div>
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
                    {tier.note && (
                      <div style={{
                        marginTop: '0.375rem',
                        fontSize: '0.75rem',
                        fontStyle: 'italic',
                        color: tier.highlight ? '#E0D4E5' : colors.subtleText,
                      }}>
                        {tier.note}
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                          <strong style={{ color: tier.highlight ? colors.sunriseBright : colors.amethyst, fontWeight: 800, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Who this is for</strong>
                          <TierDetailButton tierName={tier.name} onHighlight={tier.highlight} />
                        </div>
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
