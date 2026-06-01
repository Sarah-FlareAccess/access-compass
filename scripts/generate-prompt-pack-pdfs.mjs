// Generates PDF versions of the prompt pack files alongside the TXT
// originals. Run with: node scripts/generate-prompt-pack-pdfs.mjs
// Uses jsPDF (already a project dependency).
import { jsPDF } from 'jspdf';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const downloadsDir = path.join(projectRoot, 'public', 'training', 'downloads');

const files = [
  'ai-accessible-comms-prompt-pack',
  'ai-assistant-system-prompt',
  'claude-reviewer-and-markup-prompts',
  'human-review-checklist',
];

for (const name of files) {
  const txtPath = path.join(downloadsDir, `${name}.txt`);
  const pdfPath = path.join(downloadsDir, `${name}.pdf`);
  if (!fs.existsSync(txtPath)) {
    console.warn(`Skipping ${name}: no .txt source`);
    continue;
  }
  const txt = fs.readFileSync(txtPath, 'utf-8');

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  doc.setFont('courier', 'normal');
  doc.setFontSize(9);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 40;
  const marginTop = 40;
  const marginBottom = 50;
  const maxWidth = pageWidth - marginX * 2;
  const lineHeight = 11;

  // Split paragraphs / explicit newlines and wrap each chunk.
  const rawLines = txt.split('\n');
  const lines = [];
  for (const raw of rawLines) {
    if (raw.length === 0) {
      lines.push('');
      continue;
    }
    const wrapped = doc.splitTextToSize(raw, maxWidth);
    for (const w of wrapped) lines.push(w);
  }

  let y = marginTop;
  let page = 1;
  for (const line of lines) {
    if (y > pageHeight - marginBottom) {
      // Page footer
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text(
        `Flare Access  •  Accessible Comms Workshop  •  Page ${page}`,
        marginX,
        pageHeight - 20
      );
      doc.addPage();
      page++;
      y = marginTop;
      doc.setFont('courier', 'normal');
      doc.setFontSize(9);
    }
    doc.text(line, marginX, y);
    y += lineHeight;
  }
  // Final page footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text(
    `Flare Access  •  Accessible Comms Workshop  •  Page ${page}`,
    marginX,
    pageHeight - 20
  );

  const buf = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(pdfPath, buf);
  console.log(`Generated ${name}.pdf (${(buf.length / 1024).toFixed(1)} KB)`);
}
