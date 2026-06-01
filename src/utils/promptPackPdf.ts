import { jsPDF } from 'jspdf';

// Flare Access brand
const BRAND = {
  amethyst: [73, 14, 103] as [number, number, number],
  amethystLight: [107, 45, 138] as [number, number, number],
  sunrise: [255, 144, 21] as [number, number, number],
  sunriseDark: [204, 119, 0] as [number, number, number],
  walnut: [62, 43, 47] as [number, number, number],
  ivory: [236, 233, 230] as [number, number, number],
  bodyText: [45, 36, 32] as [number, number, number],
  mutedText: [106, 99, 96] as [number, number, number],
  promptBg: [248, 247, 246] as [number, number, number],
  promptBorder: [220, 215, 210] as [number, number, number],
};

const PAGE = { width: 595.28, height: 841.89 };
const MARGIN = { left: 56, right: 56, top: 56, bottom: 70 };
const CONTENT_WIDTH = PAGE.width - MARGIN.left - MARGIN.right;

interface State {
  doc: jsPDF;
  page: number;
  y: number;
}

export interface PromptPackPdfInput {
  title: string;
  subtitle: string;
  intro: string;
  howToUse: string[];
  sections: Array<{ title: string; intro?: string; prompt: string }>;
}

function drawFooter(doc: jsPDF, pageNum: number) {
  const y = PAGE.height - 30;
  doc.setDrawColor(...BRAND.ivory);
  doc.setLineWidth(0.5);
  doc.line(MARGIN.left, y - 14, PAGE.width - MARGIN.right, y - 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...BRAND.mutedText);
  doc.text(
    'Flare Access  ·  Using AI to Create Accessible & Inclusive Communications',
    MARGIN.left,
    y
  );
  doc.text(`Page ${pageNum}`, PAGE.width - MARGIN.right, y, { align: 'right' });
}

function ensureSpace(state: State, neededHeight: number) {
  if (state.y + neededHeight > PAGE.height - MARGIN.bottom) {
    drawFooter(state.doc, state.page);
    state.doc.addPage();
    state.page += 1;
    state.y = MARGIN.top;
  }
}

function drawCover(state: State, input: PromptPackPdfInput, logoDataUrl: string | null) {
  const { doc } = state;
  doc.setFillColor(...BRAND.amethyst);
  doc.rect(0, 0, PAGE.width, 8, 'F');
  doc.setFillColor(...BRAND.sunrise);
  doc.rect(0, 8, PAGE.width, 2, 'F');

  let logoHeight = 0;
  if (logoDataUrl) {
    const props = doc.getImageProperties(logoDataUrl);
    const targetWidth = 110;
    logoHeight = (props.height / props.width) * targetWidth;
    doc.addImage(logoDataUrl, 'PNG', MARGIN.left, MARGIN.top + 10, targetWidth, logoHeight);
  } else {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...BRAND.amethyst);
    doc.text('FLARE ACCESS', MARGIN.left, MARGIN.top + 30);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(...BRAND.amethyst);
  const titleLines = doc.splitTextToSize(input.title, CONTENT_WIDTH);
  let titleY = MARGIN.top + (logoDataUrl ? Math.max(logoHeight + 60, 200) : 200);
  for (const line of titleLines) {
    doc.text(line, MARGIN.left, titleY);
    titleY += 32;
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(...BRAND.walnut);
  const subLines = doc.splitTextToSize(input.subtitle, CONTENT_WIDTH);
  let subY = titleY + 6;
  for (const line of subLines) {
    doc.text(line, MARGIN.left, subY);
    subY += 18;
  }

  doc.setDrawColor(...BRAND.sunrise);
  doc.setLineWidth(2);
  doc.line(MARGIN.left, subY + 16, MARGIN.left + 80, subY + 16);

  const stamp = new Date().toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...BRAND.mutedText);
  doc.text(`Generated ${stamp}`, MARGIN.left, PAGE.height - 100);
  doc.text(
    'Your work belongs to you. Flare Access does not claim any rights to content you produce.',
    MARGIN.left,
    PAGE.height - 86,
    { maxWidth: CONTENT_WIDTH }
  );

  drawFooter(doc, state.page);
  doc.addPage();
  state.page += 1;
  state.y = MARGIN.top;
}

function drawHeading(state: State, text: string, level: 1 | 2 | 3 = 1) {
  const sizes = { 1: 20, 2: 14, 3: 11 };
  const colors = { 1: BRAND.amethyst, 2: BRAND.amethyst, 3: BRAND.amethystLight };
  const before = { 1: 6, 2: 24, 3: 14 };
  const after = { 1: 12, 2: 10, 3: 6 };

  ensureSpace(state, sizes[level] + before[level] + after[level]);
  state.y += before[level];
  state.doc.setFont('helvetica', 'bold');
  state.doc.setFontSize(sizes[level]);
  state.doc.setTextColor(...colors[level]);
  const lines = state.doc.splitTextToSize(text, CONTENT_WIDTH);
  for (const line of lines) {
    ensureSpace(state, sizes[level] + 2);
    state.doc.text(line, MARGIN.left, state.y);
    state.y += sizes[level] + 2;
  }
  state.y += after[level];
}

function drawParagraph(state: State, text: string) {
  const size = 10;
  state.doc.setFont('helvetica', 'normal');
  state.doc.setFontSize(size);
  state.doc.setTextColor(...BRAND.bodyText);
  const lineHeight = size + 4;
  const lines = state.doc.splitTextToSize(text, CONTENT_WIDTH);
  for (const line of lines) {
    ensureSpace(state, lineHeight);
    state.doc.text(line, MARGIN.left, state.y);
    state.y += lineHeight;
  }
  state.y += 4;
}

