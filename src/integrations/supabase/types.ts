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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      events: {
        Row: {
          attendee_ids: string[] | null
          created_at: string
          date: string
          event_type: string
          id: string
          latitude: number | null
          location_address: string | null
          location_name: string | null
          longitude: number | null
          notes: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string | null
          workout_id: string | null
          workout_name: string | null
        }
        Insert: {
          attendee_ids?: string[] | null
          created_at?: string
          date: string
          event_type?: string
          id?: string
          latitude?: number | null
          location_address?: string | null
          location_name?: string | null
          longitude?: number | null
          notes?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
          workout_id?: string | null
          workout_name?: string | null
        }
        Update: {
          attendee_ids?: string[] | null
          created_at?: string
          date?: string
          event_type?: string
          id?: string
          latitude?: number | null
          location_address?: string | null
          location_name?: string | null
          longitude?: number | null
          notes?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
          workout_id?: string | null
          workout_name?: string | null
        }
        Relationships: []
      }
      friends: {
        Row: {
          avatar_url: string | null
          created_at: string
          days_since_seen: number | null
          id: string
          last_hangout: string | null
          name: string
          relationship_start: string | null
          tags: string[] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          days_since_seen?: number | null
          id?: string
          last_hangout?: string | null
          name: string
          relationship_start?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          days_since_seen?: number | null
          id?: string
          last_hangout?: string | null
          name?: string
          relationship_start?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      local_alerts: {
        Row: {
          category: string | null
          created_at: string
          id: string
          location_name: string | null
          message: string
          source: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          location_name?: string | null
          message: string
          source?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          location_name?: string | null
          message?: string
          source?: string | null
        }
        Relationships: []
      }
      memories: {
        Row: {
          created_at: string
          date: string
          description: string | null
          event_id: string | null
          friend_ids: string[] | null
          id: string
          image_url: string | null
          memory_type: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          event_id?: string | null
          friend_ids?: string[] | null
          id?: string
          image_url?: string | null
          memory_type?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          event_id?: string | null
          friend_ids?: string[] | null
          id?: string
          image_url?: string | null
          memory_type?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memories_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      places: {
        Row: {
          address: string | null
          category: string | null
          created_at: string
          google_place_id: string | null
          id: string
          is_favorite: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          notes: string | null
          updated_at: string
          user_id: string | null
          visited_status: string | null
        }
        Insert: {
          address?: string | null
          category?: string | null
          created_at?: string
          google_place_id?: string | null
          id?: string
          is_favorite?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          notes?: string | null
          updated_at?: string
          user_id?: string | null
          visited_status?: string | null
        }
        Update: {
          address?: string | null
          category?: string | null
          created_at?: string
          google_place_id?: string | null
          id?: string
          is_favorite?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          notes?: string | null
          updated_at?: string
          user_id?: string | null
          visited_status?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          answers: Json | null
          category: string
          created_at: string
          id: string
          is_urgent: boolean | null
          latitude: number | null
          location_name: string | null
          longitude: number | null
          question: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          answers?: Json | null
          category: string
          created_at?: string
          id?: string
          is_urgent?: boolean | null
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          question: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          answers?: Json | null
          category?: string
          created_at?: string
          id?: string
          is_urgent?: boolean | null
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          question?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
