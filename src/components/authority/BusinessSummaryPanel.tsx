/**
 * Per-business strengths and opportunities, for the program host.
 *
 * Generated narrative from the assessment, never the answers themselves, and
 * never the staff modules. Framed as strengths and next steps rather than a
 * score: a band per business across a cohort reads as a ranking, and these
 * programs are not punitive.
 *
 * Colours are a two-state status pair, validated for CVD separation against a
 * light surface (deutan dE 30.6, normal 40.6). Every bar is accompanied by its
 * counts in text, so identity is never carried by colour alone.
 */
import { useState } from 'react';
import { accessModules, moduleGroups } from '../../data/accessModules';
import type { BusinessInsight, BusinessInsightItem } from '../../hooks/useProgramBusinessSummaries';

const STRENGTH = '#16a34a';
const OPPORTUNITY = '#7C3AED';
const TRACK = 'rgba(62, 43, 47, 0.10)';

const PREVIEW = 4;

const groupLabel = new Map(moduleGroups.map(g => [g.id, g.label]));
const groupOfModule = new Map(accessModules.map(m => [m.id, m.group]));

interface CategoryRow {
  key: string;
  label: string;
  strengths: number;
  opportunities: number;
}

function byCategory(insight: BusinessInsight): CategoryRow[] {
  const rows = new Map<string, CategoryRow>();
  const bump = (moduleId: string, field: 'strengths' | 'opportunities') => {
    const key = groupOfModule.get(moduleId) ?? 'other';
    let row = rows.get(key);
    if (!row) {
      row = { key, label: groupLabel.get(key) ?? 'Other', strengths: 0, opportunities: 0 };
      rows.set(key, row);
    }
    row[field] += 1;
  };
  insight.strengths.forEach(s => bump(s.moduleId, 'strengths'));
  insight.opportunities.forEach(o => bump(o.moduleId, 'opportunities'));
  // Keep the authored module-group order rather than sorting by volume, so the
  // strip reads the same way for every business.
  const order = moduleGroups.map(g => g.id);
  return Array.from(rows.values()).sort(
    (a, b) => order.indexOf(a.key) - order.indexOf(b.key),
  );
}

function StatTile({ value, label, colour }: { value: number; label: string; colour?: string }) {
  return (
    <div style={{ minWidth: '5.5rem' }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: '0.4rem',
        fontSize: '1.75rem', fontWeight: 700, lineHeight: 1,
        color: 'var(--text-primary, #2d2420)',
      }}>
        {colour && (
          <span aria-hidden="true" style={{
            width: 10, height: 10, borderRadius: 3, background: colour, flexShrink: 0,
          }} />
        )}
        {value}
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #5C4A4E)', marginTop: '0.25rem' }}>
        {label}
      </div>
    </div>
  );
}

