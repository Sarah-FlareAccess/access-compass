import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../contexts/AuthContext';
import { listEvidenceForUser, listLocalEvidence, type ExistingEvidenceMatch } from '../../utils/evidenceStorage';
import { useSignedUrl } from '../../hooks/useSignedUrl';
import { getModuleById } from '../../data/accessModules';
import './evidence-picker.css';

const DIAP_CATEGORY_LABELS: Record<string, string> = {
  'physical-access': 'Physical Access',
  'information-communication-marketing': 'Information, Communication & Marketing',
  'customer-service': 'Customer Service',
  'operations-policy-procedure': 'Operations, Policy & Procedure',
  'people-culture': 'People & Culture',
  'digital-access': 'Digital Access',
  'communication': 'Communication',
  'policy-procedure': 'Policy & Procedure',
  'training': 'Training',
  'other': 'Other',
};

interface EvidencePickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (file: ExistingEvidenceMatch) => void;
  excludeIds?: string[];
  extraSources?: ExistingEvidenceMatch[];
}

export function EvidencePicker({ open, onClose, onSelect, excludeIds = [], extraSources = [] }: EvidencePickerProps) {
  const { user, accessState } = useAuth();
  const organisationId = accessState.organisation?.id;
  const [files, setFiles] = useState<ExistingEvidenceMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'photo' | 'document'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'module' | 'diap'>('all');

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    const fetchCloud = user?.id
      ? listEvidenceForUser(user.id, organisationId)
      : Promise.resolve([] as ExistingEvidenceMatch[]);
    fetchCloud.then(result => {
      if (!cancelled) {
        setFiles(result);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [open, user?.id, organisationId]);

  const localItems = useMemo(() => (open ? listLocalEvidence() : []), [open]);

  const merged = useMemo(() => {
    const seenPaths = new Set<string>();
    const seenIds = new Set<string>();
    const out: ExistingEvidenceMatch[] = [];
    const consider = (f: ExistingEvidenceMatch) => {
      const pathKey = f.storagePath || `id:${f.id}`;
      if (seenPaths.has(pathKey) || seenIds.has(f.id)) return;
      seenPaths.add(pathKey);
      seenIds.add(f.id);
      out.push(f);
    };
    for (const f of files) consider(f);
    for (const f of localItems) consider(f);
    for (const f of extraSources) consider(f);
    return out;
  }, [files, localItems, extraSources]);

  const filtered = useMemo(() => {
    return merged.filter(f => {
      if (excludeIds.includes(f.id)) return false;
      if (search && !f.fileName.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== 'all') {
        const isPhoto = f.fileType === 'photo' || (f.mimeType?.startsWith('image/') ?? false);
        if (typeFilter === 'photo' && !isPhoto) return false;
        if (typeFilter === 'document' && isPhoto) return false;
      }
      if (sourceFilter !== 'all' && f.origin !== sourceFilter) return false;
      return true;
    });
  }, [merged, search, typeFilter, sourceFilter, excludeIds]);

  const grouped = useMemo(() => {
    const moduleGroups = new Map<string, ExistingEvidenceMatch[]>();
    const diapGroups = new Map<string, ExistingEvidenceMatch[]>();
    const ungrouped: ExistingEvidenceMatch[] = [];
    for (const f of filtered) {
      if (f.origin === 'module' && f.moduleCode) {
        if (!moduleGroups.has(f.moduleCode)) moduleGroups.set(f.moduleCode, []);
        moduleGroups.get(f.moduleCode)!.push(f);
      } else if (f.origin === 'diap' && f.diapCategory) {
        if (!diapGroups.has(f.diapCategory)) diapGroups.set(f.diapCategory, []);
        diapGroups.get(f.diapCategory)!.push(f);
      } else {
        ungrouped.push(f);
      }
    }
    return { moduleGroups, diapGroups, ungrouped };
  }, [filtered]);

  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      triggerRef.current = (document.activeElement as HTMLElement) || null;
    } else if (triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="evidence-picker-backdrop" onClick={onClose} role="presentation">
      <div
        ref={dialogRef}
        className="evidence-picker-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="evidence-picker-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="evidence-picker-header">
          <h2 id="evidence-picker-title">Select existing evidence</h2>
          <button
            type="button"
            className="evidence-picker-close"
            onClick={onClose}
            aria-label="Close evidence picker"
          >
            &times;
          </button>
        </div>

        <div className="evidence-picker-toolbar">
          <input
            type="search"
            className="evidence-picker-search"
            placeholder="Search by file name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search evidence by file name"
            autoFocus
          />
          <div className="evidence-picker-filter-row evidence-picker-filter-row-primary" role="group" aria-label="Filter by source">
            <span className="evidence-picker-filter-label" id="ep-source-label">Source</span>
            <div className="evidence-picker-type-filters" aria-labelledby="ep-source-label">
              {(['all', 'module', 'diap'] as const).map(s => (
                <button
                  key={s}
                  type="button"
                  className={`evidence-picker-type-btn ${sourceFilter === s ? 'active' : ''}`}
                  onClick={() => setSourceFilter(s)}
                  aria-pressed={sourceFilter === s}
                >
                  {s === 'all' ? 'All' : s === 'module' ? 'Assessment' : 'DIAP'}
                </button>
              ))}
            </div>
          </div>
          <div className="evidence-picker-filter-row evidence-picker-filter-row-secondary" role="group" aria-label="Filter by file type">
            <span className="evidence-picker-filter-label" id="ep-type-label">File type</span>
            <div className="evidence-picker-type-filters evidence-picker-type-filters-secondary" aria-labelledby="ep-type-label">
              {(['all', 'photo', 'document'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  className={`evidence-picker-type-btn evidence-picker-type-btn-secondary ${typeFilter === t ? 'active' : ''}`}
                  onClick={() => setTypeFilter(t)}
                  aria-pressed={typeFilter === t}
                >
                  {t === 'all' ? 'All' : t === 'photo' ? 'Photos' : 'Documents'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="evidence-picker-body">
          {loading && <p className="evidence-picker-status">Loading your evidence...</p>}
          {!loading && filtered.length === 0 && (
            <p className="evidence-picker-status">
              {files.length === 0
                ? 'No evidence uploaded yet. Upload a new file instead.'
                : 'No evidence matches your search.'}
            </p>
          )}
          {!loading && filtered.length > 0 && (
            <div className="evidence-picker-groups">
              {Array.from(grouped.moduleGroups.entries())
                .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
                .map(([moduleCode, items]) => {
                  const mod = getModuleById(moduleCode);
                  const heading = mod ? `${moduleCode} ${mod.name}` : `Module ${moduleCode}`;
                  return (
                    <section key={`mod-${moduleCode}`} className="evidence-picker-group">
                      <h3 className="evidence-picker-group-heading">
                        <span className="evidence-picker-group-tag">Assessment</span>
                        {heading}
                        <span className="evidence-picker-group-count">{items.length}</span>
                      </h3>
                      <ul className="evidence-picker-list">
                        {items.map(file => (
                          <EvidencePickerRow
                            key={file.id}
                            file={file}
                            onSelect={() => { onSelect(file); onClose(); }}
                          />
                        ))}
                      </ul>
                    </section>
                  );
                })}
              {Array.from(grouped.diapGroups.entries())
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([category, items]) => (
                  <section key={`diap-${category}`} className="evidence-picker-group">
                    <h3 className="evidence-picker-group-heading">
                      <span className="evidence-picker-group-tag evidence-picker-group-tag-diap">DIAP</span>
                      {DIAP_CATEGORY_LABELS[category] || category}
                      <span className="evidence-picker-group-count">{items.length}</span>
                    </h3>
                    <ul className="evidence-picker-list">
                      {items.map(file => (
                        <EvidencePickerRow
                          key={file.id}
                          file={file}
                          onSelect={() => { onSelect(file); onClose(); }}
                        />
                      ))}
                    </ul>
                  </section>
                ))}
              {grouped.ungrouped.length > 0 && (
                <section className="evidence-picker-group">
                  <h3 className="evidence-picker-group-heading">
                    Other
                    <span className="evidence-picker-group-count">{grouped.ungrouped.length}</span>
                  </h3>
                  <ul className="evidence-picker-list">
                    {grouped.ungrouped.map(file => (
                      <EvidencePickerRow
                        key={file.id}
                        file={file}
                        onSelect={() => { onSelect(file); onClose(); }}
                      />
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}
        </div>

        <div className="evidence-picker-footer">
          <button type="button" className="evidence-picker-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

interface EvidencePickerRowProps {
  file: ExistingEvidenceMatch;
  onSelect: () => void;
}

function EvidencePickerRow({ file, onSelect }: EvidencePickerRowProps) {
  const { url } = useSignedUrl(file.bucket, file.storagePath);
  const isPhoto = file.fileType === 'photo' || (file.mimeType?.startsWith('image/') ?? false);
  const sizeLabel = file.fileSize ? `${(file.fileSize / 1024).toFixed(1)} KB` : '';

  return (
    <li className="evidence-picker-row">
      <button
        type="button"
        className="evidence-picker-row-button"
        onClick={onSelect}
        aria-label={`Select ${file.fileName}`}
      >
        <span className="evidence-picker-thumb" aria-hidden="true">
          {isPhoto && url ? (
            <img src={url} alt="" className="evidence-picker-thumb-img" />
          ) : (
            <span className="evidence-picker-thumb-icon">{isPhoto ? '🖼️' : '📄'}</span>
          )}
        </span>
        <span className="evidence-picker-row-meta">
          <span className="evidence-picker-row-name">{file.fileName}</span>
          {sizeLabel && <span className="evidence-picker-row-size">{sizeLabel}</span>}
        </span>
      </button>
    </li>
  );
}
