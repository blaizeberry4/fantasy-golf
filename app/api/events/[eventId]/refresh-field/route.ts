import { createClient } from "@supabase/supabase-js"
import { Database } from "@/types/supabase"
import { load as loadHTML, Cheerio, Element } from "cheerio"
import slugify from "slugify"
import { NextRequest, NextResponse } from "next/server"


const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const getDataForTournament = async (tournamentId: string) => {
    const { data, error } = await supabase
        .from("pga_tour_tournaments")
        .select("name, season")
        .match({ id: tournamentId })
        .single()

    if (error) {
        throw error
    }

    if (!data) {
        return null
    }

    const tournamentSlug = slugify(data.name, { lower: true })
    const tournamentUrl = `https://www.pgatour.com/tournaments/${data.season}/${tournamentSlug}/${tournamentId}/field`
    const response = await fetch(tournamentUrl, { cache: 'no-store' })
    const html = await response.text()
    const $ = loadHTML(html)
    const nextDataEl = $('#__NEXT_DATA__') as Cheerio<Element>
    const props = nextDataEl[0]?.children[0] as unknown as Text | undefined 
    const parsed = props ? JSON.parse( props.data ) : undefined

    return parsed.props.pageProps
}

const parseField = (fieldData: any) => {
    if (!fieldData) {
        return null
    }

    return fieldData.players.map((player: any) => ({
        tournament_id: fieldData.id,
        player_id: player.id,
        round_1_score: null,
        round_2_score: null,
        round_3_score: null,
        round_4_score: null,
        current_total_score: null,
        current_position: null,
        current_round: null,
        current_round_score: null,
        current_thru: null,
        current_round_status: null,
        current_status: player.status,
        updated_at: new Date().toISOString(),
    }))
}

const parseLeaderboard = (leaderboardData: any) => {
    if (!leaderboardData.players.length) {
        return null
    }

    const fieldData = leaderboardData
        .players
        .filter((player: any) => player.__typename === 'PlayerRowV2')
        .map((player: any) => {
            return {
                tournament_id: leaderboardData.id.split('-')[0],
                player_id: player.player.id,
                round_1_score: player.rounds[0],
                round_2_score: player.rounds[1],
                round_3_score: player.rounds[2],
                round_4_score: player.rounds[3],
                current_total_score: player.total,
                current_position: player.position,
                current_round: player.currentRound,
                current_round_score: player.score,
                current_thru: player.thru,
                current_round_status: player.roundStatus,
                current_status: player.playerState,
                latest_odds_to_win: player.oddsToWin,
                latest_tee_time: player.teeTime && player.teeTime > 0 ? new Date(player.teeTime).toISOString() : null,
                updated_at: new Date().toISOString(),
            }
        })

    return fieldData
}

const parsePlayers = (fieldData: any) => {
    if (!fieldData?.players) {
        return null
    }

    return fieldData.players.map((player: any) => ({
        id: player.id,
        first_name: player.firstName,
        last_name: player.lastName,
        country: player.country,
        country_code: player.countryFlag,
        icon_url: player.headshot.replace('${HEIGHT}', '64').replace('${WIDTH}', '64'),
        updated_at: new Date().toISOString(),
    }))
}

const parseTournament = (tournamentData: any) => {
    if (!tournamentData) {
        return null
    }

    return {
        id: tournamentData.id,
        name: tournamentData.name,
        season: tournamentData.season,
        status: tournamentData.tournamentStatus,
        end_date: tournamentData.endDate,
        updated_at: new Date().toISOString(),
    }
}

export async function GET(request: NextRequest, { params }: { params: { eventId: string } }) {
    const tournamentData = await getDataForTournament(params.eventId)

    let fieldData = parseLeaderboard(tournamentData.leaderboard)

    if (!fieldData) {
        fieldData = parseField(tournamentData.field)
    }

    const playerData = parsePlayers(tournamentData.field)

    const { error: playersError } = await supabase
        .from('pga_tour_players')
        .upsert(playerData, { onConflict: 'id', ignoreDuplicates: true })

    if (playersError) {
        throw playersError
    }

    if (fieldData) {
        const { error } = await supabase
            .from("pga_tour_tournament_fields_stroke_play")
            .upsert(fieldData, { onConflict: "tournament_id, player_id" })

        if (error) {
            throw error
        }
    }

    if (tournamentData.tournament?.tournamentStatus) {
        await supabase.from("pga_tour_tournaments").update({
            status: tournamentData.tournament?.tournamentStatus,
            // current_round: tournamentData.tournament?.currentRound,
            updated_at: new Date().toISOString(),
        }).match({ id: params.eventId })
    }

    return NextResponse.json({
        field: fieldData,
        players: playerData,
        raw: tournamentData,
    })
}