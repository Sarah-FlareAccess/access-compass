import jsPDF from 'jspdf';
import type { DIAPItem } from '../hooks/useDIAPManagement';
import { getCustomCategories } from '../data/diapMapping';
import { getModuleById } from '../data/accessModules';

const COLORS = {
  amethystDark: '#3a0b52',
  amethystDiamond: '#490E67',
  amethystLight: '#6b21a8',
  aussieDark: '#E07D00',
  aussieLight: '#FF9015',
  ivory: '#FAF8F5',
  white: '#FFFFFF',
  text: '#1f2937',
  textMuted: '#6b7280',
  statusHigh: '#b91c1c',
  statusMedium: '#945a00',
  statusLow: '#1a4fd6',
  green: '#166534',
  greenLight: '#dcfce7',
  redLight: '#fee2e2',
  amberLight: '#fef3c7',
  blueLight: '#dbeafe',
};

const PAGE = {
  width: 210,
  height: 297,
  marginX: 20,
  marginY: 25,
  contentWidth: 170,
};

const CATEGORY_LABELS: Record<string, string> = {
  'physical-access': 'Physical Access',
  'information-communication-marketing': 'Information, Communication & Marketing',
  'customer-service': 'Customer Service',
  'operations-policy-procedure': 'Operations, Policy & Procedure',
  'people-culture': 'People & Culture',
};

// Lower-case phrases used in the computed executive-analysis narrative so it
// reads as prose rather than a list of category labels.
const CATEGORY_PHRASES: Record<string, string> = {
  'physical-access': 'the physical environment',
  'information-communication-marketing': 'information and communication',
  'customer-service': 'customer service',
  'operations-policy-procedure': 'operations, policy and procedure',
  'people-culture': 'people and culture',
  '__other__': 'other areas',
};

// Short, generically-true context printed under each category band so the plan
// explains why the area matters, not just what to do. Intentionally free of
// figures, benchmarks or org-specific claims (nothing that could be fabricated).
const CATEGORY_WHY: Record<string, string> = {
  'physical-access': 'The physical environment decides who can enter, move through and use a space independently. Barriers here often carry the greatest legal exposure under the Premises Standards and the National Construction Code, and are usually the most visible to visitors.',
  'information-communication-marketing': 'People can only use a service they can find, understand and act on. Accessible information, communication and marketing let everyone plan a visit, complete a booking and know what to expect before they arrive.',
  'customer-service': 'Confident, well-prepared staff turn accessible facilities into a genuinely welcoming experience. Service and support actions close the gap between what a space offers and how included a visitor actually feels.',
  'operations-policy-procedure': 'Policies and procedures set a standard that outlasts any single staff member. Embedding accessibility into how the organisation runs keeps improvements consistent and makes them easier to sustain and report on.',
  'people-culture': 'An inclusive workforce and culture shape every decision the organisation makes. Building capability and representation from within is what keeps accessibility moving beyond a one-off project.',
};

// Keep in sync with DIAPStatus in useDIAPManagement. STATUS_ORDER drives the
// status breakdown so every status is represented and percentages sum to 100.
const STATUS_LABELS: Record<string, string> = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  'achieved': 'Achieved',
  'ongoing': 'Ongoing',
  'on-hold': 'On Hold',
  'cancelled': 'Cancelled',
};

const STATUS_ORDER = ['not-started', 'in-progress', 'achieved', 'ongoing', 'on-hold', 'cancelled'];

const PRIORITY_COLORS: Record<string, string> = {
  high: COLORS.statusHigh,
  medium: COLORS.statusMedium,
  low: COLORS.statusLow,
};

const PRIORITY_ACCENT: Record<string, string> = {
  high: '#ef4444',
  medium: '#d97706',
  low: '#3b82f6',
};

const STATUS_COLORS: Record<string, string> = {
  'not-started': '#6b7280',
  'in-progress': '#945a00',
  'achieved': '#166534',
  'ongoing': '#1a4fd6',
  'on-hold': '#6b7280',
  'cancelled': '#991b1b',
};

interface DIAPPdfOptions {
  items: DIAPItem[];
  orgName?: string;
  // The plan's title, shown on the cover and the running header. Defaults to
  // "Disability Inclusion Action Plan"; callers pass a jurisdiction-aware value
  // (e.g. SA's "Disability Access and Inclusion Plan") or a per-export override.
  planTitle?: string;
  siteName?: string;
  generatedDate?: string;
  customCategoryNames?: Record<string, string>;
  // Optional statutory-framework grouping (e.g. SA SDIP): the plan's actions
  // grouped under the jurisdiction's outcome domains, printed as its own section
  // so councils can lift it straight into their statutory report.
  frameworkGrouping?: {
    name: string;
    short: string;
    domains: { name: string; outcomeStatement?: string; items: DIAPItem[] }[];
  };
  // Map of site id -> site name. When the report is org-wide (no siteName), each
  // action is tagged with the site it belongs to so items from different venues
  // are not mixed together anonymously. Ignored for single-site reports.
  siteNames?: Record<string, string>;
  // Optional grouping override for the action-items body. When absent, actions
  // are grouped by category (the default). When present, the caller supplies the
  // top-level groups already computed (e.g. by statutory outcome domain, custom
  // section or site), and the generator renders them in order. dimensionLabel
  // names the grouping for the TOC and a caption; itemFootnotes carries an
  // optional per-item line (e.g. "Also contributes to: ...") for actions that
  // span more than one group.
  grouping?: {
    dimensionLabel: string;
    groups: { key: string; heading: string; subtitle?: string; items: DIAPItem[] }[];
    itemFootnotes?: Record<string, string>;
    // When the body is already grouped by the statutory outcome domains, the
    // separate framework "detailed mapping" appendix repeats it, so the caller
    // sets this to drop the appendix (the summary table is still kept).
    omitFrameworkAppendix?: boolean;
  };
}

