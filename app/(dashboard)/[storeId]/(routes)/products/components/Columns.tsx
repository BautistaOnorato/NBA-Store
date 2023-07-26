"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./CellAction"
import ColorCircle from "@/components/ui/color-circle"
import { Color } from "@prisma/client"

export type ProductColumn = {
  id: string
  name: string
  color: string
  price: string
  category: string
  team: string
  size: string
  createdAt: string
  isArchived: boolean
  isFeatured: boolean
  isRetro: boolean
}

export const ProductColumns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "team",
    header: "Team",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <ColorCircle value={row.original.color} className="h-6 w-6 p-0" />
    )
  },
  {
    accessorKey: "isRetro",
    header: "Retro",
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
