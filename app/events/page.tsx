'use client';

import { TournamentCard } from "@/components/TournamentCard";
import { Select } from "@/components/select";
import { useEffect, useState } from "react";
import { tournaments as __tournaments } from "./data";
import { useAuth } from "@clerk/nextjs";
import { supabaseClient } from "@/lib/supabase";
import { PGATourTournament } from "@/types/supabase-derived";


const filterTournamentsByYear = (year: string, t: PGATourTournament) => {
    const startDate = new Date(t.start_date)
    const currentYear = startDate.getFullYear()

    return currentYear === parseInt(year)
}

const filterTournamentsByTour = (tour: string, t: PGATourTournament) => {
    return tour === 'All' || tour === 'PGA'
}

const filterTournamentsByEvents = (events: string, t: PGATourTournament) => {
    const startDate = new Date(t.start_date)

    if (events === "Completed" && startDate.getTime() > Date.now()) {
        return false
    }

    if (events === "Upcoming" && startDate.getTime() > Date.now()) {
        return false
    }

    return true
}

export default function EventsPage() {
    const [pgaTourTournaments, setPgaTourTournaments] = useState<PGATourTournament[]>([])
    const [year, setYear] = useState("2024")
    const [tour, setTour] = useState("All")
    const [events, setEvents] = useState("Upcoming")
    const { getToken } = useAuth()

    useEffect(() => {
        (async () => {
            const client = await supabaseClient(getToken)

            const { data: tournamentData, error } = await client
                .from('pga_tour_tournaments')
                .select('*')

            if (error) {
                console.error(error)
            }

            setPgaTourTournaments(tournamentData!)
        })()
    }, [])

    const tournaments = pgaTourTournaments
        .filter((t) => filterTournamentsByYear(year, t))
        .filter((t) => filterTournamentsByTour(tour, t))
        .sort((a, b) => {
            const aDate = new Date(a.start_date)
            const bDate = new Date(b.start_date)

            return aDate.getTime() - bDate.getTime()
        })
        // .filter((t) => filterTournamentsByEvents(events, t))

    console.log(tournaments)

    return (
        <>
            <div className="sticky top-0 pt-3 pb-1 bg-white flex flex-row px-6">
                <Select label="Season" options={["2023", "2024", "2025"]} defaultValue="2024" onChange={e => setYear(e.target.value)} />
                <Select label="Tour" options={["All", "PGA", "LIV"]} defaultValue="All" onChange={e => setTour(e.target.value)} />
                <Select label="Events" options={["All", "Completed", "Upcoming"]} defaultValue="Upcoming" onChange={e => setEvents(e.target.value)}  />
            </div>
            <div className="mx-6 pb-3">
                {tournaments.map((t: PGATourTournament) => {
                    return <TournamentCard tournament={t} key={`events-${t.id}`}></TournamentCard>
                })}
            </div>
        </>
    )
}