// app/api/reviews/[id]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Debes iniciar sesión" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { rating, comment } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Calificación inválida" }, { status: 400 });
    }

      const review = await prisma.review.findUnique({ where: { id } });

    if (!review) {
      return NextResponse.json({ error: "Reseña no encontrada" }, { status: 404 });
    }

    const isOwner = review.userId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await prisma.review.update({
      where: { id },
      data: { rating, comment: comment || null },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error al editar reseña:", error);
    return NextResponse.json({ error: "Error al editar la reseña" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Debes iniciar sesión" }, { status: 401 });
  }

  const { id } = await params;

   const review = await prisma.review.findUnique({ where: { id } });

  if (!review) {
    return NextResponse.json({ error: "Reseña no encontrada" }, { status: 404 });
  }

  const isOwner = review.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  await prisma.review.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}