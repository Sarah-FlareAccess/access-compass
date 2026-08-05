// Contrast audit for a stylesheet: every rule that sets a colour is resolved
// against the background it sits on and checked against WCAG 1.4.3.
//
// Caveat worth knowing: a background set through a CSS variable or a gradient
// is invisible to this, so those rules fall back to the page background and
// can report a false failure. Always confirm a hit by reading the rule.
//
// Usage: node scripts/contrastAudit.mjs src/styles/authority.css [pageBgHex]
import { readFileSync } from 'node:fs';

const file = process.argv[2] || 'src/styles/authority.css';
const PAGE_BG = process.argv[3] || '#F7F5F3';
const css = readFileSync(file, 'utf8');

const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const relLum = hex => {
  const h = hex.replace('#', '');
  return 0.2126 * lin(parseInt(h.slice(0, 2), 16))
       + 0.7152 * lin(parseInt(h.slice(2, 4), 16))
       + 0.0722 * lin(parseInt(h.slice(4, 6), 16));
};
const ratio = (a, b) => {
  const la = relLum(a), lb = relLum(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

const rules = [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)].map(m => ({
  sel: m[1].trim().replace(/\s+/g, ' '),
  body: m[2],
}));

const findings = [];
for (const r of rules) {
  const fg = r.body.match(/(?:^|[;\s])color:\s*(#[0-9A-Fa-f]{6})/);
  if (!fg) continue;
  const ownBg = r.body.match(/background(?:-color)?:\s*(#[0-9A-Fa-f]{6})/);
  const bg = ownBg ? ownBg[1] : PAGE_BG;
  const fs = r.body.match(/font-size:\s*([\d.]+)rem/);
  const fw = r.body.match(/font-weight:\s*(\d+)/);
  const px = fs ? parseFloat(fs[1]) * 16 : 16;
  const bold = fw ? parseInt(fw[1], 10) >= 700 : false;
  const need = (px >= 24 || (bold && px >= 18.66)) ? 3.0 : 4.5;
  const c = ratio(fg[1], bg);
  if (c < need) findings.push({ sel: r.sel.slice(0, 66), fg: fg[1], bg, px, bold, c, need, assumed: !ownBg });
}

findings.sort((a, b) => a.c - b.c);
console.log(`${file}: ${findings.length} possible WCAG 1.4.3 failures\n`);
for (const f of findings) {
  console.log(`${f.c.toFixed(2).padStart(5)}:1 need ${f.need}  ${f.fg} on ${f.bg}${f.assumed ? ' (page bg assumed)' : ''}`);
  console.log(`        ${f.px.toFixed(1)}px${f.bold ? ' bold' : ''}  ${f.sel}`);
}
