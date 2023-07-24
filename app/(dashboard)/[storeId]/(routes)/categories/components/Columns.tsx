"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./CellAction"

export type CategoryColumn = {
  id: string
  name: string
  billboard: string
  createdAt: string
}

export const CategoryColumns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
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
