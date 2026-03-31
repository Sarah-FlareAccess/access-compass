import { useState, useEffect, useCallback } from 'react';
import { supabaseRest, isSupabaseEnabled } from '../utils/supabase';
import type { AuthorityProgram, ProgramEnrolment } from '../types/access';

interface ProgramEnrolmentState {
  enrolment: ProgramEnrolment | null;
  program: AuthorityProgram | null;
  isLoading: boolean;
}

/**
 * Fetches the program enrolment (if any) for a given organisation.
 * Used by enrolled businesses to scope their module list to program requirements.
 */
export function useProgramEnrolment(organisationId?: string): ProgramEnrolmentState {
  const [state, setState] = useState<ProgramEnrolmentState>({
    enrolment: null,
    program: null,
    isLoading: false,
  });

  const fetchEnrolment = useCallback(async (orgId: string) => {
    if (!isSupabaseEnabled()) return;

    setState(prev => ({ ...prev, isLoading: true }));

    // Fetch enrolments for this org
    const { data: enrolments, error: enrolError } = await supabaseRest.query(
      'program_enrolments',
      '*',
      { organisation_id: orgId }
    );

    if (enrolError || !enrolments || (enrolments as ProgramEnrolment[]).length === 0) {
      setState({ enrolment: null, program: null, isLoading: false });
      return;
    }

    // Use the first active enrolment (businesses typically have one)
    const enrolment = (enrolments as ProgramEnrolment[])[0];

    // Fetch the associated program to get required_module_ids
    const { data: programs, error: progError } = await supabaseRest.query(
      'authority_programs',
      '*',
      { id: enrolment.program_id }
    );

    if (progError || !programs || (programs as AuthorityProgram[]).length === 0) {
      setState({ enrolment, program: null, isLoading: false });
      return;
    }

    const program = (programs as AuthorityProgram[])[0];

    // Parse required_module_ids if it comes back as a Postgres array string
    if (typeof program.required_module_ids === 'string') {
      const raw = program.required_module_ids as unknown as string;
      program.required_module_ids = raw.replace(/[{}]/g, '').split(',').filter(Boolean);
    }

    setState({ enrolment, program, isLoading: false });
  }, []);

  useEffect(() => {
    if (organisationId) {
      fetchEnrolment(organisationId);
    } else {
      setState({ enrolment: null, program: null, isLoading: false });
    }
  }, [organisationId, fetchEnrolment]);

  return state;
}
