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
      return null;
    }

    const { data: signed, error: signError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(storagePath, 60 * 60 * 24 * 365);

    if (signError || !signed?.signedUrl) {
      return null;
    }

    return {
      storagePath,
      publicUrl: signed.signedUrl,
    };
  } catch {
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

export async function computeFileHash(file: Blob): Promise<string | null> {
  try {
    const buffer = await file.arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return null;
  }
}

export interface ExistingEvidenceMatch {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  storagePath: string;
  mimeType?: string;
  bucket: string;
  source: 'evidence_files' | 'diap_documents';
  origin: 'module' | 'diap';
  moduleCode?: string;
  diapCategory?: string;
}

export async function findEvidenceByHash(
  userId: string,
  hash: string
): Promise<ExistingEvidenceMatch | null> {
  if (!isSupabaseEnabled() || !supabase || !userId || !hash) return null;
  try {
    const { data, error } = await supabase
      .from('evidence_files')
      .select('id, file_name, file_type, file_size, storage_path, mime_type, bucket_name')
      .eq('user_id', userId)
      .eq('file_hash', hash)
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return {
      id: data.id as string,
      fileName: data.file_name as string,
      fileType: data.file_type as string,
      fileSize: (data.file_size as number) || 0,
      storagePath: data.storage_path as string,
      mimeType: data.mime_type as string | undefined,
      bucket: (data.bucket_name as string) || 'evidence-files',
      source: 'evidence_files',
    };
  } catch {
    return null;
  }
}

export async function listEvidenceForUser(
  userId: string,
  organisationId?: string | null
): Promise<ExistingEvidenceMatch[]> {
  if (!isSupabaseEnabled() || !supabase || !userId) return [];
  try {
    let efQuery = supabase
      .from('evidence_files')
      .select('id, file_name, file_type, file_size, storage_path, mime_type, bucket_name, module_id, diap_item_id, linked_diap_item_ids, created_at')
      .order('created_at', { ascending: false })
      .limit(500);
    if (organisationId) {
      efQuery = efQuery.or(`user_id.eq.${userId},organisation_id.eq.${organisationId}`);
    } else {
      efQuery = efQuery.eq('user_id', userId);
    }

    let ddQuery = supabase
      .from('diap_documents')
      .select('id, filename, file_type, file_size, storage_path, linked_item_ids, uploaded_at')
      .order('uploaded_at', { ascending: false })
      .limit(500);
    if (organisationId) {
      ddQuery = ddQuery.or(`user_id.eq.${userId},organisation_id.eq.${organisationId}`);
    } else {
      ddQuery = ddQuery.eq('user_id', userId);
    }

    const [efResult, ddResult] = await Promise.all([efQuery, ddQuery]);

    const efRows = (!efResult.error && efResult.data) ? (efResult.data as Record<string, unknown>[]) : [];
    const ddRows = (!ddResult.error && ddResult.data) ? (ddResult.data as Record<string, unknown>[]) : [];

    const itemIdsToLookup = new Set<string>();
    for (const row of efRows) {
      const primary = row.diap_item_id as string | null;
      if (primary) itemIdsToLookup.add(primary);
      const linked = (row.linked_diap_item_ids as string[] | null) || [];
      for (const id of linked) itemIdsToLookup.add(id);
    }
    for (const row of ddRows) {
      const linked = (row.linked_item_ids as string[] | null) || [];
      for (const id of linked) itemIdsToLookup.add(id);
    }

    const itemCategoryMap = new Map<string, string>();
    if (itemIdsToLookup.size > 0) {
      try {
        const { data: itemRows } = await supabase
          .from('diap_items')
          .select('id, category')
          .in('id', Array.from(itemIdsToLookup));
        if (itemRows) {
          for (const ir of itemRows as Record<string, unknown>[]) {
            itemCategoryMap.set(ir.id as string, (ir.category as string) || 'physical-access');
          }
        }
      } catch {}
    }

    const seenPaths = new Set<string>();
    const out: ExistingEvidenceMatch[] = [];

    for (const row of efRows) {
      const path = row.storage_path as string;
      if (!path || seenPaths.has(path)) continue;
      seenPaths.add(path);
      const diapId = (row.diap_item_id as string | null) || ((row.linked_diap_item_ids as string[] | null) || [])[0];
      const moduleCode = (row.module_id as string | null) || undefined;
      const isDiap = !!diapId;
      out.push({
        id: row.id as string,
        fileName: row.file_name as string,
        fileType: row.file_type as string,
        fileSize: (row.file_size as number) || 0,
        storagePath: path,
        mimeType: row.mime_type as string | undefined,
        bucket: (row.bucket_name as string) || 'evidence-files',
        source: 'evidence_files',
        origin: isDiap ? 'diap' : 'module',
        moduleCode: isDiap ? undefined : moduleCode,
        diapCategory: isDiap && diapId ? itemCategoryMap.get(diapId) : undefined,
      });
    }

    for (const row of ddRows) {
      const path = row.storage_path as string;
      if (!path || path.startsWith('data:') || seenPaths.has(path)) continue;
      seenPaths.add(path);
      const fileType = (row.file_type as string) || 'application/octet-stream';
      const linkedIds = (row.linked_item_ids as string[] | null) || [];
      const linkedCategory = linkedIds.length > 0 ? itemCategoryMap.get(linkedIds[0]) : undefined;
      out.push({
        id: row.id as string,
        fileName: row.filename as string,
        fileType,
        fileSize: (row.file_size as number) || 0,
        storagePath: path,
        mimeType: fileType,
        bucket: 'diap-documents',
        source: 'diap_documents',
        origin: 'diap',
        diapCategory: linkedCategory || 'operations-policy-procedure',
      });
    }

    return out;
  } catch {
    return [];
  }
}

export function listLocalEvidence(): ExistingEvidenceMatch[] {
  const out: ExistingEvidenceMatch[] = [];
  try {
    const raw = localStorage.getItem('access_compass_module_progress');
    if (raw) {
      const progress = JSON.parse(raw) as Record<string, { responses?: Array<{ evidence?: Array<{ id: string; name: string; type?: string; mimeType?: string; size?: number; storagePath?: string; bucket?: string; dataUrl?: string; url?: string }> }> }>;
      for (const [moduleKey, moduleData] of Object.entries(progress || {})) {
        for (const resp of moduleData.responses || []) {
          for (const ev of resp.evidence || []) {
            if (!ev.id || !ev.name) continue;
            if (ev.type === 'link') continue;
            const isPhoto = ev.type === 'photo' || (ev.mimeType?.startsWith('image/') ?? false);
            out.push({
              id: ev.id,
              fileName: ev.name,
              fileType: isPhoto ? 'photo' : 'document',
              fileSize: ev.size || 0,
              storagePath: ev.storagePath || '',
              mimeType: ev.mimeType,
              bucket: ev.bucket || 'evidence-files',
              source: 'evidence_files',
              origin: 'module',
              moduleCode: moduleKey,
            });
          }
        }
      }
    }
  } catch {}
  try {
    const raw = localStorage.getItem('access_compass_diap_items');
    if (raw) {
      const items = JSON.parse(raw) as Array<{ category?: string; attachments?: Array<{ id: string; name: string; type?: string; size?: number; storagePath?: string; bucket?: string; dataUrl?: string }> }>;
      for (const item of items || []) {
        for (const att of item.attachments || []) {
          if (!att.id || !att.name) continue;
          const isPhoto = att.type?.startsWith('image/') ?? false;
          out.push({
            id: att.id,
            fileName: att.name,
            fileType: isPhoto ? 'photo' : 'document',
            fileSize: att.size || 0,
            storagePath: att.storagePath || '',
            mimeType: att.type,
            bucket: att.bucket || 'evidence-files',
            source: 'evidence_files',
            origin: 'diap',
            diapCategory: item.category || 'physical-access',
          });
        }
      }
    }
  } catch {}
  return out;
}

export async function promoteToEvidenceFile(
  match: ExistingEvidenceMatch,
  context: { userId: string; organisationId?: string | null; sessionId: string; questionId?: string; diapItemId?: string; moduleId?: string }
): Promise<{ id: string; bucket: string; storagePath: string } | null> {
  if (!isSupabaseEnabled() || !supabase) return null;

  if (match.source === 'evidence_files') {
    await linkExistingEvidence(match.id, {
      questionId: context.questionId,
      diapItemId: context.diapItemId,
    });
    return { id: match.id, bucket: match.bucket, storagePath: match.storagePath };
  }

  try {
    const newId = crypto.randomUUID();
    const isPhoto = match.mimeType?.startsWith('image/') ?? false;
    const { error } = await supabase.from('evidence_files').insert({
      id: newId,
      user_id: context.userId,
      organisation_id: context.organisationId || null,
      session_id: context.sessionId,
      module_id: context.moduleId || null,
      question_id: context.questionId || null,
      diap_item_id: context.diapItemId || null,
      linked_question_ids: context.questionId ? [context.questionId] : [],
      linked_diap_item_ids: context.diapItemId ? [context.diapItemId] : [],
      file_name: match.fileName,
      file_type: isPhoto ? 'photo' : 'document',
      file_size: match.fileSize,
      storage_path: match.storagePath,
      mime_type: match.mimeType,
      bucket_name: match.bucket,
    });
    if (error) {
      console.warn('promoteToEvidenceFile insert failed:', error);
      return null;
    }
    return { id: newId, bucket: match.bucket, storagePath: match.storagePath };
  } catch {
    return null;
  }
}

export async function linkExistingEvidence(
  evidenceFileId: string,
  link: { questionId?: string; diapItemId?: string }
): Promise<boolean> {
  if (!isSupabaseEnabled() || !supabase) return false;
  try {
    const { data: row, error: fetchError } = await supabase
      .from('evidence_files')
      .select('linked_question_ids, linked_diap_item_ids')
      .eq('id', evidenceFileId)
      .maybeSingle();
    if (fetchError || !row) return false;
    const update: Record<string, unknown> = {};
    if (link.questionId) {
      const current = (row.linked_question_ids as string[] | null) || [];
      if (!current.includes(link.questionId)) {
        update.linked_question_ids = [...current, link.questionId];
      }
    }
    if (link.diapItemId) {
      const current = (row.linked_diap_item_ids as string[] | null) || [];
      if (!current.includes(link.diapItemId)) {
        update.linked_diap_item_ids = [...current, link.diapItemId];
      }
    }
    if (Object.keys(update).length === 0) return true;
    const { error: updateError } = await supabase
      .from('evidence_files')
      .update(update)
      .eq('id', evidenceFileId);
    return !updateError;
  } catch {
    return false;
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
