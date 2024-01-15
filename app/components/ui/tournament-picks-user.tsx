'use client';

import { PGATourTournamentFieldStrokePlayEnriched, PGATourTournamentPickStrokePlayEnriched, User } from "@/types/supabase-derived";
import { format } from "date-fns";

export type TournamentPicksUserProps = {
    field: PGATourTournamentFieldStrokePlayEnriched[],
    picks: PGATourTournamentPickStrokePlayEnriched[],
    userPicksForSegment: Record<string, Set<string>>,
    onSlotClick: (slotIndex: number) => void,
}


export default function TournamentPicksUser({ field, picks, userPicksForSegment, onSlotClick }: TournamentPicksUserProps) {
    return (
        <div className="grid grid-cols-4 px-2 border-grey-300 border-b mb-2 py-2">
            { (picks || [null, null, null, null]).map((pick, index) => {
                const playerName = pick ?
                    <p className="text-sm text-center">{pick.player_first_name!.slice(0, 1)}. {pick.player_last_name}</p> :
                    <p className="text-sm text-center">Player {index + 1}</p>
                
                const playerFieldEntry = field.find((player) => player.player_id === pick?.player_id)

                if (!userPicksForSegment[pick.player_id!]) {
                    userPicksForSegment[pick.player_id!] = new Set<string>()
                }
                userPicksForSegment[pick.player_id!].add(pick.tournament_id!)
                const pickedCount = userPicksForSegment[pick.player_id!]?.size ?? 0
                const picksRemaining = 3 - pickedCount
                const picksRemainingIconColor = [
                    'bg-red-500',
                    'bg-yellow-500',
                    'bg-green-500',
                    'bg-green-500',
                ][picksRemaining]

                const playerScoringSummary = pick ?
                    <div className="flex flex-row gap-1">
                        <div className={`rounded-full w-4 h-4 ${picksRemainingIconColor} text-white text-xs`}>{picksRemaining}</div>
                        <p className="text-xs font-bold text-center">{playerFieldEntry?.latest_odds_to_win}</p>
                    </div> :
                    <p className="text-xs font-bold text-center">--</p>
                
                return (
                    <button type="button" key={`tournament-pick-${index}`} onClick={() => onSlotClick(index)}>
                        <div className="flex flex-col text-center">
                            <div className="flex justify-center">
                                <img className="rounded-full" src={pick?.player_icon_url ?? '/bph.webp'} height={48} width={48} />
                            </div>
                            <div className="flex justify-center">
                                {playerName}
                            </div>
                            <div className="flex justify-center">
                                {playerScoringSummary}
                            </div>
                            <div className="flex justify-center">
                            <p className="text-xs font-bold text-center">{format(new Date(playerFieldEntry?.latest_tee_time + 'Z'), 'h:mm a')}</p>
                            </div>
                        </div>
                    </button>
                )
            })}
        </div>
    )
}
