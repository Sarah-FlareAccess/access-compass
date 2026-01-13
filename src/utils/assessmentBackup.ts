/**
 * Assessment Backup Service
 *
 * Handles backing up deleted assessments to Supabase for temporary recovery.
 * Backups are retained for 30 days before automatic cleanup.
 */

import { supabase, isSupabaseEnabled } from './supabase';
import { getSession } from './session';
import type { ModuleRun } from '../hooks/useModuleProgress';

export interface DeletedAssessmentBackup {
  id: string;
  session_id: string;
  module_id: string;
  module_name: string;
  run_data: ModuleRun;
  deleted_at: string;
  expires_at: string;
  recovery_code?: string;
}

/**
 * Backup a deleted assessment to Supabase
 * Returns true if backup was successful, false otherwise
 */
export async function backupDeletedAssessment(
  moduleId: string,
  moduleName: string,
  run: ModuleRun
): Promise<{ success: boolean; recoveryCode?: string; error?: string }> {
  if (!isSupabaseEnabled() || !supabase) {
    console.warn('Supabase not enabled - assessment backup skipped');
    return { success: false, error: 'Supabase not configured' };
  }

  const session = getSession();
  const sessionId = session?.session_id || 'anonymous';

  // Generate a recovery code for potential manual recovery requests
  const recoveryCode = generateRecoveryCode();

  // Calculate expiration date (30 days from now)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  try {
    const { error } = await supabase
      .from('deleted_assessments')
      .insert({
        session_id: sessionId,
        module_id: moduleId,
        module_name: moduleName,
        run_data: run,
        deleted_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        recovery_code: recoveryCode,
      });

    if (error) {
      console.error('Failed to backup deleted assessment:', error);
      return { success: false, error: error.message };
    }

    console.log(`Assessment backed up successfully. Recovery code: ${recoveryCode}`);
    return { success: true, recoveryCode };
  } catch (err) {
    console.error('Error backing up deleted assessment:', err);
    return { success: false, error: 'Unexpected error during backup' };
  }
}

/**
 * Generate a human-readable recovery code
 */
function generateRecoveryCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excludes confusing characters
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Get deleted assessments for the current session (for admin/recovery purposes)
 */
export async function getDeletedAssessments(): Promise<DeletedAssessmentBackup[]> {
  if (!isSupabaseEnabled() || !supabase) {
    return [];
  }

  const session = getSession();
  if (!session?.session_id) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('deleted_assessments')
      .select('*')
      .eq('session_id', session.session_id)
      .gt('expires_at', new Date().toISOString())
      .order('deleted_at', { ascending: false });

    if (error) {
      console.error('Error fetching deleted assessments:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error fetching deleted assessments:', err);
    return [];
  }
}

/**
 * Recover a deleted assessment by recovery code
 */
export async function recoverAssessment(
  recoveryCode: string
): Promise<{ success: boolean; run?: ModuleRun; moduleId?: string; error?: string }> {
  if (!isSupabaseEnabled() || !supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('deleted_assessments')
      .select('*')
      .eq('recovery_code', recoveryCode.toUpperCase())
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !data) {
      return { success: false, error: 'Recovery code not found or expired' };
    }

    return {
      success: true,
      run: data.run_data as ModuleRun,
      moduleId: data.module_id,
    };
  } catch (err) {
    console.error('Error recovering assessment:', err);
    return { success: false, error: 'Unexpected error during recovery' };
  }
}
