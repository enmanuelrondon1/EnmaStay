// lib/cancel-booking.ts
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function cancelBooking(bookingId: string) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

  if (!booking) {
    throw new Error("NOT_FOUND");
  }

  if (booking.status === "CANCELLED") {
    return booking;
  }

  // Si ya se cobró, reembolsamos antes de marcar como cancelada.
  if (booking.status === "CONFIRMED" && booking.stripeSessionId) {
    const checkoutSession = await stripe.checkout.sessions.retrieve(
      booking.stripeSessionId
    );

    if (checkoutSession.payment_intent) {
      await stripe.refunds.create({
        payment_intent: checkoutSession.payment_intent as string,
      });
    }
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
  });
}