import { PGATourTournament } from "@/types/supabase-derived";
import Image from "next/image";


export default function TournamentBanner(props: { tournamentDetails: PGATourTournament }) {
    return (
        <div className="flex flex-row w-full items-center border border-gray-200">
            <Image
                className="object-cover rounded-full ml-4 p-2 h-20 w-20 md:h-36 md:w-36"
                src={props.tournamentDetails.logo!} alt="" height={48} width={48} 
            />
            <div className="flex flex-col justify-between p-2 leading-normal">
                <h5 className="mb-1 text-sm md:text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                    {props.tournamentDetails.name}
                </h5>
                <p className="mb-1 text-xs md:text-md font-normal text-gray-700 dark:text-gray-400">
                    {props.tournamentDetails.planned_dates!}
                    <br/>
                    {props.tournamentDetails.course_name}
                </p>
            </div>
        </div>
    )
}