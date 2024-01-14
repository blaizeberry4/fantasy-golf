'use client';

import { TournamentCard } from "@/components/tournament-card";
import { Select } from "@/components/select";
import { useState } from "react";
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

const present = ({ tournaments, year, tour }: {
    tournaments: PGATourTournament[],
    year: string,
    tour: string
}) => {
    return tournaments
        .filter((t) => filterTournamentsByYear(year, t))
        .filter((t) => filterTournamentsByTour(tour, t))
        .sort((a, b) => {
            const aDate = new Date(a.start_date)
            const bDate = new Date(b.start_date)

            return aDate.getTime() - bDate.getTime()
        })
}

export default function FilterableTournamentList({ tournaments }: { tournaments: PGATourTournament[] }) {
    const [year, setYear] = useState("2024")
    const [tour, setTour] = useState("All")
    const [events, setEvents] = useState("Upcoming")

    return (
        <>
            <div className="sticky top-0 pt-3 pb-1 bg-white flex flex-row px-6">
                <Select label="Season" options={["2023", "2024", "2025"]} defaultValue="2024" onChange={e => setYear(e.target.value)} />
                <Select label="Tour" options={["All", "PGA", "LIV"]} defaultValue="All" onChange={e => setTour(e.target.value)} />
                <Select label="Events" options={["All", "Completed", "Upcoming"]} defaultValue="Upcoming" onChange={e => setEvents(e.target.value)}  />
            </div>
            <div className="mx-6 pb-3">
                {present({
                    tournaments,
                    year,
                    tour
                }).map((t: PGATourTournament) => {
                    return <TournamentCard tournament={t} key={`events-${t.id}`}></TournamentCard>
                })}
            </div>
        </>
    )
}