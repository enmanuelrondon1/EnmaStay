// app/(main)/reservas/[id]/confirmacion/page.tsx
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { BookingConfirmation } from "@/components/site/booking-confirmation";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session_id?: string }>;
};

export default async function ConfirmacionPage({ params, searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;
  const { session_id } = await searchParams;

  let booking = await prisma.booking.findUnique({
    where: { id },
    include: { property: { include: { images: { orderBy: { order: "asc" }, take: 1 } } } },
  });

  if (!booking || booking.userId !== session.user.id) {
    notFound();
  }

  // Verificación de respaldo mientras confirmamos que el webhook llega bien.
  if (booking.status === "PENDING" && session_id) {
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
    if (checkoutSession.payment_status === "paid") {
      booking = await prisma.booking.update({
        where: { id },
        data: { status: "CONFIRMED" },
        include: { property: { include: { images: { orderBy: { order: "asc" }, take: 1 } } } },
      });
    }
  }

  return <BookingConfirmation booking={booking} />;
}