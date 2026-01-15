// ============================================
// ACCESS COMPASS - ACCESS SYSTEM TYPES
// ============================================
// Types for paywall, authentication, entitlements,
// organisations, and purchases
// ============================================

// ============================================
// ENUMS / UNION TYPES
// ============================================

/** Business size tier - determines pricing and access options */
export type BusinessSizeTier = 'small' | 'medium' | 'large' | 'enterprise';

/** Access level - assessment depth */
export type AccessLevel = 'pulse' | 'deep_dive';

/** Module bundle - determines which modules are included */
export type ModuleBundle = 'core' | 'expanded' | 'full';

/** Entitlement scope - whether entitlement is for user or organisation */
export type EntitlementScope = 'user' | 'org';

/** Purchase status */
export type PurchaseStatus = 'pending' | 'completed' | 'refunded' | 'cancelled';

/** Organisation member role - hierarchical */
export type OrgRole = 'owner' | 'admin' | 'approver' | 'editor' | 'member' | 'viewer';

/** Membership status for approval workflow */
export type MembershipStatus = 'pending' | 'active' | 'suspended' | 'rejected';

/** How the entitlement was granted */
export type EntitlementSource = 'purchase' | 'admin' | 'trial' | 'enterprise' | 'pilot' | 'sponsorship';

// ============================================
// ORGANISATION TYPES
// ============================================

/** Organisation - represents a company/precinct with access */
export interface Organisation {
  id: string;
  name: string;
  slug: string;
  size?: BusinessSizeTier;
  allowed_email_domains?: string[];
  invite_code?: string;
  allow_domain_auto_join: boolean;
  max_members: number;
  contact_email?: string;
  contact_name?: string;
  notes?: string;
  created_at: string;
  updated_at: string;

  // Security settings
  require_approval?: boolean;
  require_mfa?: boolean;
  session_timeout_minutes?: number;
  allowed_ip_ranges?: string[];
}

/** Organisation membership - links a user to an organisation */
export interface OrganisationMembership {
  id: string;
  organisation_id: string;
  user_id: string;
  user_email?: string;
  role: OrgRole;
  status: MembershipStatus;
  joined_at: string;
  invited_by?: string;
  invite_accepted_at?: string;
  approved_by?: string;
  approved_at?: string;
  suspended_reason?: string;
  suspended_at?: string;
  suspended_by?: string;
  created_at: string;
  // Joined data (when fetched with organisation)
  organisation?: Organisation;
}

/** Invite code for organisation */
export interface InviteCode {
  id: string;
  organisation_id: string;
  code: string;
  created_by: string;
  expires_at?: string;
  max_uses?: number;
  times_used: number;
  is_active: boolean;
  allowed_email_domains?: string[];
  allowed_roles: OrgRole[];
  label?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/** Audit action types */
export type AuditAction =
  | 'user_login'
  | 'user_logout'
  | 'user_signup'
  | 'password_reset'
  | 'mfa_enabled'
  | 'mfa_disabled'
  | 'org_created'
  | 'org_updated'
  | 'org_settings_changed'
  | 'member_invited'
  | 'member_joined'
  | 'member_approved'
  | 'member_rejected'
  | 'member_suspended'
  | 'member_reactivated'
  | 'member_removed'
  | 'member_role_changed'
  | 'invite_created'
  | 'invite_used'
  | 'invite_revoked'
  | 'invite_expired'
  | 'module_started'
  | 'module_completed'
  | 'response_submitted'
  | 'response_updated'
  | 'evidence_uploaded'
  | 'evidence_deleted'
  | 'report_generated'
  | 'report_exported'
  | 'data_exported'
  | 'data_deleted'
  | 'access_denied'
  | 'suspicious_activity'
  | 'ip_blocked'
  | 'rate_limit_exceeded';

/** Audit log entry */
export interface AuditLog {
  id: string;
  user_id?: string;
  user_email?: string;
  organisation_id?: string;
  action: AuditAction;
  resource_type?: string;
  resource_id?: string;
  details?: Record<string, unknown>;
  previous_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  created_at: string;
  expires_at?: string;
}

/** Organisation security settings */
export interface OrgSecuritySettings {
  require_approval: boolean;
  require_mfa: boolean;
  session_timeout_minutes: number;
  has_ip_restrictions: boolean;
  pending_member_count: number;
}

// ============================================
// ENTITLEMENT TYPES
// ============================================

/** Entitlement - defines what a user/org can access */
export interface Entitlement {
  id: string;
  scope_type: EntitlementScope;
  scope_id: string;
  access_level: AccessLevel;
  module_bundle: ModuleBundle;
  max_modules?: number;
  starts_at: string;
  ends_at?: string;
  purchase_id?: string;
  granted_by: EntitlementSource;
  granted_by_user_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  revoked_at?: string;
  revoked_reason?: string;
}

/** Result from get_user_entitlement RPC */
export interface UserEntitlementResult {
  entitlement_id: string;
  access_level: AccessLevel;
  module_bundle: ModuleBundle;
  max_modules: number | null;
  source: EntitlementSource;
  expires_at: string | null;
  organisation_id: string | null;
  organisation_name: string | null;
}

// ============================================
// PURCHASE TYPES
// ============================================

/** Purchase - records a self-serve purchase */
export interface Purchase {
  id: string;
  user_id: string;
  organisation_id?: string;
  product: 'pulse_check' | 'deep_dive';
  business_size_tier: BusinessSizeTier;
  module_bundle: ModuleBundle;
  amount_cents: number;
  currency: string;
  gst_cents?: number;
  status: PurchaseStatus;
  stripe_checkout_session_id?: string;
  stripe_payment_intent_id?: string;
  stripe_customer_id?: string;
  invoice_number?: string;
  invoice_sent_at?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  refunded_at?: string;
}

// ============================================
// USER ACCESS STATE
// ============================================

/** User's computed access state - used throughout the app */
export interface UserAccessState {
  /** Whether the user is logged in */
  isAuthenticated: boolean;

