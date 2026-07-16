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
  if (strongPct >= 60) return 'an established cohort. Most businesses have solid accessibility foundations and are assessing at high confidence. The opportunity now is to capture what the strongest businesses do well as shared case studies and lift the rest to the same standard.';
  if (strongPct >= 40) return 'a developing cohort. Businesses have good foundations and clear, visible areas to improve. Shared support focused on the themes with the highest needs signal will move several businesses forward at once.';
  if (strongPct >= 20) return 'an emerging cohort. Businesses are beginning to establish accessibility foundations - most have started the journey but still need structured guidance and practical implementation support. Sector-wide training and shared resources will accelerate progress on the priorities below.';
  return 'a cohort at the very start of its journey. Capacity-building investment now, targeted at the most common barriers, will produce measurable progress within 6 to 12 months.';
}

function maturityBand(strongPct: number): string {
  if (strongPct >= 60) return 'Established';
  if (strongPct >= 40) return 'Developing';
  if (strongPct >= 20) return 'Emerging';
  return 'Early';
}

// Templated shared-response suggestion per DIAP-category theme. Generic wording
// only - no invented figures, costs or benchmarks.
const THEME_SHARED_RESPONSE: Record<string, string> = {
  'physical-access': 'a shared works grant or bulk procurement (e.g. ramps, signage, hearing augmentation)',
  'information-communication-marketing': 'a shared accessible-information template or group communications training',
  'customer-service': 'a group disability-awareness and service training session',
  'operations-policy-procedure': 'a shared policy template or joint procedure workshop',
  'people-culture': 'a cohort-wide capability and inclusion training program',
};
function sharedResponseFor(themeKey?: string): string {
  return (themeKey && THEME_SHARED_RESPONSE[themeKey]) || 'a shared initiative or group program';
}

