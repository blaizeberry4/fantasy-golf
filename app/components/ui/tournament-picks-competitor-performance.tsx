'use client';

import { useState } from "react";
import {
    ColumnDef,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    ExpandedState,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Image from "next/image"

import { PGATourTournament, PGATourTournamentFieldStrokePlayEnriched, PGATourTournamentPickStrokePlayEnriched, User } from "@/types/supabase-derived";
import { parseScore, parseThru, presentScore } from "@/lib/scoring";

type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    getSubRows?: ((originalRow: TData, index: number) => TData[] | undefined) | undefined,
}

export function DataTable<TData, TValue>({
  columns,
  data,
  getSubRows
}: DataTableProps<TData, TValue>) {
    const [expanded, setExpanded] = useState<ExpandedState>({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSubRows: getSubRows,
    state: {
        expanded,
    },
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
  })
 
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="bg-black text-white">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={`${
                    row.getParentRow() ? 'bg-gray-200 hover:bg-gray-200' 
                        : row.getIsExpanded() ? 'bg-purple-600 hover:bg-purple-600'
                            : 'bg-white hover:bg-white'
                }`}
                onClick={row.getToggleExpandedHandler()}
                // data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className={`${
                        row.getParentRow() ? 'p-1 text-xs'
                            : row.getIsExpanded() ? 'p-4 text-sm text-white'
                                : 'p-4 text-sm'
                    } pl-4`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export type TournamentPicksUserProps = {
    field: PGATourTournamentFieldStrokePlayEnriched[],
    picks: PGATourTournamentPickStrokePlayEnriched[],
    onSlotClick: (slotIndex: number) => void,
}

type TournamentPerformance = {
    currentPosition: string,
    iconUrl: string,
    displayName: string,
    round1Score: string,
    shotRound1LowScore: boolean,
    round2Score: string,
    shotRound2LowScore: boolean,
    round3Score: string,
    shotRound3LowScore: boolean,
    round4Score: string,
    shotRound4LowScore: boolean,
    currentRound?: number | null,
    currentRoundScore: string | null,
    thru: string,
    cumulativeScore: string,
    totalScore: number | null,
    isAppUser: boolean,
    isMe: boolean,
    subRows: TournamentPerformance[],
}

const columnHelper = createColumnHelper<TournamentPerformance>()

const columnDef: ColumnDef<TournamentPerformance, any>[] = [
    columnHelper.accessor(row => row.currentPosition, {
        id: 'currentPosition',
        header: 'POS',
        cell: ({ row }) => row.original.currentPosition,
        size: 40,
        enableResizing: false
    }),
    // columnHelper.accessor(row => row.iconUrl, {
    //     id: 'iconUrl',
    //     header: '',
    //     cell: ({ row }) => <Image className="rounded-full" alt={row.original.displayName} src={row.original.iconUrl} height={32} width={32} />,
    // }),
    columnHelper.accessor(row => row.displayName, {
        id: 'displayName',
        header: 'Player',
        cell: ({ row, getValue }) => (
            <div className="flex flex-row items-center">
                <Image className="rounded-full mr-3" alt={row.original.displayName} src={row.original.iconUrl} height={32} width={32} />
                {getValue()}
            </div>
            // <div className="flex items-center">
            //     <button type='button' onClick={ row.getToggleExpandedHandler() }>
            //         <div className="flex flex-row items-center">
            //             <Image className="rounded-full mr-3" alt={row.original.displayName} src={row.original.iconUrl} height={32} width={32} />
            //             {getValue()}
            //         </div>
            //     </button>
            // </div>
        ), //row.original.displayName,
    }),
    // columnHelper.accessor(row => row.round1Score, {
    //     id: 'round1Score',
    //     header: 'R1',
    //     cell: ({ row }) => row.original.round1Score,
    // }),
    // columnHelper.accessor(row => row.round2Score, {
    //     id: 'round2Score',
    //     header: 'R2',
    //     cell: ({ row }) => row.original.round2Score,
    // }),
    // columnHelper.accessor(row => row.round3Score, {
    //     id: 'round3Score',
    //     header: 'R3',
    //     cell: ({ row }) => row.original.round3Score,
    // }),
    columnHelper.accessor(row => row.cumulativeScore, {
        id: 'cumulativeScore',
        header: 'CUM',
        cell: ({ row }) => row.original.cumulativeScore,
    }),
    columnHelper.accessor(row => row.totalScore, {
        id: 'totalScore',
        header: 'PTS',
        cell: ({ row }) => row.original.totalScore,
    }),
    columnHelper.accessor(row => row.thru, {
        id: 'round_score',
        header: 'TODAY',
        cell: ({ row }) => row.original.currentRoundScore,
    }),
    columnHelper.accessor(row => row.thru, {
        id: 'thru',
        header: 'THRU',
        cell: ({ row }) => row.original.thru,
    }),
]

export type TournamentPicksCompetitorPerformanceProps = {
    competitors: User[],
    picks: PGATourTournamentPickStrokePlayEnriched[],
    field: PGATourTournamentFieldStrokePlayEnriched[],
    tournament: PGATourTournament,
    userId: string,
}

const present = ({
    competitors,
    picks,
    field,
    tournament,
    userId,
}: TournamentPicksCompetitorPerformanceProps): TournamentPerformance[] => {
    const competitorPerformance = competitors.reduce<Record<string, TournamentPerformance>>((acc, competitor) => {
        const newPerformance: TournamentPerformance = {
            currentPosition: '1',
            iconUrl: competitor.image_url!,
            displayName: competitor.first_name + ' ' + competitor.last_name.slice(0, 1) + '.',
            round1Score: '-',
            shotRound1LowScore: false,
            round2Score: '-',
            shotRound2LowScore: false,
            round3Score: '-',
            shotRound3LowScore: false,
            round4Score: '-',
            shotRound4LowScore: false,
            currentRound: null,
            currentRoundScore: null,
            thru: '-',
            cumulativeScore: '-',
            totalScore: 0,
            isAppUser: true,
            isMe: competitor.id === userId,
            subRows: [],
        };

        return {
            ...acc,
            [competitor.id]: newPerformance,
        };
    }, {});

    picks.forEach((pick) => {
        const playerFieldEntry = field.find((player) => player.player_id === pick?.player_id)!

        competitorPerformance[pick.user_id!].subRows.push({
            currentPosition: playerFieldEntry.current_position ?? '-',
            iconUrl: playerFieldEntry.player_icon_url ?? '/bph.webp',
            displayName: playerFieldEntry.player_first_name!.slice(0, 1) + '. ' + playerFieldEntry.player_last_name,
            round1Score: playerFieldEntry.round_1_score ?? '-',
            shotRound1LowScore: playerFieldEntry.scoring_shot_low_round_1_score ?? false,
            round2Score: playerFieldEntry.round_2_score ?? '-',
            shotRound2LowScore: playerFieldEntry.scoring_shot_low_round_2_score ?? false,
            round3Score: playerFieldEntry.round_3_score ?? '-',
            shotRound3LowScore: playerFieldEntry.scoring_shot_low_round_3_score ?? false,
            round4Score: playerFieldEntry.round_4_score ?? '-',
            shotRound4LowScore: playerFieldEntry.scoring_shot_low_round_4_score ?? false,
            currentRound: playerFieldEntry.current_round,
            currentRoundScore: playerFieldEntry.current_round_score || 'E',
            thru: (playerFieldEntry.current_thru || new Date(playerFieldEntry.latest_tee_time!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) ?? '-',
            cumulativeScore: playerFieldEntry.current_total_score ?? '-',
            totalScore: playerFieldEntry.scoring_total_score,
            isAppUser: false,
            isMe: false,
            subRows: [],
        })
    })

    Object.values(competitorPerformance).forEach(performance => {
        performance.round1Score = performance.subRows.reduce((acc, row) => acc + (parseScore(row.round1Score) || 0), 0).toString()
        performance.round2Score = performance.subRows.reduce((acc, row) => acc + (parseScore(row.round2Score) || 0), 0).toString()
        performance.round3Score = performance.subRows.reduce((acc, row) => acc + (parseScore(row.round3Score) || 0), 0).toString()
        performance.round4Score = performance.subRows.reduce((acc, row) => acc + (parseScore(row.round4Score) || 0), 0).toString()
        performance.shotRound1LowScore = performance.subRows.reduce((acc, row) => acc || row.shotRound1LowScore, false)
        performance.shotRound2LowScore = performance.subRows.reduce((acc, row) => acc || row.shotRound2LowScore, false)
        performance.shotRound3LowScore = performance.subRows.reduce((acc, row) => acc || row.shotRound3LowScore, false)
        performance.shotRound4LowScore = performance.subRows.reduce((acc, row) => acc || row.shotRound4LowScore, false)
        performance.cumulativeScore = performance.subRows.reduce((acc, row) => acc + (parseScore(row.cumulativeScore) || 0), 0).toString()
        performance.totalScore = performance.subRows.reduce((acc, row) => acc + (row.totalScore || 0), 0)
        performance.subRows = performance.subRows.sort((a, b) => b.totalScore! - a.totalScore!)

        const thru = performance.subRows.reduce((acc, row) => Math.min(acc, parseThru(row.thru)), 18)
        performance.thru = thru < 18 ? thru.toString() : 'F'
        
        performance.currentRoundScore = presentScore(performance.subRows.reduce((acc, row) => acc + (parseScore(row.currentRoundScore) || 0), 0))
    })

    const totalScores = Object.values(competitorPerformance).map((performance) => performance.totalScore).sort((a, b) => b! - a!)

    Object.values(competitorPerformance).forEach(performance => {
        const positionNumberString = (totalScores.indexOf(performance.totalScore!) + 1).toString()
        const isTied = totalScores.filter(score => score === performance.totalScore!).length > 1
        performance.currentPosition = isTied ? 'T' + positionNumberString : positionNumberString
    })

    return Object.values(competitorPerformance).sort((a, b) => b.totalScore! - a.totalScore!)
}

export default function TournamentPicksCompetitorPerformance(props: TournamentPicksCompetitorPerformanceProps) {
    return <DataTable columns={columnDef} data={present(props)} getSubRows={row => row.subRows}/>
}
