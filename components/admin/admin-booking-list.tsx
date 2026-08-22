// components/admin/admin-booking-list.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Booking = {
  id: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  status: string;
  property: { title: string; city: string };
  user: { name: string | null; email: string };
};

const dateFormatter = new Intl.DateTimeFormat("es", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: "bg-teal/10 text-teal",
  PENDING: "bg-brass/10 text-brass-dark",
  CANCELLED: "bg-red-100 text-red-600",
};

export function AdminBookingList({ bookings }: { bookings: Booking[] }) {
  const router = useRouter();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  async function handleCancel(id: string) {
    if (!confirm("¿Cancelar esta reserva? Si ya fue pagada, se reembolsará automáticamente.")) {
      return;
    }

    setCancellingId(id);
    try {
      const res = await fetch(`/api/admin/reservas/${id}/cancelar`, { method: "POST" });
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
    return <p className="mt-12 text-center text-stone-600">No hay reservas todavía.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-stone-300 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-stone-300 bg-canvas-soft text-xs uppercase tracking-wide text-stone-600">
          <tr>
            <th className="px-4 py-3">Propiedad</th>
            <th className="px-4 py-3">Huésped</th>
            <th className="px-4 py-3">Fechas</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b border-stone-300 last:border-0">
              <td className="px-4 py-3">
                <div className="font-medium text-ink">{booking.property.title}</div>
                <div className="text-xs text-stone-600">{booking.property.city}</div>
              </td>
              <td className="px-4 py-3">
                <div className="text-ink">{booking.user.name ?? "—"}</div>
                <div className="text-xs text-stone-600">{booking.user.email}</div>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-stone-600">
                {dateFormatter.format(booking.checkIn)} —{" "}
                {dateFormatter.format(booking.checkOut)}
              </td>
              <td className="px-4 py-3 font-mono text-brass-dark">${booking.totalPrice}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    STATUS_STYLES[booking.status] ?? "bg-stone-300 text-stone-600"
                  }`}
                >
                  {booking.status}
                </span>
              </td>
              <td className="px-4 py-3">
                {booking.status !== "CANCELLED" && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    disabled={cancellingId === booking.id}
                    className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
                  >
                    {cancellingId === booking.id ? "Cancelando..." : "Cancelar"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}