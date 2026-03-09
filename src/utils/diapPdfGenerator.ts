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

const STATUS_LABELS: Record<string, string> = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  'completed': 'Completed',
  'on-hold': 'On Hold',
  'cancelled': 'Cancelled',
};

const PRIORITY_COLORS: Record<string, string> = {
  high: COLORS.statusHigh,
  medium: COLORS.statusMedium,
  low: COLORS.statusLow,
};

const PRIORITY_BG: Record<string, [number, number, number]> = {
  high: [255, 241, 241],
  medium: [255, 249, 235],
  low: [239, 246, 255],
};

const PRIORITY_ACCENT: Record<string, string> = {
  high: '#ef4444',
  medium: '#d97706',
  low: '#3b82f6',
};

const STATUS_COLORS: Record<string, string> = {
  'not-started': '#6b7280',
  'in-progress': '#945a00',
  'completed': '#166534',
  'on-hold': '#6b7280',
  'cancelled': '#991b1b',
};

interface DIAPPdfOptions {
  items: DIAPItem[];
  orgName?: string;
  generatedDate?: string;
  customCategoryNames?: Record<string, string>;
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
  const { items, orgName = 'Your Organisation', generatedDate, customCategoryNames = {} } = options;

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
  const completedCount = items.filter(i => i.status === 'completed').length;
  const inProgressCount = items.filter(i => i.status === 'in-progress').length;
  const notStartedCount = items.filter(i => i.status === 'not-started').length;
  const onHoldCount = items.filter(i => i.status === 'on-hold').length;
  const completionRate = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  // ========================================
  // COVER PAGE
  // ========================================
  doc.setFillColor(...hexToRgb(COLORS.amethystDark));
  doc.rect(0, 0, PAGE.width, PAGE.height, 'F');

  doc.setFillColor(...hexToRgb(COLORS.amethystDiamond));
  doc.rect(PAGE.width * 0.3, 0, PAGE.width * 0.7, PAGE.height * 0.5, 'F');

  doc.setFillColor(91, 24, 151);
  doc.ellipse(PAGE.width * 0.8, PAGE.height * 0.2, 60, 80, 'F');

  doc.setFillColor(...hexToRgb(COLORS.aussieLight));
  doc.rect(0, PAGE.height * 0.42, PAGE.width, 4, 'F');
  doc.rect(0, PAGE.height * 0.42 + 4, PAGE.width * 0.4, 1, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text('Disability Inclusion', PAGE.width / 2, PAGE.height * 0.26, { align: 'center' });
  doc.text('Action Plan', PAGE.width / 2, PAGE.height * 0.26 + 16, { align: 'center' });

  // Org name card
  doc.setFillColor(255, 255, 255);
  const orgCardY = PAGE.height * 0.54;
  doc.roundedRect(PAGE.marginX + 10, orgCardY, PAGE.contentWidth - 20, 35, 4, 4, 'F');
  doc.setFillColor(...hexToRgb(COLORS.amethystDiamond));
  doc.roundedRect(PAGE.marginX + 10, orgCardY, 4, 35, 2, 2, 'F');

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
  doc.text(orgName, PAGE.width / 2, orgCardY + 15, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text(`Generated: ${formattedDate}`, PAGE.width / 2, orgCardY + 26, { align: 'center' });

  // Summary stats on cover
  const coverStatsY = PAGE.height * 0.68;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(PAGE.marginX + 10, coverStatsY, PAGE.contentWidth - 20, 30, 4, 4, 'F');

  const coverStatsBoxWidth = (PAGE.contentWidth - 20) / 4;
  const coverStats = [
    { val: String(totalItems), label: 'Total Items', color: COLORS.amethystDiamond },
    { val: String(highItems.length), label: 'High Priority', color: COLORS.statusHigh },
    { val: String(medItems.length), label: 'Medium Priority', color: COLORS.statusMedium },
    { val: String(lowItems.length), label: 'Low Priority', color: COLORS.statusLow },
  ];
  coverStats.forEach((s, idx) => {
    const x = PAGE.marginX + 10 + idx * coverStatsBoxWidth;
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(s.color));
    doc.text(s.val, x + coverStatsBoxWidth / 2, coverStatsY + 13, { align: 'center' });
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text(s.label, x + coverStatsBoxWidth / 2, coverStatsY + 21, { align: 'center' });
  });

  // Branding
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(PAGE.width / 2 - 40, PAGE.height * 0.84, 80, 20, 3, 3, 'F');
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
  doc.text('Access Compass', PAGE.width / 2, PAGE.height * 0.84 + 9, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text('by Flare Access', PAGE.width / 2, PAGE.height * 0.84 + 15, { align: 'center' });

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
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
    doc.text(tocGroup.group, PAGE.marginX + 3, yPos);
    yPos += 6;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    tocGroup.items.forEach((item) => {
      if (item === '') { yPos += 2; return; }
      doc.text(item, PAGE.marginX + 10, yPos);
      yPos += 6;
    });
    yPos += 4;
  });

