import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { supabaseRest } from '../utils/supabase';
import { accessModules } from '../data/accessModules';
import '../styles/authority.css';

import type { AuthorityProgram } from '../types/access';

export default function ProgramEnrol() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, signUp, signIn } = useAuth();

  const [program, setProgram] = useState<AuthorityProgram | null>(null);
  const [authorityName, setAuthorityName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Enrolment form
  const [businessName, setBusinessName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPassword, setContactPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'info' | 'signup' | 'enrolling' | 'done'>('info');
  const [enrolling, setEnrolling] = useState(false);

  usePageTitle(program?.name || 'Enrol');

  useEffect(() => {
    if (!slug) return;
    loadProgram();
  }, [slug]);

  const loadProgram = async () => {
    setLoading(true);
    // Find program by slug (programs have unique slugs per org, but we search across all)
    const { data, error: fetchError } = await supabaseRest.query(
      'authority_programs',
      '*',
      { slug: slug!, is_active: 'true', allow_self_enrol: 'true' }
    );
    if (fetchError || !data || (data as AuthorityProgram[]).length === 0) {
      setError('Program not found or enrolment is not available.');
      setLoading(false);
      return;
    }
    const prog = (data as AuthorityProgram[])[0];
    setProgram(prog);

    // Get authority org name
    const { data: orgData } = await supabaseRest.query(
      'organisations',
      'name',
      { id: prog.organisation_id }
    );
    if (orgData && (orgData as { name: string }[]).length > 0) {
      setAuthorityName((orgData as { name: string }[])[0].name);
    }
    setLoading(false);
  };

  const handleEnrol = async () => {
    if (!program || !businessName.trim()) return;
    setEnrolling(true);
    setError(null);

    // If not authenticated, create account first
    if (!isAuthenticated) {
      if (!contactEmail || !contactPassword) {
        setStep('signup');
        setEnrolling(false);
        return;
      }
      const { error: signUpError } = await signUp(contactEmail, contactPassword);
      if (signUpError) {
        // Try signing in instead (account may already exist)
        const { error: signInError } = await signIn(contactEmail, contactPassword);
        if (signInError) {
          setError('Could not create or sign into account. Please try again.');
          setEnrolling(false);
          return;
        }
      }
    }

    setStep('enrolling');

    // Create child organisation for the business
    const orgSlug = businessName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const { data: orgData, error: orgError } = await supabaseRest.insert('organisations', {
      name: businessName.trim(),
      slug: `${orgSlug}-${Date.now()}`,
      org_type: 'standard',
      parent_org_id: program.organisation_id,
      contact_email: contactEmail || null,
      allow_domain_auto_join: false,
      max_members: 10,
    });

    if (orgError || !orgData) {
      setError('Could not create your organisation. Please try again.');
      setEnrolling(false);
      setStep('info');
      return;
    }
    const newOrg = (orgData as { id: string }[])[0];

    // Create membership linking the user to the new org
    if (user?.id) {
      await supabaseRest.insert('organisation_memberships', {
        organisation_id: newOrg.id,
        user_id: user.id,
        role: 'owner',
        status: 'active',
      });
    }

    // Create program enrolment
    const { error: enrolError } = await supabaseRest.insert('program_enrolments', {
      program_id: program.id,
      organisation_id: newOrg.id,
      status: 'enrolled',
    });

    if (enrolError) {
      setError('Could not complete enrolment. Please try again.');
      setEnrolling(false);
      setStep('info');
      return;
    }

    setEnrolling(false);
    setStep('done');
  };

  if (loading) {
    return (
      <div className="authority-page" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <p>Loading program details...</p>
      </div>
    );
  }

  if (error && !program) {
    return (
      <div className="authority-page">
        <div className="authority-empty">
          <h2>Program not available</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!program) return null;

  const programModules = accessModules.filter(m => program.required_module_ids.includes(m.id));
  const estimatedTime = programModules.reduce((sum, m) =>
    program.access_level === 'deep_dive' ? sum + (m.estimatedTimeDeepDive || m.estimatedTime) : sum + m.estimatedTime, 0
  );
  const isFree = program.funding_model === 'authority_funded' || !program.license_price_cents;
  const priceLabel = isFree ? 'No cost' : `$${(program.license_price_cents! / 100).toFixed(0)} AUD`;

  if (step === 'done') {
    return (
      <div className="authority-page">
        <div className="authority-empty">
          <h2>You are enrolled</h2>
          <p>Your business has been enrolled in {program.name}. You can now start your accessibility assessment.</p>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="authority-page">
      <div className="authority-form-card" style={{ maxWidth: '640px', margin: '0 auto' }}>
        {/* Program info */}
        <p className="authority-form-hint" style={{ fontStyle: 'normal', marginBottom: '0.5rem' }}>
          {authorityName && `Provided by ${authorityName}`}
        </p>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.5rem', color: 'var(--text-primary, #2d2420)' }}>
          {program.name}
        </h1>
        {program.enrol_message && (
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #5C4A4E)', lineHeight: 1.6, marginBottom: '1rem' }}>
            {program.enrol_message}
          </p>
        )}
        {program.description && !program.enrol_message && (
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #5C4A4E)', lineHeight: 1.6, marginBottom: '1rem' }}>
            {program.description}
          </p>
        )}

        {/* Program details */}
        <div className="authority-program-meta" style={{ marginBottom: '1.5rem' }}>
          <span>{program.access_level === 'pulse' ? 'Pulse Check' : 'Deep Dive'}</span>
          <span>{programModules.length} modules</span>
          <span style={{ fontWeight: 700 }}>{priceLabel}</span>
        </div>

        {/* Module list */}
        <details style={{ marginBottom: '1.5rem' }}>
          <summary style={{ cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: 'var(--amethyst-diamond, #490E67)' }}>
            What you will be assessed on ({programModules.length} modules)
          </summary>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary, #5C4A4E)', lineHeight: 1.8 }}>
            {programModules.map(m => (
              <li key={m.id}>{m.id} {m.name}</li>
            ))}
          </ul>
        </details>

        {error && (
          <p style={{ color: 'var(--coral-flare, #ea0b3f)', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>
        )}

        {/* Enrolment form */}
        {step === 'info' && (
          <>
            <div className="authority-form-group">
              <label htmlFor="enrol-business-name">Your business name</label>
              <input
                id="enrol-business-name"
                type="text"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="e.g. Sunrise Cafe"
              />
            </div>

            {!isAuthenticated && (
              <>
                <div className="authority-form-group">
                  <label htmlFor="enrol-email">Your email</label>
                  <input
                    id="enrol-email"
                    type="email"
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    placeholder="you@business.com"
                  />
                </div>
                <div className="authority-form-group">
                  <label htmlFor="enrol-password">Create a password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="enrol-password"
                      type={showPassword ? 'text' : 'password'}
                      value={contactPassword}
                      onChange={e => setContactPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      minLength={8}
                      style={{ paddingRight: '3rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: 'var(--text-secondary, #5C4A4E)',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {isAuthenticated && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #5C4A4E)', marginBottom: '1rem' }}>
                Signed in as {user?.email}
              </p>
            )}

            {!isFree && (
              <div className="authority-privacy-note" style={{ marginBottom: '1rem' }}>
                You will be charged <strong>{priceLabel}</strong> to enrol in this program.
                {program.funding_model === 'co_funded' && ' This is a subsidised rate provided by the program organiser.'}
              </div>
            )}

            {isFree && (
              <div className="authority-privacy-note" style={{ marginBottom: '1rem' }}>
                This assessment is provided at no cost by {authorityName || 'the program organiser'}.
              </div>
            )}

            <button
              className="btn btn-primary"
              onClick={handleEnrol}
              disabled={enrolling || !businessName.trim() || (!isAuthenticated && (!contactEmail || !contactPassword))}
              style={{ width: '100%' }}
            >
              {enrolling ? 'Enrolling...' : isFree ? 'Enrol and start assessment' : `Pay ${priceLabel} and enrol`}
            </button>
          </>
        )}

        {step === 'enrolling' && (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <p>Setting up your assessment...</p>
          </div>
        )}
      </div>
    </div>
  );
}
