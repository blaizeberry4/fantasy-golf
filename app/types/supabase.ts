export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      league_members: {
        Row: {
          created_at: string
          created_by: string
          league_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          league_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          league_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "league_members_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "pga_tour_tournament_picks_stroke_play_enriched"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "league_members_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_members_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "pga_tour_tournament_picks_stroke_play_enriched"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "league_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      leagues: {
        Row: {
          created_at: string
          created_by: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: never
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: never
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leagues_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "pga_tour_tournament_picks_stroke_play_enriched"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "leagues_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      pga_tour_players: {
        Row: {
          country: string | null
          country_code: string | null
          created_at: string
          first_name: string
          icon_url: string | null
          id: string
          last_name: string
          liv_player_id: string | null
          raw_json: Json | null
          updated_at: string
        }
        Insert: {
          country?: string | null
          country_code?: string | null
          created_at?: string
          first_name: string
          icon_url?: string | null
          id: string
          last_name: string
          liv_player_id?: string | null
          raw_json?: Json | null
          updated_at?: string
        }
        Update: {
          country?: string | null
          country_code?: string | null
          created_at?: string
          first_name?: string
          icon_url?: string | null
          id?: string
          last_name?: string
          liv_player_id?: string | null
          raw_json?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      pga_tour_tournament_fields_stroke_play: {
        Row: {
          created_at: string
          current_position: string | null
          current_round: number | null
          current_round_score: string | null
          current_round_status: string | null
          current_status: string | null
          current_thru: string | null
          current_total_score: string | null
          latest_odds_to_win: string | null
          latest_tee_time: string | null
          player_id: string
          round_1_score: string | null
          round_2_score: string | null
          round_3_score: string | null
          round_4_score: string | null
          tournament_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_position?: string | null
          current_round?: number | null
          current_round_score?: string | null
          current_round_status?: string | null
          current_status?: string | null
          current_thru?: string | null
          current_total_score?: string | null
          latest_odds_to_win?: string | null
          latest_tee_time?: string | null
          player_id: string
          round_1_score?: string | null
          round_2_score?: string | null
          round_3_score?: string | null
          round_4_score?: string | null
          tournament_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_position?: string | null
          current_round?: number | null
          current_round_score?: string | null
          current_round_status?: string | null
          current_status?: string | null
          current_thru?: string | null
          current_total_score?: string | null
          latest_odds_to_win?: string | null
          latest_tee_time?: string | null
          player_id?: string
          round_1_score?: string | null
          round_2_score?: string | null
          round_3_score?: string | null
          round_4_score?: string | null
          tournament_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pga_tour_tournament_fields_stroke_play_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "pga_tour_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pga_tour_tournament_fields_stroke_play_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "pga_tour_tournaments"
            referencedColumns: ["id"]
          }
        ]
      }
      pga_tour_tournament_picks_stroke_play: {
        Row: {
          created_at: string
          league_id: number
          pick_index: number
          player_id: string
          tournament_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          league_id: number
          pick_index: number
          player_id: string
          tournament_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          league_id?: number
          pick_index?: number
          player_id?: string
          tournament_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pga_tour_tournament_picks_stroke_play_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pga_tour_tournament_picks_stroke_play_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "pga_tour_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pga_tour_tournament_picks_stroke_play_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "pga_tour_tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pga_tour_tournament_picks_stroke_play_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "pga_tour_tournament_picks_stroke_play_enriched"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pga_tour_tournament_picks_stroke_play_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      pga_tour_tournament_stroke_play_position_scores: {
        Row: {
          position: string
          score: number
        }
        Insert: {
          position: string
          score: number
        }
        Update: {
          position?: string
          score?: number
        }
        Relationships: []
      }
      pga_tour_tournaments: {
        Row: {
          city: string
          country: string | null
          country_code: string | null
          course_name: string | null
          created_at: string
          id: string
          logo: string | null
          name: string
          planned_dates: string | null
          planned_dates_accessibility: string | null
          planned_end_date: string | null
          planned_start_date: string | null
          purse: string | null
          raw_json: Json | null
          season: string | null
          segment: string | null
          start_date: string
          state: string | null
          state_code: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          city: string
          country?: string | null
          country_code?: string | null
          course_name?: string | null
          created_at?: string
          id: string
          logo?: string | null
          name: string
          planned_dates?: string | null
          planned_dates_accessibility?: string | null
          planned_end_date?: string | null
          planned_start_date?: string | null
          purse?: string | null
          raw_json?: Json | null
          season?: string | null
          segment?: string | null
          start_date: string
          state?: string | null
          state_code?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          city?: string
          country?: string | null
          country_code?: string | null
          course_name?: string | null
          created_at?: string
          id?: string
          logo?: string | null
          name?: string
          planned_dates?: string | null
          planned_dates_accessibility?: string | null
          planned_end_date?: string | null
          planned_start_date?: string | null
          purse?: string | null
          raw_json?: Json | null
          season?: string | null
          segment?: string | null
          start_date?: string
          state?: string | null
          state_code?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          image_url: string | null
          last_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id: string
          image_url?: string | null
          last_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          image_url?: string | null
          last_name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      pga_tour_tournament_fields_stroke_play_enriched: {
        Row: {
          created_at: string | null
          current_position: string | null
          current_round: number | null
          current_round_score: string | null
          current_round_status: string | null
          current_status: string | null
          current_thru: string | null
          current_total_score: string | null
          latest_odds_to_win: string | null
          latest_tee_time: string | null
          player_country: string | null
          player_country_code: string | null
          player_first_name: string | null
          player_icon_url: string | null
          player_id: string | null
          player_last_name: string | null
          position_score: number | null
          round_1_score: string | null
          round_2_score: string | null
          round_3_score: string | null
          round_4_score: string | null
          scoring_cut_bonus: number | null
          scoring_made_cut: boolean | null
          scoring_shot_low_round_1_score: boolean | null
          scoring_shot_low_round_1_score_bonus: number | null
          scoring_shot_low_round_2_score: boolean | null
          scoring_shot_low_round_2_score_bonus: number | null
          scoring_shot_low_round_3_score: boolean | null
          scoring_shot_low_round_3_score_bonus: number | null
          scoring_shot_low_round_4_score: boolean | null
          scoring_shot_low_round_4_score_bonus: number | null
          scoring_total_score: number | null
          tournament_course_name: string | null
          tournament_dates: string | null
          tournament_id: string | null
          tournament_logo: string | null
          tournament_name: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pga_tour_tournament_fields_stroke_play_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "pga_tour_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pga_tour_tournament_fields_stroke_play_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "pga_tour_tournaments"
            referencedColumns: ["id"]
          }
        ]
      }
      pga_tour_tournament_picks_stroke_play_enriched: {
        Row: {
          league_id: number | null
          pick_created_at: string | null
          pick_index: number | null
          pick_updated_at: string | null
          player_country: string | null
          player_country_code: string | null
          player_first_name: string | null
          player_icon_url: string | null
          player_id: string | null
          player_last_name: string | null
          tournament_course_name: string | null
          tournament_dates: string | null
          tournament_id: string | null
          tournament_logo: string | null
          tournament_name: string | null
          user_email: string | null
          user_first_name: string | null
          user_id: string | null
          user_image_url: string | null
          user_last_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pga_tour_tournament_picks_stroke_play_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pga_tour_tournament_picks_stroke_play_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "pga_tour_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pga_tour_tournament_picks_stroke_play_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "pga_tour_tournaments"
            referencedColumns: ["id"]
          }
        ]
      }
      pga_tour_tournament_stroke_play_field_scoring: {
        Row: {
          cut_bonus: number | null
          made_cut: boolean | null
          player_id: string | null
          position_score: number | null
          shot_low_round_1_score: boolean | null
          shot_low_round_1_score_bonus: number | null
          shot_low_round_2_score: boolean | null
          shot_low_round_2_score_bonus: number | null
          shot_low_round_3_score: boolean | null
          shot_low_round_3_score_bonus: number | null
          shot_low_round_4_score: boolean | null
          shot_low_round_4_score_bonus: number | null
          total_score: number | null
          tournament_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pga_tour_tournament_fields_stroke_play_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "pga_tour_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pga_tour_tournament_fields_stroke_play_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "pga_tour_tournaments"
            referencedColumns: ["id"]
          }
        ]
      }
      pga_tour_tournament_stroke_play_field_scoring_features: {
        Row: {
          made_cut: boolean | null
          player_id: string | null
          position_score: number | null
          shot_low_round_1_score: boolean | null
          shot_low_round_2_score: boolean | null
          shot_low_round_3_score: boolean | null
          shot_low_round_4_score: boolean | null
          tournament_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pga_tour_tournament_fields_stroke_play_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "pga_tour_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pga_tour_tournament_fields_stroke_play_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "pga_tour_tournaments"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      requesting_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