function drawBulletList(state: State, items: string[]) {
  const size = 10;
  state.doc.setFont('helvetica', 'normal');
  state.doc.setFontSize(size);
  state.doc.setTextColor(...BRAND.bodyText);
  const lineHeight = size + 4;
  const bulletIndent = 14;
  for (const item of items) {
    const itemLines = state.doc.splitTextToSize(item, CONTENT_WIDTH - bulletIndent);
    let first = true;
    for (const line of itemLines) {
      ensureSpace(state, lineHeight);
      if (first) {
        state.doc.setFillColor(...BRAND.sunriseDark);
        state.doc.circle(MARGIN.left + 3, state.y - 3, 1.8, 'F');
        first = false;
      }
      state.doc.text(line, MARGIN.left + bulletIndent, state.y);
      state.y += lineHeight;
    }
    state.y += 2;
  }
  state.y += 4;
}

function drawPromptBlock(state: State, prompt: string) {
  state.doc.setFont('courier', 'normal');
  state.doc.setFontSize(8.5);
  state.doc.setTextColor(...BRAND.bodyText);

  const promptPadding = 12;
  const innerWidth = CONTENT_WIDTH - promptPadding * 2;
  const lineHeight = 11.5;

  const rawLines = prompt.split('\n');
  const wrappedLines: string[] = [];
  for (const raw of rawLines) {
    if (raw.length === 0) {
      wrappedLines.push('');
      continue;
    }
    const wrapped = state.doc.splitTextToSize(raw, innerWidth);
    for (const w of wrapped) wrappedLines.push(w);
  }

  let i = 0;
  while (i < wrappedLines.length) {
    const linesAvailable = Math.floor(
      (PAGE.height - MARGIN.bottom - state.y - promptPadding * 2) / lineHeight
    );
    if (linesAvailable <= 4) {
      drawFooter(state.doc, state.page);
      state.doc.addPage();
      state.page += 1;
      state.y = MARGIN.top;
      continue;
    }
    const chunkEnd = Math.min(i + linesAvailable, wrappedLines.length);
    const chunkLines = wrappedLines.slice(i, chunkEnd);
    const boxHeight = chunkLines.length * lineHeight + promptPadding * 2;

    state.doc.setFillColor(...BRAND.promptBg);
    state.doc.setDrawColor(...BRAND.promptBorder);
    state.doc.setLineWidth(0.5);
    state.doc.roundedRect(MARGIN.left, state.y, CONTENT_WIDTH, boxHeight, 4, 4, 'FD');

    state.doc.setFillColor(...BRAND.amethyst);
    state.doc.rect(MARGIN.left, state.y, 3, boxHeight, 'F');

    if (i > 0) {
      state.doc.setFont('helvetica', 'italic');
      state.doc.setFontSize(8);
      state.doc.setTextColor(...BRAND.mutedText);
      state.doc.text('(continued)', PAGE.width - MARGIN.right, state.y - 3, { align: 'right' });
      state.doc.setFont('courier', 'normal');
      state.doc.setFontSize(8.5);
      state.doc.setTextColor(...BRAND.bodyText);
    }

    let ly = state.y + promptPadding + 8;
    for (const line of chunkLines) {
      state.doc.text(line, MARGIN.left + promptPadding, ly);
      ly += lineHeight;
    }

    state.y += boxHeight + 10;
    i = chunkEnd;

    if (i < wrappedLines.length) {
      drawFooter(state.doc, state.page);
      state.doc.addPage();
      state.page += 1;
      state.y = MARGIN.top;
    }
  }

  state.y += 4;
}

function drawDivider(state: State) {
  ensureSpace(state, 20);
  state.doc.setDrawColor(...BRAND.ivory);
  state.doc.setLineWidth(0.5);
  state.doc.line(MARGIN.left, state.y, MARGIN.left + 80, state.y);
  state.y += 18;
}

function drawTableOfContents(state: State, sections: Array<{ title: string }>) {
  drawHeading(state, 'In this pack', 1);
  const lineHeight = 16;
  for (const s of sections) {
    ensureSpace(state, lineHeight);
    state.doc.setTextColor(...BRAND.amethyst);
    state.doc.setFont('helvetica', 'bold');
    state.doc.setFontSize(10.5);
    state.doc.text(s.title, MARGIN.left, state.y);
    state.y += lineHeight;
  }
  state.y += 8;
}

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch('/training/branding/flare-access-logo.png');
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Logo read failed'));
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generatePromptPackPdf(input: PromptPackPdfInput): Promise<Blob> {
  const logoDataUrl = await loadLogoDataUrl();
  const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true });
  const state: State = { doc, page: 1, y: MARGIN.top };

  drawCover(state, input, logoDataUrl);

  drawHeading(state, 'How to use this pack', 1);
  drawParagraph(state, input.intro);
  if (input.howToUse.length > 0) {
    state.y += 4;
    drawHeading(state, 'Quick setup', 3);
    drawBulletList(state, input.howToUse);
  }
  drawDivider(state);

  if (input.sections.length > 3) {
    drawTableOfContents(state, input.sections);
    drawDivider(state);
  }

  for (const section of input.sections) {
    drawHeading(state, section.title, 2);
    if (section.intro) drawParagraph(state, section.intro);
    drawPromptBlock(state, section.prompt);
  }

  drawFooter(state.doc, state.page);
  return new Blob([doc.output('arraybuffer')], { type: 'application/pdf' });
}
