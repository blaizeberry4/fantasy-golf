'use client';

import { PGATourTournamentFieldStrokePlayEnriched, PGATourTournamentPickStrokePlayEnriched, User } from "@/types/supabase-derived";
import Image from "next/image";


export type CompetitorEventSummaryProps = {
    competitor: User,
    picks: PGATourTournamentPickStrokePlayEnriched[],
    field: PGATourTournamentFieldStrokePlayEnriched[],
}

const parseScore = (score: string | null | undefined): number | null => {
    if (score === null || score === undefined) {
        return null
    }

    if (score === 'E') {
        return 0
    }

    return parseInt(score)
}

export default function CompetitorEventSummary({ competitor, picks, field }: CompetitorEventSummaryProps) {
    const competitorName = `${competitor.first_name} ${competitor.last_name.slice(0, 1)}.`

    // position, picture, name, r1, r2, r3, r4, thru, cum score, total score

    const competitorScoringSummary = picks.reduce((acc, pick) => {
        const playerFieldEntry = field.find((player) => player.player_id === pick?.player_id)
        const round1Score = playerFieldEntry ? parseScore(playerFieldEntry.round_1_score) : 0
        const round2Score = playerFieldEntry ? playerFieldEntry.round_2_score : 0
        const round3Score = playerFieldEntry ? playerFieldEntry.round_3_score : 0
        const round4Score = playerFieldEntry ? playerFieldEntry.round_4_score : 0
        const thru = playerFieldEntry ? playerFieldEntry.current_thru : 0
        const cumulativeScore = playerFieldEntry?.current_total_score ? playerFieldEntry.current_total_score : 0
        const totalScore = playerFieldEntry?.scoring_total_score ? playerFieldEntry.scoring_total_score : 0

        return {
            position: 1,
            thru: acc.thru + thru,
            round_1_score: acc.round_1_score + round1Score,
            round_2_score: acc.round_2_score + round2Score,
            round_3_score: acc.round_3_score + round3Score,
            round_4_score: acc.round_4_score + round4Score,
            cumulative_score: acc.cumulative_score + cumulativeScore,
            total_score: acc.total_score + totalScore,
        }
    }, {
        position: 0,
        thru: 0,
        round_1_score: 0,
        round_2_score: 0,
        round_3_score: 0,
        round_4_score: 0,
        cumulative_score: 0,
        total_score: 0,
    })

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
                const playerScoringSummary = pick ?
                    <p className="ml-4 text-xs font-bold">{playerFieldEntry?.current_total_score} / {playerFieldEntry?.scoring_total_score} pts</p> :
                    <p className="ml-4 text-xs font-bold">-- pts</p>

                return (
                    <div className="flex flex-row items-center justify-between" key={`event-competitors-${index}`}>
                        <Image src={src} alt={playerName} className="rounded-full" height={24} width={24}/>
                        <p className="ml-2 text-sm">{playerName}</p>
                        {playerScoringSummary}
                    </div>
                )
            })}
        </div>
        </>
    )
}