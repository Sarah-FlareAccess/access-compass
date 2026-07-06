/**
 * PDF Report Generator
 *
 * Generates professionally formatted PDF reports using jsPDF.
 * Includes headers, footers, page numbers, and proper formatting.
 */

import jsPDF from 'jspdf';
import type { Report, CategorisedItem } from '../hooks/useReportGeneration';
import { accessModules } from '../data/accessModules';
import { groupProfessionalReviewByExpertise, FLARE_CONTACT } from './professionalSupportGroups';
import { groupOwnerArea, groupLabel, groupOrderIndex } from './maturityModel';
import type { ThematicSummary } from './reportAnalysis';

// Brand Colors - matching Access Compass design system
const COLORS = {
  // Primary brand
  amethystDark: '#3a0b52',
  amethystDiamond: '#490E67',
  amethystLight: '#6b21a8',
  // Accent
  aussieDark: '#E07D00',
  aussieLight: '#FF9015',
  // Status
  green: '#22c55e',
  greenLight: '#dcfce7',
  red: '#ef4444',
  redLight: '#fee2e2',
  amber: '#f59e0b',
  amberLight: '#fef3c7',
  amberDark: '#d97706',
  blue: '#3b82f6',
  blueLight: '#dbeafe',
  // Neutrals
  gray: '#6b7280',
  grayLight: '#9ca3af',
  ivory: '#FAF8F5',
  ivoryDark: '#f0ede8',
  text: '#1a1a2e',
  textSecondary: '#4a4a4a',
};

// Page dimensions (3.1)
const PAGE = {
  width: 210,
  height: 297,
  marginLeft: 20,
  marginRight: 20,
  marginTop: 25,
  marginBottom: 25,
  contentWidth: 170, // 210 - 20 - 20
};

interface PDFGeneratorOptions {
  report: Report;
  includeCoverPage?: boolean;
  includeTableOfContents?: boolean;
  /** If true, render a 1-2 page executive summary only:
   *  cover + stat boxes + top 3 priorities + top 3 strengths.
   *  Skips Methodology, full module evidence and detailed action list.
   *  For board/exec audiences who need the headline, not the workpaper. */
  summaryOnly?: boolean;
}

// Module group ordering and labels for the findings section
const GROUP_ORDER: { id: string; label: string }[] = [
  { id: 'before-arrival', label: 'Before they arrive' },
  { id: 'getting-in', label: 'Getting in and moving around' },
  { id: 'during-visit', label: 'During the visit' },
  { id: 'service-support', label: 'Service and support' },
  { id: 'organisational-commitment', label: 'Organisational commitment' },
  { id: 'events', label: 'Events' },
];

/**
 * Generate a professional PDF report
 */
