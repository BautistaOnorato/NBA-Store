import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { teamId: string } }) {
  try {
    if (!params.teamId) {
      return new NextResponse("Team id is required", { status: 400 });
    }

    const team = await prismadb.team.findFirst({
      where: {
        id: params.teamId
      }
    })

    return NextResponse.json(team)
  } catch (error) {
    console.log("TEAM_GET", error);
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { teamId: string, storeId: string } }) {
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

    if (!params.teamId) {
      return new NextResponse("Team id is required", { status: 400 });
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

    const team = await prismadb.team.update({
      where: {
        id: params.teamId
      },
      data: {
        name,
        imageUrl,
        billboardId,
        primaryColorId,
        secondaryColorId
      }
    })

    return NextResponse.json(team)
  } catch (error) {
    console.log("TEAM_PATCH", error);
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { teamId: string, storeId: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.teamId) {
      return new NextResponse("Team id is required", { status: 400 });
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

    const team = await prismadb.team.delete({
      where: {
        id: params.teamId
      }
    })

    return NextResponse.json(team)
  } catch (error) {
    console.log("TEAM_DELETE", error);
    return new NextResponse("Internal error", { status: 500 })
  }
}