"use client";

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import { ColorColumn, ColorColumns } from './Columns'
import { useParams, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

interface ColorClientProps {
  data: ColorColumn[]
}

const ColorClient: React.FC<ColorClientProps> = ({ data }) => {
  const router = useRouter()
  const params = useParams()

  const handleClick = () => {
    router.push(`/${params.storeId}/colors/new`)
  }

  return (
    <>
      <div className='flex items-center justify-between w-full'>
        <Heading title={`Colors (${(data?.length)})`} description='Manage your colors.' />
        <Button onClick={handleClick}>
          <Plus className='mr-2 h-4 w-4' />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={ColorColumns} data={data} filter='name' />
    </>
  )
}

export default ColorClient