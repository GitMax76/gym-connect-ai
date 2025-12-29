export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_date: string
          created_at: string | null
          end_time: string
          id: string
          notes: string | null
          price: number | null
          session_type: string
          start_time: string
          status: string | null
          trainer_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          booking_date: string
          created_at?: string | null
          end_time: string
          id?: string
          notes?: string | null
          price?: number | null
          session_type: string
          start_time: string
          status?: string | null
          trainer_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          booking_date?: string
          created_at?: string | null
          end_time?: string
          id?: string
          notes?: string | null
          price?: number | null
          session_type?: string
          start_time?: string
          status?: string | null
          trainer_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gym_profiles: {
        Row: {
          address: string | null
          business_email: string | null
          closing_hours: string | null
          day_pass_fee: number | null
          description: string | null
          facilities: string[] | null
          gym_name: string
          id: string
          is_verified: boolean | null
          member_capacity: number | null
          monthly_fee: number | null
          opening_hours: string | null
          closing_hours: string | null
          opening_days: string[] | null
          subscription_plans: Json[] | null
          postal_code: string | null
          social_media: Json | null
          specializations: string[] | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          business_email?: string | null
          closing_hours?: string | null
          day_pass_fee?: number | null
          description?: string | null
          facilities?: string[] | null
          gym_name: string
          id: string
          is_verified?: boolean | null
          member_capacity?: number | null
          monthly_fee?: number | null
          opening_hours?: string | null
          closing_hours?: string | null
          opening_days?: string[] | null
          subscription_plans?: Json[] | null
          postal_code?: string | null
          social_media?: Json | null
          specializations?: string[] | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          business_email?: string | null
          closing_hours?: string | null
          day_pass_fee?: number | null
          description?: string | null
          facilities?: string[] | null
          gym_name?: string
          id?: string
          is_verified?: boolean | null
          member_capacity?: number | null
          monthly_fee?: number | null
          opening_hours?: string | null
          closing_hours?: string | null
          opening_days?: string[] | null
          subscription_plans?: Json[] | null
          postal_code?: string | null
          social_media?: Json | null
          specializations?: string[] | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gym_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      match_scores: {
        Row: {
          created_at: string | null
          factors: Json | null
          gym_id: string | null
          id: string
          score: number
          trainer_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          factors?: Json | null
          gym_id?: string | null
          id?: string
          score: number
          trainer_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          factors?: Json | null
          gym_id?: string | null
          id?: string
          score?: number
          trainer_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_scores_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gym_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_scores_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      matching_preferences: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          created_at: string | null
          group_vs_personal: string | null
          id: string
          max_distance_km: number | null
          preferred_gym_facilities: string[] | null
          preferred_times: Json | null
          preferred_trainer_specializations: string[] | null
          updated_at: string | null
          user_id: string
          workout_frequency_per_week: number | null
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          group_vs_personal?: string | null
          id?: string
          max_distance_km?: number | null
          preferred_gym_facilities?: string[] | null
          preferred_times?: Json | null
          preferred_trainer_specializations?: string[] | null
          updated_at?: string | null
          user_id: string
          workout_frequency_per_week?: number | null
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          group_vs_personal?: string | null
          id?: string
          max_distance_km?: number | null
          preferred_gym_facilities?: string[] | null
          preferred_times?: Json | null
          preferred_trainer_specializations?: string[] | null
          updated_at?: string | null
          user_id?: string
          workout_frequency_per_week?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "matching_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          created_at: string | null
          currency: string | null
          id: string
          payment_method: string | null
          payment_status: string | null
          stripe_payment_intent_id: string | null
          transaction_date: string | null
          user_id: string
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string | null
          currency?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          stripe_payment_intent_id?: string | null
          transaction_date?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string | null
          currency?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          stripe_payment_intent_id?: string | null
          transaction_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string | null
          comment: string | null
          created_at: string | null
          id: string
          rating: number
          reviewed_id: string
          reviewer_id: string
        }
        Insert: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          rating: number
          reviewed_id: string
          reviewer_id: string
        }
        Update: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          reviewed_id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewed_id_fkey"
            columns: ["reviewed_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      search_filters: {
        Row: {
          created_at: string | null
          filter_name: string
          filter_type: string
          filters: Json
          id: string
          is_saved: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          filter_name: string
          filter_type: string
          filters: Json
          id?: string
          is_saved?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          filter_name?: string
          filter_type?: string
          filters?: Json
          id?: string
          is_saved?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "search_filters_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          end_date: string
          gym_id: string
          id: string
          price: number
          start_date: string
          status: string | null
          stripe_subscription_id: string | null
          subscription_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date: string
          gym_id: string
          id?: string
          price: number
          start_date: string
          status?: string | null
          stripe_subscription_id?: string | null
          subscription_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string
          gym_id?: string
          id?: string
          price?: number
          start_date?: string
          status?: string | null
          stripe_subscription_id?: string | null
          subscription_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gym_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trainer_availability: {
        Row: {
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean | null
          start_time: string
          trainer_id: string
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean | null
          start_time: string
          trainer_id: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean | null
          start_time?: string
          trainer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trainer_availability_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trainer_profiles: {
        Row: {
          availability_schedule: Json | null
          bio: string | null
          certifications: string[] | null
          date_of_birth: string | null
          group_rate_per_hour: number | null
          id: string
          is_verified: boolean | null
          languages: string[] | null
          personal_rate_per_hour: number | null
          preferred_areas: string | null
          specializations: string[] | null
          years_experience: number | null
        }
        Insert: {
          availability_schedule?: Json | null
          bio?: string | null
          certifications?: string[] | null
          date_of_birth?: string | null
          group_rate_per_hour?: number | null
          id: string
          is_verified?: boolean | null
          languages?: string[] | null
          personal_rate_per_hour?: number | null
          preferred_areas?: string | null
          specializations?: string[] | null
          years_experience?: number | null
        }
        Update: {
          availability_schedule?: Json | null
          bio?: string | null
          certifications?: string[] | null
          date_of_birth?: string | null
          group_rate_per_hour?: number | null
          id?: string
          is_verified?: boolean | null
          languages?: string[] | null
          personal_rate_per_hour?: number | null
          preferred_areas?: string | null
          specializations?: string[] | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trainer_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          age: number | null
          availability_hours_per_week: number | null
          budget_max: number | null
          budget_min: number | null
          experience_description: string | null
          fitness_level: string | null
          health_conditions: string | null
          height: number | null
          id: string
          preferred_location: string | null
          primary_goal: string | null
          secondary_goals: string[] | null
          weight: number | null
        }
        Insert: {
          age?: number | null
          availability_hours_per_week?: number | null
          budget_max?: number | null
          budget_min?: number | null
          experience_description?: string | null
          fitness_level?: string | null
          health_conditions?: string | null
          height?: number | null
          id: string
          preferred_location?: string | null
          primary_goal?: string | null
          secondary_goals?: string[] | null
          weight?: number | null
        }
        Update: {
          age?: number | null
          availability_hours_per_week?: number | null
          budget_max?: number | null
          budget_min?: number | null
          experience_description?: string | null
          fitness_level?: string | null
          health_conditions?: string | null
          height?: number | null
          id?: string
          preferred_location?: string | null
          primary_goal?: string | null
          secondary_goals?: string[] | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      },
      workout_plans: {
        Row: {
          id: string
          trainer_id: string
          user_id: string
          title: string
          description: string | null
          start_date: string | null
          end_date: string | null
          created_at: string | null
          status: string | null
        }
        Insert: {
          id?: string
          trainer_id: string
          user_id: string
          title: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string | null
          status?: string | null
        }
        Update: {
          id?: string
          trainer_id?: string
          user_id?: string
          title?: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_plans_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_match_score: {
        Args: { p_user_id: string; p_trainer_id?: string; p_gym_id?: string }
        Returns: number
      }
      check_trainer_availability: {
        Args: {
          p_trainer_id: string
          p_date: string
          p_start_time: string
          p_end_time: string
        }
        Returns: boolean
      }
    }
    Enums: {
      user_type: "user" | "trainer" | "gym_owner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
  | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
  | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
  | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {
      user_type: ["user", "trainer", "gym_owner"],
    },
  },
} as const