interface ThemeGroup<T> { key: string; label: string; total: number; items: T[]; }
function groupByTheme<T extends { count: number; theme?: { key: string; label: string } }>(items: T[]): ThemeGroup<T>[] {
  const map = new Map<string, ThemeGroup<T>>();
  for (const it of items) {
    const key = it.theme?.key ?? 'other';
    const label = it.theme?.label ?? 'Other';
    let g = map.get(key);
    if (!g) { g = { key, label, total: 0, items: [] }; map.set(key, g); }
    g.total += it.count;
    g.items.push(it);
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

function describeCompletion(completedPct: number, total: number): string {
  if (total === 0) return 'No businesses are currently enrolled. Once enrolment begins this section will populate.';
  if (completedPct >= 80) return 'Most businesses have finished their assessments, giving this report a high-confidence basis. Findings can be cited in public reporting.';
  if (completedPct >= 40) return 'A meaningful proportion has finished. Findings are directional but reliable. Follow up with the in-progress cohort to firm up the picture before public reporting.';
  if (completedPct >= 15) return 'Early-stage program. Findings are indicative only. Consider this a baseline read; re-run the report in 4-8 weeks once more businesses complete.';
  return 'Very early in the program. Treat the figures below as preliminary signal, not conclusion.';
}

interface GroupedInsights { strengths: string[]; barriers: string[]; opportunity: string[]; }

function generateKeyInsights(payload: ProgramReportPayload, strongPct: number, completedPct: number): GroupedInsights {
  const { moduleAggregates, topPriorityActions, topStrengths } = payload;
  const strengths: string[] = [];
  const barriers: string[] = [];
  const opportunity: string[] = [];

  if (strongPct >= 50) strengths.push(`${strongPct}% of assessed modules show strong confidence - the cohort is doing well overall.`);
  else if (strongPct >= 25) strengths.push(`${strongPct}% of assessed modules are already strong - a solid base to build on.`);
  if (topStrengths.length > 0) {
    const t = topStrengths[0];
    strengths.push(`"${t.text}" is in place across ${t.count} business${t.count !== 1 ? 'es' : ''} - worth highlighting publicly.`);
  }

  const sortedByNeeds = [...moduleAggregates]
    .filter(m => (m.confidence_strong + m.confidence_mixed + m.confidence_needs_work) > 0)
    .sort((a, b) => {
      const at = a.confidence_strong + a.confidence_mixed + a.confidence_needs_work;
      const bt = b.confidence_strong + b.confidence_mixed + b.confidence_needs_work;
      return (b.confidence_needs_work / bt) - (a.confidence_needs_work / at);
    });
  if (sortedByNeeds.length > 0 && sortedByNeeds[0].confidence_needs_work > 0) {
    const m = sortedByNeeds[0];
    const tot = m.confidence_strong + m.confidence_mixed + m.confidence_needs_work;
    barriers.push(`${moduleName(m.module_id)} (${m.module_id}) shows the most needs-work signal (${m.confidence_needs_work} of ${tot}). Prioritise for cohort-wide support.`);
  }
  if (strongPct < 25) barriers.push(`Cohort maturity is still developing (${strongPct}% strong), so meaningful collective work remains.`);

  if (topPriorityActions.length > 0) {
    const area = topPriorityActions[0].theme?.label;
    opportunity.push(area
      ? `${area} is where recommendations cluster most across the cohort - the strongest area for a shared, council-led response rather than supporting businesses one at a time.`
      : `Recommendations cluster in a few areas across the cohort - a shared, council-led response reaches more businesses than one-at-a-time support.`);
  }
  if (completedPct >= 40 && completedPct < 80) opportunity.push(`At ${completedPct}% completion, re-running in 4 to 6 weeks will firm up findings before public reporting.`);

  return { strengths, barriers, opportunity };
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
    ensureSpace(20);

    doc.setFontSize(BODY_TEXT_SIZE);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(COLORS.text));
    doc.text(`${moduleName(moduleId)} (${moduleId})`, PAGE.marginX, yPos);

    const total = agg?.total_enrolments ?? 0;
    const completed = agg?.completed ?? 0;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(BODY_TEXT_SIZE);
    doc.setTextColor(...hexToRgb(COLORS.textMuted));
    doc.text(`${completed}/${total} completed`, PAGE.width - PAGE.marginX, yPos, { align: 'right' });
    yPos += 4;

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
    yPos += barH + 3;

    if (confTotal > 0) {
      doc.setFontSize(BODY_TEXT_SIZE);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...hexToRgb(COLORS.textMuted));
      doc.text(
        `Strong ${confStrong}  -  Mixed ${confMixed}  -  Needs work ${confNeeds}`,
        PAGE.marginX,
        yPos,
      );
      yPos += 6;
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
    { val: String(enrolment.completed + enrolment.submitted), label: 'Completed' },
    { val: String(program.moduleIds.length), label: 'Modules' },
    { val: `${pct(enrolment.completed + enrolment.submitted, enrolment.total)}%`, label: 'Completion' },
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
  doc.text(`COHORT MATURITY: ${maturityBand(strongPct).toUpperCase()}`, interpX, yPos + 5);
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
    const paThemes = groupByTheme(payload.topPriorityActions);
    // Lower-case the lead word of an "e.g." example so it reads mid-sentence,
    // but leave acronyms (NDIS, DIAP) untouched.
    const asExample = (t: string) => (/^[A-Z]{2,}/.test(t) ? t : t.charAt(0).toLowerCase() + t.slice(1));
    const glance: string[] = [`Cohort readiness: ${maturityBand(strongPct)} (${strongPct}% strong)`];
    if (paThemes[0]) glance.push(`Biggest shared need: ${paThemes[0].label} (${paThemes[0].total} recommendation${paThemes[0].total !== 1 ? 's' : ''})`);
    if (payload.topStrengths[0]) {
      const s = payload.topStrengths[0];
      glance.push(s.theme?.label ? `Strongest area: ${s.theme.label} (e.g. ${asExample(s.text)})` : `Strongest area: ${s.text}`);
    }
    if (paThemes[0] && payload.topPriorityActions[0]) glance.push(`Recommended focus: a shared ${paThemes[0].label} initiative (e.g. ${asExample(payload.topPriorityActions[0].action)})`);
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
  const sharedOpps = topPriorityActions.filter(a => a.count >= 2);
  const activeThemes = new Set(topPriorityActions.map(a => a.theme?.key ?? 'other')).size;

  addSectionHeader('Program impact');
  ensureSpace(30);
  const impactW = (PAGE.contentWidth - 9) / 4;
  addStatBox(PAGE.marginX, yPos, impactW, String(enrolment.total), 'Businesses reached', COLORS.amethystDiamond);
  addStatBox(PAGE.marginX + impactW + 3, yPos, impactW, String(completedDisplay), 'Assessments done', COLORS.strongText);
  addStatBox(PAGE.marginX + 2 * (impactW + 3), yPos, impactW, String(sharedOpps.length), 'Shared opportunities', COLORS.aussieLight);
  addStatBox(PAGE.marginX + 3 * (impactW + 3), yPos, impactW, String(activeThemes), 'Themes active', COLORS.mixedText);
  yPos += 30;
  addParagraph('Shared opportunities are recommendations that recur across two or more businesses - a signal of where a single, council-led initiative could help many at once rather than supporting each business separately.', 9);

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

  if (sharedOpps.length > 0) {
    ensureSpace(24);
    doc.setFontSize(BODY_TEXT_SIZE);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
    doc.text('Recommended council response', PAGE.marginX, yPos);
    yPos += 6.5;
    // Lead with the AREA and a direction, not a single frequency-derived action:
    // the counts show where support helps most, but the specific action to fund
    // should be confirmed against the businesses' plans, not read off one line.
    drawBulletList(groupByTheme(sharedOpps).slice(0, 3).map(g =>
      `- ${g.label}: recommendations recur across ${g.total} point${g.total !== 1 ? 's' : ''} in the cohort. Consider ${sharedResponseFor(g.key)}.`));
    yPos += 2;
    doc.setTextColor(0, 0, 0);
  }

  addSectionHeader('Module progress');
  addParagraph('Completion rate and confidence band distribution for each module in scope. Wider green means the cohort is doing well, wider red means collective attention is needed.', 9);

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
    .filter(m => (m.confidence_strong + m.confidence_mixed + m.confidence_needs_work) > 0)
    .sort((a, b) => (needsRatio(b) - needsRatio(a)) || (b.confidence_needs_work - a.confidence_needs_work))[0];
  const interpModuleText = topNeeds && topNeeds.confidence_needs_work > 0
    ? `What this means: ${moduleName(topNeeds.module_id)} (${topNeeds.module_id}) shows the strongest needs-work signal across the cohort. A group training or shared resource focused here will lift multiple businesses at once.`
    : `What this means: confidence is reasonably consistent across modules. No single module dominates as a sector-wide concern, so support can be distributed.`;
  drawWhatThisMeans(interpModuleText);

  // =====================================================
  // Top priority actions
  // =====================================================
  if (topPriorityActions.length > 0) {
    addSectionHeader('Common recommendations by theme');
    addParagraph('Where businesses most often received recommendations, by area. Counts show how many businesses each pattern appears in - a signal of where shared support would help most. The specific actions below are examples drawn from the assessment responses to illustrate each theme; confirm against each business’s own plan before acting.');

    groupByTheme(topPriorityActions).forEach(g => {
      ensureSpace(18);
      doc.setFontSize(BODY_TEXT_SIZE);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
      doc.splitTextToSize(`${g.label} - ${g.total} recommendation${g.total !== 1 ? 's' : ''} across the cohort`, PAGE.contentWidth).forEach((l: string) => { ensureSpace(6.5); doc.text(l, PAGE.marginX, yPos); yPos += 6.5; });
      drawBulletList(g.items.slice(0, 3).map(pa =>
        `- ${pa.action} (${pa.count} business${pa.count !== 1 ? 'es' : ''}${pa.priority ? `, ${pa.priority.toUpperCase()} priority` : ''})`));
      if (g.items.length > 3) {
        ensureSpace(6);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(BODY_TEXT_SIZE);
        doc.setTextColor(...hexToRgb(COLORS.textMuted));
        doc.text(`...and ${g.items.length - 3} more in this theme`, PAGE.marginX + 4, yPos);
        yPos += 6;
        doc.setTextColor(...hexToRgb(COLORS.text));
      }
      yPos += 3;
    });
    addParagraph('The main body shows the top few patterns per theme; every recommendation pattern is listed in full in the appendix.');
  }

  // =====================================================
  // Recommended program investments (shared opportunities)
  // =====================================================
  if (sharedOpps.length > 0) {
    addSectionHeader('Recommended program investments');
    addParagraph('Areas where a single, shared initiative would serve many businesses at once. These point to where investment goes furthest based on how often recommendations recur; they are a starting point for council planning, not a costed commitment. Confirm the specific response against the underlying business plans before committing.');
    groupByTheme(sharedOpps).slice(0, 5).forEach((g, idx) => {
      ensureSpace(16);
      doc.setFontSize(BODY_TEXT_SIZE);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRgb(COLORS.text));
      doc.splitTextToSize(`${idx + 1}. ${g.label}`, PAGE.contentWidth).forEach((l: string) => { ensureSpace(6); doc.text(l, PAGE.marginX, yPos); yPos += 6; });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(BODY_TEXT_SIZE);
      doc.setTextColor(...hexToRgb(COLORS.textMuted));
      doc.splitTextToSize(`Recommendations recur across ${g.total} point${g.total !== 1 ? 's' : ''} in the cohort here. A shared response - ${sharedResponseFor(g.key)} - would reach many businesses at once.`, PAGE.contentWidth).forEach((l: string) => { ensureSpace(5.5); doc.text(l, PAGE.marginX, yPos); yPos += 5.5; });
      yPos += 3;
      doc.setTextColor(0, 0, 0);
    });
  }

  // =====================================================
  // Strengths
  // =====================================================
  if (topStrengths.length > 0) {
    addSectionHeader('Strengths across the cohort');
    addParagraph('Practices already in place, grouped by area. Worth celebrating publicly and using as case studies.');
    groupByTheme(topStrengths).forEach(g => {
      ensureSpace(16);
      doc.setFontSize(BODY_TEXT_SIZE);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRgb(COLORS.amethystDiamond));
      doc.text(g.label, PAGE.marginX, yPos);
      yPos += 6.5;
      drawBulletList(g.items.map(s => `- ${s.text} (${s.count} business${s.count !== 1 ? 'es' : ''})`));
      yPos += 3;
    });

    drawWhatThisMeans('What this means: these are proof points. Use them in council communications, grant applications and award nominations to demonstrate sector progress and reassure the community that local businesses are responsive.');
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
    addSectionHeader(`Alignment with ${fw.frameworkShort}`);
    addParagraph(`The cohort's confidence bands mapped to the ${fw.frameworkName} outcome domains, ready for statutory reporting. Every outcome domain is listed; domains with no assessed modules yet are shown as not yet covered so the coverage gap is explicit.`);
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
      yPos += barH + 4;
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
  addParagraph('This report aggregates completion and confidence bands across enrolled businesses; individual business responses are never shown. Priority actions and strengths are the narrative generated from each business assessment, counted by how many businesses share each one. Figures are a point-in-time snapshot and update as more businesses complete or re-assess.', 9);

  // =====================================================
  // Appendix - full recommendation list by theme
  // =====================================================
  if (topPriorityActions.length > 0) {
    addNewPage();
    addSectionHeader('Appendix: all recommendations by theme');
    addParagraph('The complete list of recommendation patterns the report holds, grouped by area. The main body highlights the top few in each theme; this appendix carries the rest. Counts show how many businesses each pattern appears in. Confirm against each business’s own plan before acting.', 9);

    groupByTheme(topPriorityActions).forEach(g => {
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

  doc.save(`program-report-${safeProgramName}-${fileDate}.pdf`);
}
