'use client';

import { PGATourTournamentFieldStrokePlayEnriched, PGATourTournamentPickStrokePlayEnriched, User } from "@/types/supabase-derived";
import Image from "next/image";


export type CompetitorPicksSummaryProps = {
    competitor: User,
    picks: PGATourTournamentPickStrokePlayEnriched[],
    field: PGATourTournamentFieldStrokePlayEnriched[],
    competitorPicksForSegment: Record<string, Set<string>>,
}


export default function CompetitorPicksSummary({ competitor, picks, field, competitorPicksForSegment }: CompetitorPicksSummaryProps) {
    const competitorName = `${competitor.first_name} ${competitor.last_name.slice(0, 1)}.`

    return (
        <>
        <div className="col-start-1 col-end-4 flex flex-col items-center justify-center">
            <Image src={competitor.image_url!} alt={competitorName} className="rounded-full" height={48} width={48}/>
            {/* <p className="ml-2">{competitorName}</p> */}
        </div>
        <div className="col-start-4 col-end-12 flex flex-col">
            { picks.map((pick, index) => {
                const src = pick?.player_icon_url ? pick.player_icon_url : '/bph.webp'
                const playerName = pick ? pick.player_first_name! + ' ' + pick.player_last_name! : `Player ${index + 1}`
                const playerFieldEntry = field.find((player) => player.player_id === pick?.player_id)
                const playerOddsAndTeeTime = pick ?
                    <p className="ml-4 text-xs font-bold">{playerFieldEntry?.latest_odds_to_win}</p> :
                    <p className="ml-4 text-xs font-bold">--</p>
                
                const pickedCount = pick ? competitorPicksForSegment[pick.player_id!]?.size ?? 0 : 0
                const picksRemaining = 3 - pickedCount
                const picksRemainingIconColor = [
                    'bg-red-500',
                    'bg-yellow-500',
                    'bg-green-500',
                    'bg-green-500',
                ][picksRemaining]

                return (
                    <div className="flex flex-row items-center justify-between" key={`event-competitors-${index}`}>
                        <Image src={src} alt={playerName} className="rounded-full" height={24} width={24}/>
                        <div className="flex flex-row items-center">
                            <p className="ml-2 text-sm">{playerName}</p>
                            {pick && <div className={`rounded-full w-3 h-3 ml-2 ${picksRemainingIconColor} text-center text-white text-[8px]`}>{picksRemaining}</div>}
                        </div>
                        {playerOddsAndTeeTime}
                    </div>
                )
            })}
        </div>
        </>
    )
}