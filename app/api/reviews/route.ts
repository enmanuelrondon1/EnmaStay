// app/api/reviews/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Debes iniciar sesión" }, { status: 401 });
  }

  try {
    const { bookingId, rating, comment } = await req.json();

    if (!bookingId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { review: true },
    });

    if (!booking || booking.userId !== session.user.id) {
      return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
    }

    if (booking.status !== "CONFIRMED") {
      return NextResponse.json(
        { error: "Solo puedes reseñar reservas confirmadas" },
        { status: 400 }
      );
    }

    if (booking.checkIn > new Date()) {
      return NextResponse.json(
        { error: "Solo puedes reseñar después de tu estadía" },
        { status: 400 }
      );
    }

    if (booking.review) {
      return NextResponse.json(
        { error: "Ya dejaste una reseña para esta reserva" },
        { status: 409 }
      );
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment: comment || null,
        userId: session.user.id,
        propertyId: booking.propertyId,
        bookingId: booking.id,
      },
    });

    return NextResponse.json({ id: review.id }, { status: 201 });
  } catch (error) {
    console.error("Error al crear reseña:", error);
    return NextResponse.json({ error: "Error al crear la reseña" }, { status: 500 });
  }
}