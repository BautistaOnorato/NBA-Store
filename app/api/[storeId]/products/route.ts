import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params } : { params: { storeId: string } }) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { 
      name,
      images,
      price,
      categoryId,
      colorId,
      sizeId,
      teamId,
      isFeatured,
      isArchived,
      isRetro,
      description, 
    } = body

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 })
    }

    if (!description) {
      return new NextResponse("Description is required", { status: 400 })
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 })
    }

    if (!colorId) {
      return new NextResponse("Color id is required", { status: 400 })
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 })
    }

    if (!sizeId) {
      return new NextResponse("Size id is required", { status: 400 })
    }

    if (!teamId) {
      return new NextResponse("Team id is required", { status: 400 })
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 })
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId
      }
    })

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        description, 
        storeId: params.storeId,
        isFeatured,
        isArchived,
        isRetro,
        categoryId,
        colorId,
        sizeId,
        teamId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)]
          }
        },
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log("PRODUCT_POST", error);
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function GET(req: Request, { params } : { params: { storeId: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const teamId = searchParams.get("teamId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const isFeatured = searchParams.get("isFeatured");
    const isRetro = searchParams.get("isRetro");

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 })
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        teamId,
        isRetro: isRetro ? true : undefined,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
        team: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.log("PRODUCTS_GET", error);
    return new NextResponse("Internal error", { status: 500 })
  }
}