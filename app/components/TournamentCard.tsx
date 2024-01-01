import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";


export type TournamentDetails = {
    tournamentName: string;
    tournamentLogo: string;
    date: string;
    city: string;
    stateCode: string;
    country: string;
    countryCode: string;
    tour: string;
    startDate: number;
    [key: string]: any;
}

export type TournamentCardProps = {
    tournament: TournamentDetails;
    onClick: () => void;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, onClick }) => {
    const location = tournament.countryCode === "USA" ? 
        `${tournament.city}, ${tournament.stateCode}` :
        `${tournament.city}, ${tournament.country}`;

    return (
        <a href="#" className="flex flex-row items-center bg-white border border-gray-200 rounded-lg shadow md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            <img className="object-cover w-full rounded-full p-2 h-24 w-24 md:h-36 md:w-36" src={tournament.tournamentLogo} alt="" />
            <div className="flex flex-col justify-between p-2 leading-normal">
                <h5 className="mb-1 text-sm md:text-lg font-bold tracking-tight text-gray-900 dark:text-white">{tournament.tournamentName}</h5>
                <p className="mb-1 text-xs md:text-md font-normal text-gray-700 dark:text-gray-400">{tournament.date}<br/>{location}</p>
            </div>
        </a>
    );

     {/* // return (
    //     <Card onClick={onClick}>
    //         <CardHeader>
    //             {tournament.tournamentName}
    //         </CardHeader>
    //         <CardContent>
    //             <img src={tournament.tournamentLogo} alt="" width={64} height={64} />
    //             <div>{tournament.date}</div>
    //             <div>{location}</div>
    //         </CardContent>
    //     </Card>
    // ); */}
};
