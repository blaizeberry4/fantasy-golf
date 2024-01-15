import { useState } from "react";
import { PGATourTournamentFieldStrokePlayEnriched } from "@/types/supabase-derived";
import Image from "next/image";


export type PlayerSelectorProps = {
    onPlayerSelect: (playerId: string) => Promise<void>,
    field: PGATourTournamentFieldStrokePlayEnriched[],
    userPicksForSegment: Record<string, Set<string>>,
}

const present = (
    field: PGATourTournamentFieldStrokePlayEnriched[],
    search: string,
) => {
    return field
        .filter(player => (
            search === ''
            || player.player_first_name!.toLowerCase().includes(search.toLowerCase())
            || player.player_last_name!.toLowerCase().includes(search.toLowerCase())
        ))
        .sort((a, b) => {
            return parseInt(a.latest_odds_to_win || '1000000') - parseInt(b.latest_odds_to_win || '1000000')
        })
}

export default function PlayerSelector({ onPlayerSelect, field, userPicksForSegment }: PlayerSelectorProps) {
    const [search, setSearch] = useState("")

    return (
        <div className="mx-6 my-2 max-h-[60vh] overflow-scroll">
            {present(field, search).map((player) => {
                const pickedCount = userPicksForSegment[player.player_id!]?.size ?? 0
                const picksRemaining = 3 - pickedCount
                const picksRemainingIconColor = [
                    'bg-red-600',
                    'bg-yellow-600',
                    'bg-green-500',
                    'bg-green-500',
                ][picksRemaining]

                return <button 
                    className="grid grid-cols-6 gap-1 w-full border-gray-200 border-b items-center py-1 hover:bg-gray-200"
                    key={`event-field-player-${player.player_id}`}
                    onClick={async () => {
                        await onPlayerSelect(player.player_id!)
                        setSearch('')
                    }}
                >
                    <Image 
                        className="rounded-full"
                        src={player.player_icon_url!}
                        alt={player.player_first_name + ' ' + player.player_last_name}
                        height={36} width={36}
                    />
                    <div className="flex flex-row items-center col-span-4">
                        <div className={`rounded-full w-4 h-4 ${picksRemainingIconColor} text-white text-xs`}>{picksRemaining}</div>
                        <p className="ml-2 text-left">{player.player_first_name + ' ' + player.player_last_name}</p>
                    </div>
                    <p className="font-bold text-sm">{player.latest_odds_to_win}</p>
                </button>
            })}
        </div>
    )
}
