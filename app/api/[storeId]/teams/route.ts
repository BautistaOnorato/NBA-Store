import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params } : { params: { storeId: string } }) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { name, imageUrl, billboardId, primaryColorId, secondaryColorId } = body

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }

    if (!imageUrl) {
      return new NextResponse("Image url is required", { status: 400 })
    }

    if (!billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 })
    }

    if (!primaryColorId) {
      return new NextResponse("Primary color id is required", { status: 400 })
    }

    if (!secondaryColorId) {
      return new NextResponse("Secondary color id is required", { status: 400 })
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

    const team = await prismadb.team.create({
      data: {
        name,
        imageUrl,
        billboardId,
        primaryColorId,
        secondaryColorId,
        storeId: params.storeId
      }
    })

    return NextResponse.json(team)
  } catch (error) {
    console.log("TEAM_POST", error);
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function GET(req: Request, { params } : { params: { storeId: string } }) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 })
    }

    const teams = await prismadb.team.findMany({
      where: {
        storeId: params.storeId
      }
    })

    return NextResponse.json(teams)
  } catch (error) {
    console.log("TEAM_GET", error);
    return new NextResponse("Internal error", { status: 500 })
  }
}