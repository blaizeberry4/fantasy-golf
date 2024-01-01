'use client';

import { TournamentCard, TournamentDetails } from "@/components/TournamentCard";
import { Select } from "@/components/select";
import { useState } from "react";
import { tournaments as __tournaments } from "./data";

const filterTournamentsByYear = (year: string, t: TournamentDetails) => {
    const startDate = new Date(t.startDate)
    const currentYear = startDate.getFullYear()

    return currentYear === parseInt(year)
}

const filterTournamentsByTour = (tour: string, t: TournamentDetails) => {
    return tour === 'All' || t.tour === tour
}

const filterTournamentsByEvents = (events: string, t: TournamentDetails) => {
    const startDate = new Date(t.startDate)

    if (events === "Completed" && startDate.getTime() > Date.now()) {
        return false
    }

    if (events === "Upcoming" && startDate.getTime() > Date.now()) {
        return false
    }

    return true
}

const handleSelectTournament = () => {
    console.log('handleSelectTournament')
}

export default function EventsPage() {
    const [year, setYear] = useState("2024")
    const [tour, setTour] = useState("All")
    const [events, setEvents] = useState("Upcoming")

    const tournaments = __tournaments
        .filter((t: TournamentDetails) => filterTournamentsByYear(year, t))
        .filter((t: TournamentDetails) => filterTournamentsByTour(tour, t))
        // .filter((t: TournamentDetails) => filterTournamentsByEvents(events, t))

    console.log(tournaments)

    return (
        <>
            <div className="flex flex-row mx-6 my-2">
                <Select label="Season" options={["2023", "2024", "2025"]} defaultValue="2024" onChange={e => setYear(e.target.value)} />
                <Select label="Tour" options={["All", "PGA", "LIV"]} defaultValue="All" onChange={e => setTour(e.target.value)} />
                <Select label="Events" options={["All", "Completed", "Upcoming"]} defaultValue="Upcoming" onChange={e => setEvents(e.target.value)}  />
            </div>
            <div className="mx-6 my-2">
                {tournaments.map((t: TournamentDetails) => {
                    return <TournamentCard tournament={t} onClick={handleSelectTournament} key={`events-${t.id}`}></TournamentCard>
                })}
            </div>
        </>
    )
}