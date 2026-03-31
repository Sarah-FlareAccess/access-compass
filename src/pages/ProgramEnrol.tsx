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
  const [step, setStep] = useState<'info' | 'signup' | 'returning' | 'enrolling' | 'carryover' | 'done'>('info');
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [completedOverlap, setCompletedOverlap] = useState<{ moduleId: string; moduleName: string; completedAt: string }[]>([]);
  const [carryoverModules, setCarryoverModules] = useState<Set<string>>(new Set());
  const [declarationConfirmed, setDeclarationConfirmed] = useState(false);
  const [newOrgId, setNewOrgId] = useState<string | null>(null);
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

    // If not authenticated, create account or sign in
    if (!isAuthenticated) {
      if (!contactEmail || !contactPassword) {
        setStep('signup');
        setEnrolling(false);
        return;
      }

      if (isReturningUser) {
        // Returning user: sign in with existing password
        const { error: signInError } = await signIn(contactEmail, contactPassword);
        if (signInError) {
          setError('Incorrect password. Please try again.');
          setEnrolling(false);
          return;
        }
      } else {
        // New user: try sign up
        const { error: signUpError } = await signUp(contactEmail, contactPassword);
        if (signUpError) {
          const errMsg = signUpError.message || '';
          if (errMsg.toLowerCase().includes('already') || errMsg.toLowerCase().includes('exists') || errMsg.toLowerCase().includes('registered')) {
            // Email already registered: switch to sign-in mode
            setIsReturningUser(true);
            setStep('returning');
            setContactPassword('');
            setError(null);
            setEnrolling(false);
            return;
          }
          setError('Could not create account. Please try again.');
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

    setNewOrgId(newOrg.id);
    setEnrolling(false);

    // Check for completed modules that overlap with this program
    const MODULE_PROGRESS_KEY = 'access_compass_module_progress';
    const progressData = localStorage.getItem(MODULE_PROGRESS_KEY);
    if (progressData) {
      const allProgress = JSON.parse(progressData) as Record<string, { moduleId: string; status: string; completedAt?: string }>;
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const overlap = program.required_module_ids
        .map(moduleId => {
          const prog = allProgress[moduleId];
          if (prog?.status === 'completed' && prog.completedAt) {
            const completedDate = new Date(prog.completedAt);
            if (completedDate >= threeMonthsAgo) {
              const mod = accessModules.find(m => m.id === moduleId);
              return { moduleId, moduleName: mod?.name || moduleId, completedAt: prog.completedAt };
            }
          }
          return null;
        })
        .filter(Boolean) as { moduleId: string; moduleName: string; completedAt: string }[];

      if (overlap.length > 0) {
        setCompletedOverlap(overlap);
        setCarryoverModules(new Set(overlap.map(o => o.moduleId)));
        setStep('carryover');
        return;
      }
    }

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
  const isFree = program.funding_model === 'authority_funded' || !program.license_price_cents;
  const priceLabel = isFree ? 'No cost' : `$${(program.license_price_cents! / 100).toFixed(0)} AUD`;

  const handleCarryoverConfirm = async () => {
    if (!program || !newOrgId || !user?.id) return;

    // Save declarations to Supabase for audit trail
    for (const moduleId of carryoverModules) {
      const overlap = completedOverlap.find(o => o.moduleId === moduleId);
      if (!overlap) continue;
      const expiresAt = new Date(overlap.completedAt);
      expiresAt.setDate(expiresAt.getDate() + 90);

      await supabaseRest.insert('module_carryover_declarations', {
        user_id: user.id,
        organisation_id: newOrgId,
        program_id: program.id,
        module_id: moduleId,
        original_completed_at: overlap.completedAt,
        declaration_type: 'no_changes',
        declaration_text: 'I confirm no material changes have been made to my venue since the previous assessment of this module.',
        expires_at: expiresAt.toISOString(),
        valid_days: 90,
      }).catch(() => {});
    }

    setStep('done');
  };

  if (step === 'carryover') {
    const carryCount = carryoverModules.size;
    const reassessCount = completedOverlap.length - carryCount;

    return (
      <div className="authority-page">
        <div className="authority-form-card" style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem' }}>Previous assessment found</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #5C4A4E)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            You have completed {completedOverlap.length} of this program's required modules within the last 3 months. You can carry them forward or choose to re-assess specific modules.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {completedOverlap.map(item => (
              <label key={item.moduleId} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                background: carryoverModules.has(item.moduleId) ? 'rgba(22, 163, 74, 0.06)' : 'rgba(239, 68, 68, 0.04)',
                border: `1px solid ${carryoverModules.has(item.moduleId) ? 'rgba(22, 163, 74, 0.15)' : 'rgba(239, 68, 68, 0.1)'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background 0.15s, border-color 0.15s',
              }}>
                <input
                  type="checkbox"
                  checked={carryoverModules.has(item.moduleId)}
                  onChange={() => {
                    setCarryoverModules(prev => {
                      const next = new Set(prev);
                      if (next.has(item.moduleId)) {
                        next.delete(item.moduleId);
                      } else {
                        next.add(item.moduleId);
                      }
                      return next;
                    });
                  }}
                  style={{ width: '18px', height: '18px', accentColor: '#16A34A' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.moduleId} {item.moduleName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #5C4A4E)' }}>
                    Completed {new Date(item.completedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {carryoverModules.has(item.moduleId) ? ' (carry forward)' : ' (will re-assess)'}
                  </div>
                </div>
              </label>
            ))}
          </div>

          {carryCount > 0 && (
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '1rem',
              background: 'rgba(73, 14, 103, 0.04)',
              border: '1px solid rgba(73, 14, 103, 0.12)',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                checked={declarationConfirmed}
                onChange={e => setDeclarationConfirmed(e.target.checked)}
                style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#490E67' }}
              />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                <strong>Declaration:</strong> I confirm no material changes have been made to my venue or operations that would affect the {carryCount} module{carryCount !== 1 ? 's' : ''} I am carrying forward. I understand I can re-assess at any time.
              </div>
            </label>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              className="btn btn-primary"
              onClick={handleCarryoverConfirm}
              disabled={carryCount > 0 && !declarationConfirmed}
              style={{ flex: 1 }}
            >
              {carryCount > 0
                ? `Carry forward ${carryCount} module${carryCount !== 1 ? 's' : ''}${reassessCount > 0 ? `, re-assess ${reassessCount}` : ''}`
                : `Re-assess all ${completedOverlap.length} modules`}
            </button>
          </div>

          <button
            type="button"
            onClick={() => { setCarryoverModules(new Set()); setStep('done'); }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.8125rem', color: 'var(--text-secondary, #5C4A4E)',
              marginTop: '0.75rem', padding: 0,
            }}
          >
            Skip and start all modules fresh
          </button>
        </div>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="authority-page">
        <div className="authority-empty">
          <h2>You are enrolled</h2>
          <p>Your business has been enrolled in {program.name}. You can now start your accessibility assessment.</p>
          <button className="btn btn-primary" onClick={() => navigate('/assessment')}>
            Go to your modules
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

        {step === 'returning' && (
          <>
            <div style={{
              background: 'rgba(73, 14, 103, 0.04)',
              border: '1px solid rgba(73, 14, 103, 0.12)',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1rem',
            }}>
              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>
                Welcome back
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #5C4A4E)', margin: 0, lineHeight: 1.5 }}>
                An account with <strong>{contactEmail}</strong> already exists. Sign in with your existing password to enrol in this program. Your previous assessment data will be available.
              </p>
            </div>

            <div className="authority-form-group">
              <label htmlFor="enrol-password-returning">Your password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="enrol-password-returning"
                  type={showPassword ? 'text' : 'password'}
                  value={contactPassword}
                  onChange={e => setContactPassword(e.target.value)}
                  placeholder="Enter your existing password"
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

            <button
              className="btn btn-primary"
              onClick={handleEnrol}
              disabled={enrolling || !contactPassword}
              style={{ width: '100%' }}
            >
              {enrolling ? 'Signing in...' : 'Sign in and enrol'}
            </button>

            <button
              type="button"
              onClick={() => { setIsReturningUser(false); setStep('info'); setContactPassword(''); setError(null); }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8125rem',
                color: 'var(--amethyst-diamond, #490E67)',
                marginTop: '0.75rem',
                padding: 0,
              }}
            >
              Use a different email
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
