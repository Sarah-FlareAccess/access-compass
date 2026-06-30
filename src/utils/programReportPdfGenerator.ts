/**
 * Program Report PDF generator
 *
 * Produces a branded multi-page PDF from a ProgramReportPayload snapshot.
 * Layout: cover -> executive summary + per-module rollup -> top priority
 * actions -> strengths + areas to explore -> methodology.
 *
 * Mirrors the styling of diapPdfGenerator.ts so council artefacts feel
 * consistent across DIAP and Program reports.
 */

import jsPDF from 'jspdf';
import type { ProgramReportPayload } from '../hooks/useProgramReport';
import { accessModules } from '../data/accessModules';

const COLORS = {
  amethystDark: '#3a0b52',
  amethystDiamond: '#490E67',
  aussieLight: '#FF9015',
  ivory: '#FAF8F5',
  text: '#1f2937',
  textMuted: '#6b7280',
  green: '#166534',
  amber: '#945a00',
  red: '#b91c1c',
  greyBar: '#e5e7eb',
};

const PAGE = {
  width: 210,
  height: 297,
  marginX: 20,
  marginY: 25,
  contentWidth: 170,
};

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function moduleName(moduleId: string): string {
  return accessModules.find(m => m.id === moduleId)?.name || moduleId;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function pct(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

interface ProgramReportPdfOptions {
  payload: ProgramReportPayload;
  reportName: string;
  generatedAt: string;
}

export function generateProgramReportPdf(options: ProgramReportPdfOptions): void {
  const { payload, reportName, generatedAt } = options;
  const { program, authority, enrolment, moduleAggregates, topPriorityActions, topStrengths, topAreasToExplore, methodology } = payload;

  const formattedDate = formatDate(generatedAt);
  const fileDate = new Date(generatedAt).toISOString().split('T')[0];
  const safeProgramName = program.name.replace(/[^a-zA-Z0-9-]+/g, '-').replace(/^-|-$/g, '') || 'program';

  const doc = new jsPDF('p', 'mm', 'a4');
  let currentPage = 1;
  let yPos = PAGE.marginY;

  // =====================================================
  // Helpers
  // =====================================================

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
    doc.text('Program Report', PAGE.width - PAGE.marginX, 10, { align: 'right' });
    doc.setTextColor(0, 0, 0);
  };

  const addFooter = () => {
    const fy = PAGE.height - 12;
    doc.setFillColor(...hexToRgb(COLORS.ivory));
    doc.rect(0, fy - 6, PAGE.width, 18, 'F');
    doc.setFillColor(...hexToRgb(COLORS.amethystDiamond));
    doc.rect(PAGE.marginX, fy - 6, 40, 1, 'F');

    doc.setFontSize(7);
    doc.setTextColor(...hexToRgb(COLORS.textMuted));
    const footerLeft = `${authority.name} - ${reportName}`.slice(0, 60);
    doc.text(footerLeft, PAGE.marginX, fy);
    doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
    doc.text(formattedDate, PAGE.width / 2, fy, { align: 'center' });
    doc.setTextColor(...hexToRgb(COLORS.textMuted));
    doc.text(`Page ${currentPage}`, PAGE.width - PAGE.marginX, fy, { align: 'right' });
    doc.setTextColor(0, 0, 0);
  };

  const addNewPage = () => {
    addFooter();
    doc.addPage();
    currentPage += 1;
    yPos = PAGE.marginY;
    addHeader();
    yPos += 10;
  };

  const ensureSpace = (needed: number) => {
    if (yPos + needed > PAGE.height - PAGE.marginY - 15) {
      addNewPage();
    }
  };

  const addSectionHeader = (title: string) => {
    ensureSpace(20);
    yPos += 4;
    doc.setFillColor(...hexToRgb(COLORS.amethystDiamond));
    doc.roundedRect(PAGE.marginX - 3, yPos - 4, PAGE.contentWidth + 6, 10, 2, 2, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(title, PAGE.marginX + 4, yPos + 3);
    yPos += 14;
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
  };

  const addParagraph = (text: string, fontSize = 10) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRgb(COLORS.text));
    const lines = doc.splitTextToSize(text, PAGE.contentWidth);
    lines.forEach((line: string) => {
      ensureSpace(fontSize * 0.5);
      doc.text(line, PAGE.marginX, yPos);
      yPos += fontSize * 0.5;
    });
    yPos += 2;
  };

  const addStatBox = (x: number, y: number, width: number, value: string, label: string, accent: string) => {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, y, width, 25, 3, 3, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, width, 25, 3, 3, 'S');
    doc.setFillColor(...hexToRgb(accent));
    doc.rect(x, y, 1.5, 25, 'F');

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(accent));
    doc.text(value, x + width / 2, y + 12, { align: 'center' });

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text(label, x + width / 2, y + 19, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(0, 0, 0);
  };

  const addModuleRow = (moduleId: string, agg: typeof moduleAggregates[number] | undefined) => {
    ensureSpace(18);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(COLORS.text));
    doc.text(`${moduleId} ${moduleName(moduleId)}`, PAGE.marginX, yPos);

    const total = agg?.total_enrolments ?? 0;
    const completed = agg?.completed ?? 0;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...hexToRgb(COLORS.textMuted));
    doc.text(`${completed}/${total} completed`, PAGE.width - PAGE.marginX, yPos, { align: 'right' });
    yPos += 3;

    const barW = PAGE.contentWidth;
    const barH = 4;
    doc.setFillColor(...hexToRgb(COLORS.greyBar));
    doc.roundedRect(PAGE.marginX, yPos, barW, barH, 1, 1, 'F');

    if (total > 0) {
      const completedPct = completed / total;
      const inProgressPct = (agg?.in_progress ?? 0) / total;
      const notStartedPct = (agg?.not_started ?? 0) / total;
      let x = PAGE.marginX;
      if (completedPct > 0) {
        const w = completedPct * barW;
        doc.setFillColor(...hexToRgb(COLORS.green));
        doc.rect(x, yPos, w, barH, 'F');
        x += w;
      }
      if (inProgressPct > 0) {
        const w = inProgressPct * barW;
        doc.setFillColor(...hexToRgb(COLORS.amber));
        doc.rect(x, yPos, w, barH, 'F');
        x += w;
      }
      if (notStartedPct > 0) {
        const w = notStartedPct * barW;
        doc.setFillColor(180, 180, 180);
        doc.rect(x, yPos, w, barH, 'F');
      }
    }
    yPos += barH + 3;

    const confTotal = (agg?.confidence_strong ?? 0) + (agg?.confidence_mixed ?? 0) + (agg?.confidence_needs_work ?? 0);
    if (confTotal > 0) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...hexToRgb(COLORS.textMuted));
      doc.text(
        `Strong ${agg?.confidence_strong ?? 0}  -  Mixed ${agg?.confidence_mixed ?? 0}  -  Needs work ${agg?.confidence_needs_work ?? 0}`,
        PAGE.marginX,
        yPos,
      );
      yPos += 4;
    } else {
      yPos += 1;
    }

    doc.setTextColor(0, 0, 0);
    yPos += 4;
  };

  // =====================================================
  // COVER PAGE
  // =====================================================
  doc.setFillColor(...hexToRgb(COLORS.amethystDark));
  doc.rect(0, 0, PAGE.width, PAGE.height, 'F');
  doc.setFillColor(...hexToRgb(COLORS.amethystDiamond));
  doc.rect(PAGE.width * 0.3, 0, PAGE.width * 0.7, PAGE.height * 0.5, 'F');
  doc.setFillColor(...hexToRgb(COLORS.aussieLight));
  doc.rect(0, PAGE.height * 0.42, PAGE.width, 4, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('Program Report', PAGE.width / 2, PAGE.height * 0.26, { align: 'center' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(program.accessLevel === 'pulse' ? 'Pulse Check' : 'Deep Dive', PAGE.width / 2, PAGE.height * 0.32, { align: 'center' });

  // Org + program name card
  doc.setFillColor(255, 255, 255);
  const orgCardY = PAGE.height * 0.54;
  doc.roundedRect(PAGE.marginX + 10, orgCardY, PAGE.contentWidth - 20, 40, 4, 4, 'F');
  doc.setFillColor(...hexToRgb(COLORS.amethystDiamond));
  doc.roundedRect(PAGE.marginX + 10, orgCardY, 4, 40, 2, 2, 'F');

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
  doc.text(authority.name, PAGE.width / 2, orgCardY + 12, { align: 'center' });

  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...hexToRgb(COLORS.text));
  const programLines = doc.splitTextToSize(program.name, PAGE.contentWidth - 30);
  doc.text(programLines, PAGE.width / 2, orgCardY + 22, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(...hexToRgb(COLORS.textMuted));
  doc.text(`Generated ${formattedDate}`, PAGE.width / 2, orgCardY + 34, { align: 'center' });

  // Cover stats
  const coverStatsY = PAGE.height * 0.72;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(PAGE.marginX + 10, coverStatsY, PAGE.contentWidth - 20, 28, 4, 4, 'F');
  const coverStats = [
    { val: String(enrolment.total), label: 'Businesses' },
    { val: String(enrolment.completed), label: 'Completed' },
    { val: String(program.moduleIds.length), label: 'Modules' },
    { val: `${pct(enrolment.completed, enrolment.total)}%`, label: 'Completion' },
  ];
  const coverStatW = (PAGE.contentWidth - 20) / 4;
  coverStats.forEach((s, idx) => {
    const x = PAGE.marginX + 10 + idx * coverStatW;
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
    doc.text(s.val, x + coverStatW / 2, coverStatsY + 12, { align: 'center' });
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text(s.label, x + coverStatW / 2, coverStatsY + 20, { align: 'center' });
  });

  // Branding badge
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(PAGE.width / 2 - 40, PAGE.height * 0.87, 80, 18, 3, 3, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
  doc.text('Access Compass', PAGE.width / 2, PAGE.height * 0.87 + 8, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...hexToRgb(COLORS.textMuted));
  doc.text('by Flare Access', PAGE.width / 2, PAGE.height * 0.87 + 14, { align: 'center' });

  // =====================================================
  // PAGE 2: Executive summary + module rollup
  // =====================================================
  doc.addPage();
  currentPage += 1;
  yPos = PAGE.marginY;
  addHeader();
  yPos += 10;

  addSectionHeader('Executive summary');

  const statBoxW = (PAGE.contentWidth - 9) / 4;
  ensureSpace(30);
  addStatBox(PAGE.marginX, yPos, statBoxW, String(enrolment.total), 'Enrolled', COLORS.amethystDiamond);
  addStatBox(PAGE.marginX + statBoxW + 3, yPos, statBoxW, String(enrolment.completed), 'Completed', COLORS.green);
  addStatBox(PAGE.marginX + 2 * (statBoxW + 3), yPos, statBoxW, String(enrolment.submitted), 'Submitted', COLORS.amber);
  addStatBox(PAGE.marginX + 3 * (statBoxW + 3), yPos, statBoxW, String(enrolment.in_progress), 'In progress', COLORS.red);
  yPos += 30;

  const introText =
    `This ${program.accessLevel === 'pulse' ? 'Pulse Check' : 'Deep Dive'} program covers ${program.moduleIds.length} module${program.moduleIds.length !== 1 ? 's' : ''} across ${enrolment.total} enrolled business${enrolment.total !== 1 ? 'es' : ''}. ` +
    `${pct(enrolment.completed, enrolment.total)}% of enrolled businesses have completed their assessments, ` +
    `and ${pct(enrolment.submitted + enrolment.completed, enrolment.total)}% have submitted at least one module for review.`;
  addParagraph(introText);

  addSectionHeader('Module progress');
  addParagraph('Completion rate and confidence band distribution for each module in scope.');

  program.moduleIds.forEach(mid => {
    const agg = moduleAggregates.find(a => a.module_id === mid);
    addModuleRow(mid, agg);
  });

  // =====================================================
  // Top priority actions
  // =====================================================
  if (topPriorityActions.length > 0) {
    addSectionHeader('Top priority actions across the cohort');
    addParagraph('Recommended actions appearing most often across business assessments. Useful for sector-wide initiatives, group training, or shared infrastructure investment.');

    topPriorityActions.forEach((pa, idx) => {
      ensureSpace(14);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRgb(COLORS.text));
      const numbered = `${idx + 1}. ${pa.action}`;
      const lines = doc.splitTextToSize(numbered, PAGE.contentWidth);
      lines.forEach((line: string) => {
        ensureSpace(5);
        doc.text(line, PAGE.marginX, yPos);
        yPos += 5;
      });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...hexToRgb(COLORS.textMuted));
      const moduleLabel = pa.moduleIds.length > 0 ? `, modules ${pa.moduleIds.join(', ')}` : '';
      const meta = `Appears in ${pa.count} business${pa.count !== 1 ? 'es' : ''}${pa.priority ? `, ${pa.priority.toUpperCase()} priority` : ''}${moduleLabel}`;
      doc.text(meta, PAGE.marginX, yPos);
      yPos += 7;
      doc.setTextColor(0, 0, 0);
    });
  }

  // =====================================================
  // Strengths
  // =====================================================
  if (topStrengths.length > 0) {
    addSectionHeader('Strengths across the cohort');
    addParagraph('Practices already in place across multiple businesses. Worth celebrating publicly and using as case studies.');
    topStrengths.forEach(s => {
      ensureSpace(10);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...hexToRgb(COLORS.text));
      const text = `- ${s.text} (${s.count} business${s.count !== 1 ? 'es' : ''})`;
      const lines = doc.splitTextToSize(text, PAGE.contentWidth);
      lines.forEach((line: string) => {
        ensureSpace(5);
        doc.text(line, PAGE.marginX, yPos);
        yPos += 5;
      });
      yPos += 1;
    });
  }

  // =====================================================
  // Areas to explore
  // =====================================================
  if (topAreasToExplore.length > 0) {
    addSectionHeader('Areas to explore');
    addParagraph('Topics businesses flagged as "unable to check" or "unsure". These often indicate where the cohort would benefit from clearer guidance, training, or sector-wide support.');
    topAreasToExplore.forEach(a => {
      ensureSpace(10);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...hexToRgb(COLORS.text));
      const text = `- ${a.text} (${a.count})`;
      const lines = doc.splitTextToSize(text, PAGE.contentWidth);
      lines.forEach((line: string) => {
        ensureSpace(5);
        doc.text(line, PAGE.marginX, yPos);
        yPos += 5;
      });
      yPos += 1;
    });
  }

  // =====================================================
  // Methodology
  // =====================================================
  addSectionHeader('Methodology and privacy');
  addParagraph(methodology, 9);

  addFooter();

  doc.save(`program-report-${safeProgramName}-${fileDate}.pdf`);
}
