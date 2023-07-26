import React from 'react'
import TeamForm from './components/TeamForm'
import prismadb from '@/lib/prismadb'

const TeamFormPage = async ({ params }: { params: { teamId: string, storeId: string } }) => {
  const team = await prismadb.team.findUnique({
    where: {
      id: params.teamId
    }
  })

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      label: "asc"
    }
  })

  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId
    }, 
    orderBy: {
      name: "asc"
    }
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TeamForm initialData={team} billboards={billboards} colors={colors} />
      </div>
    </div>
  )
}

export default TeamFormPage