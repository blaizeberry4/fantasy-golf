import supabase from "@/lib/supabase-ssr";
import FilterableTournamentList from "@/components/ui/tournament-list";


export const revalidate = 3600

export default async function EventsPage() {
    const { data, error } = await supabase
        .from('pga_tour_tournaments')
        .select('*')

    if (error || !data) {
        console.error(error)
        return <div>Error loading tournaments</div>
    }

    return (<FilterableTournamentList tournaments={data!}/>)
}