// Filesystem-safe fragment from a display name (spaces to dashes, strip the
// rest) for use in the download filename.
function slugForFilename(name: string): string {
  return name
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

export function generateDIAPPdf(options: DIAPPdfOptions): void {
  const { items, orgName = 'Your Organisation', planTitle = 'Disability Inclusion Action Plan', siteName, generatedDate, customCategoryNames = {}, frameworkGrouping, siteNames = {}, grouping } = options;

  // Tag each action with its site only in an org-wide report (no single site
  // selected); when scoped to one site every item shares it, so a tag is noise.
  const orgWideReport = !siteName;

  // The distinct sites this report actually covers, derived from the items in
  // scope (so it stays accurate whatever selection produced them). Used to state
  // the scope on the cover and near the intro.
  const coveredSiteNames = orgWideReport
    ? [...new Set(
        items
          .map(i => i.siteId)
          .filter((id): id is string => !!id && !!siteNames[id])
          .map(id => siteNames[id]),
      )].sort((a, b) => a.localeCompare(b))
    : [];

  // Concise scope label for the cover: an explicit site name, a single covered
  // site, or a count when the plan spans several (the full list sits by the intro).
  const coverScope = siteName
    ? siteName
    : coveredSiteNames.length === 1 ? coveredSiteNames[0]
    : coveredSiteNames.length > 1 ? `${coveredSiteNames.length} sites` : '';

  // Build category labels with custom categories and name overrides
  const categoryLabels: Record<string, string> = { ...CATEGORY_LABELS };
  getCustomCategories().forEach(cat => {
    categoryLabels[cat.id] = cat.name;
  });
  Object.entries(customCategoryNames).forEach(([id, name]) => {
    if (name.trim()) categoryLabels[id] = name.trim();
  });
  const dateStr = generatedDate || new Date().toISOString();
  const formattedDate = new Date(dateStr).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const fileDate = new Date(dateStr).toISOString().split('T')[0];

  const doc = new jsPDF('p', 'mm', 'a4');
  let currentPage = 1;
  let yPos = PAGE.marginY;

  // Contents-page support: record the page each section lands on, and where each
  // contents line was drawn, so a second pass can stamp accurate page numbers
  // (the pages are not known when the contents page is first drawn).
  const sectionPages = new Map<string, number>();
  const tocEntries: { title: string; page: number; y: number }[] = [];
  const recordSection = (title: string) => {
    if (!sectionPages.has(title)) sectionPages.set(title, doc.getNumberOfPages());
  };

  // ========================================
  // HELPERS
  // ========================================

  const addHeader = () => {
    doc.setFillColor(...hexToRgb(COLORS.amethystDark));
    doc.rect(0, 0, PAGE.width, 15, 'F');
    doc.setFillColor(...hexToRgb(COLORS.amethystDiamond));
    doc.rect(0, 0, PAGE.width * 0.6, 15, 'F');

    doc.setFillColor(...hexToRgb(COLORS.aussieLight));
    doc.rect(0, 14, PAGE.width, 1.5, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(orgName, PAGE.marginX, 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(planTitle, PAGE.width - PAGE.marginX, 10, { align: 'right' });
    doc.setTextColor(0, 0, 0);
  };

  const addFooter = () => {
    const fy = PAGE.height - 12;

    doc.setFillColor(...hexToRgb(COLORS.ivory));
    doc.rect(0, fy - 6, PAGE.width, 18, 'F');

    doc.setFillColor(...hexToRgb(COLORS.amethystDiamond));
    doc.rect(PAGE.marginX, fy - 6, 40, 1, 'F');

    doc.setFontSize(7);
    doc.setTextColor(107, 114, 128);
    doc.text('Prepared with Access Compass by Flare Access', PAGE.marginX, fy);
    doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
    doc.text(formattedDate, PAGE.width / 2, fy, { align: 'center' });
    doc.setTextColor(107, 114, 128);
    doc.text(`Page ${currentPage}`, PAGE.width - PAGE.marginX, fy, { align: 'right' });
    doc.setTextColor(0, 0, 0);
  };

  const addNewPage = () => {
    doc.addPage();
    currentPage++;
    yPos = PAGE.marginY;
    addHeader();
  };

  const checkNewPage = (neededHeight: number) => {
    if (yPos + neededHeight > PAGE.height - PAGE.marginY) {
      const prevSize = doc.getFontSize();
      const prevFont = doc.getFont();
      addFooter();
      addNewPage();
      doc.setFontSize(prevSize);
      doc.setFont(prevFont.fontName, prevFont.fontStyle);
      return true;
    }
    return false;
  };

  const wrapText = (text: string, maxWidth: number): string[] => {
    return doc.splitTextToSize(text, maxWidth);
  };

  const addSectionHeader = (title: string, style: 'band' | 'accent' = 'band', reserveAfter = 14) => {
    // Reserve room for the header band (~14mm) plus the first chunk of its
    // content, so a header is never left orphaned at the foot of a page while
    // its rows break to the next.
    const needed = 14 + reserveAfter;
    checkNewPage(needed);
    if (yPos > PAGE.marginY + 5) {
      yPos += 8;
      checkNewPage(needed);
    }
    recordSection(title);

    if (style === 'band') {
      doc.setFillColor(...hexToRgb(COLORS.amethystDiamond));
      doc.roundedRect(PAGE.marginX - 3, yPos - 4, PAGE.contentWidth + 6, 10, 2, 2, 'F');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(title, PAGE.marginX + 4, yPos + 3);
    } else {
      doc.setFillColor(...hexToRgb(COLORS.ivory));
      doc.roundedRect(PAGE.marginX - 3, yPos - 4, PAGE.contentWidth + 6, 10, 2, 2, 'F');
      doc.setFillColor(...hexToRgb(COLORS.amethystDiamond));
      doc.roundedRect(PAGE.marginX - 3, yPos - 4, 1.5, 10, 0.75, 0.75, 'F');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRgb(COLORS.text));
      doc.text(title, PAGE.marginX + 3, yPos + 3);
    }

    yPos += 14;
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
  };

  const addStatBox = (
    x: number,
    y: number,
    width: number,
    value: string,
    label: string,
    borderColor: string,
  ) => {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, y, width, 28, 3, 3, 'F');
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, width, 28, 3, 3, 'S');

    doc.setFillColor(...hexToRgb(borderColor));
    doc.roundedRect(x, y, 1.5, 28, 0.75, 0, 'F');
    doc.rect(x + 0.5, y, 1, 28, 'F');

    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(borderColor));
    doc.text(value, x + width / 2, y + 13, { align: 'center' });

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text(label, x + width / 2, y + 21, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(0, 0, 0);
  };

  // ========================================
  // STATS
  // ========================================
  const totalItems = items.length;
  const highItems = items.filter(i => i.priority === 'high');
  const medItems = items.filter(i => i.priority === 'medium');
  const lowItems = items.filter(i => i.priority === 'low');
  const achievedItems = items.filter(i => i.status === 'achieved');
  const completedCount = achievedItems.length;
  const completionRate = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  // Any item whose category is not a known label (standard or custom) is
  // collected here so it is never silently dropped from the plan.
  const OTHER_CATEGORY_LABEL = 'Other / Uncategorised';
  const knownCategoryKeys = new Set(Object.keys(categoryLabels));
  const otherCategoryItems = items.filter(i => !knownCategoryKeys.has(i.category));

  // ----------------------------------------
  // EXECUTIVE ANALYSIS (computed, not authored)
  // A short, data-derived narrative so the plan opens with direction rather
  // than raw metrics. Everything here is calculated from the items in front of
  // us: no benchmarks, comparisons or claims that are not in the data.
  // ----------------------------------------
  const catPhrase = (key: string): string =>
    CATEGORY_PHRASES[key] || (categoryLabels[key] ? categoryLabels[key].toLowerCase() : 'other areas');

  const catCounts = [...Object.keys(categoryLabels), '__other__']
    .map(key => ({
      key,
      count: key === '__other__'
        ? otherCategoryItems.length
        : items.filter(i => i.category === key).length,
    }))
    .filter(c => c.count > 0)
    .sort((a, b) => b.count - a.count);

  const highByCat = [...Object.keys(categoryLabels), '__other__']
    .map(key => ({
      key,
      count: key === '__other__'
        ? otherCategoryItems.filter(i => i.priority === 'high').length
        : items.filter(i => i.category === key && i.priority === 'high').length,
    }))
    .filter(c => c.count > 0)
    .sort((a, b) => b.count - a.count);

  const phaseSentence =
    completionRate < 15 ? 'The plan is in its early implementation phase, with foundational planning underway.'
    : completionRate < 50 ? 'The plan is actively underway, with a number of actions already in progress.'
    : completionRate < 85 ? 'The plan is well progressed, with most actions started or complete.'
    : 'The plan is largely delivered and moving into maintenance and review.';

  const execParas: string[] = [];
  execParas.push(
    `This plan sets out ${totalItems} action${totalItems === 1 ? '' : 's'} to improve accessibility across the visitor journey, organisational systems and workforce capability.`,
  );
  if (catCounts[0] && totalItems > 0) {
    const top = catCounts[0];
    let weight = `The largest concentration of work sits in ${catPhrase(top.key)} (${Math.round((top.count / totalItems) * 100)}% of actions)`;
    if (catCounts[1]) {
      weight += `, followed by ${catPhrase(catCounts[1].key)} (${Math.round((catCounts[1].count / totalItems) * 100)}%)`;
    }
    execParas.push(weight + '.');
  }
  if (highItems.length > 0 && highByCat[0]) {
    execParas.push(
      `Most high-priority actions relate to ${catPhrase(highByCat[0].key)}, where legal-compliance and safety risk is greatest. Progressing these early reduces exposure while improving the visitor experience.`,
    );
  }
  execParas.push(
    phaseSentence + (highItems.length > 0 ? ' Immediate attention should focus on the high-priority actions to reduce compliance risk.' : ''),
  );

  // ========================================
  // COVER PAGE
  // ========================================
  const ccx = PAGE.width / 2;

  // Amethyst top band (single tone) + warm ivory lower area, so the cover reads
  // lighter than the previous full-purple layering (matches the report cover).
  doc.setFillColor(...hexToRgb(COLORS.amethystDiamond));
  doc.rect(0, 0, PAGE.width, PAGE.height * 0.44, 'F');
  doc.setFillColor(250, 247, 245); // warm ivory
  doc.rect(0, PAGE.height * 0.44 + 3, PAGE.width, PAGE.height - (PAGE.height * 0.44 + 3), 'F');

  // Subtle tone-on-tone compass, offset to the lower-right of the band so it
  // sits beside the title rather than under it.
  const cpx = PAGE.width * 0.70;
  const cpy = PAGE.height * 0.31;
  doc.setDrawColor(96, 42, 134);
  doc.setLineWidth(0.6);
  doc.circle(cpx, cpy, 30, 'S');
  doc.circle(cpx, cpy, 21, 'S');
  doc.setLineWidth(0.9);
  doc.line(cpx, cpy - 30, cpx, cpy - 25); // N
  doc.line(cpx, cpy + 25, cpx, cpy + 30); // S
  doc.line(cpx - 30, cpy, cpx - 25, cpy); // W
  doc.line(cpx + 25, cpy, cpx + 30, cpy); // E
  doc.setFillColor(124, 66, 166);
  doc.triangle(cpx, cpy - 18, cpx - 3.5, cpy, cpx + 3.5, cpy, 'F'); // needle N
  doc.setFillColor(90, 32, 128);
  doc.triangle(cpx, cpy + 14, cpx - 3.5, cpy, cpx + 3.5, cpy, 'F'); // needle S
  doc.setFillColor(...hexToRgb(COLORS.aussieLight));
  doc.circle(cpx, cpy, 1.6, 'F'); // orange hub
  doc.setDrawColor(0, 0, 0);

  // Title, left-aligned on clean purple beside the compass. Wrapped so a longer
  // jurisdiction title (e.g. "Disability Access and Inclusion Plan") still fits
  // clear of the compass.
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(planTitle, 95);
  titleLines.forEach((line: string, idx: number) => {
    doc.text(line, PAGE.marginX + 4, PAGE.height * 0.19 + idx * 12, { align: 'left' });
  });

  // Orange divider
  doc.setFillColor(...hexToRgb(COLORS.aussieLight));
  doc.rect(0, PAGE.height * 0.44, PAGE.width, 3, 'F');


  // Organisation name (dark on the light area)
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
  doc.text(orgName, ccx, PAGE.height * 0.62, { align: 'center' });

  if (coverScope) {
    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(90, 60, 120);
    doc.text(coverScope, ccx, PAGE.height * 0.62 + 9, { align: 'center' });
  }

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text(`Generated ${formattedDate}`, ccx, PAGE.height * 0.62 + (coverScope ? 18 : 10), { align: 'center' });

  // Discreet credit line only (branding kept to a small, footer-style credit so
  // the plan reads as the organisation's own submittable document).
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 128);
  doc.text('Prepared with Access Compass by Flare Access', ccx, PAGE.height * 0.93, { align: 'center' });

  // ========================================
  // TABLE OF CONTENTS
  // ========================================
  addNewPage();

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
  doc.text('Table of Contents', PAGE.marginX, yPos);
  yPos += 15;

  // Build the action-items TOC entries from the active grouping (the caller's
  // groups when supplied, else by category). Headings must match the section
  // headers drawn by renderGroupBlock so the page numbers resolve.
  const actionTocItems: string[] = [];
  if (grouping) {
    for (const g of grouping.groups) {
      if (g.items.length > 0) actionTocItems.push(`${g.heading} (${g.items.length})`);
    }
  } else {
    for (const [key, label] of Object.entries(categoryLabels)) {
      const count = items.filter(i => i.category === key).length;
      if (count > 0) actionTocItems.push(`${label} (${count})`);
    }
    if (otherCategoryItems.length > 0) actionTocItems.push(`${OTHER_CATEGORY_LABEL} (${otherCategoryItems.length})`);
  }
  const actionTocGroupLabel = `Action Items by ${grouping ? grouping.dimensionLabel : 'Category'}`;
  const showFrameworkAppendix = !!frameworkGrouping && !grouping?.omitFrameworkAppendix;

  const tocSections: { group: string; items: string[] }[] = [
    {
      group: 'Overview',
      items: [
        'Executive Analysis',
        'Progress Overview',
        'Status Breakdown',
        'Items by Category',
        ...(achievedItems.length > 0 ? ['Achievements to date'] : []),
        ...(frameworkGrouping ? [`Alignment with ${frameworkGrouping.short}`] : []),
      ],
    },
    {
      group: actionTocGroupLabel,
      items: actionTocItems,
    },
    ...(showFrameworkAppendix ? [{
      group: 'Appendix',
      items: [`${frameworkGrouping.short} detailed mapping`],
    }] : []),
  ];

  tocSections.forEach((tocGroup) => {
    if (tocGroup.items.length === 0) return;
    checkNewPage(14);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
    doc.text(tocGroup.group, PAGE.marginX + 3, yPos);
    yPos += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    tocGroup.items.forEach((item) => {
      if (item === '') { yPos += 2; return; }
      checkNewPage(8);
      doc.setTextColor(...hexToRgb(COLORS.text));
      doc.text(item, PAGE.marginX + 10, yPos);
      // Dotted leader between the title and where the page number will go.
      const titleW = doc.getTextWidth(item);
      const dotsStart = PAGE.marginX + 10 + titleW + 3;
      const dotsEnd = PAGE.width - PAGE.marginX - 10;
      if (dotsEnd > dotsStart) {
        doc.setDrawColor(200, 196, 206);
        doc.setLineDashPattern([0.6, 1.2], 0);
        doc.setLineWidth(0.3);
        doc.line(dotsStart, yPos - 1, dotsEnd, yPos - 1);
        doc.setLineDashPattern([], 0);
        doc.setDrawColor(0, 0, 0);
      }
      tocEntries.push({ title: item, page: doc.getNumberOfPages(), y: yPos });
      yPos += 7;
    });
    yPos += 4;
  });
  doc.setTextColor(0, 0, 0);

  addFooter();

  // ========================================
  // PROGRESS OVERVIEW PAGE
  // ========================================
  addNewPage();

  recordSection('Progress Overview');
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
  doc.text('Progress Overview', PAGE.marginX, yPos);
  yPos += 14;

  // Sites covered: name the venues this org-wide plan spans, so the scope is
  // explicit alongside the per-item site tags. Skipped for single-site reports
  // (the site is already on the cover) and when no sites resolve.
  if (orgWideReport && coveredSiteNames.length > 0) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
    doc.text(coveredSiteNames.length === 1 ? 'Site covered' : `Sites covered (${coveredSiteNames.length})`, PAGE.marginX, yPos);
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRgb(COLORS.text));
    wrapText(coveredSiteNames.join(', '), PAGE.contentWidth)
      .forEach(l => { checkNewPage(6); doc.text(l, PAGE.marginX, yPos); yPos += 4.5; });
    yPos += 5;
  }

  // Executive analysis: a short computed narrative so the plan opens with
  // direction (what it covers, where the weight sits, what to do first) rather
  // than raw metrics.
  addSectionHeader('Executive Analysis', 'accent');
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...hexToRgb(COLORS.text));
  for (const para of execParas) {
    const lines = wrapText(para, PAGE.contentWidth);
    checkNewPage(lines.length * 5 + 3);
    for (const l of lines) { doc.text(l, PAGE.marginX, yPos); yPos += 5; }
    yPos += 2.5;
  }
  yPos += 3;

  // Stat boxes row (reserve the full box height so the header keeps them)
  addSectionHeader('At a glance', 'accent', 40);
  const boxWidth = (PAGE.contentWidth - 12) / 4;
  const statBoxes = [
    { val: `${completionRate}%`, label: 'Completion Rate', color: COLORS.green },
    { val: String(highItems.length), label: 'High Priority', color: COLORS.statusHigh },
    { val: String(medItems.length), label: 'Medium Priority', color: COLORS.statusMedium },
    { val: String(lowItems.length), label: 'Low Priority', color: COLORS.statusLow },
  ];

  statBoxes.forEach((box, idx) => {
    const x = PAGE.marginX + idx * (boxWidth + 4);
    addStatBox(x, yPos, boxWidth, box.val, box.label, box.color);
  });
  yPos += 38;

  // Status breakdown
  addSectionHeader('Status Breakdown', 'accent');

  // Build a row per known status, then a catch-all so no item is unaccounted
  // for and the percentages sum to 100.
  const statusRows = STATUS_ORDER.map(s => ({
    label: STATUS_LABELS[s],
    count: items.filter(i => i.status === s).length,
    color: STATUS_COLORS[s],
  }));
  const knownStatuses = new Set(STATUS_ORDER);
  const otherStatusCount = items.filter(i => !knownStatuses.has(i.status)).length;
  if (otherStatusCount > 0) {
    statusRows.push({ label: 'Other', count: otherStatusCount, color: '#6b7280' });
  }

  statusRows.forEach(row => {
    if (row.count === 0) return;
    checkNewPage(8);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    doc.setFillColor(...hexToRgb(row.color));
    doc.circle(PAGE.marginX + 4, yPos - 1.2, 1.5, 'F');

    doc.setTextColor(...hexToRgb(COLORS.text));
    doc.text(row.label, PAGE.marginX + 10, yPos);

    const pct = totalItems > 0 ? Math.round((row.count / totalItems) * 100) : 0;
    doc.setTextColor(...hexToRgb(row.color));
    doc.setFont('helvetica', 'bold');
    doc.text(`${row.count} (${pct}%)`, PAGE.marginX + 60, yPos);

    const barX = PAGE.marginX + 90;
    const barW = 80;
    doc.setFillColor(230, 230, 230);
    doc.roundedRect(barX, yPos - 3, barW, 4, 2, 2, 'F');
    if (pct > 0) {
      doc.setFillColor(...hexToRgb(row.color));
      doc.roundedRect(barX, yPos - 3, Math.max(4, barW * (pct / 100)), 4, 2, 2, 'F');
    }

    yPos += 8;
  });
  yPos += 5;

  // Category breakdown
  addSectionHeader('Items by Category', 'accent');

  const categoryBreakdownRows = Object.entries(categoryLabels)
    .map(([key, label]) => ({ label, count: items.filter(i => i.category === key).length }))
    .filter(r => r.count > 0);
  if (otherCategoryItems.length > 0) {
    categoryBreakdownRows.push({ label: OTHER_CATEGORY_LABEL, count: otherCategoryItems.length });
  }
  categoryBreakdownRows.forEach(({ label, count }) => {
    checkNewPage(8);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRgb(COLORS.text));
    doc.text(label, PAGE.marginX + 4, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text(String(count), PAGE.marginX + 100, yPos);
    yPos += 6;
  });

  // ========================================
  // ACHIEVEMENTS TO DATE (optional)
  // Surfaces completed actions so the plan recognises progress, not just the
  // work still outstanding. Objectives deduped so shared objectives list once.
  // ========================================
  if (achievedItems.length > 0) {
    addSectionHeader('Achievements to date', 'accent');

    // Summarise completed work by area rather than listing individual actions.
    // A static PDF cannot expand a truncated list, so a per-category count shows
    // the breadth of progress without a dangling "and N more".
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...hexToRgb(COLORS.textMuted));
    wrapText(`${completedCount} action${completedCount === 1 ? '' : 's'} completed so far, spanning these areas. Recognising progress matters as much as planning the work ahead.`, PAGE.contentWidth)
      .forEach(l => { checkNewPage(6); doc.text(l, PAGE.marginX, yPos); yPos += 4.5; });
    yPos += 3;

    const achievedByCat = [...Object.keys(categoryLabels), '__other__']
      .map(key => ({
        label: key === '__other__' ? OTHER_CATEGORY_LABEL : categoryLabels[key],
        count: key === '__other__'
          ? otherCategoryItems.filter(i => i.status === 'achieved').length
          : items.filter(i => i.category === key && i.status === 'achieved').length,
      }))
      .filter(c => c.count > 0)
      .sort((a, b) => b.count - a.count);

    for (const c of achievedByCat) {
      checkNewPage(7);
      // Green tick drawn as two strokes (helvetica has no check glyph).
      const tx = PAGE.marginX + 3;
      doc.setDrawColor(...hexToRgb(COLORS.green));
      doc.setLineWidth(0.8);
      doc.line(tx, yPos - 1.4, tx + 1.5, yPos);
      doc.line(tx + 1.5, yPos, tx + 4, yPos - 3.4);
      doc.setDrawColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...hexToRgb(COLORS.text));
      doc.text(c.label, PAGE.marginX + 9, yPos);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRgb(COLORS.green));
      doc.text(`${c.count} completed`, PAGE.marginX + PAGE.contentWidth, yPos, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...hexToRgb(COLORS.text));
      yPos += 6.5;
    }
  }

  // ========================================
  // STATUTORY FRAMEWORK ALIGNMENT (optional)
  // ========================================
  if (frameworkGrouping && frameworkGrouping.domains.some(d => d.items.length > 0)) {
    addSectionHeader(`Alignment with ${frameworkGrouping.short}`, 'accent');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(107, 114, 128);
    wrapText(`This action plan is mapped to the ${frameworkGrouping.name} outcome domains for statutory reporting. Domain-by-domain detail appears in the appendix.`, PAGE.contentWidth)
      .forEach(l => { checkNewPage(6); doc.text(l, PAGE.marginX, yPos); yPos += 5; });
    yPos += 4;

    // Summary table: one row per outcome domain with an action count and a
    // status split, so the reader sees coverage and progress at a glance. Counts
    // are derived from the items grouped under each domain.
    const colActions = PAGE.marginX + 107;
    const colDone = PAGE.marginX + 128;
    const colProg = PAGE.marginX + 150;
    const colRem = PAGE.marginX + 168;

    checkNewPage(14);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(COLORS.textMuted));
    doc.text('Outcome domain', PAGE.marginX, yPos);
    doc.text('Actions', colActions, yPos, { align: 'right' });
    doc.text('Done', colDone, yPos, { align: 'right' });
    doc.text('In prog.', colProg, yPos, { align: 'right' });
    doc.text('Remaining', colRem, yPos, { align: 'right' });
    yPos += 2;
    doc.setDrawColor(210, 206, 216);
    doc.setLineWidth(0.3);
    doc.line(PAGE.marginX, yPos, PAGE.marginX + PAGE.contentWidth, yPos);
    doc.setDrawColor(0, 0, 0);
    yPos += 5;

    for (const d of frameworkGrouping.domains) {
      if (d.items.length === 0) continue;
      const actions = d.items.length;
      const done = d.items.filter(i => i.status === 'achieved').length;
      const prog = d.items.filter(i => i.status === 'in-progress').length;
      const rem = actions - done - prog;

      const nameLines = wrapText(d.name, 82);
      checkNewPage(nameLines.length * 4.5 + 3);
      const rowY = yPos;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...hexToRgb(COLORS.text));
      nameLines.forEach(l => { doc.text(l, PAGE.marginX, yPos); yPos += 4.5; });

      doc.setTextColor(...hexToRgb(COLORS.text));
      doc.text(String(actions), colActions, rowY, { align: 'right' });
      doc.setTextColor(...hexToRgb(COLORS.green));
      doc.text(String(done), colDone, rowY, { align: 'right' });
      doc.setTextColor(...hexToRgb(COLORS.statusMedium));
      doc.text(String(prog), colProg, rowY, { align: 'right' });
      doc.setTextColor(...hexToRgb(COLORS.textMuted));
      doc.text(String(rem), colRem, rowY, { align: 'right' });
      doc.setTextColor(...hexToRgb(COLORS.text));
      yPos += 2;
    }
    yPos += 2;
  }

  addFooter();

  // ========================================
  // PRIORITY LEGEND (before action items)
  // ========================================
  addNewPage();

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
  doc.text('Action Items', PAGE.marginX, yPos);
  yPos += 7;

  // Caption stating how the actions below are grouped.
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...hexToRgb(COLORS.textMuted));
  doc.text(`Grouped by ${grouping ? grouping.dimensionLabel : 'category'}.`, PAGE.marginX, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
  doc.text('Understanding Priority Levels', PAGE.marginX, yPos);
  yPos += 7;

  const legendItems = [
    { label: 'High', color: COLORS.statusHigh, desc: 'Gaps in mandatory compliance requirements (Premises Standards, WCAG, NCC) and safety-related items. Highest legal and safety risk.' },
    { label: 'Medium', color: COLORS.statusMedium, desc: 'High-impact improvements that significantly affect the experience of people with disability, and items needing further investigation.' },
    { label: 'Low', color: COLORS.statusLow, desc: 'Best-practice improvements that make a real, meaningful difference. Not less important, just lower legal risk.' },
  ];
  for (const item of legendItems) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(item.color));
    doc.text(item.label, PAGE.marginX + 4, yPos);
    yPos += 4;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRgb(COLORS.textMuted));
    const descLines = wrapText(item.desc, PAGE.contentWidth - 10);
    for (const line of descLines) {
      doc.text(line, PAGE.marginX + 4, yPos);
      yPos += 3.5;
    }
    yPos += 2;
  }
  yPos += 2;

  // Encouragement text
  checkNewPage(14);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...hexToRgb(COLORS.textMuted));
  const encLines = wrapText(
    'Every action here is worth doing. Priority levels indicate where to start, not what to skip. Even "low" priority items can have a meaningful impact on someone\'s experience. Progress can begin wherever capacity allows.',
    PAGE.contentWidth - 8
  );
  for (const line of encLines) {
    checkNewPage(5);
    doc.text(line, PAGE.marginX + 4, yPos);
    yPos += 4;
  }
  yPos += 8;

  // ========================================
  // ACTION ITEMS BY CATEGORY, THEN PRIORITY
  // ========================================
  const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };

  const CARD_TEXT_MAX_WIDTH = (PAGE.contentWidth - 2) - 8 - 4;

  // Always show the module name alongside its number. moduleSource comes through
  // inconsistently ("2.1", "2.1: Arrival...", "Module 2.1: Arrival..."), so pull
  // the code and resolve the canonical title; fall back to the raw string if the
  // module is not found.
  const moduleLabel = (moduleSource: string): string => {
    const code = moduleSource.match(/(\d+\.\d+)/)?.[1];
    const mod = code ? getModuleById(code) : undefined;
    return mod ? `${mod.code}: ${mod.name}` : moduleSource;
  };

  const buildOptionalFields = (item: DIAPItem): { label: string; value: string }[] => {
    const fields: { label: string; value: string }[] = [];
    // Site comes first in an org-wide report so it is clear which venue each
    // action belongs to. Only shown when the id resolves to a known site.
    if (orgWideReport && item.siteId && siteNames[item.siteId]) {
      fields.push({ label: 'Site', value: siteNames[item.siteId] });
    }
    if (item.responsibleRole) fields.push({ label: 'Owner', value: item.responsibleRole });
    if (item.responsibleTeam) fields.push({ label: 'Team', value: item.responsibleTeam });
    if (item.timeframe) fields.push({ label: 'Timeframe', value: item.timeframe });
    if (item.dueDate) {
      fields.push({
        label: 'Due Date',
        value: new Date(item.dueDate).toLocaleDateString('en-AU', {
          day: 'numeric', month: 'short', year: 'numeric',
        }),
      });
    }
    if (item.moduleSource) fields.push({ label: 'Module', value: moduleLabel(item.moduleSource) });
    if (item.budgetEstimate) fields.push({ label: 'Budget', value: item.budgetEstimate });
    return fields;
  };

  // Rough card height, used both to decide the card's own page break and to
  // reserve room under an objective heading so the heading is never orphaned.
  const estimateCardHeight = (item: DIAPItem): number => {
    let h = 10 + wrapText(item.action, CARD_TEXT_MAX_WIDTH).length * 4.5;
    h += buildOptionalFields(item).length * 5.5;
    h += 8;
    if (item.notes) h += 6 + wrapText(item.notes, CARD_TEXT_MAX_WIDTH).length * 4.5;
    if (item.successIndicators) h += 6 + wrapText(item.successIndicators, CARD_TEXT_MAX_WIDTH).length * 4.5;
    const footnote = grouping?.itemFootnotes?.[item.id];
    if (footnote) h += 2 + wrapText(footnote, CARD_TEXT_MAX_WIDTH).length * 4;
    return h;
  };

  const renderItemCard = (item: DIAPItem) => {
    const cardX = PAGE.marginX + 2;
    const cardWidth = PAGE.contentWidth - 2;
    const textInset = 8;
    const textMaxWidth = cardWidth - textInset - 4;

    // The objective is now printed once as the group heading above these cards,
    // so the card body carries only the action and its detail.
    const actionLines = wrapText(item.action, textMaxWidth);
    const itemPriority = item.priority || 'low';
    const accentColor = PRIORITY_ACCENT[itemPriority] || PRIORITY_COLORS[itemPriority] || COLORS.statusLow;
    const priorityColor = PRIORITY_COLORS[itemPriority] || COLORS.statusLow;

    const optionalFields = buildOptionalFields(item);

    checkNewPage(Math.min(estimateCardHeight(item), 80));

    const cardStartY = yPos;

    // Action text (the objective is the group heading above this card)
    yPos += 4;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRgb(COLORS.text));
    for (const line of actionLines) {
      checkNewPage(5);
      doc.text(line, cardX + textInset, yPos);
      yPos += 4.5;
    }
    yPos += 2;

    // Badge row: status + priority + compliance
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    let badgeX = cardX + textInset;

    const statusLabel = STATUS_LABELS[item.status] || item.status;
    const statusColor = STATUS_COLORS[item.status] || '#6b7280';
    const statusBadgeW = doc.getTextWidth(statusLabel) + 6;
    doc.setFillColor(...hexToRgb(statusColor));
    doc.roundedRect(badgeX, yPos - 3, statusBadgeW, 5, 1.5, 1.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text(statusLabel, badgeX + statusBadgeW / 2, yPos, { align: 'center' });
    badgeX += statusBadgeW + 4;

    const prioLabel = itemPriority.charAt(0).toUpperCase() + itemPriority.slice(1);
    const prioBadgeW = doc.getTextWidth(prioLabel) + 6;
    doc.setFillColor(...hexToRgb(priorityColor));
    doc.roundedRect(badgeX, yPos - 3, prioBadgeW, 5, 1.5, 1.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text(prioLabel, badgeX + prioBadgeW / 2, yPos, { align: 'center' });
    badgeX += prioBadgeW + 4;

    if (item.complianceLevel) {
      const compLabel = item.complianceLevel === 'mandatory' ? 'Mandatory' : 'Best Practice';
      const compBadgeW = doc.getTextWidth(compLabel) + 6;
      const compColor = item.complianceLevel === 'mandatory' ? '#991b1b' : '#1e3a8a';
      const compBg = item.complianceLevel === 'mandatory' ? '#fee2e2' : '#dbeafe';
      doc.setFillColor(...hexToRgb(compBg));
      doc.roundedRect(badgeX, yPos - 3, compBadgeW, 5, 1.5, 1.5, 'F');
      doc.setTextColor(...hexToRgb(compColor));
      doc.text(compLabel, badgeX + compBadgeW / 2, yPos, { align: 'center' });
    }

    yPos += 7;

    doc.setFontSize(8);
    for (const field of optionalFields) {
      checkNewPage(6);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(107, 114, 128);
      doc.text(`${field.label}:`, cardX + textInset, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...hexToRgb(COLORS.text));
      const fieldValueMaxW = textMaxWidth - 30;
      const fieldLines = wrapText(field.value, fieldValueMaxW);
      for (const fl of fieldLines) {
        doc.text(fl, cardX + textInset + 30, yPos);
        yPos += 4.5;
      }
      if (fieldLines.length <= 1) yPos += 0.5;
    }

    if (item.notes) {
      yPos += 1;
      checkNewPage(10);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(107, 114, 128);
      doc.text('Notes:', cardX + textInset, yPos);
      yPos += 4;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...hexToRgb(COLORS.text));
      const noteLines = wrapText(item.notes, textMaxWidth);
      for (const line of noteLines) {
        checkNewPage(5);
        doc.text(line, cardX + textInset, yPos);
        yPos += 4.5;
      }
    }

    if (item.successIndicators) {
      yPos += 1;
      checkNewPage(10);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(107, 114, 128);
      doc.text('Success Indicators:', cardX + textInset, yPos);
      yPos += 4;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...hexToRgb(COLORS.text));
      const siLines = wrapText(item.successIndicators, textMaxWidth);
      for (const line of siLines) {
        checkNewPage(5);
        doc.text(line, cardX + textInset, yPos);
        yPos += 4.5;
      }
    }

    // Cross-reference note (e.g. the other outcome domains an action also maps
    // to under domain grouping), so a single-placement action still shows its
    // full coverage.
    const footnote = grouping?.itemFootnotes?.[item.id];
    if (footnote) {
      yPos += 2;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(107, 114, 128);
      const fnLines = wrapText(footnote, textMaxWidth);
      for (const line of fnLines) {
        checkNewPage(5);
        doc.text(line, cardX + textInset, yPos);
        yPos += 4;
      }
    }

    yPos += 3;

    const cardHeight = yPos - cardStartY;
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.roundedRect(cardX, cardStartY, cardWidth, cardHeight, 2, 2, 'S');

    doc.setFillColor(...hexToRgb(accentColor));
    doc.roundedRect(cardX, cardStartY, 1.5, cardHeight, 0.75, 0.75, 'F');

    doc.setDrawColor(0, 0, 0);
    yPos += 4;
  };

  // An objective heading shown once above its group of action cards (ivory bar,
  // left accent set to the group's highest-priority colour). Objective text may
  // wrap, so the bar is sized to the number of lines.
  const renderObjectiveHeading = (objective: string, accent: string, reserveAfter = 30) => {
    const lines = wrapText(objective, PAGE.contentWidth - 8);
    const lineH = 5;
    const boxH = lines.length * lineH + 3;
    // Keep the heading with the start of its first card (reserveAfter) so a
    // heading is never left stranded at the foot of a page.
    checkNewPage(boxH + 6 + reserveAfter);
    if (yPos > PAGE.marginY + 5) yPos += 4;

    const boxTop = yPos - 4;
    doc.setFillColor(...hexToRgb(COLORS.ivory));
    doc.roundedRect(PAGE.marginX - 3, boxTop, PAGE.contentWidth + 6, boxH, 2, 2, 'F');
    doc.setFillColor(...hexToRgb(accent));
    doc.roundedRect(PAGE.marginX - 3, boxTop, 1.5, boxH, 0.75, 0.75, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(COLORS.text));
    lines.forEach((l, idx) => { doc.text(l, PAGE.marginX + 3, boxTop + 5 + idx * lineH); });
    yPos = boxTop + boxH + 5;
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
  };

  // Render one top-level group as a page: purple band header, an optional intro
  // (category "why this matters", or a domain's outcome statement), then the
  // actions grouped by objective (each objective heads its distinct actions
  // once, rather than repeating inside every card).
  // The first group flows on from the priority-legend page rather than forcing a
  // new one (avoids a near-empty legend page); later groups each start on their
  // own page.
  let firstActionGroup = true;
  const renderGroupBlock = (heading: string, subtitle: string | undefined, groupItems: DIAPItem[]) => {
    if (groupItems.length === 0) return;

    if (firstActionGroup) {
      firstActionGroup = false;
    } else {
      addFooter();
      addNewPage();
    }

    // Group header (full purple band). Extra reserve so the header, intro and
    // mini-dashboard stay together rather than orphaning at a page foot.
    addSectionHeader(`${heading} (${groupItems.length})`, 'band', 34);

    // Optional intro: category context, or the outcome domain's statement.
    if (subtitle) {
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(...hexToRgb(COLORS.textMuted));
      wrapText(subtitle, PAGE.contentWidth).forEach(l => { checkNewPage(6); doc.text(l, PAGE.marginX, yPos); yPos += 4.5; });
      yPos += 3;
      doc.setFont('helvetica', 'normal');
    }

    // Mini-dashboard: a quick read on the group before the actions - total,
    // priority split, completion, and the modules it draws on most.
    {
      const total = groupItems.length;
      const hi = groupItems.filter(i => i.priority === 'high').length;
      const med = groupItems.filter(i => i.priority === 'medium').length;
      const low = total - hi - med;
      const done = groupItems.filter(i => i.status === 'achieved').length;
      const completion = total > 0 ? Math.round((done / total) * 100) : 0;
      const themeTally = new Map<string, number>();
      for (const it of groupItems) {
        if (!it.moduleSource) continue;
        const code = it.moduleSource.match(/(\d+\.\d+)/)?.[1];
        const name = code ? getModuleById(code)?.name : undefined;
        if (name) themeTally.set(name, (themeTally.get(name) ?? 0) + 1);
      }
      const topThemes = [...themeTally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);

      const dashH = topThemes.length > 0 ? 21 : 16;
      checkNewPage(dashH + 4);
      const top = yPos;
      doc.setFillColor(...hexToRgb(COLORS.ivory));
      doc.roundedRect(PAGE.marginX - 3, top, PAGE.contentWidth + 6, dashH, 2, 2, 'F');

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
      doc.text(String(total), PAGE.marginX + 1, top + 9);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...hexToRgb(COLORS.textMuted));
      doc.text(total === 1 ? 'action' : 'actions', PAGE.marginX + 1, top + 14);

      const cx = PAGE.marginX + 28;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRgb(COLORS.statusHigh)); doc.text(`High ${hi}`, cx, top + 6);
      doc.setTextColor(...hexToRgb(COLORS.statusMedium)); doc.text(`Medium ${med}`, cx + 24, top + 6);
      doc.setTextColor(...hexToRgb(COLORS.statusLow)); doc.text(`Low ${low}`, cx + 58, top + 6);
      doc.setTextColor(...hexToRgb(COLORS.text)); doc.text(`${completion}% complete`, cx, top + 12);

      if (topThemes.length > 0) {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...hexToRgb(COLORS.textMuted));
        doc.text(wrapText(`Focus areas: ${topThemes.join(', ')}`, PAGE.contentWidth - 4)[0], PAGE.marginX + 1, top + 18);
      }

      yPos = top + dashH + 4;
      doc.setTextColor(0, 0, 0);
    }

    const rankOf = (item: DIAPItem) => priorityOrder[item.priority || 'low'] ?? 2;

    // Group actions by objective. Items with no objective are collected and
    // rendered without a heading so they are never dropped.
    const groupsMap = new Map<string, DIAPItem[]>();
    const noObjective: DIAPItem[] = [];
    for (const item of groupItems) {
      const key = (item.objective || '').trim();
      if (!key) { noObjective.push(item); continue; }
      if (!groupsMap.has(key)) groupsMap.set(key, []);
      groupsMap.get(key)!.push(item);
    }

    // Order groups by their best (lowest) priority rank; within a group, order
    // the actions the same way.
    const objGroups = [...groupsMap.entries()].map(([objective, gItems]) => {
      gItems.sort((a, b) => rankOf(a) - rankOf(b));
      return { objective, items: gItems, bestRank: Math.min(...gItems.map(rankOf)) };
    });
    objGroups.sort((a, b) => a.bestRank - b.bestRank);

    for (const g of objGroups) {
      const topPriority = g.items[0].priority || 'low';
      renderObjectiveHeading(
        g.objective,
        PRIORITY_COLORS[topPriority] || COLORS.statusLow,
        Math.min(estimateCardHeight(g.items[0]), 80),
      );
      for (const item of g.items) renderItemCard(item);
    }

    // Actions with no objective render on their own beneath the groups.
    if (noObjective.length > 0) {
      noObjective.sort((a, b) => rankOf(a) - rankOf(b));
      for (const item of noObjective) renderItemCard(item);
    }

    yPos += 4;
  };

  if (grouping) {
    // Caller-supplied grouping (outcome domain, custom section or site).
    for (const g of grouping.groups) renderGroupBlock(g.heading, g.subtitle, g.items);
  } else {
    // Default: by category, with the "why this matters" context per category.
    for (const [catKey, catLabel] of Object.entries(categoryLabels)) {
      renderGroupBlock(catLabel, CATEGORY_WHY[catKey], items.filter(i => i.category === catKey));
    }
    // Catch-all so items with an unmapped category are never dropped.
    renderGroupBlock(OTHER_CATEGORY_LABEL, undefined, otherCategoryItems);
  }

  // Closing provenance note: the plan is a living document; this PDF is a
  // point-in-time snapshot. Neutral and third-person so it suits a submittable
  // document.
  yPos += 6;
  checkNewPage(18);
  doc.setDrawColor(210, 206, 216);
  doc.setLineWidth(0.3);
  doc.line(PAGE.marginX, yPos, PAGE.marginX + PAGE.contentWidth, yPos);
  yPos += 6;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...hexToRgb(COLORS.textMuted));
  wrapText('This action plan is managed within Access Compass, where actions can be assigned, updated, evidenced, reported and reviewed over time. This PDF provides a point-in-time snapshot.', PAGE.contentWidth)
    .forEach(l => { checkNewPage(5); doc.text(l, PAGE.marginX, yPos); yPos += 4.5; });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  addFooter();

  // ========================================
  // APPENDIX: framework detailed mapping (optional, at the very end)
  // The domain-by-domain objective list, deduped, kept out of the overview so
  // the summary table can lead. Councils can lift this straight into a report.
  // Skipped when the body is already grouped by domain (it would just repeat).
  // ========================================
  if (showFrameworkAppendix && frameworkGrouping && frameworkGrouping.domains.some(d => d.items.length > 0)) {
    addNewPage();

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
    doc.text('Appendix', PAGE.marginX, yPos);
    yPos += 12;

    addSectionHeader(`${frameworkGrouping.short} detailed mapping`, 'accent');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(107, 114, 128);
    wrapText(`Every objective grouped under its ${frameworkGrouping.name} outcome domain.`, PAGE.contentWidth)
      .forEach(l => { checkNewPage(6); doc.text(l, PAGE.marginX, yPos); yPos += 5; });
    yPos += 3;

    for (const d of frameworkGrouping.domains) {
      if (d.items.length === 0) continue;

      // Collapse to unique objectives; multiple actions often share one.
      const seenLabels = new Set<string>();
      const uniqueLabels: string[] = [];
      for (const item of d.items) {
        const label = (item.objective || item.action || '').trim();
        if (!label || seenLabels.has(label)) continue;
        seenLabels.add(label);
        uniqueLabels.push(label);
      }
      if (uniqueLabels.length === 0) continue;

      checkNewPage(16);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
      doc.text(`${d.name} (${uniqueLabels.length})`, PAGE.marginX, yPos);
      yPos += 6;

      if (d.outcomeStatement) {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(107, 114, 128);
        wrapText(d.outcomeStatement, PAGE.contentWidth)
          .forEach(l => { checkNewPage(5); doc.text(l, PAGE.marginX, yPos); yPos += 4.5; });
        yPos += 1;
      }

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...hexToRgb(COLORS.text));
      for (const label of uniqueLabels) {
        const lines = wrapText(`- ${label}`, PAGE.contentWidth - 4);
        checkNewPage(lines.length * 5 + 2);
        lines.forEach((l, idx) => { doc.text(l, PAGE.marginX + (idx === 0 ? 0 : 4), yPos); yPos += 5; });
      }
      yPos += 5;
    }

    addFooter();
  }

  // Second pass: stamp the real page number next to each contents-page line,
  // now that every section's page is known.
  for (const e of tocEntries) {
    const p = sectionPages.get(e.title);
    if (!p) continue;
    doc.setPage(e.page);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
    doc.text(String(p), PAGE.width - PAGE.marginX, e.y, { align: 'right' });
  }
  doc.setPage(doc.getNumberOfPages());
  doc.setTextColor(0, 0, 0);

  // ========================================
  // SECOND PASS: Page X of Y
  // ========================================
  // Skip page 1 (the cover) so no footer box is drawn over the title art.
  const totalPages = doc.getNumberOfPages();
  for (let i = 2; i <= totalPages; i++) {
    doc.setPage(i);
    const fy = PAGE.height - 12;

    doc.setFillColor(...hexToRgb(COLORS.ivory));
    doc.rect(PAGE.width - PAGE.marginX - 30, fy - 3, 32, 8, 'F');

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(`Page ${i} of ${totalPages}`, PAGE.width - PAGE.marginX, fy, { align: 'right' });
  }

  // Save. Include the venue in the filename when scoped to a site.
  const fileScope = siteName ? `${slugForFilename(siteName)}-` : '';
  doc.save(`DIAP-Report-${fileScope}${fileDate}.pdf`);
}