  /** Whether the user has any valid access (entitlement) */
  hasAccess: boolean;

  /** The access level they have (pulse or deep_dive) */
  accessLevel?: AccessLevel;

  /** The module bundle they can access */
  moduleBundle?: ModuleBundle;

  /** Maximum modules they can use (null = unlimited) */
  maxModules?: number | null;

  /** How they got access */
  source?: EntitlementSource;

  /** When their access expires (null = never) */
  expiresAt?: string | null;

  /** The organisation they belong to (if any) */
  organisation?: Organisation | null;

  /** The user's membership details (role, status) */
  membership?: {
    role?: string;
    status?: string;
  };

  /** The entitlement ID (for reference) */
  entitlementId?: string;
}

// ============================================
// PRICING TYPES
// ============================================

/** Input for pricing calculation */
export interface PricingInput {
  businessSizeTier: BusinessSizeTier;
  accessLevel: AccessLevel;
  moduleBundle: ModuleBundle;
}

/** Result of pricing calculation */
export interface PriceResult {
  /** Price in cents (AUD) */
  amountCents: number;

  /** Currency code */
  currency: string;

  /** Formatted price label (e.g., "$600") */
  label: string;

  /** List of what's included */
  inclusions: string[];

  /** Whether this can be purchased self-serve */
  isPurchasable: boolean;

  /** Whether this requires a sales call */
  requiresCall: boolean;

  /** Optional original price for showing discount */
  originalAmountCents?: number;

  /** Optional discount label */
  discountLabel?: string;
}

// ============================================
// AUTH TYPES
// ============================================

/** User from Supabase Auth */
export interface AuthUser {
  id: string;
  email?: string;
  email_confirmed_at?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
}

/** Auth context value */
export interface AuthContextValue {
  // Auth state
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Access state
  accessState: UserAccessState;

  // Auth actions
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;

  // Organisation actions
  joinOrganisation: (inviteCode: string) => Promise<{ error: string | null; organisation?: Organisation }>;
  checkDomainAutoJoin: () => Promise<{ organisation?: Organisation }>;

  // Session merge (anonymous -> authenticated)
  mergeAnonymousSession: (anonymousSessionId: string) => Promise<void>;

  // Refresh
  refreshAccessState: () => Promise<void>;
}

// ============================================
// CHECKOUT TYPES
// ============================================

/** Checkout session creation request */
export interface CreateCheckoutRequest {
  businessSizeTier: BusinessSizeTier;
  accessLevel: AccessLevel;
  moduleBundle: ModuleBundle;
  sessionId?: string; // Anonymous session to merge after purchase
  successUrl: string;
  cancelUrl: string;
}

/** Checkout session response */
export interface CreateCheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
}

// ============================================
// DECISION PAGE TYPES
// ============================================

/** View state for Decision page */
export type DecisionView = 'choice' | 'login' | 'signup' | 'invite-code' | 'forgot-password';

/** Props for Decision page pathway card */
export interface PathwayCardProps {
  accessLevel: AccessLevel;
  price: PriceResult;
  isSelected: boolean;
  isAuthenticated: boolean;
  hasEntitlement: boolean;
  onSelect: () => void;
  onContinue: () => void;
}