export function generatePDFReport(options: PDFGeneratorOptions): jsPDF {
  const { report, includeCoverPage = true, includeTableOfContents = true, summaryOnly = false } = options;
  const doc = new jsPDF('p', 'mm', 'a4');

  // Accessibility: enforce an 11pt minimum font size across the entire
  // document. Any setFontSize below 11 is raised to 11 so no text, including
  // labels, captions and footers, falls under the minimum.
  const _origSetFontSize = doc.setFontSize.bind(doc);
  (doc as unknown as { setFontSize: (n: number) => jsPDF }).setFontSize = (n: number) =>
    _origSetFontSize(Math.max(11, n));

  // Document-level accessibility metadata. Full PDF/UA tagging is not produced
  // by jsPDF, but a document language and descriptive properties help assistive
  // technology and are a baseline expectation.
  doc.setLanguage('en-AU');
  doc.setProperties({
    title: `Accessibility Self-Review Report — ${report.organisation}`,
    subject: 'Accessibility self-review report',
    author: 'Access Compass by Flare Access',
    creator: 'Access Compass',
  });

  let currentPage = 1;
  let yPosition = PAGE.marginTop;

  // Contents-page support: record the page each section title lands on, and
  // where each contents line was drawn, so a second pass can fill in accurate
  // page numbers (the pages are not known when the contents page is drawn).
  const sectionPages = new Map<string, number>();
  const tocEntries: { title: string; page: number; y: number }[] = [];
  const recordSection = (title: string) => {
    if (!sectionPages.has(title)) sectionPages.set(title, doc.getNumberOfPages());
  };

  // Helper: Add header to current page
  const addHeader = () => {
    // Purple gradient effect (simulated with two rects)
    doc.setFillColor(58, 11, 82); // amethystDark
    doc.rect(0, 0, PAGE.width, 15, 'F');
    doc.setFillColor(73, 14, 103); // amethystDiamond
    doc.rect(0, 0, PAGE.width * 0.6, 15, 'F');

    // Orange accent line at bottom (brand orange)
    doc.setFillColor(255, 144, 21); // aussieLight / brand orange
    doc.rect(0, 14, PAGE.width, 1.5, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Access Compass', PAGE.marginLeft, 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(report.organisation, PAGE.width - PAGE.marginRight, 10, { align: 'right' });
    doc.setTextColor(0, 0, 0);
  };

  // Helper: Add footer to current page
  const addFooter = () => {
    const footerY = PAGE.height - 12;

    // Subtle background bar
    doc.setFillColor(250, 248, 245); // ivory
    doc.rect(0, footerY - 6, PAGE.width, 18, 'F');

    // Purple accent line at top of footer
    doc.setFillColor(73, 14, 103); // amethystDiamond
    doc.rect(PAGE.marginLeft, footerY - 6, 40, 1, 'F');

    // Footer text
    doc.setFontSize(7);
    doc.setTextColor(107, 114, 128); // gray
    doc.text('Access Compass by Flare Access', PAGE.marginLeft, footerY);
    doc.setTextColor(73, 14, 103); // amethystDiamond
    doc.text(
      new Date(report.generatedAt).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      PAGE.width / 2,
      footerY,
      { align: 'center' }
    );
    // Page number placeholder (updated in final pass with total)
    doc.setTextColor(107, 114, 128);
    doc.text(`Page ${currentPage}`, PAGE.width - PAGE.marginRight, footerY, { align: 'right' });

    doc.setTextColor(0, 0, 0);
  };

  // Helper: Add new page
  const addNewPage = () => {
    doc.addPage();
    currentPage++;
    yPosition = PAGE.marginTop;
    addHeader();
  };

  // Helper: Check if we need a new page (preserves font state across breaks)
  const checkNewPage = (neededHeight: number) => {
    if (yPosition + neededHeight > PAGE.height - PAGE.marginBottom) {
      // Capture current font state before page break
      const prevFontSize = doc.getFontSize();
      const prevFont = doc.getFont();

      addFooter();
      addNewPage();

      // Restore font state after page break
      doc.setFontSize(prevFontSize);
      doc.setFont(prevFont.fontName, prevFont.fontStyle);
      return true;
    }
    return false;
  };

  // Helper: Add group header (left-border accent style matching app).
  // reserve = space that must remain so the header is not stranded at the
  // foot of a page with its content pushed onto the next one.
  const addGroupHeader = (title: string, isFindings: boolean = false, reserve: number = 48) => {
    checkNewPage(reserve);

    // Add extra spacing before groups (except if at top of page)
    if (yPosition > PAGE.marginTop + 5) {
      yPosition += 10;
      checkNewPage(reserve);
    }
    recordSection(title);

    if (isFindings) {
      // Findings group headers: light ivory bg with purple left accent bar (matching app)
      doc.setFillColor(250, 248, 245); // ivory bg
      doc.roundedRect(PAGE.marginLeft - 3, yPosition - 4, PAGE.contentWidth + 6, 10, 2, 2, 'F');

      // Purple left accent bar
      doc.setFillColor(73, 14, 103); // amethystDiamond
      doc.roundedRect(PAGE.marginLeft - 3, yPosition - 4, 3, 10, 2, 2, 'F');

      // Dark text
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(COLORS.text);
      doc.text(title, PAGE.marginLeft + 5, yPosition + 3);
    } else {
      // Non-findings group headers: full purple band (Overview, Evidence, etc.)
      doc.setFillColor(73, 14, 103); // amethystDiamond
      doc.roundedRect(PAGE.marginLeft - 3, yPosition - 4, PAGE.contentWidth + 6, 10, 2, 2, 'F');

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(title, PAGE.marginLeft + 4, yPosition + 3);
    }

    yPosition += 14;
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
  };

  // Helper: Add section title with visual depth (11pt, not 13pt).
  // reserve keeps the title with the first lines of its content.
  const addSectionTitle = (title: string, accentColor: string = COLORS.amethystDiamond, reserve: number = 30) => {
    checkNewPage(reserve);
    recordSection(title);

    // Background bar for section header
    doc.setFillColor(250, 248, 245); // ivory
    doc.roundedRect(PAGE.marginLeft - 3, yPosition - 5, PAGE.contentWidth + 6, 14, 2, 2, 'F');

    // Left accent bar
    doc.setFillColor(accentColor);
    doc.roundedRect(PAGE.marginLeft - 3, yPosition - 5, 3, 14, 1, 1, 'F');

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(accentColor);
    doc.text(title, PAGE.marginLeft + 4, yPosition + 4.5);
    yPosition += 17;

    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
  };

  // Helper: Add paragraph text with word wrapping. Body copy is floored at
  // 11pt for print accessibility.
  const addParagraph = (text: string, fontSize: number = 11) => {
    const fs = Math.max(11, fontSize);
    doc.setFontSize(fs);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(text, PAGE.contentWidth);
    const lineHeight = fs * 0.5;

    for (const line of lines) {
      checkNewPage(lineHeight + 2);
      doc.text(line, PAGE.marginLeft, yPosition);
      yPosition += lineHeight;
    }
    yPosition += 3;
  };

  // Helper: Add a labelled frequency bar list (recurring themes, strengths).
  const renderFreqBars = (items: { label: string; count: number }[], barColor: string) => {
    if (!items.length) return;
    yPosition += 3;
    const labelW = 64;
    const barX = PAGE.marginLeft + labelW + 2;
    const barW = PAGE.contentWidth - labelW - 2 - 14;
    const maxC = items[0].count || 1;
    for (const it of items) {
      checkNewPage(11);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(31, 41, 55);
      doc.text(doc.splitTextToSize(it.label, labelW)[0], PAGE.marginLeft, yPosition + 2);
      doc.setFillColor(236, 234, 240);
      doc.roundedRect(barX, yPosition - 0.5, barW, 4, 1, 1, 'F');
      doc.setFillColor(barColor);
      doc.roundedRect(barX, yPosition - 0.5, Math.max(1.5, barW * it.count / maxC), 4, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(31, 41, 55);
      doc.text(String(it.count), PAGE.width - PAGE.marginRight, yPosition + 2, { align: 'right' });
      yPosition += 10;
    }
    yPosition += 2;
    doc.setTextColor(0, 0, 0);
  };

  // Helper: Render "Where the priorities sit" as bar rows + barriers subline,
  // matching the report's other bar sections.
  const renderThematicSummaries = (summaries: ThematicSummary[]) => {
    for (const s of summaries) {
      checkNewPage(22);
      // Row 1: domain name (left) + percentage (right)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(COLORS.text);
      doc.text(s.label, PAGE.marginLeft, yPosition);
      doc.setFontSize(11);
      doc.setTextColor(31, 41, 55);
      doc.text(`${s.pct}%`, PAGE.width - PAGE.marginRight, yPosition, { align: 'right' });
      yPosition += 3;

      // Row 2: full-width bar
      doc.setFillColor(236, 234, 240);
      doc.roundedRect(PAGE.marginLeft, yPosition, PAGE.contentWidth, 4, 1, 1, 'F');
      doc.setFillColor(COLORS.amethystDiamond);
      doc.roundedRect(PAGE.marginLeft, yPosition, Math.max(1.5, PAGE.contentWidth * s.pct / 100), 4, 1, 1, 'F');
      yPosition += 8;

      // Row 3: count + barriers subline
      const sub = `${s.count} of ${s.total} ${s.scopeHigh ? 'high-priority' : 'total'} actions`
        + (s.barriers.length ? ` · Barriers: ${s.barriers.join(', ')}` : '');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(107, 114, 128);
      for (const l of doc.splitTextToSize(sub, PAGE.contentWidth)) {
        checkNewPage(6);
        doc.text(l, PAGE.marginLeft, yPosition);
        yPosition += 5;
      }
      yPosition += 5;
      doc.setTextColor(0, 0, 0);
    }
  };

  // Helper: Add bullet list
  const addBulletList = (items: string[], bulletColor: string = COLORS.gray) => {
    doc.setFontSize(9);
    const lineHeight = 5;

    for (const item of items) {
      const lines = doc.splitTextToSize(item, PAGE.contentWidth - 8);
      const totalHeight = lines.length * lineHeight + 2;

      checkNewPage(totalHeight);

      // Bullet
      doc.setFillColor(bulletColor);
      doc.circle(PAGE.marginLeft + 2, yPosition - 1.5, 1.2, 'F');

      // Text
      doc.setTextColor(0, 0, 0);
      for (let i = 0; i < lines.length; i++) {
        doc.text(lines[i], PAGE.marginLeft + 8, yPosition);
        yPosition += lineHeight;
      }
      yPosition += 1;
    }
    yPosition += 3;
  };

  // Strip legacy "(high priority)" suffix
  const stripSuffix = (t: string) => t.replace(/\s*\((high|medium|low) priority\)\s*$/i, '');

  // Helper: Add stat box (clean style with colored left border)
  const addStatBox = (
    x: number,
    y: number,
    width: number,
    value: string,
    label: string,
    borderColor: string,
    textColor?: string
  ) => {
    const numColor = textColor || borderColor;
    const h = 23;

    // White background with subtle border
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, y, width, h, 3, 3, 'F');

    // Light border
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, width, h, 3, 3, 'S');

    // Colored left border (3px)
    doc.setFillColor(borderColor);
    doc.roundedRect(x, y, 3, h, 2, 0, 'F');
    doc.rect(x + 1, y, 2, h, 'F');

    // Value in contrast-safe color
    doc.setFontSize(19);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(numColor);
    doc.text(value, x + width / 2, y + 10.5, { align: 'center' });

    // Label in dark gray below
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text(label, x + width / 2, y + 18, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(0, 0, 0);
  };

  // Helper: Look up module group from accessModules data
  const getModuleGroup = (moduleCode: string): string => {
    const mod = accessModules.find(m => m.code === moduleCode);
    return mod ? mod.group : 'during-visit';
  };

  // Helper: Get module group label
  const getGroupLabel = (groupId: string): string => {
    const found = GROUP_ORDER.find(g => g.id === groupId);
    return found ? found.label : groupId;
  };

  // ============================================
  // COVER PAGE
  // ============================================
  if (includeCoverPage) {
    const ccx = PAGE.width / 2;

    // Amethyst top band (single tone, not layered) + light lower area, so the
    // cover reads lighter than the previous all-purple layering.
    doc.setFillColor(73, 14, 103); // amethystDiamond
    doc.rect(0, 0, PAGE.width, PAGE.height * 0.44, 'F');
    doc.setFillColor(250, 247, 245); // warm ivory
    doc.rect(0, PAGE.height * 0.44 + 3, PAGE.width, PAGE.height - (PAGE.height * 0.44 + 3), 'F');

    // Subtle tone-on-tone compass, offset to the lower-right of the band so it
    // sits beside the title rather than under it (mirrors the site hero layout).
    const cpx = PAGE.width * 0.70;
    const cpy = PAGE.height * 0.31;
    doc.setDrawColor(96, 42, 134); // slightly lighter purple
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
    doc.setFillColor(255, 144, 21);
    doc.circle(cpx, cpy, 1.6, 'F'); // orange hub
    doc.setDrawColor(0, 0, 0);

    // Title, left-aligned on clean purple beside the compass
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(30);
    doc.setFont('helvetica', 'bold');
    doc.text('Accessibility', PAGE.marginLeft + 4, PAGE.height * 0.19, { align: 'left' });
    doc.text('Self-Review Report', PAGE.marginLeft + 4, PAGE.height * 0.19 + 13, { align: 'left' });

    // Orange divider
    doc.setFillColor(255, 144, 21);
    doc.rect(0, PAGE.height * 0.44, PAGE.width, 3, 'F');

    // Report type badge, straddling the divider
    const reportTypeText =
      report.reportType === 'pulse-check' ? 'Pulse Check' : 'Deep Dive';
    const badgeWidth = 50;
    doc.setFillColor(255, 237, 200); // light amber bg
    doc.roundedRect(ccx - badgeWidth / 2, PAGE.height * 0.44 + 11, badgeWidth, 12, 3, 3, 'F');
    doc.setDrawColor(224, 125, 0);
    doc.setLineWidth(0.5);
    doc.roundedRect(ccx - badgeWidth / 2, PAGE.height * 0.44 + 11, badgeWidth, 12, 3, 3, 'S');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(120, 53, 0);
    doc.text(reportTypeText, ccx, PAGE.height * 0.44 + 19, { align: 'center' });
    doc.setDrawColor(0, 0, 0);

    // Organisation name (dark on the light area)
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(73, 14, 103);
    doc.text(report.organisation, ccx, PAGE.height * 0.62, { align: 'center' });

    if (report.siteName) {
      doc.setFontSize(13);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(90, 60, 120);
      doc.text(report.siteName, ccx, PAGE.height * 0.62 + 9, { align: 'center' });
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(
      `Generated ${new Date(report.generatedAt).toLocaleDateString('en-AU', {
        day: 'numeric', month: 'long', year: 'numeric',
      })}`,
      ccx,
      PAGE.height * 0.62 + (report.siteName ? 18 : 10),
      { align: 'center' }
    );

    // Branding at bottom
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(73, 14, 103);
    doc.text('Access Compass', ccx, PAGE.height * 0.9, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('by Flare Access', ccx, PAGE.height * 0.9 + 6, { align: 'center' });

    // Start new page for content
    addNewPage();
  } else {
    addHeader();
  }

  // ============================================
  // TABLE OF CONTENTS (Deep Dive only)
  // ============================================
  if (includeTableOfContents && report.reportType === 'deep-dive') {
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.amethystDiamond);
    doc.text('Table of Contents', PAGE.marginLeft, yPosition);
    yPosition += 15;

    const hasAnalysisData =
      (report.urlAnalysisResults && report.urlAnalysisResults.length > 0) ||
      (report.mediaAnalysisResults && report.mediaAnalysisResults.length > 0);

    // Flat, section-level outline. Every item maps to a rendered heading, so a
    // second pass can stamp its true page number next to it.
    const tocItems: string[] = [
      'Executive Summary',
      ...(report.frameworkAlignment ? ['Legislative Alignment'] : []),
      'About This Report',
      ...(report.themeBreakdown.length ? ['Performance by Area'] : []),
      ...(report.analysis.recurringThemes.length ? ['Recurring Themes'] : []),
      ...(report.analysis.thematicSummaries.length ? ['Where the Priorities Sit'] : []),
      ...(report.analysis.strengthsByTheme.length ? ["Where You're Strongest"] : []),
      ...(report.analysis.startingSequence.length ? ['Suggested Implementation Roadmap'] : []),
      ...(hasAnalysisData ? ['Analysis Results'] : []),
      'Key Findings',
      'Next Steps & Guidance',
      ...(report.moduleEvidence?.length ? ['Assessment Evidence'] : []),
      'Important Disclaimer',
    ];

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    for (const item of tocItems) {
      checkNewPage(11);
      doc.setTextColor(COLORS.text);
      doc.text(item, PAGE.marginLeft + 3, yPosition);
      // Dotted leader between the title and where the page number will go.
      const titleW = doc.getTextWidth(item);
      const dotsStart = PAGE.marginLeft + 3 + titleW + 3;
      const dotsEnd = PAGE.width - PAGE.marginRight - 10;
      if (dotsEnd > dotsStart) {
        doc.setTextColor(200, 196, 206);
        doc.setLineDashPattern([0.6, 1.2], 0);
        doc.setDrawColor(200, 196, 206);
        doc.setLineWidth(0.3);
        doc.line(dotsStart, yPosition - 1, dotsEnd, yPosition - 1);
        doc.setLineDashPattern([], 0);
      }
      tocEntries.push({ title: item, page: doc.getNumberOfPages(), y: yPosition });
      yPosition += 9;
    }
    doc.setTextColor(0, 0, 0);

    addFooter();
    addNewPage();
  }

  // ============================================
  // GROUP 1: OVERVIEW
  // ============================================
  addGroupHeader('Overview');
  addSectionTitle('Executive Summary');

  // Stats boxes with clean style (white bg, colored left border). Widened so
  // the longest label ("Modules Completed") fits at 11pt without overflow.
  const boxWidth = 41;
  const boxGap = 5;
  const startX = PAGE.marginLeft;

  // Reserve both tile rows so the stats and director tiles stay together.
  checkNewPage(58);

  addStatBox(
    startX,
    yPosition,
    boxWidth,
    String(report.executiveSummary.modulesCompleted),
    'Modules Completed',
    COLORS.amethystDiamond
  );
  addStatBox(
    startX + boxWidth + boxGap,
    yPosition,
    boxWidth,
    String(report.executiveSummary.strengthsCount),
    'Strengths',
    COLORS.green,
    '#15803d'
  );
  addStatBox(
    startX + (boxWidth + boxGap) * 2,
    yPosition,
    boxWidth,
    String(report.executiveSummary.actionsCount),
    'Priority Actions',
    '#b91c1c'
  );
  addStatBox(
    startX + (boxWidth + boxGap) * 3,
    yPosition,
    boxWidth,
    String(report.executiveSummary.areasToExploreCount),
    'To Investigate',
    COLORS.amber,
    '#92400e'
  );

  yPosition += 27;

  // --- Director numbers: priority load at a glance (grouped with the stats
  // above so the two tile rows stay together and never orphan) ---
  {
    const bw = 41;
    const gap = 5;
    const sx = PAGE.marginLeft;
    addStatBox(sx, yPosition, bw, String(report.directorNumbers.high), 'High priority', '#b91c1c');
    addStatBox(sx + (bw + gap), yPosition, bw, String(report.directorNumbers.medium), 'Medium priority', COLORS.amber, '#92400e');
    addStatBox(sx + (bw + gap) * 2, yPosition, bw, String(report.directorNumbers.low), 'Low priority', '#1a4fd6');
    addStatBox(sx + (bw + gap) * 3, yPosition, bw, String(report.directorNumbers.quickWins), 'Quick wins', COLORS.amethystDiamond);
    yPosition += 30;
  }

  // --- Accessibility maturity snapshot (the headline "where are we") ---
  if (report.maturity.started) {
    checkNewPage(50);
    const mx = PAGE.marginLeft;
    const mw = PAGE.contentWidth;
    const boxTop = yPosition;
    const boxH = 42;
    doc.setFillColor(250, 247, 251);
    doc.roundedRect(mx, boxTop, mw, boxH, 3, 3, 'F');
    doc.setDrawColor(230, 224, 236);
    doc.setLineWidth(0.3);
    doc.roundedRect(mx, boxTop, mw, boxH, 3, 3, 'S');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(107, 114, 128);
    doc.text('Accessibility maturity', mx + 6, boxTop + 9);

    const levelColors = ['#b45309', '#a16207', '#4d7c0f', '#15803d'];
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(levelColors[report.maturity.levelIdx] || '#a16207');
    doc.text(report.maturity.level, mx + 6, boxTop + 19);

    if (report.maturity.nextStage) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128);
      doc.text(`Next: reach ${report.maturity.nextStage}`, mx + mw - 6, boxTop + 19, { align: 'right' });
    }

    const segColors = ['#d97706', '#ca8a04', '#65a30d', '#16a34a'];
    const segGap = 3;
    const segW = (mw - 12 - segGap * 3) / 4;
    const segY = boxTop + 25;
    for (let i = 0; i < 4; i++) {
      doc.setFillColor(i <= report.maturity.levelIdx ? segColors[i] : '#e5e7eb');
      doc.roundedRect(mx + 6 + i * (segW + segGap), segY, segW, 3, 1, 1, 'F');
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text(
      `${report.maturity.confidence} confidence  ·  ${report.executiveSummary.modulesCompleted} of ${report.executiveSummary.totalModules} areas assessed (${report.maturity.coveragePct}%)  ·  ${report.maturity.performancePct}% doing well`,
      mx + 6, boxTop + 37
    );

    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(0, 0, 0);
    yPosition = boxTop + boxH + 6;

    // What this maturity level means (level-generic)
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    for (const l of doc.splitTextToSize(report.maturity.meaning, PAGE.contentWidth)) {
      checkNewPage(6);
      doc.text(l, PAGE.marginLeft, yPosition);
      yPosition += 5;
    }
    yPosition += 8;
    doc.setTextColor(0, 0, 0);
  }

  // --- Executive interpretation: what the data means ---
  if (report.analysis.interpretation.length > 0) {
    addSectionTitle('Executive Interpretation');
    for (const para of report.analysis.interpretation) {
      addParagraph(para, 9.5);
    }
  }

  // ============================================
  // SUMMARY-ONLY EARLY-EXIT: top priorities + top strengths
  // For board/exec audiences. Skips the rest of the report.
  // ============================================
  if (summaryOnly) {
    // Where the priorities sit (the exec "so what") — on its own page.
    if (report.analysis.thematicSummaries.length > 0) {
      addFooter();
      addNewPage();
      addSectionTitle('Where the Priorities Sit');
      yPosition += 4;
      renderThematicSummaries(report.analysis.thematicSummaries);
    }

    // Top priorities: rank genuinely by risk, not list order.
    // Safety-related first, then mandatory-compliance gaps, then by priority.
    const rank: Record<string, number> = { high: 0, medium: 100, low: 200 };
    const rankKey = (it: CategorisedItem): number => {
      let s = rank[it.priority || 'low'];
      if (it.safetyRelated) s -= 20;
      if (it.complianceLevel === 'mandatory') s -= 10;
      return s;
    };
    const topActions = (report.sections.priorityActions.categorised || [])
      .slice()
      .sort((a, b) => rankKey(a) - rankKey(b))
      .slice(0, 3);
    if (topActions.length > 0) {
      addSectionTitle('Top Priorities');
      for (const item of topActions) {
        const label = item.text || '';
        if (!label) continue;
        addParagraph(`• ${label}`, 10);
      }
      yPosition += 2;
    }

    // Suggested starting sequence
    if (report.analysis.startingSequence.length > 0) {
      addSectionTitle('Suggested Implementation Roadmap');
      for (const step of report.analysis.startingSequence) {
        checkNewPage(12);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(COLORS.amethystDiamond);
        doc.text(step.heading, PAGE.marginLeft, yPosition);
        const headW = doc.getTextWidth(step.heading);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(COLORS.text);
        const lines = doc.splitTextToSize(step.items.join(', '), PAGE.contentWidth - headW - 8);
        doc.text(lines[0] || '', PAGE.marginLeft + headW + 4, yPosition);
        yPosition += 5.3;
        for (let i = 1; i < lines.length; i++) {
          checkNewPage(6);
          doc.text(lines[i], PAGE.marginLeft + 4, yPosition);
          yPosition += 5.3;
        }
        yPosition += 1.5;
      }
      yPosition += 2;
    }

    const topStrengths = (report.sections.strengths.categorised || []).slice(0, 3);
    if (topStrengths.length > 0) {
      addSectionTitle('What\'s Going Well', '#166534');
      for (const item of topStrengths) {
        const label = item.text || '';
        if (!label) continue;
        addParagraph(`• ${label}`, 10);
      }
    }

    // Legislative alignment on the exec one-pager: the council differentiator.
    renderLegislativeAlignment();

    // Skip table of contents + all detail sections. Run the
    // page-numbering second pass so the footer is correct. Skip page 1 only
    // when it is a cover; the exec summary has no cover, so number from page 1.
    const totalPages = doc.getNumberOfPages();
    for (let i = includeCoverPage ? 2 : 1; i <= totalPages; i++) {
      doc.setPage(i);
      const fy = PAGE.height - 12;
      doc.setFillColor(250, 248, 245);
      doc.rect(0, fy - 6, PAGE.width, 18, 'F');
      doc.setFillColor(73, 14, 103);
      doc.rect(PAGE.marginLeft, fy - 6, 40, 1, 'F');
      doc.setFontSize(7);
      doc.setTextColor(107, 114, 128);
      doc.text('Access Compass — Executive Summary', PAGE.marginLeft, fy);
      doc.setTextColor(73, 14, 103);
      doc.text(
        new Date(report.generatedAt).toLocaleDateString('en-AU', {
          day: 'numeric', month: 'long', year: 'numeric',
        }),
        PAGE.width / 2, fy, { align: 'center' },
      );
      doc.setTextColor(107, 114, 128);
      doc.text(`Page ${i} of ${totalPages}`, PAGE.width - PAGE.marginRight, fy, { align: 'right' });
    }

    return doc;
  }

  // Legislative alignment sits immediately after the executive summary.
  renderLegislativeAlignment();

  // ============================================
  // ABOUT / OBLIGATIONS / METHODOLOGY (context, after the summary)
  // ============================================
  addSectionTitle('About This Report');

  const reportTypeIntro = report.reportType === 'pulse-check'
    ? 'a pulse check, providing a high-level snapshot of current accessibility across selected areas'
    : 'an accessibility review covering detailed findings across selected accessibility areas';

  addParagraph(
    `This report summarises the findings of ${reportTypeIntro} conducted using Access Compass. Findings are benchmarked against the Disability (Access to Premises-Buildings) Standards 2010, the National Construction Code, relevant Australian Standards including AS 1428.1, and the Web Content Accessibility Guidelines (WCAG) 2.2 for digital content. Recommendations that extend beyond mandatory compliance are identified as best practice.`,
    11
  );

  addSectionTitle('Your Obligations');

  addParagraph(
    'All organisations have responsibilities under the Disability Discrimination Act 1992 to provide equitable and dignified access to premises, goods and services. Disability is broadly defined and includes physical, intellectual, sensory, neurological, cognitive and psychosocial conditions.',
    11
  );
  addParagraph(
    'The Disability (Access to Premises-Buildings) Standards 2010 set minimum access requirements for new buildings and those undergoing significant upgrade or refurbishment. Mandatory compliance requirements are triggered when building work requires development approval. However, organisations can voluntarily make accessibility improvements at any time. Elements not covered by the Premises Standards remain subject to the broader provisions of the DDA.',
    11
  );
  addParagraph(
    'Regardless of whether building work is planned, any person with disability may lodge a complaint under the DDA if they experience discrimination in accessing premises, goods or services. Proactively addressing accessibility barriers reduces this risk and demonstrates a commitment to equitable access.',
    11
  );

  addSectionTitle('Methodology');

  addParagraph(
    'This report reflects a structured self-review completed by the organisation through the Access Compass platform. Each module presents a sequence of questions with embedded guidance, examples and links to applicable standards. Respondents select from response options that map to compliance status (compliant, partial, gap) and to whether a response represents minimum compliance or best practice.',
    11
  );
  addParagraph(
    'Findings represent the organisation\'s view of its current accessibility at the time of completion. Access Compass does not independently verify responses. For statutory certification or formal compliance audit, independent professional review is recommended. Recommendations in this report are generated from the response pattern and a curated library of accessibility actions; prioritisation reflects both legal exposure and impact on people with disability.',
    11
  );

  // --- Performance by area (theme breakdown) ---
  if (report.themeBreakdown.length > 0) {
    // Reserve the whole block (title + bars + note) so it is not split across
    // a page break or stranded at the foot of a page.
    const perfReserve = 36 + report.themeBreakdown.length * 10;
    addSectionTitle('Performance by Area', COLORS.amethystDiamond, perfReserve);
    yPosition += 5; // breathing room between the subheading and the bars
    const labelW = 64;
    const barX = PAGE.marginLeft + labelW + 2;
    const barW = PAGE.contentWidth - labelW - 2 - 16;
    const rowH = 10;
    const barH = 4;
    for (const t of report.themeBreakdown) {
      checkNewPage(rowH + 2);
      const noFindings = t.strengths + t.actions === 0;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(31, 41, 55);
      doc.text(doc.splitTextToSize(t.label, labelW)[0], PAGE.marginLeft, yPosition + 2);

      doc.setFillColor(236, 234, 240);
      doc.roundedRect(barX, yPosition - 0.5, barW, barH, 1, 1, 'F');
      if (!noFindings) {
        const fillColor = t.performancePct >= 67 ? '#16a34a' : t.performancePct >= 34 ? '#ca8a04' : '#dc2626';
        doc.setFillColor(fillColor);
        doc.roundedRect(barX, yPosition - 0.5, Math.max(1.5, barW * t.performancePct / 100), barH, 1, 1, 'F');
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      if (noFindings) {
        doc.setTextColor(156, 163, 175);
        doc.text('No findings', PAGE.width - PAGE.marginRight, yPosition + 2, { align: 'right' });
      } else {
        doc.setTextColor(31, 41, 55);
        doc.text(`${t.performancePct}%`, PAGE.width - PAGE.marginRight, yPosition + 2, { align: 'right' });
      }
      yPosition += rowH;
    }
    yPosition += 1;
    checkNewPage(10);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(107, 114, 128);
    for (const l of doc.splitTextToSize('Share of checks already going well in each area assessed. Lower bars are where to focus.', PAGE.contentWidth)) {
      doc.text(l, PAGE.marginLeft, yPosition + 2);
      yPosition += 5;
    }
    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
  }

  // --- Recurring themes across recommendations ---
  if (report.analysis.recurringThemes.length > 0) {
    addSectionTitle('Recurring Themes');
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(107, 114, 128);
    doc.text('Themes that appear across multiple recommendations, most frequent first.', PAGE.marginLeft, yPosition);
    yPosition += 4;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    renderFreqBars(report.analysis.recurringThemes, COLORS.amethystDiamond);

    if (report.analysis.recurringInsight) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(COLORS.text);
      for (const l of doc.splitTextToSize(report.analysis.recurringInsight, PAGE.contentWidth)) {
        checkNewPage(6);
        doc.text(l, PAGE.marginLeft, yPosition);
        yPosition += 5;
      }
      yPosition += 4;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
    }

    if (report.analysis.themeLeads.length > 0) {
      checkNewPage(14);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(107, 114, 128);
      doc.text('THEME', PAGE.marginLeft, yPosition);
      doc.text('SUGGESTED LEAD', PAGE.width - PAGE.marginRight, yPosition, { align: 'right' });
      yPosition += 2;
      doc.setDrawColor(220, 216, 226);
      doc.setLineWidth(0.3);
      doc.line(PAGE.marginLeft, yPosition, PAGE.width - PAGE.marginRight, yPosition);
      yPosition += 5.5;
      for (const l of report.analysis.themeLeads) {
        checkNewPage(7);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(COLORS.text);
        doc.text(l.theme, PAGE.marginLeft, yPosition);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(COLORS.amethystDiamond);
        doc.text(l.lead, PAGE.width - PAGE.marginRight, yPosition, { align: 'right' });
        yPosition += 6;
      }
      yPosition += 3;
      doc.setTextColor(0, 0, 0);
    }
  }

  // --- Where the priorities sit ---
  if (report.analysis.thematicSummaries.length > 0) {
    addSectionTitle('Where the Priorities Sit');
    yPosition += 4;
    renderThematicSummaries(report.analysis.thematicSummaries);
  }

  // --- Where you're strongest ---
  if (report.analysis.strengthsByTheme.length > 0) {
    addSectionTitle("Where You're Strongest");
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(107, 114, 128);
    doc.text('Areas with the most strengths identified, highest first.', PAGE.marginLeft, yPosition);
    yPosition += 4;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    renderFreqBars(report.analysis.strengthsByTheme, '#16a34a');
  }

  // --- Suggested starting sequence ---
  if (report.analysis.startingSequence.length > 0) {
    addSectionTitle('Suggested Implementation Roadmap');
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(107, 114, 128);
    const seqNote = doc.splitTextToSize('Indicative time bands, with the achievable operational items first. A starting point for your own planning, not a fixed schedule.', PAGE.contentWidth);
    for (const l of seqNote) { checkNewPage(6); doc.text(l, PAGE.marginLeft, yPosition); yPosition += 5.3; }
    yPosition += 2;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    for (const step of report.analysis.startingSequence) {
      checkNewPage(10);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(COLORS.amethystDiamond);
      doc.text(step.heading, PAGE.marginLeft, yPosition);
      const headW = doc.getTextWidth(step.heading);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(COLORS.text);
      const lines = doc.splitTextToSize(step.items.join(', '), PAGE.contentWidth - headW - 6);
      doc.text(lines[0] || '', PAGE.marginLeft + headW + 4, yPosition);
      yPosition += 4.5;
      for (let i = 1; i < lines.length; i++) {
        checkNewPage(5);
        doc.text(lines[i], PAGE.marginLeft + 4, yPosition);
        yPosition += 4.5;
      }
      yPosition += 1.5;
    }
    yPosition += 2;
    doc.setTextColor(0, 0, 0);
  }

  // ============================================
  // LEGISLATIVE ALIGNMENT definition (hoisted; invoked after the summary above)
  // ============================================
  function renderLegislativeAlignment() {
    if (!report.frameworkAlignment) return;
    const fa = report.frameworkAlignment;
    if (yPosition > PAGE.marginTop + 20) { addFooter(); addNewPage(); }
    addGroupHeader('Legislative Alignment');

    // Mandate badge + framework name
    const badgeText = fa.mandate === 'statutory' ? 'Statutory reporting framework'
      : fa.mandate === 'voluntary' ? 'Voluntary alignment aid'
      : fa.mandate === 'national' ? 'National framework' : 'Reference framework';
    const badgeColors: Record<string, [string, string]> = {
      statutory: ['#fde8e8', '#b91c1c'], voluntary: ['#fef3d6', '#a16207'], national: ['#efe7f5', '#490E67'], na: ['#f3f4f6', '#6b7280'],
    };
    const [bBg, bFg] = badgeColors[fa.mandate] || badgeColors.national;
    yPosition += 2;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    const bTextW = doc.getTextWidth(badgeText) + 8;
    doc.setFillColor(bBg);
    doc.roundedRect(PAGE.marginLeft, yPosition - 4.5, bTextW, 7, 2, 2, 'F');
    doc.setTextColor(bFg);
    doc.text(badgeText, PAGE.marginLeft + 4, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLORS.text);
    doc.text(fa.frameworkName, PAGE.marginLeft + bTextW + 4, yPosition);
    yPosition += 8;

    addParagraph("How your self-review aligns to this framework's outcome domains, and where coverage gaps remain. This is an alignment aid to support planning and reporting, not a compliance audit or certification.", 11);

    // Nudge to set jurisdiction when still on the national default
    if (fa.mandate === 'national') {
      const nudge = "You're viewing alignment to the national framework. If you report against a state or territory disability plan, set your reporting jurisdiction in Organisation settings to align this report to that statutory framework.";
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const nLines = doc.splitTextToSize(nudge, PAGE.contentWidth - 10);
      const nH = nLines.length * 5 + 6;
      checkNewPage(nH + 4);
      doc.setFillColor(254, 243, 214);
      doc.roundedRect(PAGE.marginLeft, yPosition - 2, PAGE.contentWidth, nH, 2, 2, 'F');
      doc.setFillColor('#d97706');
      doc.roundedRect(PAGE.marginLeft, yPosition - 2, 3, nH, 1, 1, 'F');
      doc.setTextColor('#92400e');
      let ny = yPosition + 3;
      for (const l of nLines) { doc.text(l, PAGE.marginLeft + 6, ny); ny += 5; }
      yPosition += nH + 4;
      doc.setTextColor(0, 0, 0);
    }

    // Legend
    checkNewPage(8);
    const legend: Array<[string, string]> = [['#16a34a', 'Doing well'], ['#ca8a04', 'Mixed'], ['#dc2626', 'Needs work'], ['#d1d5db', 'Not yet assessed']];
    let lx = PAGE.marginLeft;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    for (const [c, label] of legend) {
      doc.setFillColor(c);
      doc.roundedRect(lx, yPosition - 3, 3.5, 3.5, 0.8, 0.8, 'F');
      doc.setTextColor(75, 85, 99);
      doc.text(label, lx + 5, yPosition);
      lx += 6 + doc.getTextWidth(label) + 8;
    }
    yPosition += 8;
    doc.setTextColor(0, 0, 0);

    // Per-domain rows
    for (const d of fa.domains) {
      checkNewPage(22);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(COLORS.text);
      doc.text(d.name, PAGE.marginLeft, yPosition);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      if (d.total === 0) {
        doc.setTextColor(107, 114, 128);
        doc.text('Not yet assessed', PAGE.width - PAGE.marginRight, yPosition, { align: 'right' });
      } else {
        doc.setTextColor(75, 85, 99);
        doc.text(`${d.moduleIds.length} area${d.moduleIds.length !== 1 ? 's' : ''} assessed`, PAGE.width - PAGE.marginRight, yPosition, { align: 'right' });
      }
      yPosition += 5.5;

      if (d.outcomeStatement) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(107, 114, 128);
        for (const l of doc.splitTextToSize(d.outcomeStatement, PAGE.contentWidth)) {
          checkNewPage(6);
          doc.text(l, PAGE.marginLeft, yPosition);
          yPosition += 5;
        }
      }

      if (d.total > 0) {
        const barW = PAGE.contentWidth;
        doc.setFillColor(236, 234, 240);
        doc.roundedRect(PAGE.marginLeft, yPosition, barW, 4, 1, 1, 'F');
        let cx = PAGE.marginLeft;
        const segs: Array<[number, string]> = [[d.strong, '#16a34a'], [d.mixed, '#ca8a04'], [d.needsWork, '#dc2626']];
        for (const [n, c] of segs) {
          if (n > 0) { const w = barW * n / d.total; doc.setFillColor(c); doc.rect(cx, yPosition, w, 4, 'F'); cx += w; }
        }
        yPosition += 4 + 5;
      } else {
        yPosition += 3;
      }
      yPosition += 2;
      doc.setTextColor(0, 0, 0);
    }

    // Citation
    checkNewPage(10);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(107, 114, 128);
    for (const l of doc.splitTextToSize(fa.citation, PAGE.contentWidth)) {
      doc.text(l, PAGE.marginLeft, yPosition);
      yPosition += 5;
    }
    yPosition += 4;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
  }

  // ============================================
  // ASSESSMENT EVIDENCE (appendix; defined here, rendered near the end)
  // ============================================
  function renderAssessmentEvidence() {
  // Assessment Evidence starts on a fresh page for a clean section break.
  if (yPosition > PAGE.marginTop + 20) {
    addFooter();
    addNewPage();
  }
  addGroupHeader('Assessment Evidence');

  // ============================================
  // MODULES REVIEWED
  // ============================================
  if (report.moduleEvidence && report.moduleEvidence.length > 0) {
    addSectionTitle('Modules Reviewed');

    // Caption so the columns are self-explanatory
    doc.setFontSize(11);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(107, 114, 128);
    const capLines = doc.splitTextToSize(
      'Strengths: things already done well. Actions: improvements identified. Confidence: how complete and certain the responses were for that module.',
      PAGE.contentWidth
    );
    for (const cl of capLines) {
      checkNewPage(6);
      doc.text(cl, PAGE.marginLeft, yPosition);
      yPosition += 5;
    }
    yPosition += 3;

    // Column layout (offsets from marginLeft)
    const colStrengths = 108;
    const colActions = 134;

    // Column header
    checkNewPage(16);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(107, 114, 128);
    doc.text('Module', PAGE.marginLeft + 1, yPosition);
    doc.text('Strengths', PAGE.marginLeft + colStrengths, yPosition, { align: 'right' });
    doc.text('Actions', PAGE.marginLeft + colActions, yPosition, { align: 'right' });
    doc.text('Confidence', PAGE.width - PAGE.marginRight, yPosition, { align: 'right' });
    yPosition += 2.5;
    doc.setDrawColor(220, 216, 226);
    doc.setLineWidth(0.3);
    doc.line(PAGE.marginLeft, yPosition, PAGE.width - PAGE.marginRight, yPosition);
    yPosition += 6;

    // Group modules by journey area for context
    const evByGroup = new Map<string, typeof report.moduleEvidence>();
    for (const ev of report.moduleEvidence) {
      const g = getModuleGroup(ev.moduleCode);
      if (!evByGroup.has(g)) evByGroup.set(g, []);
      evByGroup.get(g)!.push(ev);
    }
    const orderedGroups = Array.from(evByGroup.keys()).sort((a, b) => groupOrderIndex(a) - groupOrderIndex(b));

    let rowAlt = false;
    for (const g of orderedGroups) {
      checkNewPage(20);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(73, 14, 103);
      doc.text(groupLabel(g), PAGE.marginLeft + 1, yPosition + 1);
      yPosition += 6.5;

      const rows = evByGroup.get(g)!.slice().sort((a, b) => a.moduleCode.localeCompare(b.moduleCode, undefined, { numeric: true }));
      for (const ev of rows) {
        const rowH = 9;
        checkNewPage(rowH + 2);
        if (rowAlt) {
          doc.setFillColor(250, 248, 245);
          doc.rect(PAGE.marginLeft - 1, yPosition - 4.5, PAGE.contentWidth + 2, rowH, 'F');
        }
        rowAlt = !rowAlt;

        doc.setFillColor(240, 233, 245);
        const bw = 18;
        doc.roundedRect(PAGE.marginLeft, yPosition - 4, bw, 7, 1.5, 1.5, 'F');
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(73, 14, 103);
        doc.text(ev.moduleCode, PAGE.marginLeft + bw / 2, yPosition + 0.6, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(COLORS.text);
        doc.text(doc.splitTextToSize(ev.moduleName, 74)[0], PAGE.marginLeft + 22, yPosition + 0.8);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(ev.strengthsCount > 0 ? '#15803d' : '#9ca3af');
        doc.text(String(ev.strengthsCount), PAGE.marginLeft + colStrengths, yPosition + 0.8, { align: 'right' });
        doc.setTextColor(ev.actionsCount > 0 ? '#b91c1c' : '#9ca3af');
        doc.text(String(ev.actionsCount), PAGE.marginLeft + colActions, yPosition + 0.8, { align: 'right' });

        const conf = ev.confidenceSnapshot;
        const confLabel = conf === 'strong' ? 'Strong' : conf === 'mixed' ? 'Mixed' : conf === 'needs-work' ? 'Needs work' : '—';
        const confColor = conf === 'strong' ? '#15803d' : conf === 'mixed' ? '#92400e' : conf === 'needs-work' ? '#b91c1c' : '#9ca3af';
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(confColor);
        doc.text(confLabel, PAGE.width - PAGE.marginRight, yPosition + 0.8, { align: 'right' });

        yPosition += rowH;
      }
      yPosition += 2;
    }
    doc.setTextColor(0, 0, 0);
    yPosition += 3;
  }
  } // end renderAssessmentEvidence

  // ============================================
  // GROUP 3: ANALYSIS RESULTS (conditional)
  // ============================================
  const hasAnyAnalysis =
    (report.urlAnalysisResults && report.urlAnalysisResults.length > 0) ||
    (report.mediaAnalysisResults && report.mediaAnalysisResults.length > 0);
  if (hasAnyAnalysis) {
    addGroupHeader('Analysis Results');
  }

  // ============================================
  // URL ANALYSIS RESULTS
  // ============================================
  if (report.urlAnalysisResults && report.urlAnalysisResults.length > 0) {
    addSectionTitle('Website Accessibility Analysis');

    report.urlAnalysisResults.forEach((analysis) => {
      checkNewPage(40);

      // URL and score
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(COLORS.amethystDiamond);
      doc.text(analysis.url, PAGE.marginLeft, yPosition);
      yPosition += 5;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(`Score: ${analysis.overallScore}/100 (${analysis.overallStatus})`, PAGE.marginLeft, yPosition);
      yPosition += 6;

      addParagraph(analysis.summary, 9);

      if (analysis.strengths.length > 0) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('Strengths:', PAGE.marginLeft, yPosition);
        yPosition += 4;
        doc.setFont('helvetica', 'normal');
        addBulletList(analysis.strengths, COLORS.green);
      }

      if (analysis.improvements.length > 0) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('Areas for Improvement:', PAGE.marginLeft, yPosition);
        yPosition += 4;
        doc.setFont('helvetica', 'normal');
        addBulletList(analysis.improvements, COLORS.aussieDark);
      }
    });
  }

  // ============================================
  // MEDIA ANALYSIS RESULTS
  // ============================================
  if (report.mediaAnalysisResults && report.mediaAnalysisResults.length > 0) {
    addSectionTitle('Media Analysis Results');

    report.mediaAnalysisResults.forEach((analysis) => {
      checkNewPage(35);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      const title = analysis.fileName || analysis.url || formatAnalysisType(analysis.analysisType);
      doc.text(`${formatAnalysisType(analysis.analysisType)}: ${title}`, PAGE.marginLeft, yPosition);
      yPosition += 5;

      doc.setFont('helvetica', 'normal');
      doc.text(`Score: ${analysis.overallScore}/100 (${analysis.overallStatus})`, PAGE.marginLeft, yPosition);
      yPosition += 6;

      addParagraph(analysis.summary, 9);

      if (analysis.strengths.length > 0) {
        addBulletList(analysis.strengths.slice(0, 3), COLORS.green);
      }

      if (analysis.improvements.length > 0) {
        addBulletList(analysis.improvements.slice(0, 3), COLORS.aussieDark);
      }
    });
  }

  // ============================================
  // GROUP 4: KEY FINDINGS (per-module structure)
  // ============================================
  addGroupHeader('Key Findings');

  // Build per-module findings map
  interface ModuleFindings {
    moduleCode: string;
    moduleName: string;
    group: string;
    strengths: CategorisedItem[];
    highActions: CategorisedItem[];
    mediumActions: CategorisedItem[];
    lowActions: CategorisedItem[];
    explores: CategorisedItem[];
  }

  const moduleMap = new Map<string, ModuleFindings>();

  const ensureModule = (item: CategorisedItem): ModuleFindings => {
    let entry = moduleMap.get(item.moduleCode);
    if (!entry) {
      entry = {
        moduleCode: item.moduleCode,
        moduleName: item.moduleName,
        group: getModuleGroup(item.moduleCode),
        strengths: [],
        highActions: [],
        mediumActions: [],
        lowActions: [],
        explores: [],
      };
      moduleMap.set(item.moduleCode, entry);
    }
    return entry;
  };

  // Populate from strengths
  if (report.sections.strengths.categorised) {
    for (const item of report.sections.strengths.categorised) {
      ensureModule(item).strengths.push(item);
    }
  }

  // Populate from priority actions
  if (report.sections.priorityActions.categorised) {
    for (const item of report.sections.priorityActions.categorised) {
      const entry = ensureModule(item);
      const p = item.priority || 'low';
      if (p === 'high') entry.highActions.push(item);
      else if (p === 'medium') entry.mediumActions.push(item);
      else entry.lowActions.push(item);
    }
  }

  // Populate from areas to explore
  if (report.sections.areasToExplore.categorised) {
    for (const item of report.sections.areasToExplore.categorised) {
      ensureModule(item).explores.push(item);
    }
  }

  // Sort modules into group order
  const allModules = Array.from(moduleMap.values());
  allModules.sort((a, b) => {
    const groupA = GROUP_ORDER.findIndex(g => g.id === a.group);
    const groupB = GROUP_ORDER.findIndex(g => g.id === b.group);
    if (groupA !== groupB) return groupA - groupB;
    return a.moduleCode.localeCompare(b.moduleCode, undefined, { numeric: true });
  });

  // Priority legend (shown once before the first module)
  checkNewPage(50);

  // Subheading for priority legend
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.amethystDiamond);
  doc.text('Understanding Priority Levels', PAGE.marginLeft, yPosition);
  yPosition += 8;

  const legendItems: { label: string; color: string; desc: string }[] = [
    { label: 'High', color: '#b91c1c', desc: 'Gaps in mandatory compliance requirements (Premises Standards, WCAG, NCC) and safety-related items. Highest legal and safety risk.' },
    { label: 'Medium', color: '#945a00', desc: 'High-impact improvements that significantly affect the experience of people with disability, and items needing further investigation.' },
    { label: 'Low', color: '#1a4fd6', desc: 'Best-practice improvements that make a real, meaningful difference. Not less important, just lower legal risk.' },
  ];
  for (const item of legendItems) {
    // Reserve label + first description line so the label never orphans.
    checkNewPage(12);
    // Label in priority color
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(item.color);
    doc.text(`${item.label}`, PAGE.marginLeft + 4, yPosition);
    yPosition += 5;

    // Description wrapped
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLORS.gray);
    const descLines = doc.splitTextToSize(item.desc, PAGE.contentWidth - 10);
    for (const line of descLines) {
      checkNewPage(5.5);
      doc.text(line, PAGE.marginLeft + 4, yPosition);
      yPosition += 5;
    }
    yPosition += 3;
  }
  yPosition += 2;

  // Encouragement text (shown once)
  checkNewPage(16);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(COLORS.gray);
  const encLines = doc.splitTextToSize(
    'Every action here is worth doing. Priority levels help you decide where to start, not what to skip. Even "low" priority items can have a meaningful impact on someone\'s experience. Start wherever you can and build from there.',
    PAGE.contentWidth - 8
  );
  for (const line of encLines) {
    checkNewPage(5.5);
    doc.text(line, PAGE.marginLeft + 4, yPosition);
    yPosition += 5;
  }
  yPosition += 6;

  // Render per-module findings grouped by category
  let lastGroup = '';

  for (const mod of allModules) {
    // Group header when entering a new group (findings style)
    if (mod.group !== lastGroup) {
      lastGroup = mod.group;
      addGroupHeader(getGroupLabel(mod.group), true);
      // Suggested owning area for this group of actions
      checkNewPage(6);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128);
      doc.text(`Suggested owner: ${groupOwnerArea(mod.group)}`, PAGE.marginLeft + 5, yPosition);
      yPosition += 5;
      doc.setTextColor(0, 0, 0);
    }

    // 6mm space before module card
    yPosition += 6;
    checkNewPage(30);

    // Count summary badges for this module
    const mCount = mod.mediumActions.length;
    const lCount = mod.lowActions.length;
    const hCount = mod.highActions.length;

    // Module card: bordered container (matching app style)
    // Draw left border accent (purple)
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    // Top + right + bottom border in light gray
    const moduleCardTop = yPosition - 5;
    const moduleCardHeight = 15;
    doc.roundedRect(PAGE.marginLeft + 2, moduleCardTop, PAGE.contentWidth - 2, moduleCardHeight, 2, 2, 'S');
    // Purple left accent
    doc.setFillColor(COLORS.amethystDiamond);
    doc.roundedRect(PAGE.marginLeft, moduleCardTop, 3, moduleCardHeight, 2, 2, 'F');

    // Module code badge (light purple bg, purple text)
    doc.setFillColor(240, 233, 245);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    const codeWidth = doc.getTextWidth(mod.moduleCode) + 6;
    const badgeW = Math.max(codeWidth, 16);
    doc.roundedRect(PAGE.marginLeft + 8, yPosition - 3.5, badgeW, 7, 2, 2, 'F');
    doc.setTextColor(COLORS.amethystDiamond);
    doc.text(mod.moduleCode, PAGE.marginLeft + 8 + badgeW / 2, yPosition + 1, { align: 'center' });

    // Module name
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.text);
    doc.text(mod.moduleName, PAGE.marginLeft + 8 + badgeW + 4, yPosition + 1);

    // Summary count badges on the right (like app: "6M 4L")
    const badgeY = yPosition - 2.5;
    let badgeX = PAGE.width - PAGE.marginRight - 5;

    const renderCountBadge = (count: number, label: string, bgColor: string, textColor: string) => {
      if (count === 0) return;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      const badgeText = `${count}${label}`;
      const tw = doc.getTextWidth(badgeText) + 5;
      badgeX -= tw + 2;
      doc.setFillColor(bgColor);
      doc.roundedRect(badgeX, badgeY, tw, 7, 1.5, 1.5, 'F');
      doc.setTextColor(textColor);
      doc.text(badgeText, badgeX + tw / 2, badgeY + 4.8, { align: 'center' });
    };

    // Render badges right-to-left: L, M, H
    renderCountBadge(lCount, 'L', COLORS.blueLight, '#1e3a8a');
    renderCountBadge(mCount, 'M', COLORS.amberLight, '#78350f');
    renderCountBadge(hCount, 'H', COLORS.redLight, '#991b1b');

    yPosition += moduleCardHeight - 1;
    doc.setDrawColor(0, 0, 0);

    // Compact item renderer: a thin coloured marker per item, tight text,
    // no padded card. Condenses the findings list without losing colour coding.
    const renderActionSection = (
      items: CategorisedItem[],
      heading: string,
      headingColor: string,
      accentColor: string,
    ) => {
      if (items.length === 0) return;

      // Reserve heading + first line so a priority heading never orphans.
      checkNewPage(24);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(headingColor);
      doc.text(`${heading} (${items.length})`, PAGE.marginLeft + 6, yPosition + 1);
      yPosition += 8;

      const textX = PAGE.marginLeft + 11;
      const textW = PAGE.contentWidth - 13;
      for (const item of items) {
        const cleanText = stripSuffix(item.text);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(cleanText, textW);
        const lineH = 5.3;
        const blockH = lines.length * lineH;

        checkNewPage(blockH + 3);

        // Thin coloured marker down the left of the item
        doc.setFillColor(accentColor);
        doc.roundedRect(PAGE.marginLeft + 6, yPosition - 3.3, 1.8, blockH + 0.4, 0.8, 0.8, 'F');

        doc.setTextColor(COLORS.text);
        for (let i = 0; i < lines.length; i++) {
          doc.text(lines[i], textX, yPosition + i * lineH);
        }

        yPosition += blockH + 3;
      }

      yPosition += 2;
    };

    // High priority (red)
    renderActionSection(mod.highActions, 'High priority', '#991b1b', '#ef4444');

    // Medium priority (amber)
    renderActionSection(mod.mediumActions, 'Medium priority', '#78350f', '#d97706');

    // Low priority (blue)
    renderActionSection(mod.lowActions, 'Low priority', '#1e3a8a', '#3b82f6');

    // Areas to explore (violet - distinct from amber medium)
    renderActionSection(mod.explores, 'Areas to explore: from "Unable to check" responses', '#5b1897', '#8b5cf6');

    // Strengths (green - at end so actions come first)
    renderActionSection(mod.strengths, "What's going well", '#166534', '#22c55e');

    // 4mm extra space after each module's findings block
    yPosition += 4;
  }

  // Note about detailed recommendations in-app (info style, not section heading)
  yPosition += 4;
  checkNewPage(14);
  doc.setFillColor(240, 249, 255); // light blue bg
  doc.roundedRect(PAGE.marginLeft, yPosition - 3, PAGE.contentWidth, 14, 2, 2, 'F');
  doc.setDrawColor(180, 210, 240); // subtle blue border
  doc.setLineWidth(0.3);
  doc.roundedRect(PAGE.marginLeft, yPosition - 3, PAGE.contentWidth, 14, 2, 2, 'S');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(COLORS.gray);
  const noteLines = doc.splitTextToSize(
    'For detailed recommendations, action guides, and resource links for each item, refer to the in-app report.',
    PAGE.contentWidth - 12
  );
  for (let i = 0; i < noteLines.length; i++) {
    doc.text(noteLines[i], PAGE.marginLeft + 6, yPosition + 1 + i * 4);
  }
  doc.setDrawColor(0, 0, 0);
  yPosition += 18;

  // ============================================
  // GROUP 5: NEXT STEPS & GUIDANCE
  // ============================================
  addGroupHeader('Next Steps & Guidance');

  // ============================================
  // SUGGESTED NEXT STEPS
  // ============================================
  addSectionTitle('Suggested Next Steps');

  // Management-platform note: this assessment feeds the action plan
  {
    const noteText = 'The priority actions in this report can be added to your action plan in Access Compass, where each one can be assigned to a team, given a due date, tracked, evidenced and reported on over time. This assessment is the starting point. The platform helps you manage delivery.';
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(noteText, PAGE.contentWidth - 12);
    const boxH = lines.length * 4 + 8;
    checkNewPage(boxH + 6);
    doc.setFillColor(250, 247, 251);
    doc.roundedRect(PAGE.marginLeft, yPosition - 3, PAGE.contentWidth, boxH, 2, 2, 'F');
    doc.setFillColor(COLORS.amethystDiamond);
    doc.roundedRect(PAGE.marginLeft, yPosition - 3, 3, boxH, 2, 2, 'F');
    doc.setTextColor(COLORS.text);
    for (let i = 0; i < lines.length; i++) {
      doc.text(lines[i], PAGE.marginLeft + 6, yPosition + 2 + i * 4);
    }
    doc.setTextColor(0, 0, 0);
    yPosition += boxH + 4;
  }

  // "Things you can explore now" section
  checkNewPage(20);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#166534');
  doc.text('Things you can explore now', PAGE.marginLeft + 4, yPosition);
  yPosition += 7;

  for (const item of report.nextSteps.exploreNow) {
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(item, PAGE.contentWidth - 14);
    const itemHeight = lines.length * 5.3 + 6;
    checkNewPage(itemHeight);

    // Card with green left accent
    doc.setFillColor(245, 253, 247);
    doc.roundedRect(PAGE.marginLeft + 2, yPosition - 2, PAGE.contentWidth - 4, itemHeight - 2, 2, 2, 'F');
    doc.setFillColor(COLORS.green);
    doc.roundedRect(PAGE.marginLeft + 2, yPosition - 2, 2.5, itemHeight - 2, 1, 1, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLORS.text);
    for (let j = 0; j < lines.length; j++) {
      doc.text(lines[j], PAGE.marginLeft + 9, yPosition + 2 + j * 5.3);
    }
    yPosition += itemHeight;
  }
  yPosition += 4;

  // "Things to plan for later" section
  checkNewPage(20);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.amethystDiamond);
  doc.text('Things to plan for later', PAGE.marginLeft + 4, yPosition);
  yPosition += 7;

  for (const item of report.nextSteps.planForLater) {
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(item, PAGE.contentWidth - 14);
    const itemHeight = lines.length * 5.3 + 6;
    checkNewPage(itemHeight);

    // Card with purple left accent
    doc.setFillColor(248, 245, 255);
    doc.roundedRect(PAGE.marginLeft + 2, yPosition - 2, PAGE.contentWidth - 4, itemHeight - 2, 2, 2, 'F');
    doc.setFillColor(COLORS.amethystDiamond);
    doc.roundedRect(PAGE.marginLeft + 2, yPosition - 2, 2.5, itemHeight - 2, 1, 1, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLORS.text);
    for (let j = 0; j < lines.length; j++) {
      doc.text(lines[j], PAGE.marginLeft + 9, yPosition + 2 + j * 5.3);
    }
    yPosition += itemHeight;
  }
  yPosition += 5;

  // ============================================
  // PROFESSIONAL SUPPORT (grouped by expertise type)
  // ============================================
  addSectionTitle('Professional Support', COLORS.amethystLight);

  const profReviewItems = report.sections.professionalReview?.categorised || [];
  const expertiseGroups = groupProfessionalReviewByExpertise(profReviewItems);

  if (expertiseGroups.length > 0) {
    addParagraph(
      'Based on your responses, the following areas may benefit from specialist input. Items are grouped by the type of professional who can help.',
      9
    );

    for (const group of expertiseGroups) {
      checkNewPage(22);

      // Expertise type card
      doc.setFillColor(248, 240, 252); // light purple bg
      const descLines = doc.splitTextToSize(group.description, PAGE.contentWidth - 14);
      const cardHeight = 8 + descLines.length * 3.8 + 4;
      doc.roundedRect(PAGE.marginLeft, yPosition, PAGE.contentWidth, cardHeight, 2, 2, 'F');

      // Left accent
      doc.setFillColor(COLORS.amethystLight);
      doc.roundedRect(PAGE.marginLeft, yPosition, 3, cardHeight, 1, 1, 'F');

      // Label + module codes
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(COLORS.amethystDiamond);
      doc.text(group.label, PAGE.marginLeft + 7, yPosition + 5);

      // Module codes badge inline
      const codesText = `(${group.moduleCodes.join(', ')})`;
      const labelWidth = doc.getTextWidth(group.label);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(COLORS.gray);
      doc.text(codesText, PAGE.marginLeft + 7 + labelWidth + 2, yPosition + 5);

      // Description
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(COLORS.textSecondary);
      let descY = yPosition + 9;
      for (const line of descLines) {
        doc.text(line, PAGE.marginLeft + 7, descY);
        descY += 3.8;
      }

      yPosition += cardHeight + 4;
    }
  } else {
    addParagraph(
      'No specific areas requiring specialist support were identified based on your current responses. As you progress through more modules, this section will update accordingly.',
      9
    );
  }

  // Flare Access CTA card
  checkNewPage(24);
  doc.setFillColor(73, 14, 103); // amethystDiamond
  doc.roundedRect(PAGE.marginLeft, yPosition, PAGE.contentWidth, 20, 3, 3, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text(FLARE_CONTACT.label, PAGE.marginLeft + 8, yPosition + 7);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 144, 21); // brand orange
  doc.text(FLARE_CONTACT.email, PAGE.marginLeft + 8, yPosition + 14);
  const emailWidth = doc.getTextWidth(FLARE_CONTACT.email);
  doc.setTextColor(255, 255, 255);
  doc.text('  |  ', PAGE.marginLeft + 8 + emailWidth, yPosition + 14);
  doc.setTextColor(255, 144, 21);
  doc.text(FLARE_CONTACT.website, PAGE.marginLeft + 8 + emailWidth + doc.getTextWidth('  |  '), yPosition + 14);

  doc.setTextColor(0, 0, 0);
  yPosition += 26;

  // Assessment evidence sits at the back as an appendix (proof of what was
  // reviewed, by whom), out of the executive flow.
  renderAssessmentEvidence();

  // ============================================
  // DISCLAIMER
  // ============================================
  addSectionTitle('Important Disclaimer', '#92400e');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const disclaimerLines = doc.splitTextToSize(
    'This guidance is for information only. It is not legal advice, a compliance certificate, or a substitute for professional accessibility auditing. Actions are suggestions based on your responses. This review is indicative only and based on self-reported information. It does not verify accuracy or confirm compliance with accessibility standards or legal requirements.',
    PAGE.contentWidth - 12
  );
  const disclaimerBoxH = disclaimerLines.length * 5 + 8;

  checkNewPage(disclaimerBoxH + 4);
  doc.setFillColor(255, 251, 235);
  doc.roundedRect(PAGE.marginLeft, yPosition, PAGE.contentWidth, disclaimerBoxH, 2, 2, 'F');
  // Dark amber left accent bar for contrast
  doc.setFillColor('#92400e');
  doc.roundedRect(PAGE.marginLeft, yPosition, 3, disclaimerBoxH, 1, 1, 'F');
  // Subtle border
  doc.setDrawColor(217, 119, 6); // amber-600
  doc.setLineWidth(0.3);
  doc.roundedRect(PAGE.marginLeft, yPosition, PAGE.contentWidth, disclaimerBoxH, 2, 2, 'S');

  yPosition += 6;
  doc.setTextColor(COLORS.text); // dark text for contrast on light yellow bg
  disclaimerLines.forEach((line: string) => {
    doc.text(line, PAGE.marginLeft + 7, yPosition);
    yPosition += 5;
  });
  doc.setDrawColor(0, 0, 0);

  // Add final footer
  addFooter();

  // Second pass: stamp the real page number next to each contents-page line,
  // now that every section's page is known.
  for (const e of tocEntries) {
    const p = sectionPages.get(e.title);
    if (!p) continue;
    doc.setPage(e.page);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.amethystDiamond);
    doc.text(String(p), PAGE.width - PAGE.marginRight, e.y, { align: 'right' });
  }
  // Return to the last page before the footer numbering pass.
  doc.setPage(doc.getNumberOfPages());
  doc.setTextColor(0, 0, 0);

  // Second pass: overwrite page numbers with "Page X of Y".
  // Skip page 1 (the cover) so no footer box is drawn over the title art.
  const totalPages = doc.getNumberOfPages();
  for (let i = 2; i <= totalPages; i++) {
    doc.setPage(i);
    const footerY = PAGE.height - 12;

    // Clear the old page number area
    doc.setFillColor(250, 248, 245); // ivory (matches footer bg)
    doc.rect(PAGE.width - PAGE.marginRight - 30, footerY - 3, 32, 8, 'F');

    // Write updated page number
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(`Page ${i} of ${totalPages}`, PAGE.width - PAGE.marginRight, footerY, { align: 'right' });
  }

  return doc;
}

