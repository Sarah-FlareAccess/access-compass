# Access Compass - Security Documentation

## Overview

Access Compass implements enterprise-grade security features designed for organisations of all sizes, including large councils and government bodies. This document outlines all security processes, role hierarchies, and administrative override procedures.

---

## Table of Contents

1. [Role Hierarchy](#role-hierarchy)
2. [Membership Workflow](#membership-workflow)
3. [Ownership Management](#ownership-management)
4. [Invite Code System](#invite-code-system)
5. [Session Management](#session-management)
6. [Audit Logging](#audit-logging)
7. [Data Protection](#data-protection)
8. [Admin Override Procedures](#admin-override-procedures)

---

## Role Hierarchy

Access Compass uses a 6-tier role system to provide granular access control:

| Role | Level | Permissions |
|------|-------|-------------|
| **Owner** | 6 | Full control. Can transfer ownership, manage all settings, delete organisation |
| **Admin** | 5 | Manage members, invites, security settings. Cannot transfer ownership |
| **Approver** | 4 | Approve/reject new member requests |
| **Editor** | 3 | Edit module responses and assessment data |
| **Member** | 2 | Standard access to dashboard and assessments |
| **Viewer** | 1 | Read-only access to shared data |

### Role Capabilities Matrix

| Capability | Owner | Admin | Approver | Editor | Member | Viewer |
|------------|-------|-------|----------|--------|--------|--------|
| View dashboard | Yes | Yes | Yes | Yes | Yes | Yes |
| Edit assessments | Yes | Yes | Yes | Yes | Yes | No |
| Approve members | Yes | Yes | Yes | No | No | No |
| Manage invites | Yes | Yes | No | No | No | No |
| Change user roles | Yes | Yes | No | No | No | No |
| Security settings | Yes | Yes | No | No | No | No |
| Transfer ownership | Yes | No | No | No | No | No |
| Delete organisation | Yes | No | No | No | No | No |

---

## Membership Workflow

### Status Types

| Status | Description |
|--------|-------------|
| **Pending** | User has requested to join, awaiting approval |
| **Active** | Full access to the organisation |
| **Suspended** | Temporarily disabled, can be reactivated |
| **Rejected** | Join request denied |

### Join Flow

```
User Signs Up
     │
     ▼
┌─────────────────────────────────────┐
│  Check email domain auto-join       │
└─────────────────────────────────────┘
     │
     ├── Domain matches → Auto-join as 'member' (active)
     │
     └── No match → Check for invite code
              │
              ├── Has valid code → Join with invite role
              │        │
              │        └── If org requires approval → Status: pending
              │
              └── No code → Cannot join
```

### Approval Workflow (when enabled)

1. New user joins with matching domain or invite code
2. If `require_approval` is enabled:
   - User status set to `pending`
   - Admins/Approvers see notification badge
   - Admin reviews and approves/rejects
3. On approval:
   - Status changes to `active`
   - User gains full access
   - Audit log entry created

---

## Ownership Management

### Organisation Creator

When a new organisation is created:
- The creator automatically becomes the **Owner**
- Owner has full control over all settings
- Only one owner per organisation

### Transferring Ownership

**Who can transfer:** Only the current Owner

**Transfer requirements:**
- New owner must be an **Admin** or higher role
- New owner must be an **active** member
- Current owner must explicitly confirm the transfer

**Transfer process:**
1. Owner opens Organisation Settings → Members tab
2. Clicks "Transfer Ownership"
3. Selects an Admin from the list
4. Confirms the transfer (with warning)
5. Previous owner becomes Admin
6. New owner gains Owner role
7. Audit log records the transfer

**Post-transfer:**
- The previous owner cannot undo this action
- Only the new owner can transfer ownership back
- All other permissions remain unchanged

### Owner Leaving

**Scenario 1: Owner with other members**
- Owner must transfer ownership before leaving
- System prevents leaving without transfer
- Message: "As the owner, you must transfer ownership before leaving"

**Scenario 2: Owner is the only member**
- Owner can leave, which deletes the entire organisation
- All data associated with the organisation is removed
- Confirmation required before deletion

---

## Invite Code System

### Invite Code Features

| Feature | Description |
|---------|-------------|
| **Expiration** | Codes expire after specified days (1-365) |
| **Usage limits** | Set maximum uses (or unlimited) |
| **Labels** | Optional labels for tracking (e.g., "IT Department") |
| **Revocation** | Admins can revoke codes at any time |

### Creating Invite Codes

1. Admin opens Organisation Settings → Invites tab
2. Clicks "Create Invite"
3. Configures:
   - Label (optional)
   - Expiration (days)
   - Max uses (or unlimited)
4. Code is generated (8 characters)
5. Code can be copied and shared

### Using Invite Codes

1. New user signs up
2. Enters invite code when prompted
3. If code is valid:
   - Joins organisation
   - Status depends on `require_approval` setting
4. Code usage count increments
5. If max uses reached, code becomes inactive

### Automatic Code Invalidation

Codes become invalid when:
- Expiration date passes
- Maximum uses reached
- Manually revoked by admin
- Organisation is deleted

---

## Session Management

### Session Timeout

Configurable session timeout options:
- 30 minutes
- 1 hour
- 2 hours
- 4 hours
- 8 hours
- 24 hours

### Timeout Warning

- Warning appears 5 minutes before timeout
- User can extend session or log out
- If no action taken, automatic logout occurs

### Activity Detection

Session timer resets on:
- Mouse movement
- Keyboard input
- Touch events
- Scroll events

---

## Audit Logging

### Logged Events

| Event | Description |
|-------|-------------|
| `member_joined` | New member joined the organisation |
| `member_approved` | Pending member was approved |
| `member_rejected` | Pending member was rejected |
| `member_suspended` | Member was suspended |
| `member_reactivated` | Suspended member was reactivated |
| `member_removed` | Member was removed from organisation |
| `member_role_changed` | Member's role was changed |
| `invite_created` | New invite code was created |
| `invite_used` | Invite code was used |
| `invite_revoked` | Invite code was revoked |
| `org_settings_changed` | Organisation settings were modified |
| `data_exported` | User data was exported |

### Audit Log Retention

- Logs are retained for 30 days by default
- Viewable in Organisation Settings → Activity Log
- Each entry shows:
  - Action type
  - User who performed action
  - Timestamp
  - Additional metadata (where applicable)

### Admin Override Audit Entries

When admin support performs override actions:
- `entity_type` is set to `admin_override`
- Metadata includes:
  - `override_type`: Type of override action
  - `reason`: Required reason for override
  - `support_ticket_id`: Optional ticket reference
  - `performed_by`: 'service_role'

---

## Data Protection

### Row Level Security (RLS)

All database tables are protected by RLS policies:
- Users can only access their own organisation's data
- Cross-organisation data leakage is prevented
- Policies enforce role-based access

### Data Export

Users can export their organisation's data:
1. Open Organisation Settings → Security tab
2. Click "Export Data"
3. JSON file downloads with all organisation data

### Data Deletion

For GDPR compliance:
- Users can request data deletion
- Deletion removes all organisation data
- Process is logged in audit trail

---

## Admin Override Procedures

### When to Use Admin Overrides

Admin overrides should only be used when:
1. **Owner account is inaccessible** (deleted, locked, abandoned)
2. **Owner is unreachable** and organisation needs management
3. **Emergency access** is required for business continuity
4. **Support ticket** has been filed and verified

### Available Override Functions

#### 1. Reassign Ownership (`admin_reassign_ownership`)

**Purpose:** Force transfer ownership to a specific user

**Requirements:**
- Service role access (backend/admin panel)
- Target user must be active member
- Reason is required
- Support ticket ID recommended

**Usage:**
```sql
SELECT * FROM admin_reassign_ownership(
  'org-uuid-here',           -- Organisation ID
  'new-owner-uuid-here',     -- New owner's user ID
  'Owner account deleted, transferring to senior admin',  -- Reason
  'TICKET-12345'             -- Support ticket ID (optional)
);
```

**Returns:**
- `success`: true/false
- `message`: Result description

#### 2. Auto-Promote Owner (`admin_auto_promote_owner`)

**Purpose:** Automatically promote the longest-serving admin to owner when no owner exists

**Requirements:**
- Service role access
- Organisation must have no active owner
- Reason is required

**Selection Priority:**
1. Longest-serving active Admin
2. If no Admin, longest-serving active member of any role

**Usage:**
```sql
SELECT * FROM admin_auto_promote_owner(
  'org-uuid-here',           -- Organisation ID
  'Owner account was deleted, promoting senior admin',  -- Reason
  'TICKET-12345'             -- Support ticket ID (optional)
);
```

**Returns:**
- `success`: true/false
- `message`: Result description
- `new_owner_user_id`: UUID of promoted user
- `new_owner_email`: Email of promoted user

#### 3. Get Organisation Status (`admin_get_org_status`)

**Purpose:** Check organisation status before performing overrides

**Usage:**
```sql
SELECT * FROM admin_get_org_status('org-uuid-here');
```

**Returns:**
- `org_name`: Organisation name
- `org_slug`: URL slug
- `created_at`: Creation date
- `member_count`: Total active members
- `has_owner`: Whether org has an active owner
- `owner_email`: Current owner's email (if exists)
- `admin_count`: Number of admins
- `pending_count`: Number of pending members

### Override Procedure Checklist

Before performing any admin override:

- [ ] Verify the support ticket is legitimate
- [ ] Confirm the organisation needs intervention
- [ ] Check organisation status using `admin_get_org_status`
- [ ] Document the reason for override
- [ ] Perform the override action
- [ ] Verify the action was successful
- [ ] Notify relevant parties (new owner, organisation contacts)
- [ ] Close the support ticket with resolution notes

### Security Considerations

1. **Never share service role credentials**
2. **Always document reasons** for overrides
3. **Link to support tickets** when possible
4. **Review audit logs** after override actions
5. **Notify affected users** when appropriate

---

## Communicating Security to Clients

### Key Points for Client Communication

1. **Enterprise-grade security**: Role-based access, audit logging, session management
2. **Ownership protection**: Only owners can transfer ownership, with confirmation
3. **Data isolation**: RLS ensures organisations cannot access each other's data
4. **Invite control**: Expiring codes, usage limits, revocation capability
5. **Compliance ready**: Data export, deletion capabilities for GDPR
6. **Support safety net**: Admin overrides available for edge cases

### Sample Client FAQ

**Q: What happens if our organisation owner leaves?**
A: The owner must transfer ownership to another admin before leaving. If they forget, our support team can assist with reassigning ownership.

**Q: Can users from other organisations see our data?**
A: No. Row Level Security ensures complete data isolation between organisations.

**Q: How do we control who joins our organisation?**
A: You can use email domain matching for automatic joins, or require invite codes. You can also enable admin approval for all new members.

**Q: What audit trail is available?**
A: All member changes, invite usage, and security setting changes are logged and viewable for 30 days.

**Q: Can we export our data?**
A: Yes. Admins can export all organisation data in JSON format from the Security settings.

---

## Database Migrations

The security features are implemented across these migrations:

| Migration | Purpose |
|-----------|---------|
| `004a_enum_updates.sql` | Adds new role types (owner, editor, approver, viewer) and status enums |
| `004b_security_enhancements.sql` | Implements RLS, audit logging, invite codes, member management functions |
| `005_ownership_transfer.sql` | Adds ownership transfer, leave organisation, and admin override functions |

**Important:** Migrations must be run in order. `004a` must be committed before running `004b`.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | January 2026 | Initial security implementation |

---

## Support Contact

For admin override requests or security concerns, contact your system administrator with:
- Organisation ID (from URL or settings)
- Description of the issue
- Any relevant user information
- Urgency level
