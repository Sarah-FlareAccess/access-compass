// ============================================
// ACCESS COMPASS - ORG ADMIN PANEL
// ============================================
// Admin panel for managing organisation members,
// invites, security settings, and audit logs
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useOrgAdmin } from '../hooks/useOrgAdmin';
import type {
  OrganisationMembership,
  InviteCode,
  AuditLog,
  OrgSecuritySettings,
  OrgRole,
} from '../types/access';
import type { AllowedEmail } from '../hooks/useOrgAdmin';
import '../styles/admin-panel.css';

type AdminTab = 'members' | 'invites' | 'security' | 'audit';

interface OrgAdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROLE_LABELS: Record<OrgRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  approver: 'Approver',
  editor: 'Editor',
  member: 'Member',
  viewer: 'Viewer',
};

// Role descriptions for tooltips/help text (used in future enhancement)
const _ROLE_DESCRIPTIONS: Record<OrgRole, string> = {
  owner: 'Full control, can change security settings',
  admin: 'Manage members and invites',
  approver: 'Approve new member requests',
  editor: 'Edit module responses',
  member: 'Standard access',
  viewer: 'Read-only access',
};
void _ROLE_DESCRIPTIONS; // Suppress unused warning

export function OrgAdminPanel({ isOpen, onClose }: OrgAdminPanelProps) {
  const { accessState, user } = useAuth();
  const orgAdmin = useOrgAdmin();

  const [activeTab, setActiveTab] = useState<AdminTab>('members');
  const [members, setMembers] = useState<OrganisationMembership[]>([]);
  const [pendingMembers, setPendingMembers] = useState<OrganisationMembership[]>([]);
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [securitySettings, setSecuritySettings] = useState<OrgSecuritySettings | null>(null);
  const [allowedEmails, setAllowedEmails] = useState<AllowedEmail[]>([]);

  // UI state
  const [showCreateInvite, setShowCreateInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    expiresInDays: 30,
    maxUses: 1,
    label: '',
    unlimitedUses: false,
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedTransferUser, setSelectedTransferUser] = useState<string | null>(null);
  const [currentUserIsOwner, setCurrentUserIsOwner] = useState(false);
  const [showAddEmails, setShowAddEmails] = useState(false);
  const [newEmailsText, setNewEmailsText] = useState('');

  const orgId = accessState.organisation?.id;

  // Load data based on active tab
  const loadData = useCallback(async () => {
    if (!orgId) return;

    switch (activeTab) {
      case 'members':
        const [allMembers, pending] = await Promise.all([
          orgAdmin.getMembers(orgId),
          orgAdmin.getPendingMembers(orgId),
        ]);
        setMembers(allMembers);
        setPendingMembers(pending);
        break;

      case 'invites':
        const [codes, emails] = await Promise.all([
          orgAdmin.getInviteCodes(orgId),
          orgAdmin.getAllowedEmails(orgId),
        ]);
        setInviteCodes(codes);
        setAllowedEmails(emails);
        break;

      case 'security':
        const settings = await orgAdmin.getSecuritySettings(orgId);
        setSecuritySettings(settings);
        break;

      case 'audit':
        const logs = await orgAdmin.getAuditLogs(orgId, { days: 30, limit: 100 });
        setAuditLogs(logs);
        break;
    }
  }, [orgId, activeTab, orgAdmin]);

  useEffect(() => {
    if (isOpen && orgId) {
      loadData();
      // Check if current user is owner
      orgAdmin.isOrgOwner(orgId).then(setCurrentUserIsOwner);
    }
  }, [isOpen, orgId, activeTab, loadData, orgAdmin]);

  // Member actions
  const handleApproveMember = async (membershipId: string) => {
    setActionLoading(membershipId);
    const success = await orgAdmin.approveMember(membershipId);
    if (success) {
      await loadData();
    }
    setActionLoading(null);
  };

  const handleRejectMember = async (membershipId: string) => {
    const reason = window.prompt('Reason for rejection (optional):');
    setActionLoading(membershipId);
    const success = await orgAdmin.rejectMember(membershipId, reason || undefined);
    if (success) {
      await loadData();
    }
    setActionLoading(null);
  };

  const handleSuspendMember = async (membershipId: string) => {
    const reason = window.prompt('Reason for suspension:');
    if (!reason) return;
    setActionLoading(membershipId);
    const success = await orgAdmin.suspendMember(membershipId, reason);
    if (success) {
      await loadData();
    }
    setActionLoading(null);
  };

  const handleReactivateMember = async (membershipId: string) => {
    setActionLoading(membershipId);
    const success = await orgAdmin.reactivateMember(membershipId);
    if (success) {
      await loadData();
    }
    setActionLoading(null);
  };

  const handleChangeRole = async (membershipId: string, newRole: OrgRole) => {
    setActionLoading(membershipId);
    const success = await orgAdmin.changeRole(membershipId, newRole);
    if (success) {
      await loadData();
    }
    setActionLoading(null);
  };

  const handleRemoveMember = async (membershipId: string, email: string) => {
    if (!window.confirm(`Remove ${email} from the organisation?`)) return;
    setActionLoading(membershipId);
    const success = await orgAdmin.removeMember(membershipId);
    if (success) {
      await loadData();
    }
    setActionLoading(null);
  };

  // Ownership actions
  const handleTransferOwnership = async () => {
    if (!orgId || !selectedTransferUser) return;

    const confirmed = window.confirm(
      'Are you sure you want to transfer ownership? You will become an admin and cannot undo this action yourself.'
    );
    if (!confirmed) return;

    setActionLoading('transfer');
    const result = await orgAdmin.transferOwnership(orgId, selectedTransferUser);

    if (result.success) {
      setShowTransferModal(false);
      setSelectedTransferUser(null);
      setCurrentUserIsOwner(false);
      await loadData();
      alert('Ownership transferred successfully. You are now an admin.');
    } else {
      alert(result.message);
    }
    setActionLoading(null);
  };

  const handleLeaveOrganisation = async () => {
    if (!orgId) return;

    const confirmed = window.confirm(
      'Are you sure you want to leave this organisation? You will lose access to all shared data.'
    );
    if (!confirmed) return;

    setActionLoading('leave');
    const result = await orgAdmin.leaveOrganisation(orgId);

    if (result.success) {
      // Close panel and refresh - AuthContext should handle the state update
      onClose();
      window.location.reload();
    } else {
      alert(result.message);
    }
    setActionLoading(null);
  };

  // Invite actions
  const handleCreateInvite = async () => {
    if (!orgId) return;
    setActionLoading('create-invite');

    const result = await orgAdmin.createInviteCode(orgId, {
      expiresInDays: inviteForm.expiresInDays,
      maxUses: inviteForm.unlimitedUses ? undefined : inviteForm.maxUses,
      label: inviteForm.label || undefined,
    });

    if (result) {
      setShowCreateInvite(false);
      setInviteForm({ expiresInDays: 30, maxUses: 1, label: '', unlimitedUses: false });
      await loadData();
    }
    setActionLoading(null);
  };

  const handleRevokeInvite = async (code: string) => {
    if (!window.confirm('Revoke this invite code?')) return;
    setActionLoading(code);
    const success = await orgAdmin.revokeInviteCode(code);
    if (success) {
      await loadData();
    }
    setActionLoading(null);
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Allowed emails actions
  const handleAddAllowedEmails = async () => {
    if (!orgId || !newEmailsText.trim()) return;
    setActionLoading('add-emails');

    // Parse emails from text (comma, semicolon, newline, or space separated)
    const emailsArray = newEmailsText
      .split(/[,;\n\s]+/)
      .map(e => e.trim().toLowerCase())
      .filter(e => e && e.includes('@'));

    if (emailsArray.length === 0) {
      alert('Please enter valid email addresses');
      setActionLoading(null);
      return;
    }

    const result = await orgAdmin.addAllowedEmails(orgId, emailsArray);
    if (result) {
      setShowAddEmails(false);
      setNewEmailsText('');
      await loadData();
      if (result.skippedCount > 0) {
        alert(`Added ${result.addedCount} emails. ${result.skippedCount} were already registered.`);
      }
    }
    setActionLoading(null);
  };

  const handleRemoveAllowedEmail = async (emailId: string) => {
    if (!orgId) return;
    if (!window.confirm('Remove this email from the allowed list?')) return;

    setActionLoading(emailId);
    const success = await orgAdmin.removeAllowedEmail(orgId, emailId);
    if (success) {
      await loadData();
    }
    setActionLoading(null);
  };

  // Security settings
  const handleUpdateSecurity = async (key: string, value: boolean | number) => {
    if (!orgId) return;
    setActionLoading(`security-${key}`);

    const updates: Record<string, boolean | number> = {};
    if (key === 'requireApproval') updates.requireApproval = value as boolean;
    if (key === 'requireMfa') updates.requireMfa = value as boolean;
    if (key === 'sessionTimeoutMinutes') updates.sessionTimeoutMinutes = value as number;

    const success = await orgAdmin.updateSecuritySettings(orgId, updates);
    if (success) {
      await loadData();
    }
    setActionLoading(null);
  };

  // Export data
  const handleExportData = async () => {
    if (!orgId) return;
    setActionLoading('export');
    const data = await orgAdmin.exportUserData(orgId);
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `access-compass-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    setActionLoading(null);
  };

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionLabel = (action: string): string => {
    const labels: Record<string, string> = {
      member_joined: 'Member joined',
      member_approved: 'Member approved',
      member_rejected: 'Member rejected',
      member_suspended: 'Member suspended',
      member_reactivated: 'Member reactivated',
      member_removed: 'Member removed',
      member_role_changed: 'Role changed',
      invite_created: 'Invite created',
      invite_used: 'Invite used',
      invite_revoked: 'Invite revoked',
      org_settings_changed: 'Settings changed',
      data_exported: 'Data exported',
    };
    return labels[action] || action.replace(/_/g, ' ');
  };

  return (
    <div className="admin-panel-overlay" onClick={onClose}>
      <div className="admin-panel" onClick={(e) => e.stopPropagation()}>
        <div className="admin-panel-header">
          <h2>Organisation Settings</h2>
          <p className="admin-org-name">{accessState.organisation?.name}</p>
          <button className="btn-close-admin" onClick={onClose}>
            ✕
          </button>
        </div>

        <nav className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            Members
            {pendingMembers.length > 0 && (
              <span className="tab-badge">{pendingMembers.length}</span>
            )}
          </button>
          <button
            className={`admin-tab ${activeTab === 'invites' ? 'active' : ''}`}
            onClick={() => setActiveTab('invites')}
          >
            Invites
          </button>
          <button
            className={`admin-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
          <button
            className={`admin-tab ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            Activity Log
          </button>
        </nav>

        <div className="admin-content">
          {/* MEMBERS TAB */}
          {activeTab === 'members' && (
            <div className="admin-members">
              {/* Pending Approvals */}
              {pendingMembers.length > 0 && (
                <div className="pending-section">
                  <h3>Pending Approval ({pendingMembers.length})</h3>
                  <div className="member-list">
                    {pendingMembers.map((member) => (
                      <div key={member.id} className="member-card pending">
                        <div className="member-info">
                          <span className="member-email">{member.user_email}</span>
                          <span className="member-date">
                            Requested {formatDate(member.joined_at)}
                          </span>
                        </div>
                        <div className="member-actions">
                          <button
                            className="btn-approve"
                            onClick={() => handleApproveMember(member.id)}
                            disabled={actionLoading === member.id}
                          >
                            {actionLoading === member.id ? '...' : 'Approve'}
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => handleRejectMember(member.id)}
                            disabled={actionLoading === member.id}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Members */}
              <div className="members-section">
                <h3>Members ({members.filter((m) => m.status === 'active').length})</h3>
                <div className="member-list">
                  {members
                    .filter((m) => m.status === 'active')
                    .map((member) => (
                      <div key={member.id} className="member-card">
                        <div className="member-info">
                          <span className="member-email">
                            {member.user_email}
                            {member.user_id === user?.id && (
                              <span className="you-badge">You</span>
                            )}
                          </span>
                          <span className="member-role">{ROLE_LABELS[member.role]}</span>
                        </div>
                        {member.user_id !== user?.id && (
                          <div className="member-actions">
                            <select
                              className="role-select"
                              value={member.role}
                              onChange={(e) =>
                                handleChangeRole(member.id, e.target.value as OrgRole)
                              }
                              disabled={actionLoading === member.id}
                            >
                              {Object.entries(ROLE_LABELS).map(([role, label]) => (
                                <option key={role} value={role}>
                                  {label}
                                </option>
                              ))}
                            </select>
                            <button
                              className="btn-suspend"
                              onClick={() => handleSuspendMember(member.id)}
                              disabled={actionLoading === member.id || member.role === 'owner'}
                              title={member.role === 'owner' ? 'Cannot suspend owner' : 'Suspend'}
                            >
                              Suspend
                            </button>
                            <button
                              className="btn-remove"
                              onClick={() =>
                                handleRemoveMember(member.id, member.user_email || '')
                              }
                              disabled={actionLoading === member.id || member.role === 'owner'}
                              title={member.role === 'owner' ? 'Cannot remove owner' : 'Remove'}
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {/* Suspended Members */}
              {members.filter((m) => m.status === 'suspended').length > 0 && (
                <div className="suspended-section">
                  <h3>Suspended</h3>
                  <div className="member-list">
                    {members
                      .filter((m) => m.status === 'suspended')
                      .map((member) => (
                        <div key={member.id} className="member-card suspended">
                          <div className="member-info">
                            <span className="member-email">{member.user_email}</span>
                            <span className="suspended-reason">
                              {member.suspended_reason || 'No reason provided'}
                            </span>
                          </div>
                          <div className="member-actions">
                            <button
                              className="btn-reactivate"
                              onClick={() => handleReactivateMember(member.id)}
                              disabled={actionLoading === member.id}
                            >
                              Reactivate
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Ownership Section */}
              <div className="ownership-section">
                <h3>Ownership & Membership</h3>

                {/* Transfer Ownership - Only visible to owner */}
                {currentUserIsOwner && (
                  <div className="ownership-action">
                    <div className="setting-info">
                      <h4>Transfer Ownership</h4>
                      <p>Transfer organisation ownership to another admin. You will become an admin.</p>
                    </div>
                    <button
                      className="btn-transfer"
                      onClick={() => setShowTransferModal(true)}
                      disabled={members.filter(m => m.role === 'admin' && m.status === 'active').length === 0}
                    >
                      Transfer Ownership
                    </button>
                  </div>
                )}

                {/* Leave Organisation - Only visible to non-owners */}
                {!currentUserIsOwner && (
                  <div className="ownership-action leave-action">
                    <div className="setting-info">
                      <h4>Leave Organisation</h4>
                      <p>Leave this organisation. You will lose access to all shared data.</p>
                    </div>
                    <button
                      className="btn-leave-org"
                      onClick={handleLeaveOrganisation}
                      disabled={actionLoading === 'leave'}
                    >
                      {actionLoading === 'leave' ? 'Leaving...' : 'Leave Organisation'}
                    </button>
                  </div>
                )}

                {/* Owner leaving info */}
                {currentUserIsOwner && (
                  <div className="owner-leave-info">
                    <p>
                      <strong>Note:</strong> As the owner, you must transfer ownership before leaving.
                      If you are the only member, leaving will delete the organisation.
                    </p>
                  </div>
                )}
              </div>

              {/* Transfer Ownership Modal */}
              {showTransferModal && (
                <div className="transfer-modal-overlay" onClick={() => setShowTransferModal(false)}>
                  <div className="transfer-modal" onClick={(e) => e.stopPropagation()}>
                    <h3>Transfer Ownership</h3>
                    <p>Select an admin to become the new owner:</p>

                    <div className="transfer-user-list">
                      {members
                        .filter(m => m.role === 'admin' && m.status === 'active' && m.user_id !== user?.id)
                        .map(member => (
                          <label key={member.id} className="transfer-user-option">
                            <input
                              type="radio"
                              name="transferUser"
                              value={member.user_id}
                              checked={selectedTransferUser === member.user_id}
                              onChange={() => setSelectedTransferUser(member.user_id)}
                            />
                            <span className="transfer-user-email">{member.user_email}</span>
                          </label>
                        ))}
                    </div>

                    {members.filter(m => m.role === 'admin' && m.status === 'active' && m.user_id !== user?.id).length === 0 && (
                      <p className="no-admins-warning">
                        No admins available. Promote a member to admin first before transferring ownership.
                      </p>
                    )}

                    <div className="transfer-warning">
                      <strong>Warning:</strong> This action cannot be undone by you. Only the new owner can transfer ownership back.
                    </div>

                    <div className="modal-actions">
                      <button className="btn-cancel" onClick={() => setShowTransferModal(false)}>
                        Cancel
                      </button>
                      <button
                        className="btn-confirm-transfer"
                        onClick={handleTransferOwnership}
                        disabled={!selectedTransferUser || actionLoading === 'transfer'}
                      >
                        {actionLoading === 'transfer' ? 'Transferring...' : 'Confirm Transfer'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* INVITES TAB */}
          {activeTab === 'invites' && (
            <div className="admin-invites">
              <div className="invites-header">
                <h3>Invite Codes</h3>
                <button
                  className="btn-create-invite"
                  onClick={() => setShowCreateInvite(true)}
                >
                  + Create Invite
                </button>
              </div>

              {showCreateInvite && (
                <div className="create-invite-form">
                  <h4>Create New Invite Code</h4>
                  <div className="form-row">
                    <label>
                      Label (optional)
                      <span className="field-hint">e.g., IT Department</span>
                      <input
                        type="text"
                        value={inviteForm.label}
                        onChange={(e) =>
                          setInviteForm({ ...inviteForm, label: e.target.value })
                        }
                      />
                    </label>
                  </div>
                  <div className="form-row">
                    <label>
                      Expires in (days)
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={inviteForm.expiresInDays}
                        onChange={(e) =>
                          setInviteForm({
                            ...inviteForm,
                            expiresInDays: parseInt(e.target.value) || 30,
                          })
                        }
                      />
                    </label>
                  </div>
                  <div className="form-row">
                    <label>
                      <input
                        type="checkbox"
                        checked={inviteForm.unlimitedUses}
                        onChange={(e) =>
                          setInviteForm({ ...inviteForm, unlimitedUses: e.target.checked })
                        }
                      />
                      Unlimited uses
                    </label>
                  </div>
                  {!inviteForm.unlimitedUses && (
                    <div className="form-row">
                      <label>
                        Maximum uses
                        <input
                          type="number"
                          min="1"
                          max="1000"
                          value={inviteForm.maxUses}
                          onChange={(e) =>
                            setInviteForm({
                              ...inviteForm,
                              maxUses: parseInt(e.target.value) || 1,
                            })
                          }
                        />
                      </label>
                    </div>
                  )}
                  <div className="form-actions">
                    <button
                      className="btn-cancel"
                      onClick={() => setShowCreateInvite(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn-create"
                      onClick={handleCreateInvite}
                      disabled={actionLoading === 'create-invite'}
                    >
                      {actionLoading === 'create-invite' ? 'Creating...' : 'Create'}
                    </button>
                  </div>
                </div>
              )}

              <div className="invite-list">
                {inviteCodes.length === 0 ? (
                  <p className="no-invites">No invite codes yet. Create one above.</p>
                ) : (
                  inviteCodes.map((invite) => (
                    <div
                      key={invite.id}
                      className={`invite-card ${!invite.is_active ? 'inactive' : ''}`}
                    >
                      <div className="invite-info">
                        <div className="invite-code-display">
                          <code>{invite.code}</code>
                          <button
                            className="btn-copy-code"
                            onClick={() => handleCopyCode(invite.code)}
                            disabled={!invite.is_active}
                          >
                            {copiedCode === invite.code ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                        {invite.label && (
                          <span className="invite-label">{invite.label}</span>
                        )}
                        <div className="invite-meta">
                          <span>
                            Uses: {invite.times_used}
                            {invite.max_uses ? `/${invite.max_uses}` : ' (unlimited)'}
                          </span>
                          {invite.expires_at && (
                            <span>Expires: {formatDate(invite.expires_at)}</span>
                          )}
                        </div>
                      </div>
                      {invite.is_active && (
                        <button
                          className="btn-revoke"
                          onClick={() => handleRevokeInvite(invite.code)}
                          disabled={actionLoading === invite.code}
                        >
                          Revoke
                        </button>
                      )}
                      {!invite.is_active && (
                        <span className="inactive-badge">Inactive</span>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* ALLOWED EMAILS SECTION */}
              <div className="allowed-emails-section">
                <div className="invites-header">
                  <div>
                    <h3>Pre-registered Emails</h3>
                    <p className="section-description">
                      Only these email addresses can join using your invite code.
                    </p>
                  </div>
                  <button
                    className="btn-create-invite"
                    onClick={() => setShowAddEmails(true)}
                  >
                    + Add Emails
                  </button>
                </div>

                {showAddEmails && (
                  <div className="create-invite-form">
                    <h4>Add Pre-registered Emails</h4>
                    <p className="form-help">
                      Enter email addresses separated by commas, semicolons, or new lines.
                    </p>
                    <div className="form-row">
                      <label htmlFor="bulk-emails">Email addresses</label>
                      <span className="field-hint">john@company.com, jane@company.com...</span>
                      <textarea
                        id="bulk-emails"
                        className="emails-textarea"
                        value={newEmailsText}
                        onChange={(e) => setNewEmailsText(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div className="form-actions">
                      <button
                        className="btn-cancel"
                        onClick={() => {
                          setShowAddEmails(false);
                          setNewEmailsText('');
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn-create"
                        onClick={handleAddAllowedEmails}
                        disabled={actionLoading === 'add-emails' || !newEmailsText.trim()}
                      >
                        {actionLoading === 'add-emails' ? 'Adding...' : 'Add Emails'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="allowed-emails-list">
                  {allowedEmails.length === 0 ? (
                    <p className="no-invites">
                      No pre-registered emails yet. Add emails above to allow team members to join.
                    </p>
                  ) : (
                    <>
                      <div className="emails-summary">
                        <span className="email-count">
                          {allowedEmails.filter(e => !e.isUsed).length} pending
                        </span>
                        <span className="email-count used">
                          {allowedEmails.filter(e => e.isUsed).length} joined
                        </span>
                      </div>
                      {allowedEmails.map((email) => (
                        <div
                          key={email.id}
                          className={`allowed-email-card ${email.isUsed ? 'used' : ''}`}
                        >
                          <div className="email-info">
                            <span className="email-address">{email.email}</span>
                            <span className="email-status">
                              {email.isUsed ? (
                                <>Joined {formatDate(email.usedAt!)}</>
                              ) : (
                                <>Added {formatDate(email.addedAt)}</>
                              )}
                            </span>
                          </div>
                          {!email.isUsed && (
                            <button
                              className="btn-remove-email"
                              onClick={() => handleRemoveAllowedEmail(email.id)}
                              disabled={actionLoading === email.id}
                              title="Remove email"
                            >
                              {actionLoading === email.id ? '...' : '×'}
                            </button>
                          )}
                          {email.isUsed && (
                            <span className="joined-badge">Joined</span>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && securitySettings && (
            <div className="admin-security">
              <h3>Security Settings</h3>

              <div className="security-setting">
                <div className="setting-info">
                  <h4>Require Approval for New Members</h4>
                  <p>New members must be approved by an admin before gaining access.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={securitySettings.require_approval}
                    onChange={(e) =>
                      handleUpdateSecurity('requireApproval', e.target.checked)
                    }
                    disabled={actionLoading === 'security-requireApproval'}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="security-setting">
                <div className="setting-info">
                  <h4>Require Multi-Factor Authentication</h4>
                  <p>Require all members to set up MFA for enhanced security.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={securitySettings.require_mfa}
                    onChange={(e) => handleUpdateSecurity('requireMfa', e.target.checked)}
                    disabled={actionLoading === 'security-requireMfa'}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="security-setting">
                <div className="setting-info">
                  <h4>Session Timeout</h4>
                  <p>Automatically log out inactive users after this period.</p>
                </div>
                <select
                  className="timeout-select"
                  value={securitySettings.session_timeout_minutes}
                  onChange={(e) =>
                    handleUpdateSecurity('sessionTimeoutMinutes', parseInt(e.target.value))
                  }
                  disabled={actionLoading === 'security-sessionTimeoutMinutes'}
                  aria-label="Session timeout duration"
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                  <option value={240}>4 hours</option>
                  <option value={480}>8 hours</option>
                  <option value={1440}>24 hours</option>
                </select>
              </div>

              <div className="security-divider"></div>

              <h3>Data Management</h3>

              <div className="data-action">
                <div className="setting-info">
                  <h4>Export Your Data</h4>
                  <p>Download a copy of your organisation's data in JSON format.</p>
                </div>
                <button
                  className="btn-export"
                  onClick={handleExportData}
                  disabled={actionLoading === 'export'}
                >
                  {actionLoading === 'export' ? 'Exporting...' : 'Export Data'}
                </button>
              </div>
            </div>
          )}

          {/* AUDIT TAB */}
          {activeTab === 'audit' && (
            <div className="admin-audit">
              <h3>Activity Log (Last 30 Days)</h3>

              {auditLogs.length === 0 ? (
                <p className="no-logs">No activity recorded yet.</p>
              ) : (
                <div className="audit-list">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="audit-entry">
                      <div className="audit-icon">
                        {log.action.includes('member') && '👤'}
                        {log.action.includes('invite') && '✉️'}
                        {log.action.includes('security') && '🔒'}
                        {log.action.includes('data') && '📁'}
                        {log.action.includes('org') && '🏢'}
                      </div>
                      <div className="audit-info">
                        <span className="audit-action">{getActionLabel(log.action)}</span>
                        <span className="audit-user">{log.user_email || 'System'}</span>
                      </div>
                      <span className="audit-time">{formatDate(log.created_at)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {orgAdmin.error && <div className="admin-error">{orgAdmin.error}</div>}
      </div>
    </div>
  );
}
