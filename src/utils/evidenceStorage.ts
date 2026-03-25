/**
 * Evidence Storage Utility
 *
 * Handles uploading evidence files (photos, documents) to Supabase Storage
 * instead of storing base64 data in localStorage.
 *
 * Pattern:
 * - Upload: Convert base64 dataUrl to blob, upload to Supabase Storage, return public URL
 * - Download: Fetch from Supabase Storage URL
 * - Fallback: If upload fails, keep base64 in localStorage (offline mode)
 */

import { supabase, isSupabaseEnabled } from './supabase';

const BUCKET_NAME = 'evidence-files';

/**
 * Upload a base64 data URL to Supabase Storage.
 * Returns the storage path on success, or null on failure.
 */
export async function uploadEvidence(
  dataUrl: string,
  userId: string,
  sessionId: string,
  questionId: string,
  fileName: string
): Promise<{ storagePath: string; publicUrl: string } | null> {
  if (!isSupabaseEnabled() || !supabase) return null;

  try {
    // Convert base64 data URL to blob
    const blob = dataUrlToBlob(dataUrl);
    if (!blob) return null;

    // Create a unique path: userId/sessionId/questionId/fileName
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${userId}/${sessionId}/${questionId}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, blob, {
        contentType: blob.type,
        upsert: true,
      });

    if (uploadError) {
      console.warn('[EvidenceStorage] Upload failed:', uploadError.message);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath);

    return {
      storagePath,
      publicUrl: urlData.publicUrl,
    };
  } catch (err) {
    console.warn('[EvidenceStorage] Upload error:', err);
    return null;
  }
}

/**
 * Delete an evidence file from Supabase Storage.
 */
export async function deleteEvidenceFile(storagePath: string): Promise<boolean> {
  if (!isSupabaseEnabled() || !supabase || !storagePath) return false;

  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([storagePath]);

    if (error) {
      console.warn('[EvidenceStorage] Delete failed:', error.message);
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Try to upload evidence in the background. If successful, returns
 * the updated evidence file with URL instead of base64.
 * If it fails, returns the original (with base64 intact).
 */
export async function migrateEvidenceToStorage(
  evidenceFile: { dataUrl?: string; url?: string; name: string; id: string },
  userId: string,
  sessionId: string,
  questionId: string
): Promise<{ url?: string; storagePath?: string } | null> {
  // Skip if already uploaded or no dataUrl
  if (!evidenceFile.dataUrl) return null;
  if (evidenceFile.url && !evidenceFile.url.startsWith('data:')) return null;

  const result = await uploadEvidence(
    evidenceFile.dataUrl,
    userId,
    sessionId,
    questionId,
    evidenceFile.name
  );

  if (!result) return null;

  return {
    url: result.publicUrl,
    storagePath: result.storagePath,
  };
}

/**
 * Convert a base64 data URL to a Blob.
 */
function dataUrlToBlob(dataUrl: string): Blob | null {
  try {
    const parts = dataUrl.split(',');
    if (parts.length !== 2) return null;

    const mimeMatch = parts[0].match(/data:([^;]+)/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';

    const byteString = atob(parts[1]);
    const buffer = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      buffer[i] = byteString.charCodeAt(i);
    }

    return new Blob([buffer], { type: mimeType });
  } catch {
    return null;
  }
}

/**
 * Create the storage bucket if it doesn't exist.
 * Call this once on app initialization.
 */
export async function ensureEvidenceBucket(): Promise<void> {
  if (!isSupabaseEnabled() || !supabase) return;

  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = buckets?.some(b => b.name === BUCKET_NAME);

    if (!exists) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 10 * 1024 * 1024, // 10MB per file
        allowedMimeTypes: [
          'image/jpeg', 'image/png', 'image/webp', 'image/gif',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
      });
    }
  } catch {
    // Bucket creation requires service role; skip if using anon key
    // The bucket should be created manually in the Supabase dashboard
  }
}
