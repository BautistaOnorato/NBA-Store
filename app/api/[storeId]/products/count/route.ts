import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params } : { params: { storeId: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const teamId = searchParams.get("teamId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const isRetro = searchParams.get("isRetro");

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 })
    }

    const quantity = await prismadb.product.count({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        teamId,
        isRetro: isRetro ? true : undefined,
        isArchived: false
      }
    })

    return NextResponse.json(quantity)
  } catch (error) {
    console.log("PRODUCTS_GET", error);
    return new NextResponse("Internal error", { status: 500 })
  }
}