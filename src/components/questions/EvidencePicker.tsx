import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../contexts/AuthContext';
import { listEvidenceForUser, listLocalEvidence, type ExistingEvidenceMatch } from '../../utils/evidenceStorage';
import { useSignedUrl } from '../../hooks/useSignedUrl';
import './evidence-picker.css';

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
      return true;
    });
  }, [merged, search, typeFilter, excludeIds]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="evidence-picker-backdrop" onClick={onClose} role="presentation">
      <div
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
          <div className="evidence-picker-type-filters" role="group" aria-label="Filter by type">
            {(['all', 'photo', 'document'] as const).map(t => (
              <button
                key={t}
                type="button"
                className={`evidence-picker-type-btn ${typeFilter === t ? 'active' : ''}`}
                onClick={() => setTypeFilter(t)}
                aria-pressed={typeFilter === t}
              >
                {t === 'all' ? 'All' : t === 'photo' ? 'Photos' : 'Documents'}
              </button>
            ))}
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
            <ul className="evidence-picker-list">
              {filtered.map(file => (
                <EvidencePickerRow
                  key={file.id}
                  file={file}
                  onSelect={() => { onSelect(file); onClose(); }}
                />
              ))}
            </ul>
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
