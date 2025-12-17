// Supabase Database Types
// Auto-generated types for type-safe database queries

export type Database = {
  public: {
    Tables: {
      sessions: {
        Row: {
          id: string;
          user_id: string | null;
          created_at: string;
          last_updated: string;
          business_snapshot: any;
          selected_modules: string[];
          discovery_responses: any;
          constraints: any;
          ai_response: any | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          created_at?: string;
          last_updated?: string;
          business_snapshot?: any;
          selected_modules?: string[];
          discovery_responses?: any;
          constraints?: any;
          ai_response?: any | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          created_at?: string;
          last_updated?: string;
          business_snapshot?: any;
          selected_modules?: string[];
          discovery_responses?: any;
          constraints?: any;
          ai_response?: any | null;
        };
      };
      actions: {
        Row: {
          id: string;
          session_id: string;
          priority: 'act_now' | 'plan_next' | 'consider_later';
          category: string;
          title: string;
          why_matters: string;
          effort: 'low' | 'medium' | 'high';
          cost_band: string;
          how_to_steps: string[];
          example: string;
          owner: string | null;
          timeframe: string | null;
          status: 'not_started' | 'in_progress' | 'complete' | 'on_hold';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          priority: 'act_now' | 'plan_next' | 'consider_later';
          category: string;
          title: string;
          why_matters: string;
          effort: 'low' | 'medium' | 'high';
          cost_band: string;
          how_to_steps?: string[];
          example: string;
          owner?: string | null;
          timeframe?: string | null;
          status?: 'not_started' | 'in_progress' | 'complete' | 'on_hold';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          priority?: 'act_now' | 'plan_next' | 'consider_later';
          category?: string;
          title?: string;
          why_matters?: string;
          effort?: 'low' | 'medium' | 'high';
          cost_band?: string;
          how_to_steps?: string[];
          example?: string;
          owner?: string | null;
          timeframe?: string | null;
          status?: 'not_started' | 'in_progress' | 'complete' | 'on_hold';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      evidence: {
        Row: {
          id: string;
          action_id: string;
          type: 'photo' | 'pdf' | 'link';
          filename: string | null;
          url: string;
          file_data: string | null;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          action_id: string;
          type: 'photo' | 'pdf' | 'link';
          filename?: string | null;
          url: string;
          file_data?: string | null;
          uploaded_at?: string;
        };
        Update: {
          id?: string;
          action_id?: string;
          type?: 'photo' | 'pdf' | 'link';
          filename?: string | null;
          url?: string;
          file_data?: string | null;
          uploaded_at?: string;
        };
      };
      clarifications: {
        Row: {
          id: string;
          session_id: string;
          question: string;
          module: string;
          why_matters: string;
          how_to_check: string;
          resolved: boolean;
          resolved_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          question: string;
          module: string;
          why_matters: string;
          how_to_check: string;
          resolved?: boolean;
          resolved_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          question?: string;
          module?: string;
          why_matters?: string;
          how_to_check?: string;
          resolved?: boolean;
          resolved_at?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      priority_level: 'act_now' | 'plan_next' | 'consider_later';
      effort_level: 'low' | 'medium' | 'high';
      action_status: 'not_started' | 'in_progress' | 'complete' | 'on_hold';
      evidence_type: 'photo' | 'pdf' | 'link';
      business_type:
        | 'cafe-restaurant'
        | 'accommodation'
        | 'tour-operator'
        | 'attraction-museum-gallery'
        | 'visitor-centre'
        | 'other';
      user_role: 'owner' | 'manager' | 'operations-lead' | 'other';
      budget_range: 'under_500' | '500_2k' | '2k_10k' | '10k_plus' | 'not_sure';
      capacity_level: 'diy' | 'some_support' | 'hire_help' | 'not_sure';
      timeframe_type: 'now' | 'soon' | 'later' | 'exploring';
    };
  };
};
