// components/site/booking-calendar.tsx
"use client";

import { useEffect, useState } from "react";
import { type DateRange } from "react-day-picker";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

type BookingCalendarProps = {
  propertyId: string;
  pricePerNight: number;
};

type BookedRange = { checkIn: string; checkOut: string };

function toNoonUTC(date: Date): string {
  const normalized = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0),
  );
  return normalized.toISOString();
}

export function BookingCalendar({
  propertyId,
  pricePerNight,
}: BookingCalendarProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [range, setRange] = useState<DateRange | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/bookings/availability?propertyId=${propertyId}`)
      .then((res) => res.json())
      .then((data) => setBookedRanges(data.bookings ?? []))
      .finally(() => setLoadingAvailability(false));
  }, [propertyId]);

  const disabledDays = [
    { before: new Date() },
    ...bookedRanges.map((b) => ({
      from: new Date(b.checkIn),
      to: new Date(b.checkOut),
    })),
  ];

  const nights =
    range?.from && range?.to
      ? differenceInCalendarDays(range.to, range.from)
      : 0;
  const totalPrice = nights * pricePerNight;

  function rangeOverlapsBooked(from: Date, to: Date) {
    const selectedDays = eachDayOfInterval({ start: from, end: to });
    return bookedRanges.some((b) => {
      const bookedDays = eachDayOfInterval({
        start: new Date(b.checkIn),
        end: new Date(b.checkOut),
      });
      return selectedDays.some((d) =>
        bookedDays.some((bd) => bd.toDateString() === d.toDateString()),
      );
    });
  }

  async function handleReserve() {
    setError(null);

    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    if (!range?.from || !range?.to || nights <= 0) {
      setError("Selecciona fechas de entrada y salida");
      return;
    }

    if (rangeOverlapsBooked(range.from, range.to)) {
      setError("Las fechas seleccionadas ya no están disponibles");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/bookings/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          checkIn: toNoonUTC(range.from),
          checkOut: toNoonUTC(range.to),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al crear la reserva");
        setSubmitting(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Error de conexión, intenta de nuevo");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex w-full flex-col items-center">
      {loadingAvailability ? (
        <Skeleton className="h-72 w-full max-w-xs" />
      ) : (
        <div className="w-full">
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            disabled={disabledDays}
            numberOfMonths={1}
            className="w-full rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
          />
        </div>
      )}

      {nights > 0 && (
        <div className="mt-4 w-full border-t border-stone-300 pt-4 font-mono text-sm">
          <div className="flex justify-between text-stone-600">
            <span>
              ${pricePerNight} x {nights} noche{nights > 1 ? "s" : ""}
            </span>
            <span>${totalPrice}</span>
          </div>
          <div className="mt-1 flex justify-between font-medium text-ink">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
        </div>
      )}

      {error && <p className="mt-3 w-full text-sm text-red-600">{error}</p>}

      <button
        onClick={handleReserve}
        disabled={submitting || nights <= 0}
        className="mt-4 w-full rounded-md bg-ink py-2.5 text-sm font-medium text-canvas-soft hover:bg-brass disabled:opacity-50"
      >
        {submitting ? "Redirigiendo a pago..." : "Reservar"}
      </button>
    </div>
  );
}