/**
 * Download the PDF report
 */
export function downloadPDFReport(report: Report): void {
  const doc = generatePDFReport({ report });
  const scope = report.siteName ? `${report.siteName.replace(/[^a-z0-9]/gi, '-')}-` : '';
  const fileName = `${report.organisation.replace(/[^a-z0-9]/gi, '-')}-${scope}accessibility-report-${
    new Date().toISOString().split('T')[0]
  }.pdf`;
  doc.save(fileName);
}

/**
 * Download a one-page executive summary. For board-level audiences who
 * want the headline, not the workpaper.
 */
export function downloadExecutiveSummaryPDF(report: Report): void {
  const doc = generatePDFReport({ report, summaryOnly: true, includeTableOfContents: false, includeCoverPage: false });
  const scope = report.siteName ? `${report.siteName.replace(/[^a-z0-9]/gi, '-')}-` : '';
  const fileName = `${report.organisation.replace(/[^a-z0-9]/gi, '-')}-${scope}executive-summary-${
    new Date().toISOString().split('T')[0]
  }.pdf`;
  doc.save(fileName);
}

// Helper function to format analysis type
function formatAnalysisType(analysisType: string): string {
  const labels: Record<string, string> = {
    menu: 'Menu',
    brochure: 'Brochure',
    flyer: 'Flyer',
    'large-print': 'Large Print',
    signage: 'Signage',
    lighting: 'Lighting',
    'ground-surface': 'Ground Surface',
    pathway: 'Pathway',
    entrance: 'Entrance',
    ramp: 'Ramp',
    stairs: 'Stairs',
    door: 'Door',
    'social-media-post': 'Social Media Post',
    'social-media-url': 'Social Media Profile',
    'website-wave': 'Website Audit',
  };
  return labels[analysisType] || analysisType;
}
