import jsPDF from 'jspdf';
import type { BadgeLevel } from '../hooks/useBadgeProgress';

interface CertificateOptions {
  organisationName: string;
  level: BadgeLevel;
  completedModules: string[];
  totalModules: number;
  completionDate: string;
}

const LEVEL_COLORS: Record<Exclude<BadgeLevel, 'none'>, { primary: string; secondary: string; label: string }> = {
  bronze: { primary: '#92400e', secondary: '#b45309', label: 'Bronze' },
  silver: { primary: '#4b5563', secondary: '#6b7280', label: 'Silver' },
  gold: { primary: '#92400e', secondary: '#d97706', label: 'Gold' },
  platinum: { primary: '#490E67', secondary: '#6b21a8', label: 'Platinum' },
};

export function downloadCertificate(options: CertificateOptions): void {
  const { organisationName, level, completedModules, totalModules, completionDate } = options;

  if (level === 'none') return;

  const colors = LEVEL_COLORS[level];
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = 297;
  const pageHeight = 210;

  // Background
  doc.setFillColor(250, 248, 245);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Top gradient bar
  doc.setFillColor(73, 14, 103);
  doc.rect(0, 0, pageWidth, 28, 'F');
  doc.setFillColor(107, 33, 168);
  doc.rect(0, 24, pageWidth, 4, 'F');

  // Border
  doc.setDrawColor(73, 14, 103);
  doc.setLineWidth(0.8);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
  doc.setLineWidth(0.3);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Header text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('ACCESS COMPASS', pageWidth / 2, 16, { align: 'center' });
  doc.setFontSize(10);
  doc.setTextColor(230, 200, 255);
  doc.text('Accessibility Self-Assessment Certificate', pageWidth / 2, 22, { align: 'center' });

  // Badge circle (simplified version of the SVG badge)
  const badgeCx = pageWidth / 2;
  const badgeCy = 58;
  const badgeR = 22;

  doc.setFillColor(
    parseInt(colors.secondary.slice(1, 3), 16),
    parseInt(colors.secondary.slice(3, 5), 16),
    parseInt(colors.secondary.slice(5, 7), 16)
  );
  doc.circle(badgeCx, badgeCy, badgeR, 'F');

  doc.setDrawColor(
    parseInt(colors.primary.slice(1, 3), 16),
    parseInt(colors.primary.slice(3, 5), 16),
    parseInt(colors.primary.slice(5, 7), 16)
  );
  doc.setLineWidth(1.5);
  doc.circle(badgeCx, badgeCy, badgeR, 'S');

  // Checkmark inside badge
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(2);
  doc.line(badgeCx - 8, badgeCy + 1, badgeCx - 2, badgeCy + 8);
  doc.line(badgeCx - 2, badgeCy + 8, badgeCx + 10, badgeCy - 6);

  // Level label below badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(
    parseInt(colors.primary.slice(1, 3), 16),
    parseInt(colors.primary.slice(3, 5), 16),
    parseInt(colors.primary.slice(5, 7), 16)
  );
  doc.text(`${colors.label.toUpperCase()} LEVEL`, pageWidth / 2, badgeCy + badgeR + 8, { align: 'center' });

  // Certificate body
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(74, 74, 74);
  doc.text('This certifies that', pageWidth / 2, 100, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(26, 26, 46);
  doc.text(organisationName, pageWidth / 2, 112, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(74, 74, 74);
  doc.text(
    `has completed a ${colors.label} level self-assessment using Access Compass,`,
    pageWidth / 2,
    124,
    { align: 'center' }
  );
  doc.text(
    `covering ${completedModules.length} of ${totalModules} accessibility modules.`,
    pageWidth / 2,
    131,
    { align: 'center' }
  );

  // Module summary (2 columns)
  const colWidth = 120;
  const startX = (pageWidth - colWidth * 2) / 2;
  const startY = 142;
  const lineHeight = 5;
  const maxPerCol = Math.ceil(completedModules.length / 2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);

  completedModules.forEach((moduleName, i) => {
    const col = i < maxPerCol ? 0 : 1;
    const row = i < maxPerCol ? i : i - maxPerCol;
    const x = startX + col * colWidth;
    const y = startY + row * lineHeight;

    if (y < pageHeight - 35) {
      doc.text(`\u2713 ${moduleName}`, x, y);
    }
  });

  // Date
  const formattedDate = new Date(completionDate).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.setFontSize(10);
  doc.setTextColor(74, 74, 74);
  doc.text(`Date: ${formattedDate}`, pageWidth / 2, pageHeight - 32, { align: 'center' });

  // Disclaimer footer
  doc.setFillColor(73, 14, 103);
  doc.rect(0, pageHeight - 22, pageWidth, 22, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(200, 180, 220);
  doc.text(
    'This certificate acknowledges completion of a self-assessment. It does not constitute a professional accessibility audit.',
    pageWidth / 2,
    pageHeight - 14,
    { align: 'center' }
  );
  doc.text(
    'Access Compass provides guidance only, not legal advice or compliance certification.',
    pageWidth / 2,
    pageHeight - 9,
    { align: 'center' }
  );

  doc.save(`Access-Compass-Certificate-${level}-${organisationName.replace(/\s+/g, '-')}.pdf`);
}
