import { useState, useCallback } from 'react';
import { supabaseRest } from '../utils/supabase';
import type {
  AuthorityProgram,
  ProgramEnrolment,
  AuthorityQuestionGuidance,
  ChildOrgSummary,
} from '../types/access';

export function useAuthorityAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ==========================================
  // PROGRAMS
  // ==========================================

  const getPrograms = useCallback(async (organisationId: string): Promise<AuthorityProgram[]> => {
    setIsLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabaseRest.query(
      'authority_programs',
      '*',
      { organisation_id: organisationId }
    );
    setIsLoading(false);
    if (fetchError) {
      setError(typeof fetchError === 'string' ? fetchError : 'Failed to fetch programs');
      return [];
    }
    return (data as AuthorityProgram[]) || [];
  }, []);

  const getProgram = useCallback(async (programId: string): Promise<AuthorityProgram | null> => {
    setIsLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabaseRest.query(
      'authority_programs',
      '*',
      { id: programId }
    );
    setIsLoading(false);
    if (fetchError || !data || (data as AuthorityProgram[]).length === 0) {
      setError(typeof fetchError === 'string' ? fetchError : 'Program not found');
      return null;
    }
    return (data as AuthorityProgram[])[0];
  }, []);

  const createProgram = useCallback(async (program: {
    organisation_id: string;
    name: string;
    slug: string;
    description?: string;
    required_module_ids: string[];
    access_level: 'pulse' | 'deep_dive';
    allow_self_enrol?: boolean;
    funding_model?: string;
    license_price_cents?: number;
    enrol_message?: string;
  }): Promise<AuthorityProgram | null> => {
    setIsLoading(true);
    setError(null);
    const { data, error: insertError } = await supabaseRest.insert('authority_programs', {
      ...program,
      required_module_ids: `{${program.required_module_ids.join(',')}}`,
      is_active: true,
    });
    setIsLoading(false);
    if (insertError) {
      setError(typeof insertError === 'string' ? insertError : 'Failed to create program');
      return null;
    }
    const result = data as AuthorityProgram[];
    return result?.[0] || null;
  }, []);

  const updateProgram = useCallback(async (
    programId: string,
    updates: Partial<Pick<AuthorityProgram, 'name' | 'description' | 'is_active' | 'required_module_ids' | 'access_level' | 'allow_self_enrol'>>
  ): Promise<AuthorityProgram | null> => {
    setIsLoading(true);
    setError(null);
    const payload: Record<string, unknown> = { ...updates };
    if (updates.required_module_ids) {
      payload.required_module_ids = `{${updates.required_module_ids.join(',')}}`;
    }
    const { data, error: updateError } = await supabaseRest.update(
      'authority_programs',
      payload,
      { id: programId }
    );
    setIsLoading(false);
    if (updateError) {
      setError(typeof updateError === 'string' ? updateError : 'Failed to update program');
      return null;
    }
    const result = data as AuthorityProgram[];
    return result?.[0] || null;
  }, []);

  // ==========================================
  // ENROLMENTS
  // ==========================================

  const getEnrolments = useCallback(async (programId: string): Promise<ProgramEnrolment[]> => {
    setIsLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabaseRest.query(
      'program_enrolments',
      '*',
      { program_id: programId }
    );
    setIsLoading(false);
    if (fetchError) {
      setError(typeof fetchError === 'string' ? fetchError : 'Failed to fetch enrolments');
      return [];
    }
    return (data as ProgramEnrolment[]) || [];
  }, []);

  const enrolBusiness = useCallback(async (
    programId: string,
    businessName: string,
    contactEmail?: string,
  ): Promise<ProgramEnrolment | null> => {
    setIsLoading(true);
    setError(null);

    // First, get the program to find the parent org
    const program = await getProgram(programId);
    if (!program) {
      setIsLoading(false);
      return null;
    }

    // Create a child organisation for the business
    const slug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const { data: orgData, error: orgError } = await supabaseRest.insert('organisations', {
      name: businessName,
      slug: `${slug}-${Date.now()}`,
      org_type: 'standard',
      parent_org_id: program.organisation_id,
      contact_email: contactEmail || null,
      allow_domain_auto_join: false,
      max_members: 10,
    });
    if (orgError || !orgData) {
      setError(typeof orgError === 'string' ? orgError : 'Failed to create business organisation');
      setIsLoading(false);
      return null;
    }
    const newOrg = (orgData as { id: string }[])[0];

    // Create the enrolment
    const { data: enrolData, error: enrolError } = await supabaseRest.insert('program_enrolments', {
      program_id: programId,
      organisation_id: newOrg.id,
      status: 'enrolled',
    });
    setIsLoading(false);
    if (enrolError) {
      setError(typeof enrolError === 'string' ? enrolError : 'Failed to enrol business');
      return null;
    }
    const result = enrolData as ProgramEnrolment[];
    return result?.[0] || null;
  }, [getProgram]);

  // ==========================================
  // CHILD ORG SUMMARIES
  // ==========================================

  const getChildOrgSummaries = useCallback(async (authorityOrgId: string): Promise<ChildOrgSummary[]> => {
    setIsLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabaseRest.query(
      'authority_child_summaries',
      '*',
      { authority_org_id: authorityOrgId }
    );
    setIsLoading(false);
    if (fetchError) {
      setError(typeof fetchError === 'string' ? fetchError : 'Failed to fetch business summaries');
      return [];
    }
    return (data as ChildOrgSummary[]) || [];
  }, []);

  // ==========================================
  // GUIDANCE NOTES
  // ==========================================

  const getGuidanceNotes = useCallback(async (organisationId: string): Promise<AuthorityQuestionGuidance[]> => {
    setIsLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabaseRest.query(
      'authority_question_guidance',
      '*',
      { organisation_id: organisationId }
    );
    setIsLoading(false);
    if (fetchError) {
      setError(typeof fetchError === 'string' ? fetchError : 'Failed to fetch guidance notes');
      return [];
    }
    return (data as AuthorityQuestionGuidance[]) || [];
  }, []);

  const saveGuidanceNote = useCallback(async (note: {
    organisation_id: string;
    question_id: string;
    guidance_text: string;
    program_id?: string;
  }): Promise<AuthorityQuestionGuidance | null> => {
    setIsLoading(true);
    setError(null);
    const { data, error: upsertError } = await supabaseRest.insert('authority_question_guidance', {
      ...note,
      program_id: note.program_id || null,
    });
    setIsLoading(false);
    if (upsertError) {
      setError(typeof upsertError === 'string' ? upsertError : 'Failed to save guidance note');
      return null;
    }
    const result = data as AuthorityQuestionGuidance[];
    return result?.[0] || null;
  }, []);

  const deleteGuidanceNote = useCallback(async (noteId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    const { error: deleteError } = await supabaseRest.delete('authority_question_guidance', { id: noteId });
    setIsLoading(false);
    if (deleteError) {
      setError(typeof deleteError === 'string' ? deleteError : 'Failed to delete guidance note');
      return false;
    }
    return true;
  }, []);

  return {
    isLoading,
    error,
    getPrograms,
    getProgram,
    createProgram,
    updateProgram,
    getEnrolments,
    enrolBusiness,
    getChildOrgSummaries,
    getGuidanceNotes,
    saveGuidanceNote,
    deleteGuidanceNote,
  };
}
