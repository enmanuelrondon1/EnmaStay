// lib/edit-booking-dates.ts
import { prisma } from "@/lib/prisma";

const PENDING_EXPIRATION_MINUTES = 30;

export async function editBookingDates(
  bookingId: string,
  newCheckIn: Date,
  newCheckOut: Date
) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new Error("Reserva no encontrada");
  }

  if (booking.status !== "CONFIRMED") {
    throw new Error("Solo puedes editar reservas confirmadas");
  }

  if (booking.checkIn < new Date()) {
    throw new Error("No se puede editar una reserva que ya comenzó");
  }

  if (newCheckIn >= newCheckOut) {
    throw new Error("La fecha de salida debe ser posterior a la de entrada");
  }

  if (newCheckIn < new Date()) {
    throw new Error("La nueva fecha de entrada no puede ser en el pasado");
  }

  // Validar que sea la misma cantidad de noches (mismo precio)
  const originalNights = Math.round(
    (booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24)
  );
  const newNights = Math.round(
    (newCheckOut.getTime() - newCheckIn.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (originalNights !== newNights) {
    throw new Error(
      `Solo puedes cambiar las fechas manteniendo la misma cantidad de noches (${originalNights}). ` +
        `Para cambiar la duración de tu estadía, contacta al soporte.`
    );
  }

  // Validar disponibilidad, excluyendo la propia reserva
  const expirationCutoff = new Date(Date.now() - PENDING_EXPIRATION_MINUTES * 60 * 1000);
  const conflicting = await prisma.booking.findMany({
    where: {
      propertyId: booking.propertyId,
      id: { not: booking.id },
      OR: [
        { status: "CONFIRMED" },
        { status: "PENDING", createdAt: { gte: expirationCutoff } },
      ],
      checkIn: { lt: newCheckOut },
      checkOut: { gt: newCheckIn },
    },
  });

  if (conflicting.length > 0) {
    throw new Error("Las nuevas fechas no están disponibles para esta propiedad");
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: { checkIn: newCheckIn, checkOut: newCheckOut },
    include: { property: true, user: true },
  });
}