// app/api/favorites/[propertyId]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Debes iniciar sesión" }, { status: 401 });
  }

  const { propertyId } = await params;

  await prisma.favorite.deleteMany({
    where: { userId: session.user.id, propertyId },
  });

  return NextResponse.json({ ok: true });
}