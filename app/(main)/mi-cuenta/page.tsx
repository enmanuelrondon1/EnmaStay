// app/(main)/mi-cuenta/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingList } from "@/components/site/booking-list";

export default async function MiCuentaPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const bookings = await prisma.booking.findMany({
  where: { userId: session.user.id },
  include: {
    review: { select: { id: true } },
    property: {
      include: { images: { orderBy: { order: "asc" }, take: 1 } },
    },
  },
  orderBy: { createdAt: "desc" },
});

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-1 font-display text-2xl text-ink">Mis reservas</h1>
      <p className="mb-6 text-sm text-stone-600">
        Hola {session.user.name ?? session.user.email}, aquí está el historial de tus reservas.
      </p>

      <BookingList bookings={bookings} />
    </div>
  );
}