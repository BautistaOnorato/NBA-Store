import React from 'react'
import TeamClient from './components/Client'
import prismadb from '@/lib/prismadb'
import { format } from "date-fns"
import { TeamColumn } from './components/Columns'

const TeamPage = async ({ params }: { params: { storeId: string } }) => {

  const teams = await prismadb.team.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      primaryColor: true,
      secondaryColor: true,
      billboard: true,
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const formattedTeams: TeamColumn[] = teams.map((team) => ({
    id: team.id,
    name: team.name,
    primaryColor: team.primaryColor,
    secondaryColor: team.secondaryColor,
    billboard: team.billboard.label,
    createdAt: format(team.createdAt, "MMMM do, yyyy")
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TeamClient data={formattedTeams} />
      </div>
    </div>
  )
}

export default TeamPage