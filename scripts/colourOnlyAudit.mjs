// Finds colour-coded category sets: groups of sibling CSS rules that differ
// only by modifier and set DIFFERENT background colours. Each group is a place
// where meaning may be carried by hue alone.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const files = [];
for (const dir of ['src/styles', 'src/pages', 'src/components']) {
  const walk = d => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.css')) files.push(p);
    }
  };
  try { walk(dir); } catch { /* dir may not exist */ }
}

for (const f of files) {
  const css = readFileSync(f, 'utf8');
  const rules = [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)];
  const groups = new Map();
  for (const m of rules) {
    const sel = m[1].trim().replace(/\s+/g, ' ');
    const bg = m[2].match(/background(?:-color)?:\s*(#[0-9A-Fa-f]{3,8}|linear-gradient\([^;]+)/);
    if (!bg) continue;
    // base = selector minus its final modifier (--x, .x, -x)
    const base = sel.replace(/(\.|--|\.[a-z]+-)[a-z0-9-]+$/i, '');
    if (!base || base === sel) continue;
    if (!groups.has(base)) groups.set(base, []);
    groups.get(base).push([sel, bg[1].slice(0, 34)]);
  }
  const multi = [...groups.entries()].filter(([, v]) => {
    const uniq = new Set(v.map(x => x[1]));
    return v.length >= 3 && uniq.size >= 3;
  });
  if (!multi.length) continue;
  console.log(`\n### ${f}`);
  for (const [base, v] of multi) {
    console.log(`  ${base}  (${v.length} variants)`);
    for (const [sel, c] of v.slice(0, 6)) console.log(`      ${c.padEnd(36)} ${sel}`);
  }
}
