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
import type { ModuleAggregate, ProgramReportPayload } from '../hooks/useProgramReport';
import { diapThemeForModules, type AggregateTheme } from './aggregateTheme';
import {
  moduleName,
  describeCohortMaturity,
  describeCompletion,
  sharedResponseFor,
  generateKeyInsights,
  MIN_ASSESSED_TO_FLAG,
  computeMaturity,
  computeRisk,
  authorityRecommendations,
  priorityHorizons,
  moduleVerdict,
  resolveGroupMode,
  groupWordFor,
  groupRecommendations,
} from './programReportModel';

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
  /** Group the recommendation sections by DIAP theme (default) or by the
   *  jurisdiction's statutory outcome domain. 'framework' falls back to 'theme'
   *  when the snapshot has no framework outcomes. */
  groupBy?: 'theme' | 'framework';
}

export function generateProgramReportPdf(options: ProgramReportPdfOptions): void {
  const { reportName, generatedAt } = options;
  // Re-derive an aggregate's theme from its source modules when the snapshot has
  // none. Reports saved before theming existed carry no theme, which otherwise
  // collapses every action and strength into a single "Other" group. moduleIds
  // are stored on the aggregate, so this fixes old snapshots without regenerating.
  const withTheme = <T extends { moduleIds: string[]; theme?: AggregateTheme }>(x: T): T =>
    x.theme ? x : { ...x, theme: diapThemeForModules(x.moduleIds) };
  const payload: ProgramReportPayload = {
    ...options.payload,
    topPriorityActions: options.payload.topPriorityActions.map(withTheme),
    topStrengths: options.payload.topStrengths.map(withTheme),
  };
  const { program, authority, enrolment, moduleAggregates, topPriorityActions, topStrengths, topAreasToExplore } = payload;

  // Grouping mode for the recommendation sections. 'framework' groups by the
  // jurisdiction's statutory outcome domain (via the module -> domain mapping)
  // instead of DIAP theme; it needs the snapshot's framework key and falls back
  // to theme grouping otherwise.
  const fwKey = payload.outcomes?.frameworkKey;
  const groupMode = resolveGroupMode(options.groupBy, fwKey);
  const groupWord = groupWordFor(groupMode);
  // Intro sentence describing how the report is organised, plus a filename slug
  // so a downloaded report is recognisable without opening it.
  const groupSentence = groupMode === 'framework'
    ? `Throughout, recommendations are organised by the ${payload.outcomes?.frameworkShort ?? 'jurisdiction'} statutory outcome areas, so they map directly to your reporting.`
    : 'Throughout, recommendations are organised by accessibility theme (the area of the visitor journey they relate to).';
  const groupSlug = groupMode === 'framework' ? 'by-outcome-area' : 'by-theme';
  const groupItems = <T extends { count: number; moduleIds: string[]; theme?: AggregateTheme }>(items: T[]) =>
    groupRecommendations(items, groupMode, fwKey);

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

  // Body prose never renders below 11pt for readability; callers that pass a
  // smaller size (older footnote sizes) are floored up.
  const BODY_TEXT_SIZE = 11;
  const addParagraph = (text: string, fontSize = BODY_TEXT_SIZE) => {
    const size = Math.max(fontSize, BODY_TEXT_SIZE);
    doc.setFontSize(size);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRgb(COLORS.text));
    const lines = doc.splitTextToSize(text, PAGE.contentWidth);
    lines.forEach((line: string) => {
      ensureSpace(size * 0.5);
      // Re-assert after a possible page break in ensureSpace, which runs the
      // header/footer and leaves their smaller font size and colour.
      doc.setFontSize(size);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...hexToRgb(COLORS.text));
      doc.text(line, PAGE.marginX, yPos);
      yPos += size * 0.5;
    });
    yPos += 2;
  };

  // Small interpretation block ("What this means" callout)
  const drawWhatThisMeans = (text: string) => {
    doc.setFontSize(BODY_TEXT_SIZE);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(text, PAGE.contentWidth - 6);
    const h = lines.length * 5.5 + 5;
    ensureSpace(h + 4);
    // Re-assert after a possible page break in ensureSpace, which runs the
    // header/footer and leaves their own font size, colour and fill.
    doc.setFontSize(BODY_TEXT_SIZE);
    doc.setFont('helvetica', 'normal');
    doc.setFillColor(...hexToRgb(COLORS.ivory));
    doc.roundedRect(PAGE.marginX, yPos, PAGE.contentWidth, h, 2, 2, 'F');
    doc.setTextColor(...hexToRgb(COLORS.text));
    let cY = yPos + 5.5;
    lines.forEach((line: string) => {
      doc.text(line, PAGE.marginX + 3, cY);
      cY += 5.5;
    });
    yPos += h + 4;
  };

  // Draw "- ..." body list items at one consistent size. The font is re-applied
  // per item because a mid-list page break runs the header/footer, which leave
  // their own size and colour - without this the overflow items after a break
  // render smaller and in the wrong colour, which reads as mismatched fonts.
  const BODY_LIST_SIZE = 11;
  const drawBulletList = (items: string[]) => {
    items.forEach(item => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(BODY_LIST_SIZE);
      doc.setTextColor(...hexToRgb(COLORS.text));
      const lines = doc.splitTextToSize(item, PAGE.contentWidth - 4) as string[];
      ensureSpace(lines.length * 5.5);
      // A page break inside ensureSpace resets the font, so set it again.
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(BODY_LIST_SIZE);
      doc.setTextColor(...hexToRgb(COLORS.text));
      lines.forEach((line, i) => {
        doc.text(line, PAGE.marginX + (i === 0 ? 0 : 4), yPos);
        yPos += 5.5;
      });
    });
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
    ensureSpace(22);
    yPos += 1;

    // Module title is the skim anchor - larger and bold so the eye lands on it
    // before the muted completion count and the band-count line below the bar.
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
    doc.text(`${moduleName(moduleId)} (${moduleId})`, PAGE.marginX, yPos);

    const total = agg?.total_enrolments ?? 0;
    const completed = agg?.completed ?? 0;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(BODY_TEXT_SIZE);
    doc.setTextColor(...hexToRgb(COLORS.textMuted));
    doc.text(`${completed}/${total} completed`, PAGE.width - PAGE.marginX, yPos, { align: 'right' });
    yPos += 5;

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
      const x = PAGE.marginX;
      if (completedPct > 0) {
        const w = completedPct * barW;
        doc.setFillColor(...hexToRgb(COLORS.strongFill));
        doc.rect(x, yPos, w, barH, 'F');
      }
    }
    yPos += barH + 6;

    if (confTotal > 0) {
      doc.setFontSize(BODY_TEXT_SIZE);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...hexToRgb(COLORS.textMuted));
      doc.text(
        `Strong ${confStrong}  -  Mixed ${confMixed}  -  Needs work ${confNeeds}`,
        PAGE.marginX,
        yPos,
      );
      // Verdict, right-aligned and colour-coded (Maintain / Invest / Improve).
      const verdict = agg ? moduleVerdict(agg) : null;
      if (verdict) {
        const vColor = verdict.key === 'maintain' ? COLORS.strongText : verdict.key === 'invest' ? COLORS.mixedText : COLORS.needsText;
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...hexToRgb(vColor));
        doc.text(verdict.label, PAGE.width - PAGE.marginX, yPos, { align: 'right' });
      }
      yPos += 6;
    } else {
      yPos += 1;
    }

    doc.setTextColor(0, 0, 0);
    yPos += 4;
  };

  // =====================================================
  // COVER PAGE (matches the DIAP + assessment report covers)
  // =====================================================
  const ccx = PAGE.width / 2;
  // Amethyst top band (single tone) + warm ivory lower area.
  doc.setFillColor(...hexToRgb(COLORS.amethystDiamond));
  doc.rect(0, 0, PAGE.width, PAGE.height * 0.44, 'F');
  doc.setFillColor(...hexToRgb(COLORS.ivory));
  doc.rect(0, PAGE.height * 0.44 + 3, PAGE.width, PAGE.height - (PAGE.height * 0.44 + 3), 'F');

  // Tone-on-tone compass, offset to the lower-right of the band beside the title.
  const cpx = PAGE.width * 0.70;
  const cpy = PAGE.height * 0.31;
  doc.setDrawColor(96, 42, 134);
  doc.setLineWidth(0.6);
  doc.circle(cpx, cpy, 30, 'S');
  doc.circle(cpx, cpy, 21, 'S');
  doc.setLineWidth(0.9);
  doc.line(cpx, cpy - 30, cpx, cpy - 25);
  doc.line(cpx, cpy + 25, cpx, cpy + 30);
  doc.line(cpx - 30, cpy, cpx - 25, cpy);
  doc.line(cpx + 25, cpy, cpx + 30, cpy);
  doc.setFillColor(124, 66, 166);
  doc.triangle(cpx, cpy - 18, cpx - 3.5, cpy, cpx + 3.5, cpy, 'F');
  doc.setFillColor(90, 32, 128);
  doc.triangle(cpx, cpy + 14, cpx - 3.5, cpy, cpx + 3.5, cpy, 'F');
  doc.setFillColor(255, 144, 21);
  doc.circle(cpx, cpy, 1.6, 'F');
  doc.setDrawColor(0, 0, 0);

  // Title, left-aligned on the clean purple band beside the compass.
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(30);
  doc.setFont('helvetica', 'bold');
  doc.text('Program Report', PAGE.marginX + 4, PAGE.height * 0.20, { align: 'left' });

  // Orange divider.
  doc.setFillColor(...hexToRgb(COLORS.aussieLight));
  doc.rect(0, PAGE.height * 0.44, PAGE.width, 3, 'F');

  // Council (org) name - dark on the light area.
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
  doc.text(authority.name, ccx, PAGE.height * 0.62, { align: 'center' });

  // Program name.
  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...hexToRgb(COLORS.text));
  doc.splitTextToSize(program.name, PAGE.contentWidth - 20).forEach((line: string, i: number) => {
    doc.text(line, ccx, PAGE.height * 0.62 + 9 + i * 6, { align: 'center' });
  });

  // Generated date.
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...hexToRgb(COLORS.textMuted));
  doc.text(`Generated ${formattedDate}`, ccx, PAGE.height * 0.62 + 22, { align: 'center' });

  // Branding at the bottom.
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
  doc.text('Access Compass', ccx, PAGE.height * 0.9, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...hexToRgb(COLORS.textMuted));
  doc.text('by Flare Access', ccx, PAGE.height * 0.9 + 6, { align: 'center' });

  // =====================================================
  // PAGE 2: Executive summary + module rollup
  // =====================================================
  doc.addPage();
  currentPage += 1;
  yPos = PAGE.marginY;
  addHeader();
  yPos += 10;

  // About this program - purpose, areas in scope and report type. Gives a
  // council reader the context the cover no longer carries.
  addSectionHeader('About this program');
  if (program.description) addParagraph(program.description);
  addParagraph(`Report type: ${program.accessLevel === 'pulse' ? 'Pulse Check' : 'Deep Dive'}. ${program.moduleIds.length} area${program.moduleIds.length !== 1 ? 's' : ''} assessed across ${enrolment.total} enrolled business${enrolment.total !== 1 ? 'es' : ''}. ${groupSentence}`);
  if (program.moduleIds.length > 0) {
    doc.setFontSize(BODY_TEXT_SIZE);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
    ensureSpace(7);
    doc.text('Areas assessed', PAGE.marginX, yPos);
    yPos += 6.5;
    drawBulletList(program.moduleIds.map(mid => `- ${moduleName(mid)} (${mid})`));
    yPos += 3;
  }

  addSectionHeader('Executive summary');

  // Stat row (submitted merged into completed - no review workflow yet)
  const completedDisplay = enrolment.completed + enrolment.submitted;
  const statBoxW = (PAGE.contentWidth - 9) / 4;
  ensureSpace(30);
  addStatBox(PAGE.marginX, yPos, statBoxW, String(enrolment.total), 'Enrolled', COLORS.amethystDiamond);
  addStatBox(PAGE.marginX + statBoxW + 3, yPos, statBoxW, String(completedDisplay), 'Completed', COLORS.strongText);
  addStatBox(PAGE.marginX + 2 * (statBoxW + 3), yPos, statBoxW, String(enrolment.in_progress), 'In progress', COLORS.mixedText);
  addStatBox(PAGE.marginX + 3 * (statBoxW + 3), yPos, statBoxW, String(enrolment.enrolled), 'Not started', COLORS.textMuted);
  yPos += 32;

  // Cohort maturity calc for the donut + insights
  const confidence = {
    strong: moduleAggregates.reduce((s, m) => s + m.confidence_strong, 0),
    mixed: moduleAggregates.reduce((s, m) => s + m.confidence_mixed, 0),
    needs: moduleAggregates.reduce((s, m) => s + m.confidence_needs_work, 0),
  };
  const confTotal = confidence.strong + confidence.mixed + confidence.needs;
  const strongPct = confTotal > 0 ? Math.round((confidence.strong / confTotal) * 100) : 0;
  const completedPct = pct(completedDisplay, enrolment.total);
  const maturity = computeMaturity({ strong: confidence.strong, mixed: confidence.mixed, total: confTotal });
  const risk = computeRisk(maturity.score, completedPct, confTotal);

  // Network Accessibility Maturity Score - the headline, trackable board-paper
  // metric. The donut below is the confidence breakdown behind it.
  ensureSpace(26);
  doc.setFillColor(...hexToRgb(COLORS.amethystDiamond));
  doc.roundedRect(PAGE.marginX, yPos, PAGE.contentWidth, 20, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text(String(maturity.score), PAGE.marginX + 8, yPos + 14);
  const scoreW = doc.getTextWidth(String(maturity.score));
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('/100', PAGE.marginX + 9 + scoreW, yPos + 14);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(`Network Accessibility Maturity: ${maturity.band}`, PAGE.marginX + 9 + scoreW + 16, yPos + 12.5);
  doc.setTextColor(0, 0, 0);
  yPos += 24;

  // Network accessibility risk read.
  const riskColor = risk.level === 'Low' ? COLORS.strongText : risk.level === 'High' ? COLORS.needsText : COLORS.mixedText;
  ensureSpace(8);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(BODY_TEXT_SIZE);
  doc.setTextColor(...hexToRgb(riskColor));
  doc.text(`Network accessibility risk: ${risk.level}`, PAGE.marginX, yPos);
  yPos += 5.5;
  doc.setTextColor(0, 0, 0);
  addParagraph(risk.note);

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
  doc.setFontSize(BODY_TEXT_SIZE);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
  doc.text('CONFIDENCE BREAKDOWN', interpX, yPos + 5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...hexToRgb(COLORS.text));
  doc.setFontSize(BODY_TEXT_SIZE);
  const interpText = `This is ${describeCohortMaturity(strongPct)}`;
  const interpLines = doc.splitTextToSize(interpText, interpW);
  let interpY = yPos + 11;
  interpLines.forEach((line: string) => {
    doc.text(line, interpX, interpY);
    interpY += 5.5;
  });

  // Clear the taller of the donut band and the interpretation text, so the 11pt
  // maturity blurb never overruns into the completion paragraph below.
  yPos = Math.max(yPos + 56, interpY + 3);

  // Completion context paragraph
  const completionText = `Completion: ${completedPct}% of enrolled businesses have finished. ${describeCompletion(completedPct, enrolment.total)}`;
  addParagraph(completionText, 9);

  // Program at a glance - the quotable summary for a council reader.
  {
    const paThemes = groupItems(payload.topPriorityActions);
    const glance: string[] = [`Cohort readiness: ${maturity.band} (${maturity.score}/100, ${strongPct}% strong)`];
    if (paThemes[0]) glance.push(`Biggest shared need: ${paThemes[0].label} (${paThemes[0].total} recommendation${paThemes[0].total !== 1 ? 's' : ''})`);
    // Strongest area = the area with the most strengths that is NOT the biggest
    // need, so this line names a genuinely different area. (The old "Recommended
    // focus" line was dropped - it just restated the biggest need, and the
    // Recommended council response section already covers what to do.)
    const strongestArea = groupItems(payload.topStrengths).find(g => g.key !== paThemes[0]?.key);
    if (strongestArea) glance.push(`Strongest area: ${strongestArea.label} (${strongestArea.total} strength${strongestArea.total !== 1 ? 's' : ''} already in place)`);
    if (payload.improvement && payload.improvement.reassessedCount > 0) glance.push(`Readiness change: ${payload.improvement.avgDelta >= 0 ? '+' : ''}${payload.improvement.avgDelta} points across ${payload.improvement.reassessedCount} re-assessed`);

    // Pre-wrap each line at the render font size so the box height matches what
    // actually draws. Long items (e.g. a wordy top-investment action) wrap to a
    // second line; rendering only the first line would truncate them.
    doc.setFontSize(BODY_TEXT_SIZE);
    const wrappedGlance = glance.map(g => doc.splitTextToSize(g, PAGE.contentWidth - 14) as string[]);
    const glanceLines = wrappedGlance.reduce((n, lines) => n + lines.length, 0);
    const gH = 11 + glanceLines * 6.5;
    ensureSpace(gH + 6);
    doc.setFillColor(...hexToRgb(COLORS.amethystDiamond));
    doc.roundedRect(PAGE.marginX, yPos, PAGE.contentWidth, gH, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('PROGRAM AT A GLANCE (FOR COUNCIL)', PAGE.marginX + 5, yPos + 7);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(BODY_TEXT_SIZE);
    let gy = yPos + 14;
    for (const lines of wrappedGlance) {
      doc.setFillColor(...hexToRgb(COLORS.aussieLight));
      doc.circle(PAGE.marginX + 6, gy - 1.2, 0.8, 'F');
      doc.setTextColor(255, 255, 255);
      lines.forEach(line => {
        doc.text(line, PAGE.marginX + 10, gy);
        gy += 6.5;
      });
    }
    yPos += gH + 5;
    doc.setTextColor(0, 0, 0);
  }

  // Key insights callout, grouped into Strengths / Common barriers / Opportunity.
  const insights = generateKeyInsights(payload, strongPct, completedPct);
  const insightGroups = [
    { label: 'Strengths', items: insights.strengths },
    { label: 'Common barriers', items: insights.barriers },
    { label: 'Biggest opportunity', items: insights.opportunity },
  ].filter(g => g.items.length > 0);
  if (insightGroups.length > 0) {
    const lineH = 5.5;
    // Pre-wrap every item at the render font size so the callout height matches
    // what actually draws. Long items (e.g. the opportunity summary) wrap to 2-3
    // lines; rendering only the first line would truncate them mid-sentence.
    doc.setFontSize(BODY_TEXT_SIZE);
    const wrapped = insightGroups.map(g => ({
      label: g.label,
      items: g.items.map(it => doc.splitTextToSize(it, PAGE.contentWidth - 16) as string[]),
    }));
    const calloutH = 7 + wrapped.reduce(
      (n, g) => n + 6.5 + g.items.reduce((m, lines) => m + lines.length * lineH, 0) + 1.5,
      0,
    ) + 1;
    ensureSpace(calloutH + 6);
    doc.setFillColor(...hexToRgb(COLORS.insightBg));
    doc.setDrawColor(...hexToRgb(COLORS.insightBorder));
    doc.setLineWidth(0.5);
    doc.roundedRect(PAGE.marginX, yPos, PAGE.contentWidth, calloutH, 3, 3, 'FD');
    doc.setFillColor(...hexToRgb(COLORS.amethystDiamond));
    doc.rect(PAGE.marginX, yPos, 2, calloutH, 'F');
    let iy = yPos + 7;
    for (const g of wrapped) {
      doc.setFontSize(BODY_TEXT_SIZE);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
      doc.text(g.label.toUpperCase(), PAGE.marginX + 6, iy);
      iy += 6.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(BODY_TEXT_SIZE);
      doc.setTextColor(...hexToRgb(COLORS.text));
      for (const lines of g.items) {
        doc.setFillColor(...hexToRgb(COLORS.amethystDiamond));
        doc.circle(PAGE.marginX + 8, iy - 1.2, 0.7, 'F');
        lines.forEach(line => {
          doc.text(line, PAGE.marginX + 12, iy);
          iy += lineH;
        });
      }
      iy += 1.5;
    }
    yPos += calloutH + 4;
    doc.setLineWidth(0.3);
  }

  // =====================================================
  // Program impact + recommended council response
  // =====================================================
  const sharedOpps = topPriorityActions.filter(a => a.count >= 3);
  const activeThemes = groupItems(topPriorityActions).length;

  addSectionHeader('Program impact');
  ensureSpace(30);
  const impactW = (PAGE.contentWidth - 9) / 4;
  addStatBox(PAGE.marginX, yPos, impactW, String(enrolment.total), 'Businesses reached', COLORS.amethystDiamond);
  addStatBox(PAGE.marginX + impactW + 3, yPos, impactW, String(completedDisplay), 'Assessments done', COLORS.strongText);
  addStatBox(PAGE.marginX + 2 * (impactW + 3), yPos, impactW, String(sharedOpps.length), 'Shared opportunities', COLORS.aussieLight);
  addStatBox(PAGE.marginX + 3 * (impactW + 3), yPos, impactW, String(activeThemes), groupMode === 'framework' ? 'Outcome areas' : 'Themes active', COLORS.mixedText);
  yPos += 30;
  addParagraph('Shared opportunities are recommendations that recur across three or more businesses - a signal of where a single, council-led initiative could help many at once rather than supporting each business separately.', 9);

  // Before/after improvement - only when the re-assessed subset exists.
  if (payload.improvement && payload.improvement.reassessedCount > 0) {
    const imp = payload.improvement;
    addSectionHeader('Program impact over time');
    ensureSpace(30);
    const impW = (PAGE.contentWidth - 9) / 4;
    const deltaColor = imp.avgDelta > 0 ? COLORS.strongText : imp.avgDelta < 0 ? COLORS.needsText : COLORS.textMuted;
    addStatBox(PAGE.marginX, yPos, impW, String(imp.avgBaselineReadiness), 'Avg readiness before', COLORS.textMuted);
    addStatBox(PAGE.marginX + impW + 3, yPos, impW, String(imp.avgCurrentReadiness), 'Avg readiness now', COLORS.amethystDiamond);
    addStatBox(PAGE.marginX + 2 * (impW + 3), yPos, impW, `${imp.avgDelta >= 0 ? '+' : ''}${imp.avgDelta}`, 'Change', deltaColor);
    addStatBox(PAGE.marginX + 3 * (impW + 3), yPos, impW, `${imp.improvedCount}/${imp.reassessedCount}`, 'Businesses improved', COLORS.strongText);
    yPos += 30;
    addParagraph(`Measured only for the ${imp.reassessedCount} business${imp.reassessedCount !== 1 ? 'es' : ''} that have re-assessed since joining - a fair before-and-after needs two assessments. Readiness is a 0 to 100 score weighted by confidence (strong 100, mixed 50, needs work 0). Businesses assessed once are not counted here until they re-assess.`, 9);
  }

  addSectionHeader('Module progress');
  addParagraph('Completion rate and confidence band distribution for each module in scope. Wider green means the cohort is doing well, wider red means collective attention is needed. The verdict on the right flags where to focus: Maintain (doing well), Invest (mixed, targeted support pays off) or Improve (the biggest collective gap).');

  // Legend for the confidence bars
  ensureSpace(8);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  let lx = PAGE.marginX;
  for (const li of [{ c: COLORS.strongFill, l: 'Strong' }, { c: COLORS.mixedFill, l: 'Mixed' }, { c: COLORS.needsFill, l: 'Needs work' }]) {
    doc.setFillColor(...hexToRgb(li.c));
    doc.rect(lx, yPos - 2.6, 3, 3, 'F');
    doc.setTextColor(...hexToRgb(COLORS.textMuted));
    doc.text(li.l, lx + 4.5, yPos);
    lx += 4.5 + doc.getTextWidth(li.l) + 8;
  }
  yPos += 7;
  doc.setTextColor(0, 0, 0);

  program.moduleIds.forEach(mid => {
    const agg = moduleAggregates.find(a => a.module_id === mid);
    addModuleRow(mid, agg);
  });

  // What this means. Rank by the share of assessed businesses needing work, not
  // the raw count, so the module flagged matches the "most needs-work signal"
  // barrier insight above (which also uses the ratio). Absolute count is the
  // tiebreak when two modules have the same share.
  const needsRatio = (m: ModuleAggregate) => {
    const t = m.confidence_strong + m.confidence_mixed + m.confidence_needs_work;
    return t > 0 ? m.confidence_needs_work / t : 0;
  };
  const topNeeds = [...moduleAggregates]
    .filter(m => (m.confidence_strong + m.confidence_mixed + m.confidence_needs_work) >= MIN_ASSESSED_TO_FLAG)
    .sort((a, b) => (needsRatio(b) - needsRatio(a)) || (b.confidence_needs_work - a.confidence_needs_work))[0];
  const interpModuleText = topNeeds && topNeeds.confidence_needs_work > 0
    ? `What this means: ${moduleName(topNeeds.module_id)} (${topNeeds.module_id}) shows the strongest needs-work signal across the cohort. A group training or shared resource focused here will lift multiple businesses at once.`
    : `What this means: confidence is reasonably consistent across modules. No single module dominates as a sector-wide concern, so support can be distributed.`;
  drawWhatThisMeans(interpModuleText);

  // =====================================================
  // Top priority actions
  // =====================================================
  if (topPriorityActions.length > 0) {
    addSectionHeader(`Common recommendations by ${groupWord}`);
    addParagraph(`Where businesses most often received recommendations, by area. Counts show how many businesses each pattern appears in - a signal of where shared support would help most. The specific actions below are examples drawn from the assessment responses to illustrate each ${groupWord}; check the specifics with the businesses before acting on their behalf.`);

    groupItems(topPriorityActions).forEach(g => {
      ensureSpace(18);
      doc.setFontSize(BODY_TEXT_SIZE);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
      doc.splitTextToSize(`${g.label} - ${g.total} recommendation${g.total !== 1 ? 's' : ''} across the cohort`, PAGE.contentWidth).forEach((l: string) => { ensureSpace(6.5); doc.text(l, PAGE.marginX, yPos); yPos += 6.5; });
      // Shared-response suggestion (folds in the old "investments" section).
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(BODY_TEXT_SIZE);
      doc.setTextColor(...hexToRgb(COLORS.textMuted));
      doc.splitTextToSize(`A shared response - ${sharedResponseFor(g.key)} - would reach many businesses at once. Examples:`, PAGE.contentWidth).forEach((l: string) => { ensureSpace(5.5); doc.text(l, PAGE.marginX, yPos); yPos += 5.5; });
      doc.setTextColor(...hexToRgb(COLORS.text));
      drawBulletList(g.items.slice(0, 3).map(pa =>
        `- ${pa.action} (${pa.count} business${pa.count !== 1 ? 'es' : ''}${pa.priority ? `, ${pa.priority.toUpperCase()} priority` : ''})`));
      if (g.items.length > 3) {
        ensureSpace(6);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(BODY_TEXT_SIZE);
        doc.setTextColor(...hexToRgb(COLORS.textMuted));
        doc.text(`...and ${g.items.length - 3} more in this ${groupWord} - see the appendix for the full list`, PAGE.marginX + 4, yPos);
        yPos += 6;
        doc.setTextColor(...hexToRgb(COLORS.text));
      }
      yPos += 3;
    });
    addParagraph(`The main body shows the top few patterns per ${groupWord}; every recommendation pattern is listed in full in the appendix.`);
  }

  // =====================================================
  // Priorities by planning horizon (the second grouping lens)
  // =====================================================
  {
    const horizons = priorityHorizons(topPriorityActions);
    if (horizons.length > 0) {
      addSectionHeader('Priorities by planning horizon');
      addParagraph("The cohort's most common recommended actions, grouped so they map onto your planning cycles.");
      horizons.forEach(h => {
        ensureSpace(16);
        doc.setFontSize(BODY_TEXT_SIZE);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
        doc.text(`${h.label} - ${h.hint}`, PAGE.marginX, yPos);
        yPos += 6.5;
        drawBulletList(h.items.slice(0, 6).map(p => `- ${p.action} (${p.count} business${p.count !== 1 ? 'es' : ''})`));
        yPos += 3;
      });
    }
  }

  // =====================================================
  // Recommended actions for the authority (decisions for the council)
  // =====================================================
  {
    const authRecs = authorityRecommendations(payload);
    if (authRecs.length > 0) {
      addSectionHeader('Recommended actions for the authority');
      addParagraph("Where to focus next, drawn from the cohort's aggregate signal - actions for the authority, not the individual businesses.");
      authRecs.forEach(r => {
        ensureSpace(14);
        doc.setFontSize(BODY_TEXT_SIZE);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
        doc.text(r.kind, PAGE.marginX, yPos);
        yPos += 5.5;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...hexToRgb(COLORS.text));
        doc.splitTextToSize(r.text, PAGE.contentWidth).forEach((l: string) => { ensureSpace(5.5); doc.text(l, PAGE.marginX, yPos); yPos += 5.5; });
        yPos += 3;
      });
    }
  }

  // =====================================================
  // Strengths
  // =====================================================
  if (topStrengths.length > 0) {
    addSectionHeader('Strengths across the cohort');
    addParagraph('Practices already in place, grouped by area. Worth celebrating publicly and using as case studies.');
    groupItems(topStrengths).forEach(g => {
      ensureSpace(16);
      doc.setFontSize(BODY_TEXT_SIZE);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
      doc.text(g.label, PAGE.marginX, yPos);
      yPos += 6.5;
      drawBulletList(g.items.map(s => `- ${s.text} (${s.count} business${s.count !== 1 ? 'es' : ''})`));
      yPos += 3;
    });

    drawWhatThisMeans('What this means: these are strengths businesses report already having in place (self-assessed, not independently audited). Confirm before citing externally, then use them to celebrate progress in council communications and case studies.');
  }

  // =====================================================
  // Areas to explore
  // =====================================================
  if (topAreasToExplore.length > 0) {
    addSectionHeader('Capability gaps');
    addParagraph('Topics businesses flagged as "unable to check" or "unsure". This measures where the cohort lacks knowledge, not where it is failing - each gap is a low-cost training or guidance opportunity.');
    drawBulletList(topAreasToExplore.map(a => `- ${a.text} (${a.count} business${a.count !== 1 ? 'es' : ''})`));

    drawWhatThisMeans('What this means: businesses are uncertain rather than failing. A short council-issued guide or a quick training session can turn this uncertainty into competence at low cost.');
  }

  // =====================================================
  // Statutory framework alignment (optional; from payload.outcomes)
  // =====================================================
  if (payload.outcomes && payload.outcomes.domains.some(d => d.total > 0)) {
    const fw = payload.outcomes;
    addSectionHeader(`Alignment with ${fw.frameworkShort} - readiness by outcome area`);
    addParagraph(`This is the cohort's readiness against each ${fw.frameworkShort} outcome domain - the confidence bands mapped to the ${fw.frameworkName} domains, to support your statutory reporting.${groupMode === 'framework' ? ` It complements the recommendations earlier in this report, which are grouped by these same outcome areas: this section shows where the cohort stands, those show what to act on.` : ''} The mapping is automated - confirm it fits your plan before relying on it. Every outcome domain is listed; domains with no assessed modules yet are shown as not yet covered so the coverage gap is explicit.`);
    // List ALL framework domains, including any with no assessed modules. For a
    // statutory report an uncovered outcome area is itself reportable, so it is
    // shown as "not yet covered" rather than silently dropped.
    fw.domains.forEach(d => {
      ensureSpace(18);
      doc.setFontSize(BODY_TEXT_SIZE);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRgb(COLORS.text));
      doc.text(d.name, PAGE.marginX, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(BODY_TEXT_SIZE);
      doc.setTextColor(...hexToRgb(COLORS.textMuted));
      doc.text(d.total > 0 ? `${d.total} assessed` : 'Not yet covered', PAGE.width - PAGE.marginX, yPos, { align: 'right' });
      yPos += 4;
      const barW = PAGE.contentWidth;
      const barH = 4;
      doc.setFillColor(...hexToRgb(COLORS.greyBar));
      doc.roundedRect(PAGE.marginX, yPos, barW, barH, 1, 1, 'F');
      if (d.total > 0) {
        let x = PAGE.marginX;
        const seg = (v: number, color: string) => {
          if (v > 0) { const w = (v / d.total) * barW; doc.setFillColor(...hexToRgb(color)); doc.rect(x, yPos, w, barH, 'F'); x += w; }
        };
        seg(d.strong, COLORS.strongFill);
        seg(d.mixed, COLORS.mixedFill);
        seg(d.needsWork, COLORS.needsFill);
      }
      yPos += barH + 6;
      doc.setFontSize(BODY_TEXT_SIZE);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...hexToRgb(COLORS.textMuted));
      doc.text(
        d.total > 0
          ? `Strong ${d.strong}  -  Mixed ${d.mixed}  -  Needs work ${d.needsWork}`
          : 'No modules in this program map to this outcome area yet.',
        PAGE.marginX,
        yPos,
      );
      yPos += 6;
      doc.setTextColor(0, 0, 0);
    });
  }

  // =====================================================
  // Methodology (concise)
  // =====================================================
  addSectionHeader('Methodology and privacy');
  addParagraph('This report aggregates completion and confidence bands across enrolled businesses; individual business responses are never shown. Each figure counts distinct businesses from their most recent assessment, with withdrawn businesses excluded. Priority actions and strengths are self-assessed narrative (not independently audited); the same recommendation is counted once per business and grouped across the cohort. Figures are a point-in-time snapshot and update as businesses complete or re-assess; treat a small cohort as indicative rather than conclusive.');

  // =====================================================
  // Appendix - full recommendation list by theme
  // =====================================================
  if (topPriorityActions.length > 0) {
    addNewPage();
    addSectionHeader(`Appendix: all recommendations by ${groupWord}`);
    addParagraph(`The complete list of recommendation patterns the report holds, grouped by area. The main body highlights the top few in each ${groupWord}; this appendix carries the rest. Counts show how many businesses each pattern appears in. Check the specifics with the businesses before acting on their behalf.`);

    groupItems(topPriorityActions).forEach(g => {
      ensureSpace(16);
      doc.setFontSize(BODY_TEXT_SIZE);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
      doc.splitTextToSize(`${g.label} - ${g.total} recommendation${g.total !== 1 ? 's' : ''} across the cohort`, PAGE.contentWidth).forEach((l: string) => { ensureSpace(6.5); doc.text(l, PAGE.marginX, yPos); yPos += 6.5; });
      drawBulletList(g.items.map(pa =>
        `- ${pa.action} (${pa.count} business${pa.count !== 1 ? 'es' : ''}${pa.priority ? `, ${pa.priority.toUpperCase()} priority` : ''})`));
      yPos += 3;
    });
  }

  addFooter();

  doc.save(`program-report-${safeProgramName}-${groupSlug}-${fileDate}.pdf`);
}
