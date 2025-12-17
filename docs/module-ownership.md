# Module Ownership & Assignment

This document describes the module ownership and assignment system in Access Compass, designed to support team collaboration and accountability during accessibility self-reviews.

## Overview

The ownership system allows teams to:
- Assign modules to specific team members
- Track who completed each module and when
- Generate notification messages for assignees
- View completion evidence in reports and DIAP

**Design Philosophy:** This is intentionally simple - ownership, not task management. No complex workflows, notifications, or approval chains.

---

## Features

### 1. Module Assignment (Optional)

Modules can optionally be assigned to team members from the Dashboard.

**Fields:**
| Field | Required | Description |
|-------|----------|-------------|
| Assigned to | No | Name or role (e.g., "Jane Smith" or "Visitor Experience Manager") |
| Email | No | Email address for generating notification message |
| Target date | No | When the module should be completed |

**How to assign:**
1. On the Dashboard, find the module card
2. Click the person+ icon (or pencil icon if already assigned)
3. Fill in the details
4. Click Save

### 2. Email Notification Template

When you save an assignment with an email address, Access Compass generates a ready-to-send notification message.

**Template includes:**
- Assignee's first name
- Module name
- Organisation name
- Target completion date (if set)
- **Direct link to the module** (clickable URL)
- Time estimate (~10-15 minutes)

**Example:**
```
Hi Jane,

You've been assigned to complete the "Accessible Entrance"
accessibility self-review module for Riverside Community Centre.

This is part of our accessibility improvement initiative using
Access Compass. The module will ask you questions about
accessible entrance and help identify what we're doing well
and where we can improve.

Target completion date: 15 January 2025

To get started, click here:
https://your-domain.com/questions?module=M02

The review should take about 10-15 minutes. Your insights will
help us create a more inclusive experience for all our customers.

If you have any questions or need access, please let me know.

Thanks!
```

> **Note:** The URL is automatically generated based on your current domain, so it works whether you're running locally or in production.

**Usage:**
1. Click "Copy Message" button
2. Paste into email, Slack, Teams, or any messaging tool
3. Send to the assignee

### 3. Completion Confirmation

At the end of each module, users confirm who completed the review.

**Fields:**
| Field | Required | Description |
|-------|----------|-------------|
| Completed by | No | Name of the person who completed the module |
| Role | No | Their role/title (e.g., "Operations Manager") |
| Completion date | Auto | Captured automatically when confirmed |

**Pre-fill behaviour:**
- If the module was assigned, "Completed by" pre-fills with the assigned person's name
- Users can change this if someone else completed it

### 4. Confidence Snapshot

Each completed module receives an automatic confidence rating based on responses:

| Rating | Criteria |
|--------|----------|
| **Strong** | 70%+ "Yes" responses |
| **Mixed** | Between strong and needs-work |
| **Needs Work** | 50%+ "No" or "Not sure" responses |

This helps teams quickly identify areas needing attention.

---

## Where Ownership Data Appears

### Dashboard
- Module cards show assigned person and target date
- Completed modules show who completed them and when
- Confidence badge displays for completed modules

### Reports
The "Modules Reviewed" section shows:
- Module name and code
- Completion date
- Completed by (name and role)
- Assigned to
- Confidence snapshot
- Strengths and actions count

### DIAP Workspace
The Evidence Layer displays:
- All completed modules with metadata
- Grouped by DIAP section (Built Environment, Service Delivery, etc.)
- Completion evidence for accountability

---

## Data Storage

All ownership data is stored in localStorage alongside module progress:

```typescript
interface ModuleOwnership {
  assignedTo?: string;           // Name or role
  assignedToEmail?: string;      // Email address
  targetCompletionDate?: string; // ISO date string
  completedBy?: string;          // Auto-captured on completion
  completedByRole?: string;      // Optional role/title
}
```

---

## Best Practices

### For Team Leads
1. **Assign based on expertise** - Give modules to people who work in that area
2. **Set realistic target dates** - Allow 1-2 weeks per module
3. **Use email templates** - Makes it easy to notify assignees
4. **Review confidence ratings** - Focus support on "Needs Work" areas

### For Assignees
1. **Complete in one sitting** - Modules take 10-15 minutes
2. **Be honest** - "Not sure" is better than guessing
3. **Add notes** - Context helps with action planning
4. **Confirm completion** - Your name appears in reports

### For Organisations
1. **Start with priority modules** - Don't try to complete everything at once
2. **Distribute the work** - Different perspectives improve accuracy
3. **Track progress on Dashboard** - See overall completion status
4. **Export reports** - Share findings with stakeholders

---

## Future Enhancements

Potential additions (not currently implemented):
- Automated email notifications
- Reminder emails for approaching target dates
- Multi-user authentication
- Assignment history/audit trail
- Bulk assignment

---

## Related Documentation

- [DIAP Integration](./diap-integration.md) - How modules map to DIAP sections
- [Report Generation](./reports.md) - Understanding report content
- [Question Flow](./question-flow.md) - How module reviews work
