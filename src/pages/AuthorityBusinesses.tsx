import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuthorityAdmin } from '../hooks/useAuthorityAdmin';
import '../styles/authority.css';

import type { ChildOrgSummary } from '../types/access';

export default function AuthorityBusinesses() {
  usePageTitle('Businesses');
  const { accessState } = useAuth();
  const orgId = accessState.organisation?.id;
  const { getChildOrgSummaries } = useAuthorityAdmin();

  const [summaries, setSummaries] = useState<ChildOrgSummary[]>([]);
  const [filter, setFilter] = useState<'all' | 'enrolled' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    if (!orgId) return;
    getChildOrgSummaries(orgId).then(setSummaries);
  }, [orgId]);

  // Deduplicate by child_org_id, keeping the most relevant enrolment
  const businessMap = new Map<string, ChildOrgSummary>();
  summaries.forEach(s => {
    const existing = businessMap.get(s.child_org_id);
    if (!existing || (s.enrolment_status === 'completed' && existing.enrolment_status !== 'completed')) {
      businessMap.set(s.child_org_id, s);
    }
  });
  const businesses = Array.from(businessMap.values());

  const filtered = filter === 'all' ? businesses : businesses.filter(b => b.enrolment_status === filter);

  if (!orgId) return null;

  return (
    <div className="authority-page">
      <Link to="/authority" className="authority-back-link">Authority Portal</Link>
      <div className="authority-header">
        <h1>Businesses</h1>
      </div>

      <p className="authority-privacy-note">
        Privacy: You can see assessment completion status and score bands. Individual answers and evidence remain private to each business.
      </p>

      {/* Filter bar */}
      <div className="authority-filter-bar">
        {(['all', 'enrolled', 'in_progress', 'completed'] as const).map(f => (
          <button
            key={f}
            className={`authority-filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'all' && ` (${businesses.length})`}
          </button>
        ))}
      </div>

      {/* Business list */}
      {filtered.length === 0 ? (
        <p className="authority-empty-text">
          {filter === 'all' ? 'No businesses enrolled yet.' : `No businesses with status "${filter}".`}
        </p>
      ) : (
        <div className="authority-business-list">
          <div className="authority-business-header">
            <span>Business</span>
            <span>Program</span>
            <span>Status</span>
            <span>Enrolled</span>
            <span>Completed</span>
          </div>
          {filtered.map(business => (
            <div key={`${business.child_org_id}-${business.program_id}`} className="authority-business-row">
              <span className="authority-business-name">{business.child_org_name}</span>
              <span>{business.program_id ? 'Assigned' : '-'}</span>
              <span className={`authority-enrolment-status ${business.enrolment_status || 'enrolled'}`}>
                {business.enrolment_status || 'Enrolled'}
              </span>
              <span>{business.enrolled_at ? new Date(business.enrolled_at).toLocaleDateString('en-AU') : '-'}</span>
              <span>{business.completed_at ? new Date(business.completed_at).toLocaleDateString('en-AU') : '-'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
