export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          completed_at: string | null
          created_at: string
          delivered_count: number | null
          description: string | null
          failed_count: number | null
          from_number: string
          id: string
          message_template: string
          name: string
          recipient_list: string[]
          scheduled_at: string | null
          sent_count: number | null
          settings: Json | null
          started_at: string | null
          status: Database["public"]["Enums"]["campaign_status"] | null
          total_cost: number | null
          total_recipients: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          delivered_count?: number | null
          description?: string | null
          failed_count?: number | null
          from_number: string
          id?: string
          message_template: string
          name: string
          recipient_list: string[]
          scheduled_at?: string | null
          sent_count?: number | null
          settings?: Json | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          total_cost?: number | null
          total_recipients?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          delivered_count?: number | null
          description?: string | null
          failed_count?: number | null
          from_number?: string
          id?: string
          message_template?: string
          name?: string
          recipient_list?: string[]
          scheduled_at?: string | null
          sent_count?: number | null
          settings?: Json | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          total_cost?: number | null
          total_recipients?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      credit_allocations: {
        Row: {
          amount: number
          created_at: string
          from_user_id: string
          id: string
          to_user_id: string
          transaction_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          from_user_id: string
          id?: string
          to_user_id: string
          transaction_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          from_user_id?: string
          id?: string
          to_user_id?: string
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_allocations_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          created_at: string
          html_content: string | null
          id: string
          is_active: boolean | null
          name: string
          subject: string
          template_variables: Json | null
          text_content: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          html_content?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          subject: string
          template_variables?: Json | null
          text_content?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          html_content?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          template_variables?: Json | null
          text_content?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          title: string
          type: Database["public"]["Enums"]["notification_type"] | null
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          title: string
          type?: Database["public"]["Enums"]["notification_type"] | null
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"] | null
          user_id?: string
        }
        Relationships: []
      }
      number_pool: {
        Row: {
          assigned_user_id: string | null
          capabilities: string[] | null
          country_code: string
          created_at: string
          id: string
          is_active: boolean | null
          monthly_cost: number | null
          phone_number: string
          settings: Json | null
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          assigned_user_id?: string | null
          capabilities?: string[] | null
          country_code: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          monthly_cost?: number | null
          phone_number: string
          settings?: Json | null
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          assigned_user_id?: string | null
          capabilities?: string[] | null
          country_code?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          monthly_cost?: number | null
          phone_number?: string
          settings?: Json | null
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "number_pool_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          configuration: Json
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          provider: string
          updated_at: string
        }
        Insert: {
          configuration?: Json
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          provider: string
          updated_at?: string
        }
        Update: {
          configuration?: Json
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          provider?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          description: string | null
          id: string
          metadata: Json | null
          payment_method_id: string | null
          processed_at: string | null
          provider_transaction_id: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_method_id?: string | null
          processed_at?: string | null
          provider_transaction_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_method_id?: string | null
          processed_at?: string | null
          provider_transaction_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_groups: {
        Row: {
          base_rate: number | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          markup_percentage: number | null
          name: string
          settings: Json | null
          updated_at: string
        }
        Insert: {
          base_rate?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          markup_percentage?: number | null
          name: string
          settings?: Json | null
          updated_at?: string
        }
        Update: {
          base_rate?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          markup_percentage?: number | null
          name?: string
          settings?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          created_by: string | null
          email: string
          full_name: string | null
          id: string
          last_login: string | null
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          settings: Json | null
          status: Database["public"]["Enums"]["user_status"] | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          created_by?: string | null
          email: string
          full_name?: string | null
          id?: string
          last_login?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          settings?: Json | null
          status?: Database["public"]["Enums"]["user_status"] | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          created_by?: string | null
          email?: string
          full_name?: string | null
          id?: string
          last_login?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          settings?: Json | null
          status?: Database["public"]["Enums"]["user_status"] | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sms_messages: {
        Row: {
          campaign_id: string | null
          cost: number | null
          created_at: string
          delivered_at: string | null
          delivery_status: string | null
          direction: string | null
          error_message: string | null
          from_number: string
          id: string
          message_body: string
          sent_at: string | null
          status: Database["public"]["Enums"]["message_status"] | null
          to_number: string
          updated_at: string
          user_id: string
          vendor_id: string | null
          vendor_message_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          cost?: number | null
          created_at?: string
          delivered_at?: string | null
          delivery_status?: string | null
          direction?: string | null
          error_message?: string | null
          from_number: string
          id?: string
          message_body: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          to_number: string
          updated_at?: string
          user_id: string
          vendor_id?: string | null
          vendor_message_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          cost?: number | null
          created_at?: string
          delivered_at?: string | null
          delivery_status?: string | null
          direction?: string | null
          error_message?: string | null
          from_number?: string
          id?: string
          message_body?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          to_number?: string
          updated_at?: string
          user_id?: string
          vendor_id?: string | null
          vendor_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_sms_messages_campaign"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sms_messages_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      smtp_configurations: {
        Row: {
          created_at: string
          from_email: string
          from_name: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          last_tested_at: string | null
          name: string
          smtp_host: string
          smtp_password: string
          smtp_port: number
          smtp_username: string
          updated_at: string
          use_tls: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string
          from_email: string
          from_name?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_tested_at?: string | null
          name: string
          smtp_host: string
          smtp_password: string
          smtp_port?: number
          smtp_username: string
          updated_at?: string
          use_tls?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string
          from_email?: string
          from_name?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_tested_at?: string | null
          name?: string
          smtp_host?: string
          smtp_password?: string
          smtp_port?: number
          smtp_username?: string
          updated_at?: string
          use_tls?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          reference_id: string | null
          related_user_id: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          related_user_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          related_user_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_balances: {
        Row: {
          available_balance: number | null
          created_at: string
          credit_limit: number
          current_balance: number
          id: string
          is_locked: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          available_balance?: number | null
          created_at?: string
          credit_limit?: number
          current_balance?: number
          id?: string
          is_locked?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          available_balance?: number | null
          created_at?: string
          credit_limit?: number
          current_balance?: number
          id?: string
          is_locked?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vendor_apis: {
        Row: {
          api_key_name: string | null
          authentication_type: string | null
          configuration: Json | null
          created_at: string
          endpoint_url: string
          id: string
          is_active: boolean | null
          name: string
          priority: number | null
          rate_limit: number | null
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          api_key_name?: string | null
          authentication_type?: string | null
          configuration?: Json | null
          created_at?: string
          endpoint_url: string
          id?: string
          is_active?: boolean | null
          name: string
          priority?: number | null
          rate_limit?: number | null
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          api_key_name?: string | null
          authentication_type?: string | null
          configuration?: Json | null
          created_at?: string
          endpoint_url?: string
          id?: string
          is_active?: boolean | null
          name?: string
          priority?: number | null
          rate_limit?: number | null
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_apis_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          configuration: Json | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          status: Database["public"]["Enums"]["vendor_status"] | null
          support_email: string | null
          support_phone: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          configuration?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          status?: Database["public"]["Enums"]["vendor_status"] | null
          support_email?: string | null
          support_phone?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          configuration?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["vendor_status"] | null
          support_email?: string | null
          support_phone?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      allocate_credit: {
        Args: { _amount: number; _from_user_id: string; _to_user_id: string }
        Returns: string
      }
      get_or_create_user_balance: {
        Args: { _user_id: string }
        Returns: {
          available_balance: number | null
          created_at: string
          credit_limit: number
          current_balance: number
          id: string
          is_locked: boolean
          updated_at: string
          user_id: string
        }
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      toggle_balance_lock: {
        Args: { _locked: boolean; _user_id: string }
        Returns: boolean
      }
      update_user_balance: {
        Args: {
          _amount: number
          _created_by?: string
          _description?: string
          _related_user_id?: string
          _transaction_type: Database["public"]["Enums"]["transaction_type"]
          _user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "reseller" | "user" | "super_admin"
      campaign_status:
        | "draft"
        | "scheduled"
        | "running"
        | "completed"
        | "cancelled"
      message_status: "pending" | "sent" | "delivered" | "failed" | "rejected"
      notification_type: "info" | "warning" | "error" | "success"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      transaction_status: "pending" | "completed" | "failed" | "cancelled"
      transaction_type:
        | "credit_allocation"
        | "top_up"
        | "debit"
        | "refund"
        | "auto_repayment"
        | "balance_adjustment"
      user_status: "active" | "inactive" | "suspended"
      vendor_status: "active" | "inactive" | "testing"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "reseller", "user", "super_admin"],
      campaign_status: [
        "draft",
        "scheduled",
        "running",
        "completed",
        "cancelled",
      ],
      message_status: ["pending", "sent", "delivered", "failed", "rejected"],
      notification_type: ["info", "warning", "error", "success"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      transaction_status: ["pending", "completed", "failed", "cancelled"],
      transaction_type: [
        "credit_allocation",
        "top_up",
        "debit",
        "refund",
        "auto_repayment",
        "balance_adjustment",
      ],
      user_status: ["active", "inactive", "suspended"],
      vendor_status: ["active", "inactive", "testing"],
    },
  },
} as const
