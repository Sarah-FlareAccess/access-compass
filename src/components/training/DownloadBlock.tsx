import type { TrainingDownload } from '../../data/training/types';

interface DownloadBlockProps {
  download: TrainingDownload;
}

function getFileIcon(fileType: string) {
  if (fileType.toLowerCase() === 'pdf') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

export function DownloadBlock({ download }: DownloadBlockProps) {
  return (
    <a
      href={download.fileUrl}
      className="download-block"
      download={download.fileName}
    >
      <span className="download-icon" aria-hidden="true">{getFileIcon(download.fileType)}</span>
      <span className="download-info">
        <span className="download-title">{download.title}</span>
        <span className="download-description">{download.description}</span>
        <span className="download-meta">
          {download.fileType.toUpperCase()}, {download.fileSize}
        </span>
      </span>
      <span className="download-action" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      </span>
      <span className="sr-only">
        Download {download.title} ({download.fileType.toUpperCase()}, {download.fileSize})
      </span>
    </a>
  );
}