function CategoryStrip({ rows }: { rows: CategoryRow[] }) {
  if (rows.length === 0) return null;
  return (
    <div style={{ display: 'grid', gap: '0.5rem' }}>
      {rows.map(row => {
        const total = row.strengths + row.opportunities;
        const sPct = total === 0 ? 0 : (row.strengths / total) * 100;
        const oPct = total === 0 ? 0 : (row.opportunities / total) * 100;
        return (
          <div key={row.key} style={{ display: 'grid', gridTemplateColumns: 'minmax(7rem, 10rem) 1fr auto', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #5C4A4E)' }}>
              {row.label}
            </span>
            <div
              aria-hidden="true"
              style={{ display: 'flex', gap: 2, height: 8, background: TRACK, borderRadius: 4, overflow: 'hidden' }}
            >
              {row.strengths > 0 && <div style={{ width: `${sPct}%`, background: STRENGTH }} />}
              {row.opportunities > 0 && <div style={{ width: `${oPct}%`, background: OPPORTUNITY }} />}
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary, #5C4A4E)', whiteSpace: 'nowrap' }}>
              {row.strengths} strong · {row.opportunities} to do
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ItemList({
  title, items, colour, emptyText,
}: { title: string; items: BusinessInsightItem[]; colour: string; emptyText: string }) {
  const [showAll, setShowAll] = useState(false);
  const shown = showAll ? items : items.slice(0, PREVIEW);
  const hidden = items.length - shown.length;

  return (
    <div>
      <h4 style={{
        fontSize: '0.75rem', fontWeight: 700, margin: '0 0 0.5rem',
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        color: 'var(--text-primary, #2d2420)',
      }}>
        <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: 3, background: colour }} />
        {title} ({items.length})
      </h4>
      {items.length === 0 ? (
        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary, #5C4A4E)' }}>{emptyText}</p>
      ) : (
        <>
          <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.8125rem', lineHeight: 1.55, color: 'var(--text-secondary, #5C4A4E)' }}>
            {shown.map((item, i) => <li key={`${item.moduleId}-${i}`}>{item.text}</li>)}
          </ul>
          {items.length > PREVIEW && (
            <button
              type="button"
              onClick={() => setShowAll(v => !v)}
              style={{
                marginTop: '0.4rem', background: 'none', border: 0, padding: 0,
                fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                color: 'var(--amethyst-diamond, #490E67)', textDecoration: 'underline',
              }}
            >
              {showAll ? 'Show fewer' : `Show all ${items.length}`}
              {!showAll && hidden > 0 ? ` (${hidden} more)` : ''}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default function BusinessSummaryPanel({
  panelId,
  businessName,
  insight,
  provenanceNote,
}: {
  panelId?: string;
  businessName: string;
  insight?: BusinessInsight;
  /** Overrides the default "generated from the assessment" footer, so the
   *  report page can say this reflects today rather than the snapshot date. */
  provenanceNote?: string;
}) {
  const strengths = insight?.strengths ?? [];
  const opportunities = insight?.opportunities ?? [];
  const modules = insight?.modulesSummarised ?? 0;
  const withheld = insight?.withheldModules ?? 0;

  if (strengths.length === 0 && opportunities.length === 0) {
    return (
      <div id={panelId} style={{ padding: '1rem 1rem 1rem 2rem', fontSize: '0.8125rem', color: 'var(--text-secondary, #5C4A4E)' }}>
        No completed modules yet, so there is nothing to summarise for {businessName}.
      </div>
    );
  }

  const rows = insight ? byCategory(insight) : [];

  return (
    <div
      id={panelId}
      style={{
        padding: '1.125rem 1.25rem 1.125rem 2rem',
        background: 'rgba(73, 14, 103, 0.02)',
        borderBottom: '1px solid rgba(62, 43, 47, 0.05)',
      }}
    >
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.125rem' }}>
        <StatTile value={strengths.length} label="strengths" colour={STRENGTH} />
        <StatTile value={opportunities.length} label="opportunities" colour={OPPORTUNITY} />
        <StatTile value={modules} label={modules === 1 ? 'module assessed' : 'modules assessed'} />
      </div>

      {rows.length > 0 && (
        <div style={{ marginBottom: '1.125rem' }}>
          <CategoryStrip rows={rows} />
        </div>
      )}

      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <ItemList title="Strengths" items={strengths} colour={STRENGTH} emptyText="None recorded yet." />
        <ItemList title="Opportunities" items={opportunities} colour={OPPORTUNITY} emptyText="None recorded yet." />
      </div>

      <p style={{ margin: '1rem 0 0', fontSize: '0.7rem', fontStyle: 'italic', color: 'var(--text-secondary, #5C4A4E)' }}>
        {provenanceNote ?? 'Generated from the assessment, not from the individual answers.'}
        {withheld > 0 && ` ${withheld} completed module${withheld === 1 ? '' : 's'} withheld from this view because ${withheld === 1 ? 'it describes' : 'they describe'} staff rather than the place.`}
      </p>
    </div>
  );
}
