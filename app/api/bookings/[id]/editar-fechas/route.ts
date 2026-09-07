// app/api/bookings/[id]/editar-fechas/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { editBookingDates } from "@/lib/edit-booking-dates";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Debes iniciar sesión" }, { status: 401 });
  }

  const { id } = await params;
  const { checkIn, checkOut } = await req.json();

  if (!checkIn || !checkOut) {
    return NextResponse.json({ error: "Faltan fechas" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({ where: { id } });

  if (!booking || booking.userId !== session.user.id) {
    return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
  }

  try {
    const updated = await editBookingDates(id, new Date(checkIn), new Date(checkOut));
    return NextResponse.json({
      checkIn: updated.checkIn,
      checkOut: updated.checkOut,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al editar fechas";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}