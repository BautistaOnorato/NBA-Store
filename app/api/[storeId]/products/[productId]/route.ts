import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { productId: string } }) {
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const product = await prismadb.product.findFirst({
      where: {
        id: params.productId
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
        team: true
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log("PRODUCT_GET", error);
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { productId: string, storeId: string } }) {
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

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
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

    await prismadb.product.update({
      where: {
        id: params.productId
      },
      data: {
        storeId: params.storeId,
        name,
        price,
        description, 
        categoryId,
        colorId,
        sizeId,
        teamId,
        isFeatured,
        isArchived,
        isRetro,
        images: {
          deleteMany: {}
        },
      }
    })

    const product = await prismadb.product.update({
      where: {
        id: params.productId
      },
      data: {
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image)
            ]
          }
        }
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log("PRODUCT_PATCH", error);
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { productId: string, storeId: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
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

    const product = await prismadb.product.delete({
      where: {
        id: params.productId
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log("PRODUCT_DELETE", error);
    return new NextResponse("Internal error", { status: 500 })
  }
}