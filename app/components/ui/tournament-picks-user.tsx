'use client';

import { PGATourTournamentFieldStrokePlayEnriched, PGATourTournamentPickStrokePlayEnriched, User } from "@/types/supabase-derived";

export type TournamentPicksUserProps = {
    field: PGATourTournamentFieldStrokePlayEnriched[],
    picks: PGATourTournamentPickStrokePlayEnriched[],
    onSlotClick: (slotIndex: number) => void,
}


export default function TournamentPicksUser({ field, picks, onSlotClick }: TournamentPicksUserProps) {
    return (
        <div className="grid grid-cols-4 px-2 border-grey-300 border-b mb-2 py-2">
            { (picks || [null, null, null, null]).map((pick, index) => {
                const playerName = pick ?
                    <p className="text-sm text-center">{pick.player_first_name!}<br/>{pick.player_last_name}</p> :
                    <p className="text-sm text-center">Player {index + 1}</p>
                
                const playerFieldEntry = field.find((player) => player.player_id === pick?.player_id)

                const playerScoringSummary = pick ?
                    <p className="text-xs font-bold text-center">{playerFieldEntry?.current_total_score} / {playerFieldEntry?.scoring_total_score} pts</p> :
                    <p className="text-xs font-bold text-center">-- pts</p>
                
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
                        </div>
                    </button>
                )
            })}
        </div>
    )
}
