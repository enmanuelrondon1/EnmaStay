// components/site/booking-list.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

type Booking = {
  id: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  status: string;
  property: {
    id: string;
    title: string;
    city: string;
    country: string;
    images: { url: string }[];
  };
};

const dateFormatter = new Intl.DateTimeFormat("es", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  CONFIRMED: { label: "Confirmada", className: "bg-teal/10 text-teal" },
  PENDING: { label: "Pendiente de pago", className: "bg-brass/10 text-brass-dark" },
  CANCELLED: { label: "Cancelada", className: "bg-red-100 text-red-600" },
};

export function BookingList({ bookings }: { bookings: Booking[] }) {
  const router = useRouter();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  async function handleCancel(id: string) {
    if (!confirm("¿Cancelar esta reserva? Si ya la pagaste, se reembolsará automáticamente.")) {
      return;
    }

    setCancellingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}/cancelar`, { method: "POST" });
   if (!res.ok) {
  const data = await res.json();
  toast.error(data.error ?? "Error al cancelar");
  return;
}
toast.success("Reserva cancelada");
router.refresh();
    } finally {
      setCancellingId(null);
    }
  }

  if (bookings.length === 0) {
    return (
      <div className="mt-12 text-center">
        <p className="text-stone-600">Todavía no tienes reservas.</p>
        <Link
          href="/buscar"
          className="mt-4 inline-block rounded-md bg-ink px-5 py-2 text-sm font-medium text-canvas-soft hover:bg-brass"
        >
          Explorar propiedades
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const status = STATUS_LABELS[booking.status] ?? {
          label: booking.status,
          className: "bg-stone-300 text-stone-600",
        };
        const canCancel =
          booking.status !== "CANCELLED" && new Date(booking.checkIn) > new Date();

        return (
          <div
            key={booking.id}
            className="flex gap-4 overflow-hidden rounded-lg border border-stone-300 bg-white p-3"
          >
            <Link
              href={`/propiedades/${booking.property.id}`}
              className="relative h-24 w-32 shrink-0 overflow-hidden rounded-md bg-stone-300/40"
            >
              {booking.property.images[0] && (
                <Image
                  src={booking.property.images[0].url}
                  alt={booking.property.title}
                  fill
                  className="object-cover"
                />
              )}
            </Link>

            <div className="flex flex-1 flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/propiedades/${booking.property.id}`}
                    className="font-display text-lg text-ink hover:text-brass"
                  >
                    {booking.property.title}
                  </Link>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                  >
                    {status.label}
                  </span>
                </div>
                <p className="text-sm text-stone-600">
                  {booking.property.city}, {booking.property.country}
                </p>
              </div>

              <div className="flex items-end justify-between">
                <p className="font-mono text-xs text-stone-600">
                  {dateFormatter.format(booking.checkIn)} —{" "}
                  {dateFormatter.format(booking.checkOut)}
                </p>
                <div className="flex items-center gap-3">
                  <p className="font-mono text-sm font-medium text-brass-dark">
                    ${booking.totalPrice}
                  </p>
                  {canCancel && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      disabled={cancellingId === booking.id}
                      className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
                    >
                      {cancellingId === booking.id ? "Cancelando..." : "Cancelar"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}