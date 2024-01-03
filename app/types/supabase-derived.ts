import { Database } from "@/types/supabase";


export type PGATourTournamentInsert = Database['public']['Tables']['pga_tour_tournaments']['Insert']
export type PGATourTournament = Database['public']['Tables']['pga_tour_tournaments']['Row']

export type PGATourTournamentFieldStrokePlayInsert = Database['public']['Tables']['pga_tour_tournament_fields_stroke_play']['Insert']
export type PGATourTournamentFieldStrokePlay = Database['public']['Tables']['pga_tour_tournament_fields_stroke_play']['Row']

export type PGATourTournamentFieldStrokePlayEnriched = Database['public']['Views']['pga_tour_tournament_fields_stroke_play_enriched']['Row']

export type PGATourTournamentPickStrokePlayInsert = Database['public']['Tables']['pga_tour_tournament_picks_stroke_play']['Insert']
export type PGATourTournamentPickStrokePlay = Database['public']['Tables']['pga_tour_tournament_picks_stroke_play']['Row']

export type PGATourTournamentPickStrokePlayEnriched = Database['public']['Views']['pga_tour_tournament_picks_stroke_play_enriched']['Row']

export type User = Database['public']['Tables']['users']['Row']