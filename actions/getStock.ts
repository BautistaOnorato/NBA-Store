import prismadb from "@/lib/prismadb"

export const getStock = async (storeId: string) => {
  const stockCount = await prismadb.product.count({
    where: {
      storeId: storeId,
      isArchived: false
    }
  })

  return stockCount;
}