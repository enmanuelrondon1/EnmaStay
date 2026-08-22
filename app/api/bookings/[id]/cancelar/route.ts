// app/api/bookings/[id]/cancelar/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cancelBooking } from "@/lib/cancel-booking";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Debes iniciar sesión" }, { status: 401 });
  }

  const { id } = await params;

  const booking = await prisma.booking.findUnique({ where: { id } });

  if (!booking || booking.userId !== session.user.id) {
    return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
  }

  if (booking.checkIn < new Date()) {
    return NextResponse.json(
      { error: "No se puede cancelar una reserva que ya comenzó" },
      { status: 400 }
    );
  }

  try {
    await cancelBooking(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error al cancelar la reserva" }, { status: 500 });
  }
}