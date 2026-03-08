/**
 * PDF Report Generator
 *
 * Generates professionally formatted PDF reports using jsPDF.
 * Includes headers, footers, page numbers, and proper formatting.
 */

import jsPDF from 'jspdf';
import type { Report, CategorisedItem } from '../hooks/useReportGeneration';
import { accessModules, moduleGroups } from '../data/accessModules';
import { groupProfessionalReviewByExpertise, FLARE_CONTACT } from './professionalSupportGroups';

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
  const { report, includeCoverPage = true, includeTableOfContents = true } = options;
  const doc = new jsPDF('p', 'mm', 'a4');

  let currentPage = 1;
  let yPosition = PAGE.marginTop;

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

  // Helper: Add group header (left-border accent style matching app)
  const addGroupHeader = (title: string, isFindings: boolean = false) => {
    checkNewPage(40);

    // Add extra spacing before groups (except if at top of page)
    if (yPosition > PAGE.marginTop + 5) {
      yPosition += 10;
      checkNewPage(40);
    }

    if (isFindings) {
      // Findings group headers: light ivory bg with purple left accent bar (matching app)
      doc.setFillColor(250, 248, 245); // ivory bg
      doc.roundedRect(PAGE.marginLeft - 3, yPosition - 4, PAGE.contentWidth + 6, 10, 2, 2, 'F');

      // Purple left accent bar
      doc.setFillColor(73, 14, 103); // amethystDiamond
      doc.roundedRect(PAGE.marginLeft - 3, yPosition - 4, 3, 10, 2, 2, 'F');

      // Dark text
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(COLORS.text);
      doc.text(title, PAGE.marginLeft + 5, yPosition + 3);
    } else {
      // Non-findings group headers: full purple band (Overview, Evidence, etc.)
      doc.setFillColor(73, 14, 103); // amethystDiamond
      doc.roundedRect(PAGE.marginLeft - 3, yPosition - 4, PAGE.contentWidth + 6, 10, 2, 2, 'F');

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(title, PAGE.marginLeft + 4, yPosition + 3);
    }

    yPosition += 14;
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
  };

  // Helper: Add section title with visual depth (11pt, not 13pt)
  const addSectionTitle = (title: string, accentColor: string = COLORS.amethystDiamond) => {
    checkNewPage(20);

    // Background bar for section header
    doc.setFillColor(250, 248, 245); // ivory
    doc.roundedRect(PAGE.marginLeft - 3, yPosition - 5, PAGE.contentWidth + 6, 14, 2, 2, 'F');

    // Left accent bar
    doc.setFillColor(accentColor);
    doc.roundedRect(PAGE.marginLeft - 3, yPosition - 5, 3, 14, 1, 1, 'F');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(accentColor);
    doc.text(title, PAGE.marginLeft + 4, yPosition + 4);
    yPosition += 16;

    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
  };

  // Helper: Add paragraph text with word wrapping
  const addParagraph = (text: string, fontSize: number = 9) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, PAGE.contentWidth);
    const lineHeight = fontSize * 0.4;

    for (const line of lines) {
      checkNewPage(lineHeight + 2);
      doc.text(line, PAGE.marginLeft, yPosition);
      yPosition += lineHeight + 1;
    }
    yPosition += 3;
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

    // White background with subtle border
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, y, width, 28, 3, 3, 'F');

    // Light border
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, width, 28, 3, 3, 'S');

    // Colored left border (3px)
    doc.setFillColor(borderColor);
    doc.roundedRect(x, y, 3, 28, 2, 0, 'F');
    doc.rect(x + 1, y, 2, 28, 'F');

    // Value in contrast-safe color
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(numColor);
    doc.text(value, x + width / 2, y + 13, { align: 'center' });

    // Label in dark gray below
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text(label, x + width / 2, y + 21, { align: 'center' });

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
    // Deep purple background with simulated gradient
    doc.setFillColor(58, 11, 82); // amethystDark
    doc.rect(0, 0, PAGE.width, PAGE.height, 'F');

    // Lighter purple overlay for gradient effect (right side)
    doc.setFillColor(73, 14, 103); // amethystDiamond
    doc.rect(PAGE.width * 0.3, 0, PAGE.width * 0.7, PAGE.height * 0.5, 'F');

    // Decorative light ellipse effect (simulated with rect)
    doc.setFillColor(91, 24, 151); // lighter purple
    doc.ellipse(PAGE.width * 0.8, PAGE.height * 0.2, 60, 80, 'F');

    // Orange accent bar (brand orange)
    doc.setFillColor(255, 144, 21); // brand orange
    doc.rect(0, PAGE.height * 0.42, PAGE.width, 4, 'F');

    // Secondary thin accent
    doc.setFillColor(255, 144, 21); // brand orange
    doc.rect(0, PAGE.height * 0.42 + 4, PAGE.width * 0.4, 1, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold');
    doc.text('Accessibility', PAGE.width / 2, PAGE.height * 0.28, { align: 'center' });
    doc.text('Self-Review Report', PAGE.width / 2, PAGE.height * 0.28 + 16, { align: 'center' });

    // Report type badge (dark text on light amber for contrast)
    const reportTypeText =
      report.reportType === 'pulse-check' ? 'Pulse Check' : 'Deep Dive';
    doc.setFillColor(255, 237, 200); // light amber bg
    const badgeWidth = 50;
    doc.roundedRect(PAGE.width / 2 - badgeWidth / 2, PAGE.height * 0.5 - 5, badgeWidth, 12, 3, 3, 'F');
    doc.setDrawColor(224, 125, 0); // aussieDark border
    doc.setLineWidth(0.5);
    doc.roundedRect(PAGE.width / 2 - badgeWidth / 2, PAGE.height * 0.5 - 5, badgeWidth, 12, 3, 3, 'S');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(120, 53, 0); // dark amber text for contrast
    doc.text(reportTypeText, PAGE.width / 2, PAGE.height * 0.5 + 3, { align: 'center' });
    doc.setDrawColor(0, 0, 0);

    // Organisation name with background card
    doc.setFillColor(255, 255, 255);
    const orgCardHeight = 35;
    doc.roundedRect(PAGE.marginLeft + 10, PAGE.height * 0.56, PAGE.contentWidth - 20, orgCardHeight, 4, 4, 'F');

    // Purple accent on org card
    doc.setFillColor(73, 14, 103);
    doc.roundedRect(PAGE.marginLeft + 10, PAGE.height * 0.56, 4, orgCardHeight, 2, 2, 'F');

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(73, 14, 103); // amethystDiamond
    doc.text(report.organisation, PAGE.width / 2, PAGE.height * 0.56 + 15, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(
      `Generated: ${new Date(report.generatedAt).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}`,
      PAGE.width / 2,
      PAGE.height * 0.56 + 26,
      { align: 'center' }
    );

    // Branding at bottom
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(PAGE.width / 2 - 40, PAGE.height * 0.84, 80, 20, 3, 3, 'F');

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(73, 14, 103);
    doc.text('Access Compass', PAGE.width / 2, PAGE.height * 0.84 + 9, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('by Flare Access', PAGE.width / 2, PAGE.height * 0.84 + 15, { align: 'center' });

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

    const tocGroups: { group: string; items: string[] }[] = [
      {
        group: 'Overview',
        items: [
          'Executive Summary',
          'About This Report',
          'Your Obligations',
          ...(report.progressComparison?.enabled ? ['Progress Comparison'] : []),
        ],
      },
      {
        group: 'Assessment Evidence',
        items: [
          ...(report.moduleEvidence?.length ? ['Modules Reviewed'] : []),
          ...(report.questionNotes?.length ? ['Your Notes & Observations'] : []),
          ...(report.questionEvidence?.length ? ['Supporting Evidence'] : []),
        ],
      },
      ...(hasAnalysisData
        ? [{
            group: 'Analysis Results',
            items: [
              ...(report.urlAnalysisResults?.length ? ['Website Accessibility Analysis'] : []),
              ...(report.mediaAnalysisResults?.length ? ['Media Analysis Results'] : []),
            ],
          }]
        : []),
      {
        group: 'Key Findings',
        items: (() => {
          // List modules that have findings
          const modCodes = new Set<string>();
          for (const s of [
            ...(report.sections.strengths.categorised || []),
            ...(report.sections.priorityActions.categorised || []),
            ...(report.sections.areasToExplore.categorised || []),
          ]) {
            modCodes.add(s.moduleCode);
          }
          const sorted = Array.from(modCodes).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
          return sorted.map(code => {
            const mod = accessModules.find(m => m.code === code);
            return `${code}  ${mod?.name || code}`;
          });
        })(),
      },
      {
        group: 'Next Steps & Guidance',
        items: [
          'Suggested Next Steps',
          'Professional Support',
          'Compliance Note',
          'Disclaimer',
        ],
      },
    ];

    tocGroups.forEach((tocGroup) => {
      if (tocGroup.items.length === 0) return;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(COLORS.amethystDiamond);
      doc.text(tocGroup.group, PAGE.marginLeft + 3, yPosition);
      yPosition += 6;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      tocGroup.items.forEach((item) => {
        doc.text(item, PAGE.marginLeft + 10, yPosition);
        yPosition += 6;
      });
      yPosition += 2;
    });

    addFooter();
    addNewPage();
  }

  // ============================================
  // GROUP 1: OVERVIEW
  // ============================================
  addGroupHeader('Overview');
  addSectionTitle('Executive Summary');

  // Stats boxes with clean style (white bg, colored left border)
  const boxWidth = 38;
  const boxGap = 6;
  const startX = PAGE.marginLeft;

  checkNewPage(40);

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
    'Areas to Explore',
    COLORS.amber,
    '#92400e'
  );

  yPosition += 38;

  // ============================================
  // INTRODUCTION
  // ============================================
  addSectionTitle('About This Report');

  const reportTypeIntro = report.reportType === 'pulse-check'
    ? 'a pulse check, providing a high-level snapshot of current accessibility across selected areas'
    : 'an accessibility review covering detailed findings across selected accessibility areas';

  addParagraph(
    `This report summarises the findings of ${reportTypeIntro} conducted using Access Compass. Findings are benchmarked against the Disability (Access to Premises-Buildings) Standards 2010, the National Construction Code, relevant Australian Standards including AS 1428.1, and the Web Content Accessibility Guidelines (WCAG) 2.2 for digital content. Recommendations that extend beyond mandatory compliance are identified as best practice.`,
    9
  );

  addSectionTitle('Your Obligations', COLORS.amethystLight);

  addParagraph(
    'All organisations have responsibilities under the Disability Discrimination Act 1992 to provide equitable and dignified access to premises, goods and services. Disability is broadly defined and includes physical, intellectual, sensory, neurological, cognitive and psychosocial conditions.',
    9
  );
  addParagraph(
    'The Disability (Access to Premises-Buildings) Standards 2010 set minimum access requirements for new buildings and those undergoing significant upgrade or refurbishment. Mandatory compliance requirements are triggered when building work requires development approval. However, organisations can voluntarily make accessibility improvements at any time. Elements not covered by the Premises Standards remain subject to the broader provisions of the DDA.',
    9
  );
  addParagraph(
    'Regardless of whether building work is planned, any person with disability may lodge a complaint under the DDA if they experience discrimination in accessing premises, goods or services. Proactively addressing accessibility barriers reduces this risk and demonstrates a commitment to equitable access.',
    9
  );

  // ============================================
  // GROUP 2: ASSESSMENT EVIDENCE
  // ============================================
  addGroupHeader('Assessment Evidence');

  // ============================================
  // MODULES REVIEWED
  // ============================================
  if (report.moduleEvidence && report.moduleEvidence.length > 0) {
    addSectionTitle('Modules Reviewed');

    report.moduleEvidence.forEach((evidence) => {
      checkNewPage(28);

      // Module card with shadow effect
      doc.setFillColor(220, 220, 220);
      doc.roundedRect(PAGE.marginLeft + 1, yPosition, PAGE.contentWidth, 22, 3, 3, 'F');

      // Card background (warm ivory)
      doc.setFillColor(250, 248, 245);
      doc.roundedRect(PAGE.marginLeft, yPosition - 1, PAGE.contentWidth, 22, 3, 3, 'F');

      // Left accent bar (purple)
      doc.setFillColor(73, 14, 103); // amethystDiamond
      doc.roundedRect(PAGE.marginLeft, yPosition - 1, 3, 22, 2, 2, 'F');

      // Module code badge (light purple bg, purple text - matching app)
      doc.setFillColor(240, 233, 245);
      doc.roundedRect(PAGE.marginLeft + 8, yPosition + 3, 18, 7, 2, 2, 'F');
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(73, 14, 103);
      doc.text(evidence.moduleCode, PAGE.marginLeft + 17, yPosition + 8, { align: 'center' });

      // Module name
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(58, 11, 82); // amethystDark
      doc.text(evidence.moduleName, PAGE.marginLeft + 30, yPosition + 8);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(COLORS.gray);

      let metaText = '';
      if (evidence.completedAt) {
        metaText += `${new Date(evidence.completedAt).toLocaleDateString('en-AU')}`;
      }
      if (evidence.completedBy) {
        metaText += metaText ? ' · ' : '';
        metaText += evidence.completedBy;
      }
      if (metaText) {
        doc.text(metaText, PAGE.marginLeft + 30, yPosition + 15);
      }

      // Stats badges (contrast-safe text colors)
      doc.setFillColor(220, 252, 231); // greenLight
      doc.roundedRect(PAGE.width - PAGE.marginRight - 52, yPosition + 3, 24, 7, 2, 2, 'F');
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor('#15803d'); // dark green for contrast on light green bg
      doc.text(`${evidence.strengthsCount} good`, PAGE.width - PAGE.marginRight - 40, yPosition + 8, { align: 'center' });

      doc.setFillColor(254, 226, 226); // redLight
      doc.roundedRect(PAGE.width - PAGE.marginRight - 26, yPosition + 3, 24, 7, 2, 2, 'F');
      doc.setTextColor('#991b1b'); // dark red for contrast on light red bg
      doc.text(`${evidence.actionsCount} action`, PAGE.width - PAGE.marginRight - 14, yPosition + 8, { align: 'center' });

      doc.setTextColor(0, 0, 0);
      yPosition += 28;
    });
    yPosition += 5;
  }

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
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.amethystDiamond);
  doc.text('Understanding Priority Levels', PAGE.marginLeft, yPosition);
  yPosition += 7;

  const legendItems: { label: string; color: string; desc: string }[] = [
    { label: 'High', color: '#b91c1c', desc: 'Gaps in mandatory compliance requirements (Premises Standards, WCAG, NCC) and safety-related items. Highest legal and safety risk.' },
    { label: 'Medium', color: '#945a00', desc: 'High-impact improvements that significantly affect the experience of people with disability, and items needing further investigation.' },
    { label: 'Low', color: '#1a4fd6', desc: 'Best-practice improvements that make a real, meaningful difference. Not less important, just lower legal risk.' },
  ];
  for (const item of legendItems) {
    // Label in priority color
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(item.color);
    doc.text(`${item.label}`, PAGE.marginLeft + 4, yPosition);
    yPosition += 4;

    // Description wrapped
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLORS.gray);
    const descLines = doc.splitTextToSize(item.desc, PAGE.contentWidth - 10);
    for (const line of descLines) {
      checkNewPage(4);
      doc.text(line, PAGE.marginLeft + 4, yPosition);
      yPosition += 3.5;
    }
    yPosition += 2;
  }
  yPosition += 2;

  // Encouragement text (shown once)
  checkNewPage(14);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(COLORS.gray);
  const encLines = doc.splitTextToSize(
    'Every action here is worth doing. Priority levels help you decide where to start, not what to skip. Even "low" priority items can have a meaningful impact on someone\'s experience. Start wherever you can and build from there.',
    PAGE.contentWidth - 8
  );
  for (const line of encLines) {
    checkNewPage(5);
    doc.text(line, PAGE.marginLeft + 4, yPosition);
    yPosition += 4;
  }
  yPosition += 6;

  // Render per-module findings grouped by category
  let lastGroup = '';

  for (const mod of allModules) {
    // Group header when entering a new group (findings style)
    if (mod.group !== lastGroup) {
      lastGroup = mod.group;
      addGroupHeader(getGroupLabel(mod.group), true);
    }

    // 6mm space before module card
    yPosition += 6;
    checkNewPage(25);

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
    const moduleCardHeight = 12;
    doc.roundedRect(PAGE.marginLeft + 2, moduleCardTop, PAGE.contentWidth - 2, moduleCardHeight, 2, 2, 'S');
    // Purple left accent
    doc.setFillColor(COLORS.amethystDiamond);
    doc.roundedRect(PAGE.marginLeft, moduleCardTop, 3, moduleCardHeight, 2, 2, 'F');

    // Module code badge (light purple bg, purple text)
    doc.setFillColor(240, 233, 245);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    const codeWidth = doc.getTextWidth(mod.moduleCode) + 5;
    const badgeW = Math.max(codeWidth, 14);
    doc.roundedRect(PAGE.marginLeft + 8, yPosition - 2.5, badgeW, 6, 2, 2, 'F');
    doc.setTextColor(COLORS.amethystDiamond);
    doc.text(mod.moduleCode, PAGE.marginLeft + 8 + badgeW / 2, yPosition + 1.5, { align: 'center' });

    // Module name
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.text);
    doc.text(mod.moduleName, PAGE.marginLeft + 8 + badgeW + 3, yPosition + 1.5);

    // Summary count badges on the right (like app: "6M 4L")
    const badgeY = yPosition - 1.5;
    let badgeX = PAGE.width - PAGE.marginRight - 5;

    const renderCountBadge = (count: number, label: string, bgColor: string, textColor: string) => {
      if (count === 0) return;
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      const badgeText = `${count}${label}`;
      const tw = doc.getTextWidth(badgeText) + 4;
      badgeX -= tw + 2;
      doc.setFillColor(bgColor);
      doc.roundedRect(badgeX, badgeY, tw, 5, 1.5, 1.5, 'F');
      doc.setTextColor(textColor);
      doc.text(badgeText, badgeX + tw / 2, badgeY + 3.5, { align: 'center' });
    };

    // Render badges right-to-left: L, M, H
    renderCountBadge(lCount, 'L', COLORS.blueLight, '#1e3a8a');
    renderCountBadge(mCount, 'M', COLORS.amberLight, '#78350f');
    renderCountBadge(hCount, 'H', COLORS.redLight, '#991b1b');

    yPosition += moduleCardHeight - 1;
    doc.setDrawColor(0, 0, 0);

    // Card-style item renderer: colored left-border cards (matching app)
    const renderCardSection = (
      items: CategorisedItem[],
      heading: string,
      headingColor: string,
      cardBg: [number, number, number],
      accentColor: string,
    ) => {
      if (items.length === 0) return;

      // Section heading (colored text, no background bar)
      checkNewPage(14);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(headingColor);
      doc.text(`${heading} (${items.length})`, PAGE.marginLeft + 6, yPosition + 1);
      yPosition += 6;

      // Individual cards with left-border accent
      const cardLeft = PAGE.marginLeft + 4;
      const cardWidth = PAGE.contentWidth - 6;
      const textInset = 8; // text offset from card left edge

      for (const item of items) {
        const cleanText = stripSuffix(item.text);
        doc.setFontSize(9);
        const lines = doc.splitTextToSize(cleanText, cardWidth - textInset - 4);
        const lineHeight = 4.2;
        const cardPadY = 3;
        const cardHeight = lines.length * lineHeight + cardPadY * 2;

        checkNewPage(cardHeight + 2);

        // Card background
        doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
        doc.roundedRect(cardLeft, yPosition, cardWidth, cardHeight, 2, 2, 'F');

        // Left accent border
        doc.setFillColor(accentColor);
        doc.roundedRect(cardLeft, yPosition, 2.5, cardHeight, 1, 1, 'F');

        // Text
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(COLORS.text);
        for (let i = 0; i < lines.length; i++) {
          doc.text(lines[i], cardLeft + textInset, yPosition + cardPadY + (i * lineHeight) + 3);
        }

        yPosition += cardHeight + 2; // 2mm gap between cards
      }

      yPosition += 2;
    };

    // Strengths (green cards)
    renderCardSection(
      mod.strengths,
      "What's going well",
      '#166534',
      [236, 253, 243],     // light mint bg
      '#22c55e',           // green accent
    );

    // High priority (red cards)
    renderCardSection(
      mod.highActions,
      'High priority',
      '#991b1b',
      [255, 241, 241],     // light red bg
      '#ef4444',           // red accent
    );

    // Medium priority (amber cards)
    renderCardSection(
      mod.mediumActions,
      'Medium priority',
      '#78350f',
      [255, 249, 235],     // light amber bg
      '#d97706',           // amber accent
    );

    // Low priority (blue cards)
    renderCardSection(
      mod.lowActions,
      'Low priority',
      '#1e3a8a',
      [239, 246, 255],     // light blue bg
      '#3b82f6',           // blue accent
    );

    // Areas to explore (purple/violet cards - distinct from amber medium)
    renderCardSection(
      mod.explores,
      'Areas to explore',
      '#5b1897',
      [245, 240, 255],     // light violet bg
      '#8b5cf6',           // violet accent
    );

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

  // "Things you can explore now" section
  checkNewPage(20);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#166534');
  doc.text('Things you can explore now', PAGE.marginLeft + 4, yPosition);
  yPosition += 6;

  for (const item of report.nextSteps.exploreNow) {
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(item, PAGE.contentWidth - 14);
    const itemHeight = lines.length * 4.2 + 6;
    checkNewPage(itemHeight);

    // Card with green left accent
    doc.setFillColor(245, 253, 247);
    doc.roundedRect(PAGE.marginLeft + 2, yPosition - 2, PAGE.contentWidth - 4, itemHeight - 2, 2, 2, 'F');
    doc.setFillColor(COLORS.green);
    doc.roundedRect(PAGE.marginLeft + 2, yPosition - 2, 2.5, itemHeight - 2, 1, 1, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLORS.text);
    for (let j = 0; j < lines.length; j++) {
      doc.text(lines[j], PAGE.marginLeft + 9, yPosition + 2 + j * 4.2);
    }
    yPosition += itemHeight;
  }
  yPosition += 4;

  // "Things to plan for later" section
  checkNewPage(20);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.amethystDiamond);
  doc.text('Things to plan for later', PAGE.marginLeft + 4, yPosition);
  yPosition += 6;

  for (const item of report.nextSteps.planForLater) {
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(item, PAGE.contentWidth - 14);
    const itemHeight = lines.length * 4.2 + 6;
    checkNewPage(itemHeight);

    // Card with purple left accent
    doc.setFillColor(248, 245, 255);
    doc.roundedRect(PAGE.marginLeft + 2, yPosition - 2, PAGE.contentWidth - 4, itemHeight - 2, 2, 2, 'F');
    doc.setFillColor(COLORS.amethystDiamond);
    doc.roundedRect(PAGE.marginLeft + 2, yPosition - 2, 2.5, itemHeight - 2, 1, 1, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLORS.text);
    for (let j = 0; j < lines.length; j++) {
      doc.text(lines[j], PAGE.marginLeft + 9, yPosition + 2 + j * 4.2);
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

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(FLARE_CONTACT.label, PAGE.marginLeft + 8, yPosition + 6);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text(FLARE_CONTACT.description, PAGE.marginLeft + 8, yPosition + 12);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 144, 21); // brand orange
  doc.text(FLARE_CONTACT.email, PAGE.marginLeft + 8, yPosition + 17);
  const emailWidth = doc.getTextWidth(FLARE_CONTACT.email);
  doc.setTextColor(255, 255, 255);
  doc.text('  |  ', PAGE.marginLeft + 8 + emailWidth, yPosition + 17);
  doc.setTextColor(255, 144, 21);
  doc.text(FLARE_CONTACT.website, PAGE.marginLeft + 8 + emailWidth + doc.getTextWidth('  |  '), yPosition + 17);

  doc.setTextColor(0, 0, 0);
  yPosition += 26;

  // ============================================
  // DISCLAIMER
  // ============================================
  addSectionTitle('Important Disclaimer', '#92400e');

  checkNewPage(30);
  doc.setFillColor(255, 251, 235);
  doc.roundedRect(PAGE.marginLeft, yPosition, PAGE.contentWidth, 35, 2, 2, 'F');
  // Dark amber left accent bar for contrast
  doc.setFillColor('#92400e');
  doc.roundedRect(PAGE.marginLeft, yPosition, 3, 35, 1, 1, 'F');
  // Subtle border
  doc.setDrawColor(217, 119, 6); // amber-600
  doc.setLineWidth(0.3);
  doc.roundedRect(PAGE.marginLeft, yPosition, PAGE.contentWidth, 35, 2, 2, 'S');

  yPosition += 5;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(COLORS.text); // dark text for contrast on light yellow bg

  const disclaimerLines = doc.splitTextToSize(
    'This guidance is for information only. It is not legal advice, a compliance certificate, or a substitute for professional accessibility auditing. Actions are suggestions based on your responses. This review is indicative only and based on self-reported information. It does not verify accuracy or confirm compliance with accessibility standards or legal requirements.',
    PAGE.contentWidth - 12
  );

  disclaimerLines.forEach((line: string) => {
    doc.text(line, PAGE.marginLeft + 7, yPosition);
    yPosition += 4;
  });
  doc.setDrawColor(0, 0, 0);

  // Add final footer
  addFooter();

  // Second pass: overwrite page numbers with "Page X of Y"
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
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
  const fileName = `${report.organisation.replace(/[^a-z0-9]/gi, '-')}-accessibility-report-${
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
