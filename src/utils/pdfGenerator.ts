/**
 * PDF Report Generator
 *
 * Generates professionally formatted PDF reports using jsPDF.
 * Includes headers, footers, page numbers, and proper formatting.
 */

import jsPDF from 'jspdf';
import type { Report } from '../hooks/useReportGeneration';

// Brand Colors - matching Access Compass design system
const COLORS = {
  // Primary brand
  amethystDark: '#3a0b52',
  amethystDiamond: '#490E67',
  amethystLight: '#6b21a8',
  // Accent
  aussieDark: '#CC7700',
  aussieLight: '#e68a00',
  // Status
  green: '#22c55e',
  greenLight: '#dcfce7',
  red: '#ef4444',
  redLight: '#fee2e2',
  amber: '#f59e0b',
  amberLight: '#fef3c7',
  // Neutrals
  gray: '#6b7280',
  grayLight: '#9ca3af',
  ivory: '#FAF8F5',
  ivoryDark: '#f0ede8',
  text: '#1a1a2e',
  textSecondary: '#4a4a4a',
};

// Page dimensions (A4)
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

    // Orange accent line at bottom
    doc.setFillColor(204, 119, 0); // aussieDark
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

  // Helper: Check if we need a new page
  const checkNewPage = (neededHeight: number) => {
    if (yPosition + neededHeight > PAGE.height - PAGE.marginBottom) {
      addFooter();
      addNewPage();
      return true;
    }
    return false;
  };

  // Helper: Add section title with visual depth
  const addSectionTitle = (title: string, accentColor: string = COLORS.amethystDiamond) => {
    checkNewPage(20);

    // Background bar for section header
    doc.setFillColor(250, 248, 245); // ivory
    doc.roundedRect(PAGE.marginLeft - 3, yPosition - 5, PAGE.contentWidth + 6, 14, 2, 2, 'F');

    // Left accent bar
    doc.setFillColor(accentColor);
    doc.roundedRect(PAGE.marginLeft - 3, yPosition - 5, 3, 14, 1, 1, 'F');

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(accentColor);
    doc.text(title, PAGE.marginLeft + 4, yPosition + 4);
    yPosition += 16;

    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
  };

  // Helper: Add paragraph text with word wrapping
  const addParagraph = (text: string, fontSize: number = 10) => {
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
    doc.setFontSize(10);
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

  // Helper: Add stat box with depth
  const addStatBox = (
    x: number,
    y: number,
    width: number,
    value: string,
    label: string,
    bgColor: string,
    accentColor?: string
  ) => {
    // Shadow effect (lighter rect behind)
    doc.setFillColor(200, 200, 200);
    doc.roundedRect(x + 1, y + 1, width, 28, 4, 4, 'F');

    // Main background
    doc.setFillColor(bgColor);
    doc.roundedRect(x, y, width, 28, 4, 4, 'F');

    // Top accent bar
    if (accentColor) {
      doc.setFillColor(accentColor);
      doc.roundedRect(x, y, width, 3, 4, 4, 'F');
      doc.rect(x, y + 2, width, 2, 'F'); // Fill the bottom corners
    }

    // Value
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(value, x + width / 2, y + 14, { align: 'center' });

    // Label
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 255, 255);
    doc.text(label, x + width / 2, y + 22, { align: 'center' });

    doc.setTextColor(0, 0, 0);
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

    // Orange accent bar
    doc.setFillColor(204, 119, 0); // aussieDark
    doc.rect(0, PAGE.height * 0.42, PAGE.width, 4, 'F');

    // Secondary thin accent
    doc.setFillColor(230, 138, 0); // aussieLight
    doc.rect(0, PAGE.height * 0.42 + 4, PAGE.width * 0.4, 1, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold');
    doc.text('Accessibility', PAGE.width / 2, PAGE.height * 0.28, { align: 'center' });
    doc.text('Self-Review Report', PAGE.width / 2, PAGE.height * 0.28 + 16, { align: 'center' });

    // Report type badge
    const reportTypeText =
      report.reportType === 'pulse-check' ? 'Pulse Check' : 'Deep Dive';
    doc.setFillColor(204, 119, 0); // aussieDark
    const badgeWidth = 50;
    doc.roundedRect(PAGE.width / 2 - badgeWidth / 2, PAGE.height * 0.5 - 5, badgeWidth, 12, 3, 3, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(reportTypeText, PAGE.width / 2, PAGE.height * 0.5 + 3, { align: 'center' });

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

    const tocItems = [
      'Executive Summary',
      'Modules Reviewed',
      report.urlAnalysisResults?.length ? 'Website Accessibility Analysis' : null,
      report.mediaAnalysisResults?.length ? 'Media Analysis Results' : null,
      "What's Going Well",
      'Priority Actions',
      report.quickWins?.length ? 'Quick Wins' : null,
      'Areas to Explore',
      'Detailed Findings',
      'Suggested Next Steps',
      'Professional Support',
      'Disclaimer',
    ].filter(Boolean) as string[];

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    tocItems.forEach((item, index) => {
      doc.text(`${index + 1}. ${item}`, PAGE.marginLeft + 5, yPosition);
      yPosition += 7;
    });

    addFooter();
    addNewPage();
  }

  // ============================================
  // EXECUTIVE SUMMARY
  // ============================================
  addSectionTitle('Executive Summary');

  // Stats boxes with brand colors
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
    COLORS.amethystDiamond,
    COLORS.aussieDark
  );
  addStatBox(
    startX + boxWidth + boxGap,
    yPosition,
    boxWidth,
    String(report.executiveSummary.strengthsCount),
    'Strengths',
    COLORS.green
  );
  addStatBox(
    startX + (boxWidth + boxGap) * 2,
    yPosition,
    boxWidth,
    String(report.executiveSummary.actionsCount),
    'Priority Actions',
    COLORS.red
  );
  addStatBox(
    startX + (boxWidth + boxGap) * 3,
    yPosition,
    boxWidth,
    String(report.executiveSummary.areasToExploreCount),
    'Areas to Explore',
    COLORS.amber
  );

  yPosition += 38;

  // Completion progress with card background
  doc.setFillColor(250, 248, 245); // ivory
  doc.roundedRect(PAGE.marginLeft, yPosition - 3, PAGE.contentWidth, 20, 3, 3, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(73, 14, 103); // amethystDiamond
  doc.text(
    `Overall Completion: ${report.executiveSummary.completionPercentage}%`,
    PAGE.marginLeft + 5,
    yPosition + 4
  );
  doc.setTextColor(0, 0, 0);

  // Progress bar with depth
  const barY = yPosition + 8;
  doc.setFillColor(230, 230, 230);
  doc.roundedRect(PAGE.marginLeft + 5, barY, PAGE.contentWidth - 10, 6, 3, 3, 'F');
  doc.setFillColor(73, 14, 103); // amethystDiamond
  const progressWidth = ((PAGE.contentWidth - 10) * report.executiveSummary.completionPercentage) / 100;
  if (progressWidth > 0) {
    doc.roundedRect(PAGE.marginLeft + 5, barY, progressWidth, 6, 3, 3, 'F');
    // Orange highlight at end of progress
    if (progressWidth > 3) {
      doc.setFillColor(204, 119, 0); // aussieDark
      doc.roundedRect(PAGE.marginLeft + 5 + progressWidth - 3, barY, 3, 6, 0, 3, 'F');
    }
  }

  yPosition += 25;

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

      // Module code badge
      doc.setFillColor(73, 14, 103);
      doc.roundedRect(PAGE.marginLeft + 8, yPosition + 3, 18, 7, 2, 2, 'F');
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
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

      // Stats badges
      doc.setFillColor(220, 252, 231); // greenLight
      doc.roundedRect(PAGE.width - PAGE.marginRight - 52, yPosition + 3, 24, 7, 2, 2, 'F');
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(COLORS.green);
      doc.text(`${evidence.strengthsCount} good`, PAGE.width - PAGE.marginRight - 40, yPosition + 8, { align: 'center' });

      doc.setFillColor(254, 226, 226); // redLight
      doc.roundedRect(PAGE.width - PAGE.marginRight - 26, yPosition + 3, 24, 7, 2, 2, 'F');
      doc.setTextColor(COLORS.red);
      doc.text(`${evidence.actionsCount} action`, PAGE.width - PAGE.marginRight - 14, yPosition + 8, { align: 'center' });

      doc.setTextColor(0, 0, 0);
      yPosition += 28;
    });
    yPosition += 5;
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
  // WHAT'S GOING WELL
  // ============================================
  if (report.sections.strengths.content.length > 0) {
    addSectionTitle("What's Going Well", COLORS.green);
    addBulletList(report.sections.strengths.content as string[], COLORS.green);
  }

  // ============================================
  // PRIORITY ACTIONS
  // ============================================
  if (report.sections.priorityActions.content.length > 0) {
    addSectionTitle('Priority Actions', COLORS.red);
    addBulletList(report.sections.priorityActions.content as string[], COLORS.red);
  }

  // ============================================
  // QUICK WINS
  // ============================================
  if (report.quickWins && report.quickWins.length > 0) {
    addSectionTitle('Quick Wins', COLORS.aussieDark);
    addParagraph(
      'These actions offer significant accessibility improvements with minimal effort:',
      9
    );

    report.quickWins.forEach((win) => {
      checkNewPage(20);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${win.title}`, PAGE.marginLeft, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(COLORS.gray);
      doc.text(`(${win.effort} effort, ${win.impact} impact)`, PAGE.marginLeft + 80, yPosition);
      doc.setTextColor(0, 0, 0);
      yPosition += 5;
      addParagraph(win.description, 9);
    });
  }

  // ============================================
  // AREAS TO EXPLORE
  // ============================================
  if (report.sections.areasToExplore.content.length > 0) {
    addSectionTitle('Areas to Explore', COLORS.amber);
    addBulletList(report.sections.areasToExplore.content as string[], COLORS.amber);
  }

  // ============================================
  // DETAILED FINDINGS (Deep Dive only)
  // ============================================
  if (report.reportType === 'deep-dive' && report.detailedFindings && report.detailedFindings.length > 0) {
    addSectionTitle('Detailed Findings');

    report.detailedFindings.forEach((finding) => {
      checkNewPage(15);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(COLORS.amethystDiamond);
      doc.text(finding.moduleName, PAGE.marginLeft, yPosition);
      yPosition += 8;
      doc.setTextColor(0, 0, 0);

      finding.issues.forEach((issue) => {
        checkNewPage(30);

        // Issue header
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(issue.questionText, PAGE.marginLeft + 5, yPosition, {
          maxWidth: PAGE.contentWidth - 30,
        });

        // Priority badge
        const priorityColor =
          issue.priority === 'high' ? COLORS.red : issue.priority === 'medium' ? COLORS.amber : COLORS.gray;
        doc.setFillColor(priorityColor);
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7);
        doc.roundedRect(PAGE.width - PAGE.marginRight - 25, yPosition - 3, 20, 6, 1, 1, 'F');
        doc.text(`${issue.priority}`, PAGE.width - PAGE.marginRight - 15, yPosition + 1, {
          align: 'center',
        });
        doc.setTextColor(0, 0, 0);
        yPosition += 8;

        // Reasoning
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        addParagraph(issue.reasoning, 9);

        // Recommended actions
        if (issue.recommendedActions.length > 0) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.text('Recommended Actions:', PAGE.marginLeft + 5, yPosition);
          yPosition += 4;
          doc.setFont('helvetica', 'normal');
          addBulletList(
            issue.recommendedActions.map((a) => a),
            COLORS.amethystDiamond
          );
        }

        yPosition += 3;
      });
    });
  }

  // ============================================
  // SUGGESTED NEXT STEPS
  // ============================================
  addSectionTitle('Suggested Next Steps');

  // Two columns
  checkNewPage(40);
  const colWidth = (PAGE.contentWidth - 10) / 2;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Things you can explore now', PAGE.marginLeft, yPosition);
  doc.text('Things to plan for later', PAGE.marginLeft + colWidth + 10, yPosition);
  yPosition += 6;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  const maxItems = Math.max(report.nextSteps.exploreNow.length, report.nextSteps.planForLater.length);

  for (let i = 0; i < maxItems; i++) {
    checkNewPage(6);

    if (i < report.nextSteps.exploreNow.length) {
      doc.setFillColor(COLORS.green);
      doc.circle(PAGE.marginLeft + 2, yPosition - 1, 1, 'F');
      const lines = doc.splitTextToSize(report.nextSteps.exploreNow[i], colWidth - 8);
      doc.text(lines[0], PAGE.marginLeft + 6, yPosition);
    }

    if (i < report.nextSteps.planForLater.length) {
      doc.setFillColor(COLORS.amethystDiamond);
      doc.circle(PAGE.marginLeft + colWidth + 12, yPosition - 1, 1, 'F');
      const lines = doc.splitTextToSize(report.nextSteps.planForLater[i], colWidth - 8);
      doc.text(lines[0], PAGE.marginLeft + colWidth + 16, yPosition);
    }

    yPosition += 6;
  }
  yPosition += 5;

  // ============================================
  // PROFESSIONAL SUPPORT
  // ============================================
  addSectionTitle('When Professional Support May Help', COLORS.amethystLight);

  addParagraph('Based on your self-review, you may benefit from professional advice if:');

  const detectedIndicators = report.professionalSupport.indicators.filter((i) => i.detected);
  if (detectedIndicators.length > 0) {
    addBulletList(
      detectedIndicators.map((i) => `${i.category}: ${i.reason}`),
      COLORS.amethystLight
    );
  }

  if (report.professionalSupport.recommended) {
    checkNewPage(15);
    doc.setFillColor(248, 240, 252);
    doc.roundedRect(PAGE.marginLeft, yPosition, PAGE.contentWidth, 12, 2, 2, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.amethystLight);
    doc.text(
      'Based on your responses, we recommend considering professional support.',
      PAGE.marginLeft + 5,
      yPosition + 7
    );
    doc.setTextColor(0, 0, 0);
    yPosition += 18;
  }

  addParagraph(
    "This self-review is designed to support learning and planning. Seeking professional advice doesn't mean you've failed - it's a normal next step for many organisations.",
    9
  );

  // ============================================
  // DISCLAIMER
  // ============================================
  addSectionTitle('Important Disclaimer', COLORS.amber);

  checkNewPage(30);
  doc.setFillColor(255, 251, 235);
  doc.roundedRect(PAGE.marginLeft, yPosition, PAGE.contentWidth, 35, 2, 2, 'F');
  doc.setDrawColor(COLORS.amber);
  doc.setLineWidth(0.5);
  doc.roundedRect(PAGE.marginLeft, yPosition, PAGE.contentWidth, 35, 2, 2, 'S');

  yPosition += 5;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  const disclaimerLines = doc.splitTextToSize(
    'This guidance is for information only. It is not legal advice, a compliance certificate, or a substitute for professional accessibility auditing. Actions are suggestions based on your responses. This review is indicative only and based on self-reported information. It does not verify accuracy or confirm compliance with accessibility standards or legal requirements.',
    PAGE.contentWidth - 10
  );

  disclaimerLines.forEach((line: string) => {
    doc.text(line, PAGE.marginLeft + 5, yPosition);
    yPosition += 4;
  });

  // Add final footer
  addFooter();

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
