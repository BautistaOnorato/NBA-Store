import React from 'react'
import ProductForm from './components/ProductForm'
import prismadb from '@/lib/prismadb'

const ProductFormPage = async ({ params }: { params: { productId: string, storeId: string } }) => {
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId
    },
    include: {
      images: true
    }
  })

  const teams = await prismadb.team.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      name: "asc"
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

  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId
    }, 
    orderBy: {
      name: "asc"
    }
  })

  const categories = await prismadb.category.findMany({
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
        <ProductForm initialData={product} teams={teams} colors={colors} sizes={sizes} categories={categories} />
      </div>
    </div>
  )
}

export default ProductFormPage