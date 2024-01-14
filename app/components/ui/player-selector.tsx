import { useState } from "react";
import { PGATourTournamentFieldStrokePlayEnriched } from "@/types/supabase-derived";
import Image from "next/image";


export type PlayerSelectorProps = {
    onPlayerSelect: (playerId: string) => Promise<void>,
    field: PGATourTournamentFieldStrokePlayEnriched[],
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
            return parseInt(a.latest_odds_to_win || '0') - parseInt(b.latest_odds_to_win || '0')
        })
}

export default function PlayerSelector({ onPlayerSelect, field }: PlayerSelectorProps) {
    const [search, setSearch] = useState("")

    return (
        <div className="mx-6 my-2 overflow-scroll">
            {present(field, search).map((player) => {
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
                    <p className="ml-2 col-span-4 text-left">{player.player_first_name + ' ' + player.player_last_name}</p>
                    <p className="font-bold text-sm">{player.latest_odds_to_win}</p>
                </button>
            })}
        </div>
    )
}
