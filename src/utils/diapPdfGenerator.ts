import jsPDF from 'jspdf';
import type { DIAPItem } from '../hooks/useDIAPManagement';
import { getCustomCategories } from '../data/diapMapping';

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
  const { items, orgName = 'Your Organisation', siteName, generatedDate, customCategoryNames = {}, frameworkGrouping } = options;

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
    doc.text('Access Compass', PAGE.marginX, 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Disability Inclusion Action Plan', PAGE.width - PAGE.marginX, 10, { align: 'right' });
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
    doc.text('Access Compass by Flare Access', PAGE.marginX, fy);
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

  const addSectionHeader = (title: string, style: 'band' | 'accent' = 'band') => {
    checkNewPage(20);
    if (yPos > PAGE.marginY + 5) {
      yPos += 8;
      checkNewPage(20);
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
  const completedCount = items.filter(i => i.status === 'achieved').length;
  const completionRate = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  // Any item whose category is not a known label (standard or custom) is
  // collected here so it is never silently dropped from the plan.
  const OTHER_CATEGORY_LABEL = 'Other / Uncategorised';
  const knownCategoryKeys = new Set(Object.keys(categoryLabels));
  const otherCategoryItems = items.filter(i => !knownCategoryKeys.has(i.category));

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

  // Title, left-aligned on clean purple beside the compass
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(30);
  doc.setFont('helvetica', 'bold');
  doc.text('Disability Inclusion', PAGE.marginX + 4, PAGE.height * 0.19, { align: 'left' });
  doc.text('Action Plan', PAGE.marginX + 4, PAGE.height * 0.19 + 13, { align: 'left' });

  // Orange divider
  doc.setFillColor(...hexToRgb(COLORS.aussieLight));
  doc.rect(0, PAGE.height * 0.44, PAGE.width, 3, 'F');

  // Statutory-framework badge straddling the divider. Only shown when a
  // framework grouping is present, so it carries information the title does not
  // already state (avoids a redundant "Action Plan" chip under the title).
  if (frameworkGrouping?.short) {
    const badgeText = frameworkGrouping.short;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    const badgeWidth = Math.max(50, doc.getTextWidth(badgeText) + 16);
    doc.setFillColor(255, 237, 200); // light amber bg
    doc.roundedRect(ccx - badgeWidth / 2, PAGE.height * 0.44 + 11, badgeWidth, 12, 3, 3, 'F');
    doc.setDrawColor(224, 125, 0);
    doc.setLineWidth(0.5);
    doc.roundedRect(ccx - badgeWidth / 2, PAGE.height * 0.44 + 11, badgeWidth, 12, 3, 3, 'S');
    doc.setTextColor(120, 53, 0);
    doc.text(badgeText, ccx, PAGE.height * 0.44 + 19, { align: 'center' });
    doc.setDrawColor(0, 0, 0);
  }

  // Organisation name (dark on the light area)
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
  doc.text(orgName, ccx, PAGE.height * 0.62, { align: 'center' });

  if (siteName) {
    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(90, 60, 120);
    doc.text(siteName, ccx, PAGE.height * 0.62 + 9, { align: 'center' });
  }

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text(`Generated ${formattedDate}`, ccx, PAGE.height * 0.62 + (siteName ? 18 : 10), { align: 'center' });

  // Branding at bottom
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
  doc.text('Access Compass', ccx, PAGE.height * 0.9, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text('by Flare Access', ccx, PAGE.height * 0.9 + 6, { align: 'center' });

  // ========================================
  // TABLE OF CONTENTS
  // ========================================
  addNewPage();

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
  doc.text('Table of Contents', PAGE.marginX, yPos);
  yPos += 15;

  // Build category TOC items
  const catTocItems: string[] = [];
  for (const [key, label] of Object.entries(categoryLabels)) {
    const count = items.filter(i => i.category === key).length;
    if (count > 0) catTocItems.push(`${label} (${count})`);
  }
  if (otherCategoryItems.length > 0) catTocItems.push(`${OTHER_CATEGORY_LABEL} (${otherCategoryItems.length})`);

  const tocSections: { group: string; items: string[] }[] = [
    {
      group: 'Overview',
      items: ['Progress Overview', 'Status Breakdown', 'Items by Category'],
    },
    {
      group: 'Action Items by Category',
      items: catTocItems,
    },
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
  yPos += 15;

  // Stat boxes row
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
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRgb(COLORS.text));
    doc.text(label, PAGE.marginX + 4, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text(String(count), PAGE.marginX + 100, yPos);
    yPos += 6;
  });

  // ========================================
  // STATUTORY FRAMEWORK ALIGNMENT (optional)
  // ========================================
  if (frameworkGrouping && frameworkGrouping.domains.some(d => d.items.length > 0)) {
    addSectionHeader(`Against the ${frameworkGrouping.short}`, 'accent');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(107, 114, 128);
    wrapText(`Your action plan mapped to the ${frameworkGrouping.name} outcome domains, ready for statutory reporting.`, PAGE.contentWidth)
      .forEach(l => { checkNewPage(6); doc.text(l, PAGE.marginX, yPos); yPos += 5; });
    yPos += 3;

    for (const d of frameworkGrouping.domains) {
      if (d.items.length === 0) continue;

      // Collapse to unique objectives. Multiple plan actions often share one
      // objective, which would otherwise repeat line-for-line here; the full
      // per-action detail (with status) already appears in the action items
      // section, so this alignment view lists each objective once.
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
  yPos += 12;

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
    'Every action here is worth doing. Priority levels help you decide where to start, not what to skip. Even "low" priority items can have a meaningful impact on someone\'s experience. Start wherever you can and build from there.',
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

  const renderItemCard = (item: DIAPItem) => {
    const cardX = PAGE.marginX + 2;
    const cardWidth = PAGE.contentWidth - 2;
    const textInset = 8;
    const textMaxWidth = cardWidth - textInset - 4;

    const objectiveLines = wrapText(item.objective, textMaxWidth);
    const actionLines = wrapText(item.action, textMaxWidth);
    const itemPriority = item.priority || 'low';
    const accentColor = PRIORITY_ACCENT[itemPriority] || PRIORITY_COLORS[itemPriority] || COLORS.statusLow;
    const priorityColor = PRIORITY_COLORS[itemPriority] || COLORS.statusLow;

    let estimatedHeight = 14 + objectiveLines.length * 5 + actionLines.length * 4.5;

    const optionalFields: { label: string; value: string }[] = [];
    if (item.responsibleRole) optionalFields.push({ label: 'Owner', value: item.responsibleRole });
    if (item.responsibleTeam) optionalFields.push({ label: 'Team', value: item.responsibleTeam });
    if (item.timeframe) optionalFields.push({ label: 'Timeframe', value: item.timeframe });
    if (item.dueDate) {
      optionalFields.push({
        label: 'Due Date',
        value: new Date(item.dueDate).toLocaleDateString('en-AU', {
          day: 'numeric', month: 'short', year: 'numeric',
        }),
      });
    }
    if (item.moduleSource) optionalFields.push({ label: 'Module', value: item.moduleSource });
    if (item.budgetEstimate) optionalFields.push({ label: 'Budget', value: item.budgetEstimate });

    estimatedHeight += optionalFields.length * 5.5;
    estimatedHeight += 8;

    if (item.notes) {
      const noteLines = wrapText(item.notes, textMaxWidth);
      estimatedHeight += 6 + noteLines.length * 4.5;
    }
    if (item.successIndicators) {
      const siLines = wrapText(item.successIndicators, textMaxWidth);
      estimatedHeight += 6 + siLines.length * 4.5;
    }

    checkNewPage(Math.min(estimatedHeight, 80));

    const cardStartY = yPos;

    // Objective
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(COLORS.text));
    yPos += 4;
    for (const line of objectiveLines) {
      checkNewPage(6);
      doc.text(line, cardX + textInset, yPos);
      yPos += 5;
    }
    yPos += 1;

    // Action text
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

  // Render one category as a page: purple band header, then priority sub-groups.
  const renderCategoryBlock = (catLabel: string, catItems: DIAPItem[]) => {
    if (catItems.length === 0) return;

    // Sort by priority within category
    catItems.sort((a, b) => (priorityOrder[a.priority || 'low'] ?? 2) - (priorityOrder[b.priority || 'low'] ?? 2));

    addFooter();
    addNewPage();

    // Category header (full purple band)
    addSectionHeader(`${catLabel} (${catItems.length})`);

    // Priority sub-groups within the category
    const prioritySubs: { priority: string; label: string; items: DIAPItem[] }[] = [
      { priority: 'high', label: 'High priority', items: catItems.filter(i => i.priority === 'high') },
      { priority: 'medium', label: 'Medium priority', items: catItems.filter(i => i.priority === 'medium') },
      { priority: 'low', label: 'Low priority', items: catItems.filter(i => i.priority === 'low') },
    ];
    // Any item with a missing/unknown priority still renders under Low.
    const knownPriorities = new Set(['high', 'medium', 'low']);
    const otherPriority = catItems.filter(i => !knownPriorities.has(i.priority));
    if (otherPriority.length > 0) prioritySubs[2].items.push(...otherPriority);

    for (const sub of prioritySubs) {
      if (sub.items.length === 0) continue;

      // Priority sub-header (ivory bg + colored left accent)
      checkNewPage(20);
      if (yPos > PAGE.marginY + 20) yPos += 4;

      const subColor = PRIORITY_COLORS[sub.priority] || COLORS.statusLow;

      doc.setFillColor(...hexToRgb(COLORS.ivory));
      doc.roundedRect(PAGE.marginX - 3, yPos - 4, PAGE.contentWidth + 6, 10, 2, 2, 'F');
      doc.setFillColor(...hexToRgb(subColor));
      doc.roundedRect(PAGE.marginX - 3, yPos - 4, 1.5, 10, 0.75, 0.75, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRgb(subColor));
      doc.text(`${sub.label} (${sub.items.length})`, PAGE.marginX + 3, yPos + 3);
      yPos += 14;

      for (const item of sub.items) {
        renderItemCard(item);
      }
    }

    yPos += 4;
  };

  // Render by category, then priority within each category
  for (const [catKey, catLabel] of Object.entries(categoryLabels)) {
    renderCategoryBlock(catLabel, items.filter(i => i.category === catKey));
  }
  // Catch-all so items with an unmapped category are never dropped
  renderCategoryBlock(OTHER_CATEGORY_LABEL, otherCategoryItems);

  // Info note (matching report style)
  yPos += 4;
  checkNewPage(14);
  doc.setFillColor(240, 249, 255);
  doc.roundedRect(PAGE.marginX, yPos - 3, PAGE.contentWidth, 14, 2, 2, 'F');
  doc.setDrawColor(180, 210, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(PAGE.marginX, yPos - 3, PAGE.contentWidth, 14, 2, 2, 'S');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...hexToRgb(COLORS.textMuted));
  const infoLines = wrapText(
    'For detailed recommendations, resource links, and to update action item status, refer to your DIAP workspace in Access Compass.',
    PAGE.contentWidth - 12
  );
  for (let i = 0; i < infoLines.length; i++) {
    doc.text(infoLines[i], PAGE.marginX + 6, yPos + 1 + i * 4);
  }
  doc.setDrawColor(0, 0, 0);

  // Add final footer
  addFooter();

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
