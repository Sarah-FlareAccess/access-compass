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
  // Maturity palette (matches in-app heatmap pastels)
  strongFill: '#86EFAC',
  strongText: '#14532D',
  mixedFill: '#FCD34D',
  mixedText: '#78350F',
  needsFill: '#FCA5A5',
  needsText: '#7F1D1D',
  // Status palette (used for progress bar - completion, in-progress, not-started)
  statusCompleted: '#86EFAC',
  statusInProgress: '#FCD34D',
  statusNotStarted: '#E5E7EB',
  // Insight callout
  insightBg: '#F5EFFA',
  insightBorder: '#C8A8DA',
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

// Draws a donut chart by approximating each segment with many tiny
// triangles. jsPDF has no native arc-fill, so this is the cleanest path.
function drawDonut(
  doc: jsPDF,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  segments: { value: number; color: string }[],
): void {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) {
    doc.setDrawColor(...hexToRgb(COLORS.greyBar));
    doc.setFillColor(...hexToRgb(COLORS.greyBar));
    doc.circle(cx, cy, outerR, 'S');
    return;
  }

  let startAngle = -Math.PI / 2;
  segments.forEach(seg => {
    if (seg.value <= 0) return;
    const angle = (seg.value / total) * 2 * Math.PI;
    const endAngle = startAngle + angle;
    drawDonutSegment(doc, cx, cy, outerR, innerR, startAngle, endAngle, seg.color);
    startAngle = endAngle;
  });
}

function drawDonutSegment(
  doc: jsPDF,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number,
  color: string,
): void {
  const [r, g, b] = hexToRgb(color);
  doc.setFillColor(r, g, b);
  doc.setDrawColor(r, g, b);

  const sweepDeg = ((endAngle - startAngle) * 180) / Math.PI;
  const steps = Math.max(8, Math.ceil(sweepDeg / 3));

  for (let i = 0; i < steps; i++) {
    const a1 = startAngle + ((endAngle - startAngle) * i) / steps;
    const a2 = startAngle + ((endAngle - startAngle) * (i + 1)) / steps;

    const x1 = cx + outerR * Math.cos(a1);
    const y1 = cy + outerR * Math.sin(a1);
    const x2 = cx + outerR * Math.cos(a2);
    const y2 = cy + outerR * Math.sin(a2);
    const x3 = cx + innerR * Math.cos(a2);
    const y3 = cy + innerR * Math.sin(a2);
    const x4 = cx + innerR * Math.cos(a1);
    const y4 = cy + innerR * Math.sin(a1);

    doc.triangle(x1, y1, x2, y2, x3, y3, 'F');
    doc.triangle(x1, y1, x3, y3, x4, y4, 'F');
  }
}

// Plain-English interpretation generators
function describeCohortMaturity(strongPct: number): string {
  if (strongPct >= 60) return 'a strong cohort overall, with most modules assessed at high confidence. Use the strength patterns below as case studies for the rest of the cohort.';
  if (strongPct >= 40) return 'a developing cohort with good foundations and visible areas for improvement. Focus shared support on the modules with high needs-work proportions.';
  if (strongPct >= 20) return 'an emerging cohort with significant collective opportunity. Sector-wide training, shared resources, and group programs will accelerate progress on the top priority actions below.';
  return 'a cohort at the start of its journey. Capacity-building investment now will pay off in measurable progress within 6-12 months.';
}

function describeCompletion(completedPct: number, total: number): string {
  if (total === 0) return 'No businesses are currently enrolled. Once enrolment begins this section will populate.';
  if (completedPct >= 80) return 'Most businesses have finished their assessments, giving this report a high-confidence basis. Findings can be cited in public reporting.';
  if (completedPct >= 40) return 'A meaningful proportion has finished. Findings are directional but reliable. Follow up with the in-progress cohort to firm up the picture before public reporting.';
  if (completedPct >= 15) return 'Early-stage program. Findings are indicative only. Consider this a baseline read; re-run the report in 4-8 weeks once more businesses complete.';
  return 'Very early in the program. Treat the figures below as preliminary signal, not conclusion.';
}

