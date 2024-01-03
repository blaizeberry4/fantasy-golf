import * as dotenv from "dotenv"
dotenv.config({ path: '.env.local' })

import { tournaments } from '@/events/data'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

import { Cheerio, Element, load as loadHTML } from 'cheerio'
import slugify from 'slugify'
import { parse as parseDate } from 'date-fns'


type PGATourTournamentInsert = Database['public']['Tables']['pga_tour_tournaments']['Insert']


const client = new SupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

const seedTournaments = async () => {
    const tournamentData = tournaments.map(t => {
        let startDate;
        let endDate;
        try {
            startDate = new Date(t.startDate).toISOString()

            endDate = parseDate(
                t.dateAccessibilityText.split(' through ')[1] + ' ' + new Date(t.startDate).getFullYear().toString(),
                'MMMM do yyyy',
                new Date())
            .toISOString().slice(0, 10)
        } catch (e) {
            console.error(e)
            console.log(t)
            throw e
        }

        return {
            id: t.id,
            city: t.city,
            start_date: startDate,
            planned_end_date: parseDate(
                t.dateAccessibilityText.split(' through ')[1] + ' ' + new Date(t.startDate).getFullYear().toString(),
                'MMMM do yyyy',
                new Date())
            .toISOString().slice(0, 10),
            planned_start_date: startDate.slice(0, 10),
            planned_dates: t.date,
            planned_dates_accessibility: t.dateAccessibilityText as string,
            name: t.tournamentName,
            country: t.country,
            country_code: t.countryCode,
            state: t.state,
            state_code: t.stateCode,
            course_name: t.courseName as string,
            logo: t.tournamentLogo,
            purse: t.purse,
            season: new Date(t.startDate).getFullYear().toString(),
            status: t.status,
            raw_json: t,
        }
    }) as PGATourTournamentInsert[]

    const { data, error } = await client.from('pga_tour_tournaments').insert(tournamentData)

    if (error) {
        console.log('Error on write')
        console.error(error)
        throw error
    }

    return data
}

const parsePlayers = (fieldData: any) => {
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

const seedFieldsForTournaments = async () => {
    for (const tournament of tournaments) {
        const season = new Date(tournament.startDate).getFullYear().toString()

        if (season === '2022') {
            continue
        }

        const tournamentUrl = `https://www.pgatour.com/tournaments/${season}/${slugify(tournament.tournamentName).toLowerCase()}/${tournament.id}`
        console.log(tournamentUrl)
        const rawData = await getFieldForTournament(tournamentUrl)

        if (!rawData.leaderboard) { continue }

        const fieldData = rawData.leaderboard?.tournamentStatus === 'NOT_STARTED' ?
            parseField(rawData.field) :
            parseLeaderboard(rawData.leaderboard);
        const players = parsePlayers(rawData.field)
        

        if (!fieldData) {
            console.log(`No field data for ${tournamentUrl}`)
            continue
        }

        const { error: playersError } = await client.from('pga_tour_players').upsert(players, { onConflict: 'id', ignoreDuplicates: true })

        if (playersError) {
            throw playersError
        }

        const { error } = await client.from('pga_tour_tournament_fields_stroke_play').insert(fieldData)

        if (error) {
            if (error.code === '23503') {
                console.log(`Skipping due to unregistered players: ${tournamentUrl}`)
                continue
            } else {
                throw error
            }
        }

        await delay(1000)
    }
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

    const fieldData = leaderboardData.players.filter((player: any) => player.__typename === 'PlayerRowV2').map((player: any) => {
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
            updated_at: new Date().toISOString(),
        }
    })

    return fieldData
}

const getFieldForTournament = async (tournamentUrl: string) => {
    const fieldData = await fetch(`${tournamentUrl}/field`).then(r => r.text())

    const $ = loadHTML(fieldData)

    const nextDataEl = $('#__NEXT_DATA__') as Cheerio<Element>
    const props = nextDataEl[0]?.children[0] as unknown as Text | undefined 
    const parsed = props ? JSON.parse( props.data ) : undefined

    return parsed.props.pageProps
}

const seedUsers = async () => {
    const { data, error } = await client.from('users').insert([
        {
            id: 'user_2aCXDaH4NMzieTqT0siREdmLXWR',
            email: 'blaizeberry@gmail.com',
            first_name: 'Blaize',
            last_name: 'Berry',
            image_url: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yYUNYRFpsNHRvc1FZaVlnQUdXazM2VDNXRmcifQ?width=160',
            created_at: '2022-12-25T00:00:00.000Z',
            updated_at: new Date().toISOString(),
        },
        {
            id: 'user_2aPNQXCgvFB6Np2742CMxpcC87a',
            email: 'shrewsburyj@gmail.com',
            first_name: 'JD',
            last_name: 'Shrewsbury',
            image_url: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yYVBOUWRQSEVlbG1mVVlOdEZtalF4bFNPb2gifQ?width=160',
            created_at: '2022-12-25T00:00:00.000Z',
            updated_at: new Date().toISOString(),
        },
        {
            id: 'user_2aPJHuukQ8QxZgddpkVOXsrZMKf',
            email: 'bradley.obrect@gmail.com',
            first_name: 'Brad',
            last_name: 'Obrect',
            image_url: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yYVBKSTBpYTBPeWVpY2NMWTh3TkxleGdKejcifQ?width=160',
            created_at: '2022-12-25T00:00:00.000Z',
            updated_at: new Date().toISOString(),
        },
        {
            id: 'user_2aPJLjr3J6tuOoUFLS4yX3IL15s',
            email: 'petersbuschbacher@gmail.com',
            first_name: 'Pete',
            last_name: 'Buschbacher',
            image_url: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yYVBKTGpmaDM5YWROb3VmUXlnSEFERFZsYm0ifQ?width=160',
            created_at: '2022-12-25T00:00:00.000Z',
            updated_at: new Date().toISOString(),
        },
        {
            id: 'user_2aPJQ5hivfMtQUSyTeLVPvhwmJ2',
            email: 'awesleyheller@gmail.com',
            first_name: 'Alex',
            last_name: 'Heller',
            image_url: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJhUFFOWnFjM1RDbkhlRU1PV2cyTUtNV1lKMCJ9?width=160',
            created_at: '2022-12-25T00:00:00.000Z',
            updated_at: new Date().toISOString(),
        },
    ])

    if (error) {
        throw error
    }

    return data
}

async function main() {
    await seedUsers()
    console.log('Seeded users')
    await seedTournaments()
    console.log('Seeded tournaments')
    await seedFieldsForTournaments()
    console.log('Seeded fields')
}

main().then( () => process.exit(0) ).catch( (error) => {
    console.error(error)
    process.exit(1)
}   )