  addFooter();

  // ========================================
  // PROGRESS OVERVIEW PAGE
  // ========================================
  addNewPage();

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

  const statusRows = [
    { label: 'Not Started', count: notStartedCount, color: STATUS_COLORS['not-started'] },
    { label: 'In Progress', count: inProgressCount, color: STATUS_COLORS['in-progress'] },
    { label: 'Completed', count: completedCount, color: STATUS_COLORS['completed'] },
    { label: 'On Hold', count: onHoldCount, color: STATUS_COLORS['on-hold'] },
    { label: 'Cancelled', count: items.filter(i => i.status === 'cancelled').length, color: STATUS_COLORS['cancelled'] },
  ];

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

  Object.entries(categoryLabels).forEach(([key, label]) => {
    const count = items.filter(i => i.category === key).length;
    if (count === 0) return;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRgb(COLORS.text));
    doc.text(label, PAGE.marginX + 4, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text(String(count), PAGE.marginX + 100, yPos);
    yPos += 6;
  });

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
    const cardBg = PRIORITY_BG[itemPriority] || [255, 255, 255];
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

  // Render by category, then priority within each category
  for (const [catKey, catLabel] of Object.entries(categoryLabels)) {
    const catItems = items.filter(i => i.category === catKey);
    if (catItems.length === 0) continue;

    // Sort by priority within category
    catItems.sort((a, b) => (priorityOrder[a.priority || 'low'] ?? 2) - (priorityOrder[b.priority || 'low'] ?? 2));

    addFooter();
    addNewPage();

    // Category header (full purple band)
    addSectionHeader(`${catLabel} (${catItems.length})`);

    // Count badges for this category
    const hCount = catItems.filter(i => i.priority === 'high').length;
    const mCount = catItems.filter(i => i.priority === 'medium').length;
    const lCount = catItems.filter(i => i.priority === 'low').length;

    // Priority sub-groups within the category
    const prioritySubs: { priority: string; label: string; items: DIAPItem[] }[] = [
      { priority: 'high', label: 'High priority', items: catItems.filter(i => i.priority === 'high') },
      { priority: 'medium', label: 'Medium priority', items: catItems.filter(i => i.priority === 'medium') },
      { priority: 'low', label: 'Low priority', items: catItems.filter(i => i.priority === 'low') },
    ];

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
  }

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

  // ========================================
  // SECOND PASS: Page X of Y
  // ========================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const fy = PAGE.height - 12;

    doc.setFillColor(...hexToRgb(COLORS.ivory));
    doc.rect(PAGE.width - PAGE.marginX - 30, fy - 3, 32, 8, 'F');

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(`Page ${i} of ${totalPages}`, PAGE.width - PAGE.marginX, fy, { align: 'right' });
  }

  // Save
  doc.save(`DIAP-Report-${fileDate}.pdf`);
}
