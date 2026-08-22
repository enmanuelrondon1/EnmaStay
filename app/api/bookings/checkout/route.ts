// app/api/bookings/checkout/route.ts
import { NextResponse } from "next/server";
import { differenceInCalendarDays } from "date-fns";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

function toNoonUTC(isoString: string): Date {
  const d = new Date(isoString);
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 12, 0, 0),
  );
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Debes iniciar sesión" },
      { status: 401 },
    );
  }

  try {
    const { propertyId, checkIn, checkOut } = await req.json();

    if (!propertyId || !checkIn || !checkOut) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    const checkInDate = toNoonUTC(checkIn);
    const checkOutDate = toNoonUTC(checkOut);
    const nights = differenceInCalendarDays(checkOutDate, checkInDate);

    if (nights <= 0) {
      return NextResponse.json(
        { error: "Rango de fechas inválido" },
        { status: 400 },
      );
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Propiedad no encontrada" },
        { status: 404 },
      );
    }

    // Revalidar disponibilidad en el servidor -- nunca confiar en lo que mandó el cliente.
    const expirationCutoff = new Date(Date.now() - 30 * 60 * 1000);

    const overlapping = await prisma.booking.findFirst({
      where: {
        propertyId,
        OR: [
          { status: "CONFIRMED" },
          { status: "PENDING", createdAt: { gte: expirationCutoff } },
        ],
        AND: [
          { checkIn: { lt: checkOutDate } },
          { checkOut: { gt: checkInDate } },
        ],
      },
    });

    if (overlapping) {
      return NextResponse.json(
        { error: "Las fechas seleccionadas ya no están disponibles" },
        { status: 409 },
      );
    }

    const totalPrice = nights * property.price;

    const booking = await prisma.booking.create({
      data: {
        propertyId,
        userId: session.user.id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalPrice,
        status: "PENDING",
      },
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: property.title,
              description: `${nights} noche(s) · ${property.city}, ${property.country}`,
            },
            unit_amount: totalPrice * 100, // Stripe usa centavos
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/reservas/${booking.id}/confirmacion?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/propiedades/${propertyId}?canceled=true`,
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: { stripeSessionId: checkoutSession.id },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Error al crear checkout:", error);
    return NextResponse.json(
      { error: "Error al procesar la reserva" },
      { status: 500 },
    );
  }
}
