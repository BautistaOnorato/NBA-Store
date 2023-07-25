"use client";

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import { SizeColumn, SizeColumns } from './Columns'
import { useParams, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

interface SizeClientProps {
  data: SizeColumn[]
}

const SizeClient: React.FC<SizeClientProps> = ({ data }) => {
  const router = useRouter()
  const params = useParams()

  const handleClick = () => {
    router.push(`/${params.storeId}/sizes/new`)
  }

  return (
    <>
      <div className='flex items-center justify-between w-full'>
        <Heading title={`Sizes (${(data?.length)})`} description='Manage your sizes.' />
        <Button onClick={handleClick}>
          <Plus className='mr-2 h-4 w-4' />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={SizeColumns} data={data} filter='name' />
    </>
  )
}

export default SizeClient