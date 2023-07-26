import React from 'react'
import ProductClient from './components/Client'
import prismadb from '@/lib/prismadb'
import { format } from "date-fns"
import { ProductColumn } from './components/Columns'
import { formatter } from '@/lib/utils'

const ProductPage = async ({ params }: { params: { storeId: string } }) => {

  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      team: true,
      category: true,
      size: true,
      color: true
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const formattedProducts: ProductColumn[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: formatter.format(product.price.toNumber()),
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    team: product.team.name,
    category: product.category.name,
    size: product.size.value,
    color: product.color.value,
    isRetro: product.isRetro,
    createdAt: format(product.createdAt, "MMMM do, yyyy")
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  )
}

export default ProductPage