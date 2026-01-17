/**
 * EvidenceUpload Component
 *
 * Allows users to attach evidence to questions:
 * - Photos (images)
 * - Documents (PDFs, Word docs, etc.)
 * - Links (URLs to external resources)
 */

import { useState, useRef, useCallback } from 'react';
import type { EvidenceFile } from '../../hooks/useModuleProgress';
import './evidence-upload.css';

interface EvidenceUploadProps {
  evidence: EvidenceFile[];
  onEvidenceChange: (evidence: EvidenceFile[]) => void;
  allowedTypes?: ('photo' | 'document' | 'link')[];
  hint?: string;
  maxFiles?: number;
}

// File type mappings
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
];

// Max file size (2MB for localStorage compatibility - images will be compressed)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

// Image compression settings
const MAX_IMAGE_DIMENSION = 800; // Max width or height
const IMAGE_QUALITY = 0.6; // JPEG quality (0-1)

export function EvidenceUpload({
  evidence,
  onEvidenceChange,
  allowedTypes = ['photo', 'document', 'link'],
  hint,
  maxFiles = 10,
}: EvidenceUploadProps) {
  const [isExpanded, setIsExpanded] = useState(evidence.length > 0);
  const [linkInput, setLinkInput] = useState('');
  const [linkDescription, setLinkDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate unique ID
  const generateId = () => `ev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Get accepted file types for input
  const getAcceptedTypes = () => {
    const types: string[] = [];
    if (allowedTypes.includes('photo')) {
      types.push(...PHOTO_TYPES);
    }
    if (allowedTypes.includes('document')) {
      types.push(...DOCUMENT_TYPES);
    }
    return types.join(',');
  };

  // Handle file selection
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);

    if (evidence.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newEvidence: EvidenceFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setError(`File "${file.name}" is too large. Maximum size is 5MB.`);
        continue;
      }

      // Determine type
      const isPhoto = PHOTO_TYPES.includes(file.type);
      const isDocument = DOCUMENT_TYPES.includes(file.type);

      if (!isPhoto && !isDocument) {
        setError(`File "${file.name}" is not a supported type.`);
        continue;
      }

      // Convert to base64 (compress photos, keep documents as-is)
      try {
        let dataUrl: string;
        if (isPhoto) {
          // Compress images to reduce localStorage usage
          dataUrl = await compressImage(file);
        } else {
          // Documents stored as-is (check size limit)
          if (file.size > MAX_FILE_SIZE) {
            setError(`Document "${file.name}" is too large. Maximum size is 2MB.`);
            continue;
          }
          dataUrl = await fileToBase64(file);
        }

        newEvidence.push({
          id: generateId(),
          type: isPhoto ? 'photo' : 'document',
          name: file.name,
          dataUrl,
          mimeType: isPhoto ? 'image/jpeg' : file.type, // Photos converted to JPEG
          size: file.size,
          uploadedAt: new Date().toISOString(),
        });
      } catch (err) {
        setError(`Failed to process "${file.name}"`);
      }
    }

    if (newEvidence.length > 0) {
      onEvidenceChange([...evidence, ...newEvidence]);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [evidence, maxFiles, onEvidenceChange]);

  // Compress image using canvas
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;

        if (width > height) {
          if (width > MAX_IMAGE_DIMENSION) {
            height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
            width = MAX_IMAGE_DIMENSION;
          }
        } else {
          if (height > MAX_IMAGE_DIMENSION) {
            width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
            height = MAX_IMAGE_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to JPEG for better compression
        const dataUrl = canvas.toDataURL('image/jpeg', IMAGE_QUALITY);
        resolve(dataUrl);
      };

      img.onerror = () => reject(new Error('Failed to load image'));

      // Read file as data URL to load into image
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  // Convert file to base64 (for documents)
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle adding a link
  const handleAddLink = useCallback(() => {
    if (!linkInput.trim()) return;

    setError(null);

    // Basic URL validation
    let url = linkInput.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    if (evidence.length >= maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newLink: EvidenceFile = {
      id: generateId(),
      type: 'link',
      name: linkDescription.trim() || url,
      url,
      uploadedAt: new Date().toISOString(),
      description: linkDescription.trim() || undefined,
    };

    onEvidenceChange([...evidence, newLink]);
    setLinkInput('');
    setLinkDescription('');
  }, [linkInput, linkDescription, evidence, maxFiles, onEvidenceChange]);

  // Remove evidence item
  const handleRemove = useCallback((id: string) => {
    onEvidenceChange(evidence.filter(e => e.id !== id));
  }, [evidence, onEvidenceChange]);

  // Format file size
  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Get icon for evidence type
  const getIcon = (type: 'photo' | 'document' | 'link') => {
    switch (type) {
      case 'photo':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        );
      case 'document':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        );
      case 'link':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        );
    }
  };

  if (!isExpanded && evidence.length === 0) {
    return (
      <button
        type="button"
        className="evidence-toggle-btn"
        onClick={() => setIsExpanded(true)}
      >
        <span className="evidence-toggle-icons">
          {allowedTypes.includes('photo') && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          )}
          {allowedTypes.includes('document') && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          )}
        </span>
        Add evidence (optional)
      </button>
    );
  }

  return (
    <div className="evidence-upload">
      <div className="evidence-header">
        <h4 className="evidence-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
          </svg>
          Evidence
          {evidence.length > 0 && <span className="evidence-count">{evidence.length}</span>}
        </h4>
        {evidence.length === 0 && (
          <button
            type="button"
            className="evidence-collapse-btn"
            onClick={() => setIsExpanded(false)}
          >
            Cancel
          </button>
        )}
      </div>

      {hint && <p className="evidence-hint">{hint}</p>}

      {/* Existing evidence */}
      {evidence.length > 0 && (
        <div className="evidence-list">
          {evidence.map((item) => (
            <div key={item.id} className={`evidence-item evidence-${item.type}`}>
              <div className="evidence-item-icon">{getIcon(item.type)}</div>
              <div className="evidence-item-info">
                {item.type === 'link' ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="evidence-item-name">
                    {item.name}
                  </a>
                ) : (
                  <span className="evidence-item-name">{item.name}</span>
                )}
                {item.size && <span className="evidence-item-size">{formatSize(item.size)}</span>}
              </div>
              <button
                type="button"
                className="evidence-remove-btn"
                onClick={() => handleRemove(item.id)}
                aria-label={`Remove ${item.name}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error message */}
      {error && <p className="evidence-error">{error}</p>}

      {/* Upload actions */}
      <div className="evidence-actions">
        {/* File upload */}
        {(allowedTypes.includes('photo') || allowedTypes.includes('document')) && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept={getAcceptedTypes()}
              onChange={handleFileSelect}
              multiple
              className="evidence-file-input"
              id="evidence-file-input"
            />
            <label htmlFor="evidence-file-input" className="evidence-upload-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              {allowedTypes.includes('photo') && allowedTypes.includes('document')
                ? 'Upload file'
                : allowedTypes.includes('photo')
                ? 'Upload photo'
                : 'Upload document'}
            </label>
          </>
        )}

        {/* Link input */}
        {allowedTypes.includes('link') && (
          <div className="evidence-link-section">
            <div className="evidence-link-inputs">
              <input
                type="text"
                placeholder="Paste URL..."
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                className="evidence-link-input"
                aria-label="Evidence URL"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={linkDescription}
                onChange={(e) => setLinkDescription(e.target.value)}
                className="evidence-link-description"
                aria-label="Evidence link description"
              />
            </div>
            <button
              type="button"
              className="evidence-add-link-btn"
              onClick={handleAddLink}
              disabled={!linkInput.trim()}
            >
              Add link
            </button>
          </div>
        )}
      </div>

      <p className="evidence-note">
        Supported: {allowedTypes.includes('photo') && 'Images (JPG, PNG - auto-compressed) '}
        {allowedTypes.includes('document') && 'Documents (PDF, Word - max 2MB) '}
        {allowedTypes.includes('link') && 'Links'}
      </p>
    </div>
  );
}
