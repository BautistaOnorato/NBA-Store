"use client";

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import { ProductColumn, ProductColumns } from './Columns'
import { useParams, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

interface ProductClientProps {
  data: ProductColumn[]
}

const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
  const router = useRouter()
  const params = useParams()

  const handleClick = () => {
    router.push(`/${params.storeId}/products/new`)
  }

  return (
    <>
      <div className='flex items-center justify-between w-full'>
        <Heading title={`Products (${(data?.length)})`} description='Manage your products.' />
        <Button onClick={handleClick}>
          <Plus className='mr-2 h-4 w-4' />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={ProductColumns} data={data} filter='name' />
    </>
  )
}

export default ProductClient