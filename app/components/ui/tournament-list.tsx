'use client';

import { TournamentCard } from "@/components/tournament-card";
import { Select } from "@/components/select";
import { useState } from "react";
import { PGATourTournament } from "@/types/supabase-derived";
import { ChevronDown, ChevronRight } from "lucide-react";
import { format } from "date-fns";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "./button";


const filterTournamentsByYear = (year: string, t: PGATourTournament) => {
    const startDate = new Date(t.start_date)
    const currentYear = startDate.getFullYear()

    return currentYear === parseInt(year)
}

const filterTournamentsByTour = (tour: string, t: PGATourTournament) => {
    return tour === 'All' || tour === 'PGA'
}

const filterTournamentsByEvents = (events: string, t: PGATourTournament) => {
    const endDate = new Date(t.planned_end_date!)

    if (events === "Completed") {
        return endDate.getTime() < Date.now()
    }

    if (events === "Upcoming") {
        return endDate.getTime() >= Date.now()
    }

    return true
}

const SEGMENTLESS_SYMBOL = 'No Segment'

const present = ({ tournaments, year, tour, events }: {
    tournaments: PGATourTournament[],
    year: string,
    tour: string,
    events: string
}) => {
    return tournaments
        .filter((t) => filterTournamentsByYear(year, t))
        .filter((t) => filterTournamentsByTour(tour, t))
        .filter((t) => filterTournamentsByEvents(events, t))
        .sort((a, b) => {
            const aDate = new Date(a.start_date)
            const bDate = new Date(b.start_date)

            return aDate.getTime() - bDate.getTime()
        })
        .reduce((acc, t) => ({
            ...acc,
            [t.segment || SEGMENTLESS_SYMBOL]: [...(acc[t.segment || SEGMENTLESS_SYMBOL] || []), t]
        }), {} as Record<string, PGATourTournament[]>)
}

export default function FilterableTournamentList({ tournaments }: { tournaments: PGATourTournament[] }) {
    const [year, setYear] = useState("2024")
    const [tour, setTour] = useState("All")
    const [events, setEvents] = useState("All")

    const segments = Object.entries(present({ tournaments, year, tour, events }))
        .filter(([segment]) => segment !== SEGMENTLESS_SYMBOL)
        .map(([segment, tournaments]) => {
            return {
                segment,
                tournaments,
                datesDisplay: format(new Date(tournaments[0].planned_start_date!), 'MMM d') + ' - ' + format(new Date(tournaments[tournaments.length - 1].planned_end_date!), 'MMM d')
            }
        })

    return (
        <>
            <div className="sticky top-0 pt-3 pb-1 bg-white flex flex-row px-6">
                <Select label="Season" options={["2023", "2024", "2025"]} defaultValue="2024" onChange={e => setYear(e.target.value)} />
                <Select label="Tour" options={["All", "PGA", "LIV"]} defaultValue="All" onChange={e => setTour(e.target.value)} />
                <Select label="Events" options={["All", "Completed", "Upcoming"]} defaultValue="All" onChange={e => setEvents(e.target.value)}  />
            </div>
            <div className="mx-6 pb-3">
                {segments
                    .map(({ segment, tournaments, datesDisplay }) => {
                        return <Collapsible defaultOpen={ segment === '1'} className="group" key={`collapsible-segment-${segment}`}>
                            <CollapsibleTrigger >
                                <div className="flex flex-row py-2 px-4 justify-between items-center w-[90vw] bg-purple-600 rounded-full text-white mb-2">
                                    <div className="flex flex-row">
                                        <ChevronRight className="group-data-[state=open]:hidden" />
                                        <ChevronDown className="group-data-[state=closed]:hidden" />
                                        <h2 className='ml-2 text-md'>{`Segment ${segment}`}</h2>
                                    </div>
                                    <div>
                                        <p className='text-xs'>{`${tournaments.length} events`}<br/>{datesDisplay}</p>
                                    </div>
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className="grid grid-cols-1 gap-2 mb-2 max-h-[55vh] overflow-scroll">
                                    {tournaments.map((tournament, index) => {
                                        return <TournamentCard tournament={tournament} key={`tournament-${index}`} />
                                    })}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    })
                }
            </div>
        </>
    )
}