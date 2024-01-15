import supabase from "@/lib/supabase-ssr";
import Tournament from "@/components/ui/tournament";

export const revalidate = 0;

export async function generateStaticParams() {
    const { data } = await supabase.from('pga_tour_tournaments').select('id')

    return data?.map(({ id }) => ({ eventId: id })) || [] 
}

const loadEventPageData = async (eventId: string) => {
    const fieldQuery = supabase
        .from('pga_tour_tournament_fields_stroke_play_enriched')
        .select('*')
        .eq('tournament_id', eventId)

    const picksQuery = supabase
        .from('pga_tour_tournament_picks_stroke_play_enriched')
        .select('*')
        .eq('tournament_id', eventId)
        .eq('league_id', 1)

    const competitorsQuery = supabase.from('users').select('*')

    const tournamentQuery = supabase.from('pga_tour_tournaments').select('*').eq('id', eventId).single()

    const [field, picks, competitors, tournament] = await Promise.all([fieldQuery, picksQuery, competitorsQuery, tournamentQuery])

    return {
        field: field.data!,
        picks: picks.data!,
        competitors: competitors.data!,
        tournament: tournament.data!,
    }
}

export default async function EventPage({ params }: { params: { eventId: string } }) {
    const { field, picks, competitors, tournament } = await loadEventPageData(params.eventId)

    return (<Tournament field={field} picks={picks} competitors={competitors} tournament={tournament} />)
}