function generateKeyInsights(payload: ProgramReportPayload, strongPct: number, completedPct: number): string[] {
  const insights: string[] = [];
  const { enrolment, moduleAggregates, topPriorityActions, topStrengths } = payload;

  // Insight 1: cohort posture
  if (strongPct >= 50) {
    insights.push(`${strongPct}% of assessed modules show STRONG confidence - the cohort is doing well overall.`);
  } else if (strongPct >= 25) {
    insights.push(`${strongPct}% STRONG, with mixed results elsewhere - clear opportunities for targeted support.`);
  } else {
    insights.push(`Cohort maturity is in development. ${strongPct}% STRONG suggests significant collective work ahead.`);
  }

  // Insight 2: top need-work module
  const sortedByNeeds = [...moduleAggregates].filter(m => (m.confidence_strong + m.confidence_mixed + m.confidence_needs_work) > 0).sort((a, b) => {
    const aTotal = a.confidence_strong + a.confidence_mixed + a.confidence_needs_work;
    const bTotal = b.confidence_strong + b.confidence_mixed + b.confidence_needs_work;
    const aPct = aTotal > 0 ? a.confidence_needs_work / aTotal : 0;
    const bPct = bTotal > 0 ? b.confidence_needs_work / bTotal : 0;
    return bPct - aPct;
  });
  if (sortedByNeeds.length > 0 && sortedByNeeds[0].confidence_needs_work > 0) {
    const m = sortedByNeeds[0];
    insights.push(`Module ${m.module_id} shows the most NEEDS-WORK signal (${m.confidence_needs_work} of ${m.confidence_strong + m.confidence_mixed + m.confidence_needs_work} assessments). Prioritise for cohort-wide support.`);
  }

  // Insight 3: top priority action frequency
  if (topPriorityActions.length > 0) {
    const top = topPriorityActions[0];
    insights.push(`The most common recommended action is "${top.action}" (appears in ${top.count} business${top.count !== 1 ? 'es' : ''}). Consider this for a sector-wide initiative.`);
  }

  // Insight 4: strength to celebrate
  if (topStrengths.length > 0) {
    const top = topStrengths[0];
    insights.push(`"${top.text}" is already in place across ${top.count} business${top.count !== 1 ? 'es' : ''} - worth highlighting publicly.`);
  }

  // Insight 5: completion velocity context
  if (completedPct >= 40 && completedPct < 80) {
    insights.push(`${completedPct}% completion. Re-run this report in 4-6 weeks to capture the in-progress cohort and firm up findings before public reporting.`);
  }

  return insights.slice(0, 4);
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

  // Small interpretation block ("What this means" callout)
  const drawWhatThisMeans = (text: string) => {
    ensureSpace(14);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRgb(COLORS.text));
    doc.setFillColor(...hexToRgb(COLORS.ivory));
    const lines = doc.splitTextToSize(text, PAGE.contentWidth - 6);
    const h = lines.length * 4 + 4;
    doc.roundedRect(PAGE.marginX, yPos, PAGE.contentWidth, h, 2, 2, 'F');
    let cY = yPos + 4;
    lines.forEach((line: string) => {
      doc.text(line, PAGE.marginX + 3, cY);
      cY += 4;
    });
    yPos += h + 4;
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

    // Confidence band heatmap bar (matches in-app heatmap)
    const confStrong = agg?.confidence_strong ?? 0;
    const confMixed = agg?.confidence_mixed ?? 0;
    const confNeeds = agg?.confidence_needs_work ?? 0;
    const confTotal = confStrong + confMixed + confNeeds;
    if (confTotal > 0) {
      let x = PAGE.marginX;
      if (confStrong > 0) {
        const w = (confStrong / confTotal) * barW;
        doc.setFillColor(...hexToRgb(COLORS.strongFill));
        doc.rect(x, yPos, w, barH, 'F');
        x += w;
      }
      if (confMixed > 0) {
        const w = (confMixed / confTotal) * barW;
        doc.setFillColor(...hexToRgb(COLORS.mixedFill));
        doc.rect(x, yPos, w, barH, 'F');
        x += w;
      }
      if (confNeeds > 0) {
        const w = (confNeeds / confTotal) * barW;
        doc.setFillColor(...hexToRgb(COLORS.needsFill));
        doc.rect(x, yPos, w, barH, 'F');
      }
    } else if (total > 0) {
      // No confidence data yet, show completion vs not-started in grey/pastel
      const completedPct = completed / total;
      let x = PAGE.marginX;
      if (completedPct > 0) {
        const w = completedPct * barW;
        doc.setFillColor(...hexToRgb(COLORS.strongFill));
        doc.rect(x, yPos, w, barH, 'F');
      }
    }
    yPos += barH + 3;

    if (confTotal > 0) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...hexToRgb(COLORS.textMuted));
      doc.text(
        `Strong ${confStrong}  -  Mixed ${confMixed}  -  Needs work ${confNeeds}`,
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

  // Stat row
  const statBoxW = (PAGE.contentWidth - 9) / 4;
  ensureSpace(30);
  addStatBox(PAGE.marginX, yPos, statBoxW, String(enrolment.total), 'Enrolled', COLORS.amethystDiamond);
  addStatBox(PAGE.marginX + statBoxW + 3, yPos, statBoxW, String(enrolment.completed), 'Completed', COLORS.strongText);
  addStatBox(PAGE.marginX + 2 * (statBoxW + 3), yPos, statBoxW, String(enrolment.submitted), 'Submitted', COLORS.mixedText);
  addStatBox(PAGE.marginX + 3 * (statBoxW + 3), yPos, statBoxW, String(enrolment.in_progress), 'In progress', COLORS.amethystDiamond);
  yPos += 32;

  // Cohort maturity calc for the donut + insights
  const confidence = {
    strong: moduleAggregates.reduce((s, m) => s + m.confidence_strong, 0),
    mixed: moduleAggregates.reduce((s, m) => s + m.confidence_mixed, 0),
    needs: moduleAggregates.reduce((s, m) => s + m.confidence_needs_work, 0),
  };
  const confTotal = confidence.strong + confidence.mixed + confidence.needs;
  const strongPct = confTotal > 0 ? Math.round((confidence.strong / confTotal) * 100) : 0;
  const completedPct = pct(enrolment.completed, enrolment.total);

  // Maturity donut + legend (left) + interpretation (right)
  ensureSpace(60);
  const donutCx = PAGE.marginX + 25;
  const donutCy = yPos + 25;
  drawDonut(doc, donutCx, donutCy, 22, 12, [
    { value: confidence.strong, color: COLORS.strongFill },
    { value: confidence.mixed, color: COLORS.mixedFill },
    { value: confidence.needs, color: COLORS.needsFill },
  ]);

  // Center percentage
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
  doc.text(`${strongPct}%`, donutCx, donutCy + 1, { align: 'center' });
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...hexToRgb(COLORS.textMuted));
  doc.text('STRONG', donutCx, donutCy + 5, { align: 'center' });

  // Legend right of donut
  const legendX = donutCx + 30;
  const legendStartY = yPos + 6;
  const drawLegendItem = (i: number, color: string, label: string, count: number) => {
    const y = legendStartY + i * 7;
    doc.setFillColor(...hexToRgb(color));
    doc.rect(legendX, y - 3, 4, 4, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRgb(COLORS.text));
    doc.text(`${label}: ${count}`, legendX + 6, y);
  };
  drawLegendItem(0, COLORS.strongFill, 'Strong', confidence.strong);
  drawLegendItem(1, COLORS.mixedFill, 'Mixed', confidence.mixed);
  drawLegendItem(2, COLORS.needsFill, 'Needs work', confidence.needs);

  // Interpretation right block
  const interpX = legendX + 50;
  const interpW = PAGE.width - PAGE.marginX - interpX;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
  doc.text('COHORT MATURITY', interpX, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...hexToRgb(COLORS.text));
  doc.setFontSize(9);
  const interpText = `This is ${describeCohortMaturity(strongPct)}`;
  const interpLines = doc.splitTextToSize(interpText, interpW);
  let interpY = yPos + 11;
  interpLines.forEach((line: string) => {
    doc.text(line, interpX, interpY);
    interpY += 4;
  });

  yPos += 56;

  // Completion context paragraph
  const completionText = `Completion: ${completedPct}% of enrolled businesses have finished. ${describeCompletion(completedPct, enrolment.total)}`;
  addParagraph(completionText, 9);

  // Key insights callout
  const insights = generateKeyInsights(payload, strongPct, completedPct);
  if (insights.length > 0) {
    ensureSpace(20 + insights.length * 8);
    const calloutH = 12 + insights.length * 7;
    doc.setFillColor(...hexToRgb(COLORS.insightBg));
    doc.setDrawColor(...hexToRgb(COLORS.insightBorder));
    doc.setLineWidth(0.5);
    doc.roundedRect(PAGE.marginX, yPos, PAGE.contentWidth, calloutH, 3, 3, 'FD');
    doc.setFillColor(...hexToRgb(COLORS.amethystDiamond));
    doc.rect(PAGE.marginX, yPos, 2, calloutH, 'F');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
    doc.text('KEY INSIGHTS', PAGE.marginX + 6, yPos + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...hexToRgb(COLORS.text));
    insights.forEach((insight, idx) => {
      const yI = yPos + 11 + idx * 7;
      doc.setFillColor(...hexToRgb(COLORS.amethystDiamond));
      doc.circle(PAGE.marginX + 7, yI - 1, 0.8, 'F');
      const lines = doc.splitTextToSize(insight, PAGE.contentWidth - 14);
      doc.text(lines[0], PAGE.marginX + 11, yI);
      // truncate to one line for layout simplicity
    });
    yPos += calloutH + 4;
    doc.setLineWidth(0.3);
  }

  addSectionHeader('Module progress');
  addParagraph('Completion rate and confidence band distribution for each module in scope. Pastel fills match the in-app heatmap. Wider green means the cohort is doing well, wider red means collective attention is needed.', 9);

  program.moduleIds.forEach(mid => {
    const agg = moduleAggregates.find(a => a.module_id === mid);
    addModuleRow(mid, agg);
  });

  // What this means
  const topNeeds = [...moduleAggregates]
    .filter(m => (m.confidence_strong + m.confidence_mixed + m.confidence_needs_work) > 0)
    .sort((a, b) => b.confidence_needs_work - a.confidence_needs_work)[0];
  const interpModuleText = topNeeds && topNeeds.confidence_needs_work > 0
    ? `What this means: Module ${topNeeds.module_id} shows the strongest needs-work signal across the cohort. A group training or shared resource focused here will lift multiple businesses at once.`
    : `What this means: confidence is reasonably consistent across modules. No single module dominates as a sector-wide concern, so support can be distributed.`;
  drawWhatThisMeans(interpModuleText);

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

    // What this means
    const topPa = topPriorityActions[0];
    if (topPa && topPa.count >= 3) {
      drawWhatThisMeans(`What this means: the top action affects ${topPa.count} businesses. Treating this as a cohort-wide initiative (group training, shared infrastructure, council-funded works) is likely more efficient than each business addressing it alone.`);
    } else {
      drawWhatThisMeans('What this means: priority actions are spread across the cohort rather than concentrated. Tailored business-by-business support may be more effective than blanket initiatives.');
    }
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

    drawWhatThisMeans('What this means: these are proof points. Use them in council communications, grant applications and award nominations to demonstrate sector progress and reassure community members that local businesses are responsive.');
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

    drawWhatThisMeans('What this means: businesses are uncertain rather than failing. A short council-issued guide or a quick training session can turn this uncertainty into competence at low cost.');
  }

  // =====================================================
  // Methodology
  // =====================================================
  addSectionHeader('Methodology and privacy');
  addParagraph(methodology, 9);

  addFooter();

  doc.save(`program-report-${safeProgramName}-${fileDate}.pdf`);
}
