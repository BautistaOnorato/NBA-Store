import React from 'react'
import OrderClient from './components/Client'
import prismadb from '@/lib/prismadb'
import { format } from "date-fns"
import { OrderColumn } from './components/Columns'
import { formatter } from '@/lib/utils'

const OrderPage = async ({ params }: { params: { storeId: string } }) => {

  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const formattedOrders: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    isPaid: order.isPaid,
    phone: order.phone,
    address: order.address,
    totalPrice: formatter.format(order.orderItems.reduce((total, item) => {
      return total + Number(item.product.price)
    }, 0)),
    products: order.orderItems.map(item => item.product.name).join(", "),
    createdAt: format(order.createdAt, "MMMM do, yyyy")
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  )
}

export default OrderPage