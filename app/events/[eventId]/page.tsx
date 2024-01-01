'use client';

import { useState } from "react";
import { fieldData } from "./data";


export default function EventPage() {
    const [picks, setPicks] = useState<(Record<string, any> | null)[]>([null, null, null, null])
    const [search, setSearch] = useState("")

    const field = fieldData[0].data.field.players

    return (
        <div>
            <div className="grid grid-cols-2 gap-2">
                { picks.map((pick, index) => (
                    <div className="flex flex-col items-center" key={`tournament-pick-${index}`}>
                        <img className="rounded-full" src={pick ? pick.headshot.replace("${HEIGHT}", '64').replace("${WIDTH}", '64') : '/unknown_person.png'} height={64} width={64} />
                        <p className="ml-2">{pick?.displayName ?? `Player ${index + 1}`}</p>
                    </div>
                ))}
            </div>
            <input
              type="text"
              id="helper-text"
              aria-describedby="helper-text-explanation"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Filter by player name"
            />
            <div className="mx-6 my-2 overflow-scroll">
                {field.map((player) => {
                    return <div className="flex flex-row border-gray-200 border-b items-center" key={`event-field-player-${player.id}`}>
                        <img src={player.headshot.replace("${HEIGHT}", '64').replace("${WIDTH}", '64')} />
                        <p className="ml-2">{player.displayName}</p>
                    </div>
                })}
            </div>
        </div>
    )
}