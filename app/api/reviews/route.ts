// app/api/reviews/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";
import { render } from "@react-email/render";
import { AdminNewReviewEmail } from "@/lib/emails/admin-new-review-email";
import { ReviewThankYouEmail } from "@/lib/emails/review-thank-you-email";

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
      include: { review: true, property: true },
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

    // Email al huésped (independiente del envío al admin)
    try {
      if (session.user.email) {
        const guestHtml = await render(
          ReviewThankYouEmail({
            guestName: session.user.name ?? "Huésped",
            propertyTitle: booking.property.title,
            rating,
          })
        );

        await sendEmail({
          to: session.user.email,
          subject: `¡Gracias por tu reseña de "${booking.property.title}"!`,
          html: guestHtml,
        });
      }
    } catch (emailError) {
      console.error("Error al enviar email de agradecimiento al huésped:", emailError);
    }

    // Email al admin (independiente del envío al huésped)
    try {
      if (process.env.ADMIN_NOTIFICATION_EMAIL) {
        const reviewUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/propiedades/${booking.propertyId}`;
        const adminHtml = await render(
          AdminNewReviewEmail({
            guestName: session.user.name ?? "Huésped",
            propertyTitle: booking.property.title,
            rating,
            comment: comment || null,
            reviewUrl,
          })
        );

        await sendEmail({
          to: process.env.ADMIN_NOTIFICATION_EMAIL,
          subject: `⭐ Nueva reseña (${rating}/5) en "${booking.property.title}"`,
          html: adminHtml,
        });
      }
    } catch (emailError) {
      console.error("Error al enviar notificación de reseña al admin:", emailError);
    }

    return NextResponse.json({ id: review.id }, { status: 201 });
  } catch (error) {
    console.error("Error al crear reseña:", error);
    return NextResponse.json({ error: "Error al crear la reseña" }, { status: 500 });
  }
}