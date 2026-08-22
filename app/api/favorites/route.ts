// app/api/favorites/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Debes iniciar sesión" }, { status: 401 });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    select: { propertyId: true },
  });

  return NextResponse.json({ propertyIds: favorites.map((f) => f.propertyId) });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Debes iniciar sesión" }, { status: 401 });
  }

  const { propertyId } = await req.json();
  if (!propertyId) {
    return NextResponse.json({ error: "Falta propertyId" }, { status: 400 });
  }

  await prisma.favorite.upsert({
    where: { userId_propertyId: { userId: session.user.id, propertyId } },
    create: { userId: session.user.id, propertyId },
    update: {},
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}