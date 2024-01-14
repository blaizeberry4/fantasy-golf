import React from 'react';

import { PGATourTournament } from '@/types/supabase-derived';


export type TournamentCardProps = {
    tournament: PGATourTournament;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
    const location = tournament.country_code === "USA" ? 
        `${tournament.city}, ${tournament.state_code}` :
        `${tournament.city}, ${tournament.country}`;

    return (
        <a href={`/events/${tournament.id}`} className="flex flex-row items-center bg-white border border-gray-200 rounded-lg shadow md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            <img className="object-cover rounded-full p-2 h-20 w-20 md:h-36 md:w-36" src={tournament.logo!} alt="" />
            <div className="flex flex-col justify-between p-2 leading-normal">
                <h5 className="mb-1 text-sm md:text-lg font-bold tracking-tight text-gray-900 dark:text-white">{tournament.name}</h5>
                <p className="mb-1 text-xs md:text-md font-normal text-gray-700 dark:text-gray-400">{tournament.planned_dates}<br/>{tournament.course_name}<br/>{location}</p>
            </div>
        </a>
    );
};
