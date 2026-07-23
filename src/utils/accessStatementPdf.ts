/**
 * Access Profile PDF export
 *
 * A warm, written venue accessibility profile. Mirrors the brand header and
 * 11pt minimum font rules used by pdfGenerator.ts.
 */

import jsPDF from 'jspdf';
import {
  buildAccessProfileLayout,
  accessProfileIntro,
  accessProfileClosing,
  type AccessStatement,
} from './generateAccessStatement';

const PAGE = { width: 210, marginLeft: 20, marginRight: 20, contentWidth: 170 };

export function downloadAccessProfilePdf(statement: AccessStatement): void {
  const doc = new jsPDF('p', 'mm', 'a4');

  const origSetFontSize = doc.setFontSize.bind(doc);
  (doc as unknown as { setFontSize: (n: number) => jsPDF }).setFontSize = (n: number) =>
    origSetFontSize(Math.max(11, n));

  doc.setLanguage('en-AU');
  doc.setProperties({
    title: `Accessibility Profile — ${statement.organisationName}`,
    subject: 'Venue accessibility profile',
    author: 'Access Compass by Flare Access',
    creator: 'Access Compass',
  });

  let page = 1;
  let y = 0;

  const header = () => {
    doc.setFillColor(58, 11, 82);
    doc.rect(0, 0, PAGE.width, 15, 'F');
    doc.setFillColor(255, 144, 21);
    doc.rect(0, 14, PAGE.width, 1.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Access Compass', PAGE.marginLeft, 10);
    doc.setFont('helvetica', 'normal');
    doc.text('Accessibility profile', PAGE.width - PAGE.marginRight, 10, { align: 'right' });
    doc.setTextColor(0, 0, 0);
  };

  const footer = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(120, 120, 120);
    doc.text('Prepared with Access Compass', PAGE.marginLeft, 289);
    doc.text(`Page ${page}`, PAGE.width - PAGE.marginRight, 289, { align: 'right' });
    doc.setTextColor(0, 0, 0);
  };

  const newPage = () => {
    footer();
    doc.addPage();
    page += 1;
    header();
    y = 24;
  };

  const ensure = (space: number) => {
    if (y + space > 276) newPage();
  };

  const paragraph = (text: string, size: number, color: [number, number, number], gap = 5) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lineHeight = size >= 13 ? 6 : 5.4;
    const lines = doc.splitTextToSize(text, PAGE.contentWidth) as string[];
    ensure(lines.length * lineHeight + gap);
    doc.text(lines, PAGE.marginLeft, y);
    y += lines.length * lineHeight + gap;
    doc.setTextColor(0, 0, 0);
  };

  header();
  y = 26;

  // Venue name and subtitle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(73, 14, 103);
  const nameLines = doc.splitTextToSize(statement.organisationName, PAGE.contentWidth) as string[];
  doc.text(nameLines, PAGE.marginLeft, y);
  y += nameLines.length * 9 + 2;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(120, 120, 120);
  doc.text('Accessibility profile', PAGE.marginLeft, y);
  y += 9;
  doc.setTextColor(0, 0, 0);

  // Intro and date
  paragraph(accessProfileIntro(statement.organisationName), 12, [40, 40, 50], 3);
  const date = new Date(statement.generatedAt).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  paragraph(`Self-reported as of ${date}.`, 11, [130, 130, 130], 4);

  doc.setDrawColor(255, 144, 21);
  doc.setLineWidth(0.6);
  ensure(6);
  doc.line(PAGE.marginLeft, y, PAGE.marginLeft + PAGE.contentWidth, y);
  y += 8;

  // Reserve room for the heading plus a few lines of its content, so a heading
  // can never be left orphaned at the bottom of a page.
  const heading = (text: string) => {
    ensure(28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(73, 14, 103);
    doc.text(text, PAGE.marginLeft, y);
    y += 7;
    doc.setTextColor(0, 0, 0);
  };

  const layout = buildAccessProfileLayout(statement);

  // Each category with its prose and any custom sections placed under it.
  for (const block of layout.categories) {
    heading(block.title);
    if (block.paragraph) paragraph(block.paragraph, 12, [40, 40, 50], block.sections.length ? 4 : 7);
    for (const s of block.sections) {
      if (s.heading?.trim()) {
        ensure(20);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 70);
        doc.text(s.heading.trim(), PAGE.marginLeft, y);
        y += 6;
        doc.setTextColor(0, 0, 0);
      }
      paragraph(s.text.trim(), 12, [40, 40, 50], 7);
    }
  }

  // General custom sections at the end.
  for (const s of layout.general) {
    heading(s.heading?.trim() || 'More information');
    paragraph(s.text.trim(), 12, [40, 40, 50], 7);
  }

  // Closing
  ensure(6);
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.4);
  doc.line(PAGE.marginLeft, y, PAGE.marginLeft + PAGE.contentWidth, y);
  y += 8;
  paragraph(accessProfileClosing(statement.organisationName), 11, [90, 90, 90], 4);

  footer();
  const slug = statement.organisationName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'venue';
  doc.save(`accessibility-profile-${slug}.pdf`);
}
