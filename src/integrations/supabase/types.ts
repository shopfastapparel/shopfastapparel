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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author: string
          body: string
          category: string
          city: string | null
          cover_emoji: string
          cover_gradient: string
          cover_image_url: string | null
          cover_image_credit: string | null
          created_at: string
          description: string
          id: string
          keywords: string[]
          published_at: string
          read_minutes: number
          slug: string
          status: Database["public"]["Enums"]["blog_status"]
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          body: string
          category: string
          city?: string | null
          cover_emoji?: string
          cover_gradient?: string
          cover_image_url?: string | null
          cover_image_credit?: string | null
          description: string
          id?: string
          keywords?: string[]
          published_at?: string
          read_minutes?: number
          slug: string
          status?: Database["public"]["Enums"]["blog_status"]
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          body?: string
          category?: string
          city?: string | null
          cover_emoji?: string
          cover_gradient?: string
          cover_image_url?: string | null
          cover_image_credit?: string | null
          created_at?: string
          description?: string
          id?: string
          keywords?: string[]
          published_at?: string
          read_minutes?: number
          slug?: string
          status?: Database["public"]["Enums"]["blog_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          id: string
          created_at: string
          status: string
          service: string | null
          quantity: string | null
          turnaround: string | null
          turnaround_estimate: string | null
          deadline: string | null
          city: string | null
          details: string | null
          file_names: Json | null
          name: string
          company: string | null
          email: string
          phone: string | null
          mockup_url: string | null
          mockup_feedback: string | null
          price_quote: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          status?: string
          service?: string | null
          quantity?: string | null
          turnaround?: string | null
          turnaround_estimate?: string | null
          deadline?: string | null
          city?: string | null
          details?: string | null
          file_names?: Json | null
          name: string
          company?: string | null
          email: string
          phone?: string | null
          mockup_url?: string | null
          mockup_feedback?: string | null
          price_quote?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          status?: string
          service?: string | null
          quantity?: string | null
          turnaround?: string | null
          turnaround_estimate?: string | null
          deadline?: string | null
          city?: string | null
          details?: string | null
          file_names?: Json | null
          name?: string
          company?: string | null
          email?: string
          phone?: string | null
          mockup_url?: string | null
          mockup_feedback?: string | null
          price_quote?: number | null
        }
        Relationships: []
      }
      announcement_settings: {
        Row: {
          id: string
          message: string
          is_active: boolean
          theme: string
          link_url: string | null
          link_text: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          message: string
          is_active?: boolean
          theme?: string
          link_url?: string | null
          link_text?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          message?: string
          is_active?: boolean
          theme?: string
          link_url?: string | null
          link_text?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sales_leads: {
        Row: {
          id: string
          name: string
          email: string
          company: string | null
          industry: string | null
          website: string | null
          annual_volume: string | null
          current_pain_points: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          company?: string | null
          industry?: string | null
          website?: string | null
          annual_volume?: string | null
          current_pain_points?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          company?: string | null
          industry?: string | null
          website?: string | null
          annual_volume?: string | null
          current_pain_points?: string | null
          status?: string
          created_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          status?: string
          created_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      blog_status: "draft" | "published" | "rejected"
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
      app_role: ["admin", "user"],
      blog_status: ["draft", "published", "rejected"],
    },
  },
} as const
