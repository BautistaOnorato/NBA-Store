"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./CellAction"
import ColorCircle from "@/components/ui/color-circle"
import { Color } from "@prisma/client"

export type TeamColumn = {
  id: string
  name: string
  primaryColor: Color
  secondaryColor: Color
  billboard: string
  createdAt: string
}

export const TeamColumns: ColumnDef<TeamColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "primaryColor",
    header: "Primary color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-4">
        <span>{row.original.primaryColor.name}</span>
        <ColorCircle value={row.original.primaryColor.value} className="h-6 w-6 p-0" />
      </div>
    )
  },
  {
    accessorKey: "secondaryColor",
    header: "Secondary color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-4">
        <span>{row.original.secondaryColor.name}</span>
        <ColorCircle value={row.original.secondaryColor.value} className="h-6 w-6 p-0" />
      </div>
    )
  },
  {
    accessorKey: "billboard",
    header: "Billboard",
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
