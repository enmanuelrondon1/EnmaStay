// app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";
import { resend } from "@/lib/resend";
import { BookingConfirmationEmail } from "@/lib/emails/booking-confirmation-email";
import { AdminNewBookingEmail } from "@/lib/emails/admin-new-booking-email";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Falta firma" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error("Webhook signature inválida:", err);
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

if (event.type === "checkout.session.completed") {
  const session = event.data.object as Stripe.Checkout.Session;
  const bookingId = session.metadata?.bookingId;

  if (bookingId && session.payment_status === "paid") {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CONFIRMED" },
      include: {
        user: true,
        property: { include: { images: { orderBy: { order: "asc" }, take: 1 } } },
      },
    });

    const dateFormatter = new Intl.DateTimeFormat("es", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    try {
      await resend.emails.send({
        from: "EnmaStay <onboarding@resend.dev>",
        to: booking.user.email,
        subject: `Reserva confirmada: ${booking.property.title}`,
        react: BookingConfirmationEmail({
          guestName: booking.user.name ?? "huésped",
          propertyTitle: booking.property.title,
          city: booking.property.city,
          country: booking.property.country,
          checkIn: dateFormatter.format(booking.checkIn),
          checkOut: dateFormatter.format(booking.checkOut),
          totalPrice: booking.totalPrice,
          imageUrl: booking.property.images[0]?.url,
        }),
      });

      if (process.env.ADMIN_NOTIFICATION_EMAIL) {
        await resend.emails.send({
          from: "EnmaStay <onboarding@resend.dev>",
          to: process.env.ADMIN_NOTIFICATION_EMAIL,
          subject: `Nueva reserva: ${booking.property.title}`,
          react: AdminNewBookingEmail({
            guestName: booking.user.name ?? "Huésped sin nombre",
            guestEmail: booking.user.email,
            propertyTitle: booking.property.title,
            city: booking.property.city,
            checkIn: dateFormatter.format(booking.checkIn),
            checkOut: dateFormatter.format(booking.checkOut),
            totalPrice: booking.totalPrice,
          }),
        });
      }
    } catch (emailError) {
      console.error("Error al enviar email de confirmación:", emailError);
    } 
  }
}

  return NextResponse.json({ received: true });
}