// app/admin/reservas/page.tsx
import { prisma } from "@/lib/prisma";
import { AdminBookingList } from "@/components/admin/admin-booking-list";

export default async function AdminReservasPage() {
  const bookings = await prisma.booking.findMany({
    include: {
      property: { select: { title: true, city: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 font-display text-2xl text-ink">Reservas</h1>
      <AdminBookingList bookings={bookings} />
    </div>
  );
}