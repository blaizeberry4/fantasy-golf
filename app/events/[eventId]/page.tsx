'use client';

import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { supabaseClient } from "@/lib/supabase";
import { PGATourTournamentFieldStrokePlayEnriched, PGATourTournamentPickStrokePlayEnriched, User } from "@/types/supabase-derived";
import Image from "next/image";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";


const REQUIRED_PICKS = 4

function ensurePicks(picks: PGATourTournamentPickStrokePlayEnriched[]): PGATourTournamentPickStrokePlayEnriched[] {
    if (picks.length > 4) {
        throw new Error('Too many picks')
    }

    const picksToReturn = Array(REQUIRED_PICKS).fill(null)

    picks.forEach((pick) => {
        picksToReturn[pick.pick_index!] = pick
    })

    return picksToReturn
}

async function makePickForUser(
    supabase: SupabaseClient<Database>,
    user_id: string,
    player: PGATourTournamentFieldStrokePlayEnriched,
    pickIndex: number
) {
    const { data, error } = await supabase.from('pga_tour_tournament_picks_stroke_play').upsert([{
        tournament_id: player.tournament_id!,
        player_id: player.player_id!,
        user_id: user_id,
        pick_index: pickIndex,
        updated_at: new Date().toISOString()
    }], { ignoreDuplicates: false, onConflict: 'user_id,tournament_id,pick_index' }).select()

    if (error) {
        console.error(error)
        throw error
    }

    return data![0]
}

export default function EventPage({ params }: { params: { eventId: string } }) {
    const { user } = useUser()
    const { getToken } = useAuth()
    const [field, setField] = useState<PGATourTournamentFieldStrokePlayEnriched[]>([])
    const [picks, setPicks] = useState<PGATourTournamentPickStrokePlayEnriched[]>([])
    const [pickEditIndex, setPickEditIndex] = useState<number | null>(null)
    const [competitors, setCompetitors] = useState<User[]>([])
    const [search, setSearch] = useState("")

    const myPicks = ensurePicks(picks.filter((pick) => pick.user_id === user?.id))
    const competitorsWithPicks = competitors.filter(competitor => competitor.id !== user?.id).map(competitor => ({
        ...competitor,
        picks: ensurePicks(picks.filter((pick) => pick.user_id === competitor.id))
    }))
    const me = competitors.find(competitor => competitor.id === user?.id)

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
        <div className="flex flex-col">
            <div className="sticky top-0 bg-white">
                <div className="flex flex-row w-full items-center border border-gray-200">
                    <Image className="object-cover rounded-full ml-4 p-2 h-20 w-20 md:h-36 md:w-36" src={field[0]?.tournament_logo!} alt="" height={48} width={48} />
                    <div className="flex flex-col justify-between p-2 leading-normal">
                        <h5 className="mb-1 text-sm md:text-lg font-bold tracking-tight text-gray-900 dark:text-white">{field[0]?.tournament_name!}</h5>
                        <p className="mb-1 text-xs md:text-md font-normal text-gray-700 dark:text-gray-400">{field[0]?.tournament_dates!}<br/>{field[0]?.tournament_course_name!}</p>
                    </div>
                </div>
                <div className="grid grid-cols-4 px-2 border-grey-300 border-b mb-2 py-2">
                    { (myPicks || [null, null, null, null]).map((pick, index) => {
                        const playerName = pick ?
                            <p className="text-sm text-center">{pick.player_first_name!}<br/>{pick.player_last_name}</p> :
                            <p className="text-sm text-center">Player {index + 1}</p>
                        
                        const playerFieldEntry = field.find((player) => player.player_id === pick?.player_id)

                        const playerScoringSummary = pick ?
                            <p className="text-xs font-bold text-center">{playerFieldEntry?.current_total_score} / {playerFieldEntry?.scoring_total_score} pts</p> :
                            <p className="text-xs font-bold text-center">-- pts</p>
                        
                        return (
                            <button type="button" key={`tournament-pick-${index}`} onClick={() => setPickEditIndex(index)}>
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
            </div>
            <Drawer open={pickEditIndex !== null} modal={true} onClose={() => setPickEditIndex(null)}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>
                            Choose a Golfer
                        </DrawerTitle>
                    </DrawerHeader>
                    
                    <div className="h-96 overflow-y-scroll">
                        <input
                            type="text"
                            id="helper-text"
                            aria-describedby="helper-text-explanation"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Filter by player name"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="mx-6 my-2 overflow-scroll">
                            {field.filter(
                                player => search === '' ||
                                player.player_first_name!.toLowerCase().includes(search.toLowerCase()) ||
                                player.player_last_name!.toLowerCase().includes(search.toLowerCase())
                            ).sort((a, b) => { return parseInt(a.latest_odds_to_win || '0') - parseInt(b.latest_odds_to_win || '0') }).map((player) => {
                                return <button 
                                    className="grid grid-cols-6 gap-1 w-full border-gray-200 border-b items-center py-1 hover:bg-gray-200"
                                    key={`event-field-player-${player.player_id}`}
                                    onClick={async () => {
                                        const client = await supabaseClient(getToken)
                                        const madePick = await makePickForUser(client, user!.id, player, pickEditIndex!)
                                        setPicks([
                                            ...picks.filter(pick => !(
                                                pick.user_id === madePick.user_id &&
                                                pick.pick_index === madePick.pick_index &&
                                                pick.tournament_id === madePick.tournament_id
                                            )),
                                            {
                                                ...madePick,
                                                pick_created_at: madePick.created_at,
                                                pick_updated_at: madePick.updated_at,
                                                player_first_name: player.player_first_name,
                                                player_last_name: player.player_last_name,
                                                player_icon_url: player.player_icon_url,
                                                player_country: player.player_country,
                                                player_country_code: player.player_country_code,
                                                tournament_course_name: player.tournament_course_name,
                                                tournament_dates: player.tournament_dates,
                                                tournament_id: player.tournament_id,
                                                tournament_logo: player.tournament_logo,
                                                tournament_name: player.tournament_name,
                                                user_email: me!.email,
                                                user_first_name: me!.first_name,
                                                user_last_name: me!.last_name,
                                                user_image_url: me!.image_url,
                                            }
                                        ])
                                        setPickEditIndex(null)
                                        setSearch('')
                                    }}
                                >
                                    <Image className="rounded-full" src={player.player_icon_url!} alt={player.player_first_name + ' ' + player.player_last_name} height={36} width={36} />
                                    <p className="ml-2 col-span-4 text-left">{player.player_first_name + ' ' + player.player_last_name}</p>
                                    <p className="font-bold text-sm">{player.latest_odds_to_win}</p>
                                </button>
                            })}
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
            <div className="flex flex-col">
                <div className="grid grid-cols-12 gap-y-6">
                    {
                        competitorsWithPicks.map(competitor => {
                            const competitorName = `${competitor.first_name} ${competitor.last_name.slice(0, 1)}.`

                            return (
                                <>
                                <div className="col-start-1 col-end-4 flex flex-col items-center justify-center">
                                    <Image src={competitor.image_url!} alt={competitorName} className="rounded-full" height={48} width={48}/>
                                    {/* <p className="ml-2">{competitorName}</p> */}
                                </div>
                                <div className="col-start-4 col-end-12 flex flex-col">
                                    { competitor.picks.map((pick, index) => {
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
                        })
                    }
                </div>
            </div>
        </div>
    )
}