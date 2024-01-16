'use client';

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { supabaseClient } from "@/lib/supabase";
import { PGATourTournament, PGATourTournamentFieldStrokePlayEnriched, PGATourTournamentPickStrokePlayEnriched, User } from "@/types/supabase-derived";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";
import CompetitorPicksSummary from "@/components/ui/competitor-picks-summary";
import TournamentPicksUser from "@/components/ui/tournament-picks-user";
import TournamentBanner from "@/components/ui/tournament-banner";
import PlayerSelector from "@/components/ui/player-selector";
import TournamentPicksCompetitorPerformance from "./tournament-picks-competitor-performance";
import TournamentFieldPerformance from "./tournament-field-performance";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"



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
    userId: string,
    leagueId: number,
    player: PGATourTournamentFieldStrokePlayEnriched,
    pickIndex: number
) {
    const { data, error } = await supabase.from('pga_tour_tournament_picks_stroke_play').upsert([{
        tournament_id: player.tournament_id!,
        player_id: player.player_id!,
        user_id: userId,
        league_id: leagueId,
        pick_index: pickIndex,
        updated_at: new Date().toISOString()
    }], { ignoreDuplicates: false, onConflict: 'user_id,tournament_id,league_id,pick_index' }).select()

    if (error) {
        console.error(error)
        throw error
    }

    return data![0]
}

export type TournamentProps = {
    tournament: PGATourTournament,
    field: PGATourTournamentFieldStrokePlayEnriched[],
    competitors: User[],
    picks: PGATourTournamentPickStrokePlayEnriched[],
    segmentPicks: PGATourTournamentPickStrokePlayEnriched[],
}

export default function Tournament({ tournament, field, competitors, picks, segmentPicks }: TournamentProps) {
    const { getToken, userId, isSignedIn } = useAuth()
    const [pickEditIndex, setPickEditIndex] = useState<number | null>(null)
    const [myPicks, setMyPicks] = useState<PGATourTournamentPickStrokePlayEnriched[]>(
        ensurePicks(picks.filter(pick => pick.user_id === userId))
    )
    const [tableView, setTableView] = useState<'field' | 'picks'>('picks')

    if (!isSignedIn) {
        return <div>Sign in to view this page</div>
    }
    
    const me = competitors.find(competitor => competitor.id === userId)

    const competitorsWithPicks = competitors.filter(competitor => competitor.id !== userId).map(competitor => ({
        ...competitor,
        picks: ensurePicks(picks.filter((pick) => pick.user_id === competitor.id))
    }))

    const userPicksForSegment = segmentPicks.filter((pick) => pick.user_id === userId).reduce((acc, pick) => {
        if (!pick?.player_id) {
            return acc
        }

        if (!acc[pick.player_id!]) {
            acc[pick.player_id!] = new Set()
        }

        acc[pick.player_id!].add(pick.tournament_id!)

        return acc
    }, {} as Record<string, Set<string>>)

    return ['IN_PROGRESS', 'COMPLETED'].includes(tournament.status || 'invalid_status') ? (
        <div className="grid grid-cols-1 content-between h-full gap-1">
            {/* <div className="sticky top-0 bg-white"> */}
                <div className="grid grid-cols-1 max-h-128 overflow-scroll">
                    <div className="sticky">
                        <TournamentBanner tournamentDetails={tournament} />
                    </div>
                    <div className="flex overflow-auto">
                        { tableView === 'picks' ? (<TournamentPicksCompetitorPerformance
                            tournament={tournament}
                            field={field}
                            competitors={competitors}
                            picks={picks}
                            userId={userId}
                        />) : '' }
                        { tableView === 'field' ? (<TournamentFieldPerformance
                            tournament={tournament}
                            field={field}
                            competitors={competitors}
                            picks={picks}
                            userId={userId}
                        />) : '' }
                    </div>
                </div>
                <ToggleGroup type="single" value={tableView} className="py-2 text-white">
                    <ToggleGroupItem className="border rounded-l-full" value="picks" onClick={() => setTableView('picks')}>PUP Board</ToggleGroupItem>
                    <ToggleGroupItem className="border rounded-r-full" value="field" onClick={() => setTableView('field')}>Leaderboard</ToggleGroupItem>
                </ToggleGroup>
            {/* </div> */}
        </div>
    ) : (
        <div className="flex flex-col">
            <div className="sticky top-0 bg-white">
                <TournamentBanner tournamentDetails={tournament} />
                <TournamentPicksUser
                    picks={myPicks}
                    field={field}
                    userPicksForSegment={userPicksForSegment}
                    onSlotClick={(index: number) => { setPickEditIndex(index) }}
                />
            </div>
            <Drawer open={pickEditIndex !== null} modal={true} onClose={() => setPickEditIndex(null)}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>
                            Choose a Golfer
                        </DrawerTitle>
                    </DrawerHeader>

                    <PlayerSelector field={field} userPicksForSegment={userPicksForSegment} onPlayerSelect={async (playerId) => {
                        const client = await supabaseClient(getToken)
                        const player = field.find((player) => player.player_id === playerId)!
                        const madePick = await makePickForUser(client, userId, 1, player, pickEditIndex!)
                        myPicks[pickEditIndex!] = {
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
                        setMyPicks(myPicks)
                        setPickEditIndex(null)
                    }}/>
                </DrawerContent>
            </Drawer>
            <div className="flex flex-col">
                <div className="grid grid-cols-12 gap-y-6">
                    {
                        competitorsWithPicks.map(competitor => {
                            return <CompetitorPicksSummary
                                competitor={competitor}
                                picks={competitor.picks}
                                field={field}
                                key={`tournament-${tournament.id}-competitor-${competitor.id}-picks`}
                            />
                        })
                    }
                </div>
            </div>
        </div>
    )
}