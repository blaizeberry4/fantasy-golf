'use client';

import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { supabaseClient } from "@/lib/supabase";
import { PGATourTournamentFieldStrokePlayEnriched, PGATourTournamentPickStrokePlayEnriched, User } from "@/types/supabase-derived";
import Image from "next/image";


const REQUIRED_PICKS = 4

function ensurePicks(picks: PGATourTournamentPickStrokePlayEnriched[]): PGATourTournamentPickStrokePlayEnriched[] {
    if (picks.length > 4) {
        throw new Error('Too many picks')
    }

    if (picks.length < REQUIRED_PICKS) {
        return [...picks.sort((a, b) => a.pick_index! - b.pick_index!), ...Array(REQUIRED_PICKS - picks.length).fill(null)]
    }

    return picks.sort((a, b) => a.pick_index! - b.pick_index!)
}

export default function EventPage({ params }: { params: { eventId: string } }) {
    const { user } = useUser()
    const { getToken } = useAuth()
    const [field, setField] = useState<PGATourTournamentFieldStrokePlayEnriched[]>([])
    const [picks, setPicks] = useState<PGATourTournamentPickStrokePlayEnriched[]>([])
    const [pickEditIndex, setPickEditIndex] = useState<number | null>(null)
    const [competitors, setCompetitors] = useState<User[]>([])
    const [isLocked, setIsLocked] = useState<boolean>(false)
    const [search, setSearch] = useState("")

    const myPicks = ensurePicks(picks.filter((pick) => pick.user_id === user?.id))
    const competitorsWithPicks = competitors.filter(competitor => competitor.id !== user?.id).map(competitor => ({
        ...competitor,
        picks: ensurePicks(picks.filter((pick) => pick.user_id === competitor.id))
    }))

    useEffect(() => {
        (async () => {
            const client = await supabaseClient(getToken)

            const fieldQuery = client
                .from('pga_tour_tournament_fields_stroke_play_enriched')
                .select('*')
                .eq('tournament_id', params.eventId)

            const picksQuery = client
                .from('pga_tour_tournament_picks_stroke_play_enriched')
                .select('*')
                .eq('tournament_id', params.eventId)

            const competitorsQuery = client.from('users').select('*')

            const [field, picks, competitors] = await Promise.all([fieldQuery, picksQuery, competitorsQuery])

            if (field.error) {
                console.error(field.error)
            }

            if (picks.error) {
                console.error(picks.error)
            }

            setField(field.data!)
            setPicks(picks.data!)
            setCompetitors(competitors.data!)
        })()
    }, [])

    return (
        <div>
            <div className="flex flex-row w-full items-center border border-gray-200">
                <Image className="object-cover rounded-full ml-4 p-2 h-20 w-20 md:h-36 md:w-36" src={field[0]?.tournament_logo!} alt="" height={48} width={48} />
                <div className="flex flex-col justify-between p-2 leading-normal">
                    <h5 className="mb-1 text-sm md:text-lg font-bold tracking-tight text-gray-900 dark:text-white">{field[0]?.tournament_name!}</h5>
                    <p className="mb-1 text-xs md:text-md font-normal text-gray-700 dark:text-gray-400">{field[0]?.tournament_dates!}<br/>{field[0]?.tournament_course_name!}</p>
                </div>
            </div>
            <div className="flex flex-row justify-between px-2 border-grey-300 border-b mb-2 py-2">
                { (myPicks || [null, null, null, null]).map((pick, index) => (
                    <button className="flex flex-col items-center" type="button" data-drawer-target="field-picker-drawer" data-drawer-show="field-picker-drawer" data-drawer-placement="bottom" aria-controls="field-picker-drawer" key={`tournament-pick-${index}`} onClick={() => { setPickEditIndex(index) }}>
                        <img className="rounded-full" src={pick?.player_icon_url ?? '/bph.webp'} height={48} width={48} />
                        <p className="ml-2">{pick ? pick.player_first_name + ' ' + pick.player_last_name : `Player ${index + 1}`}</p>
                    </button>
                ))}
            </div>
            <div className="flex flex-col">
                <h5 className="text-bold">Competitors</h5>
                <div className="grid grid-cols-12 gap-y-6">
                    {
                        competitorsWithPicks.map(competitor => {
                            const competitorName = `${competitor.first_name} ${competitor.last_name.slice(0, 1)}.`

                            return (
                                <>
                                <div className="col-start-1 col-end-4 flex flex-col items-center justify-center">
                                    <Image src={competitor.image_url!} alt={competitorName} className="rounded-full" height={48} width={48}/>
                                    <p className="ml-2">{competitorName}</p>
                                </div>
                                <div className="col-start-5 col-end-12 flex flex-col">
                                    { competitor.picks.map((pick, index) => {
                                        const src = pick?.player_icon_url ? pick.player_icon_url : '/bph.webp'
                                        const playerName = pick ? pick.player_first_name! + ' ' + pick.player_last_name! : `Player ${index + 1}`
                                        const playerFieldEntry = field.find((player) => player.player_id === pick?.player_id)

                                        return (
                                            <div className="flex flex-row" key={`event-competitors-${index}`}>
                                                <Image src={src} alt={playerName} className="rounded-full" height={24} width={24}/>
                                                <p className="ml-2">{playerName}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                                </>
                            )
                        })
                    }
                </div>
            </div>
            <div id="field-picker-drawer" className="fixed bottom-16 left-0 right-0 z-40 w-full p-4 overflow-y-auto transition-transform bg-white dark:bg-gray-800 transform-none hidden" tabIndex={-1} aria-labelledby="field-picker-drawer">
                <input
                type="text"
                id="helper-text"
                aria-describedby="helper-text-explanation"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Filter by player name"
                />
                <div className="mx-6 my-2 overflow-scroll">
                    {field.map((player) => {
                        return <div className="flex flex-row border-gray-200 border-b items-center" key={`event-field-player-${player.player_id}`}>
                            <img src={player.player_icon_url!} />
                            <p className="ml-2">{player.player_first_name + ' ' + player.player_last_name}</p>
                        </div>
                    })}
                </div>
            </div>
        </div>
    )
}