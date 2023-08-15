"use client";

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import { OrderColumn, OrderColumns } from './Columns'
import { useParams, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

interface OrderClientProps {
  data: OrderColumn[]
}

const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  const router = useRouter()
  const params = useParams()

  return (
    <>
      <div className='flex items-center justify-between w-full'>
        <Heading title={`Orders (${(data?.length)})`} description='Manage your orders.' />
      </div>
      <Separator />
      <DataTable columns={OrderColumns} data={data} filter='prodcuts' />
    </>
  )
}

export default OrderClient