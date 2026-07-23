/**
 * Access Profile PDF export
 *
 * A concise, branded venue accessibility profile. Mirrors the brand header and
 * 11pt minimum font rules used by pdfGenerator.ts.
 */

import jsPDF from 'jspdf';
import type { AccessStatement } from './generateAccessStatement';

const PAGE = { width: 210, marginLeft: 20, marginRight: 20, contentWidth: 170 };

export function downloadAccessProfilePdf(statement: AccessStatement): void {
  const doc = new jsPDF('p', 'mm', 'a4');

  // Enforce an 11pt minimum font size across the document.
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
    if (y + space > 278) newPage();
  };

  header();
  y = 24;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(73, 14, 103);
  doc.text(statement.organisationName, PAGE.marginLeft, y);
  y += 8;

  const date = new Date(statement.generatedAt).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(90, 90, 90);
  doc.text(`Accessibility features, self-reported as of ${date}.`, PAGE.marginLeft, y);
  y += 10;
  doc.setTextColor(0, 0, 0);

  for (const cat of statement.categories) {
    ensure(16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(73, 14, 103);
    doc.text(cat.title, PAGE.marginLeft, y);
    y += 2;
    doc.setDrawColor(255, 144, 21);
    doc.setLineWidth(0.6);
    doc.line(PAGE.marginLeft, y, PAGE.marginLeft + PAGE.contentWidth, y);
    y += 6;
    doc.setTextColor(0, 0, 0);

    for (const f of cat.features) {
      const text = `${f.label}${f.detail ? ` (${f.detail})` : ''}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(text, PAGE.contentWidth - 20) as string[];
      ensure(lines.length * 5 + 3);
      doc.setFont('helvetica', 'bold');
      if (f.state === 'yes') doc.setTextColor(21, 128, 61);
      else doc.setTextColor(180, 83, 9);
      doc.text(f.state === 'yes' ? 'Yes' : 'Partial', PAGE.marginLeft, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(26, 26, 46);
      doc.text(lines, PAGE.marginLeft + 18, y);
      y += lines.length * 5 + 3;
    }
    y += 4;
  }

  footer();
  const slug = statement.organisationName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'venue';
  doc.save(`accessibility-profile-${slug}.pdf`);
}
