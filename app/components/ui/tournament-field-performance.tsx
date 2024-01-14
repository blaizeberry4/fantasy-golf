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
    initialState: {
        columnVisibility: {
            isMe: false,
            competitorImageUrls: false,
        }
    }
  })
 
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="bg-black text-white text-xs text-center">
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
                    row.getValue('isMe') ? 'bg-purple-200 hover:bg-purple-200' 
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
                    } text-center`}>
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
    competitorImageUrls: string[],
    isMe: boolean,
    selectionCount?: number | null,
    subRows: TournamentPerformance[],
}

const columnHelper = createColumnHelper<TournamentPerformance>()

const columnDef: ColumnDef<TournamentPerformance, any>[] = [
    columnHelper.accessor(row => row.currentPosition, {
        id: 'currentPosition',
        header: 'POS',
        cell: ({ row }) => row.original.currentPosition,
    }),
    columnHelper.accessor(row => row.displayName, {
        id: 'displayName',
        header: 'PLAYER',
        cell: ({ row, getValue }) => (
            <div className="flex flex-col">
                <div className="flex flex-row justify-around">
                    <div className="flex flex-col justify-center">
                        <Image className="rounded-full object-center" alt={row.original.displayName} src={row.original.competitorImageUrls[0] || '/transparent.png'} height={16} width={16} />
                        <Image className="rounded-full object-center" alt={row.original.displayName} src={row.original.competitorImageUrls[1] || '/transparent.png'} height={16} width={16} />
                    </div>
                    <Image className="rounded-full object-center" alt={row.original.displayName} src={row.original.iconUrl} height={32} width={32} />
                    <div className="flex flex-col justify-center">
                        <Image className="rounded-full object-center" alt={row.original.displayName} src={row.original.competitorImageUrls[2] || '/transparent.png'} height={16} width={16} />
                        <Image className="rounded-full object-center" alt={row.original.displayName} src={row.original.competitorImageUrls[3] || '/transparent.png'} height={16} width={16} />
                    </div>
                </div>
                <div className="flex justify-center">
                    <p className="text-center">{getValue()}</p>
                </div>
            </div>
        ),
        size: 64
    }),
    columnHelper.accessor(row => row.cumulativeScore, {
        id: 'cumulativeScore',
        header: 'CUM',
        cell: ({ row }) => row.original.cumulativeScore,
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
    columnHelper.accessor(row => row.round1Score, {
        id: 'round1Score',
        header: 'R1',
        cell: ({ row }) => row.original.round1Score,
    }),
    columnHelper.accessor(row => row.round2Score, {
        id: 'round2Score',
        header: 'R2',
        cell: ({ row }) => row.original.round2Score,
    }),
    columnHelper.accessor(row => row.round3Score, {
        id: 'round3Score',
        header: 'R3',
        cell: ({ row }) => row.original.round3Score,
    }),
    columnHelper.accessor(row => row.round3Score, {
        id: 'round4Score',
        header: 'R4',
        cell: ({ row }) => row.original.round4Score,
    }),
    columnHelper.accessor(row => row.isMe, {
        id: 'isMe',
        header: '',
        enableHiding: true,
    }),
    columnHelper.accessor(row => row.selectionCount, {
        id: 'competitorImageUrls',
        header: '',
        enableHiding: true
    }),
]

export type TournamentFieldPerformanceProps = {
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
}: TournamentFieldPerformanceProps): TournamentPerformance[] => {
    const userPicks = picks.filter(pick => pick.user_id === userId)

    const data = field.map((pick) => {
        const playerFieldEntry = field.find((player) => player.player_id === pick?.player_id)!

        return {
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
            competitorImageUrls: picks.filter(innerPick => pick.player_id === innerPick.player_id && innerPick.user_id !== userId)
                .map(pick => pick.user_image_url),
            isMe: userPicks.map(p => p.player_id).includes(pick.player_id),
            selectionCount: picks.filter(innerPick => pick.player_id === innerPick.player_id).length,
            subRows: [],
        }
    }).sort((a, b) => (parseScore(a.cumulativeScore!) || 1000) - (parseScore(b.cumulativeScore!) || 1000))

    return data
}

export default function TournamentFieldPerformance(props: TournamentFieldPerformanceProps) {
    return <DataTable columns={columnDef} data={present(props)} getSubRows={row => row.subRows}/>
}
