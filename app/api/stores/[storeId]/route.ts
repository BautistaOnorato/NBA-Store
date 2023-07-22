import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const store = await prismadb.store.findFirst({
      where: {
        userId,
        id: params.storeId
      }
    })

    return NextResponse.json(store)
  } catch (error) {
    console.log("STORE_GET", error);
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { name } = body

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const store = await prismadb.store.update({
      where: {
        userId,
        id: params.storeId
      },
      data: {
        name
      }
    })

    return NextResponse.json(store)
  } catch (error) {
    console.log("STORE_PATCH", error);
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth()


    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const store = await prismadb.store.delete({
      where: {
        userId,
        id: params.storeId
      }
    })

    return NextResponse.json(store)
  } catch (error) {
    console.log("STORE_DELETE", error);
    return new NextResponse("Internal error", { status: 500 })
  }
}