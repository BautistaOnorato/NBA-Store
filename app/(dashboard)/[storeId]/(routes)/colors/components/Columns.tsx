"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./CellAction"
import ColorCircle from "@/components/ui/color-circle"

export type ColorColumn = {
  id: string
  name: string
  value: string
  createdAt: string
}

export const ColorColumns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-4">
        <span>{row.original.value}</span>
        <ColorCircle value={row.original.value} className="h-6 w-6 p-0" />
      </div>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },

]
