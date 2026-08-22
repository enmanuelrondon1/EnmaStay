// components/site/booking-confirmation.tsx
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

type BookingConfirmationProps = {
  booking: {
    id: string;
    checkIn: Date;
    checkOut: Date;
    totalPrice: number;
    status: string;
    property: {
      title: string;
      city: string;
      country: string;
      images: { url: string }[];
    };
  };
};

const dateFormatter = new Intl.DateTimeFormat("es", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function BookingConfirmation({ booking }: BookingConfirmationProps) {
  const isConfirmed = booking.status === "CONFIRMED";

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-lg flex-col items-center justify-center px-4 py-12 text-center">
      <span className="font-display text-xl italic text-ink">EnmaStay</span>

      <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-teal/10">
        <CheckCircle2 className="h-9 w-9 text-teal" strokeWidth={1.5} />
      </div>

      <h1 className="mt-6 font-display text-2xl text-ink">
        {isConfirmed ? "¡Reserva confirmada!" : "Confirmando tu reserva..."}
      </h1>
      <p className="mt-2 text-sm text-stone-600">
        {isConfirmed
          ? "Te esperamos. Aquí están los detalles de tu estadía."
          : "El pago fue exitoso, estamos confirmando los últimos detalles."}
      </p>

      <div className="mt-8 w-full overflow-hidden rounded-lg border border-stone-300 bg-white text-left">
        {booking.property.images[0] && (
          <div className="relative h-40 w-full">
            <Image
              src={booking.property.images[0].url}
              alt={booking.property.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="space-y-3 p-5">
          <h2 className="font-display text-lg text-ink">{booking.property.title}</h2>
          <p className="text-sm text-stone-600">
            {booking.property.city}, {booking.property.country}
          </p>

          <div className="border-t border-stone-300 pt-3 font-mono text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Entrada</span>
              <span>{dateFormatter.format(booking.checkIn)}</span>
            </div>
            <div className="mt-1 flex justify-between text-stone-600">
              <span>Salida</span>
              <span>{dateFormatter.format(booking.checkOut)}</span>
            </div>
            <div className="mt-2 flex justify-between font-medium text-ink">
              <span>Total pagado</span>
              <span>${booking.totalPrice}</span>
            </div>
          </div>
        </div>
      </div>

      <Link
        href="/mi-cuenta"
        className="mt-8 rounded-md bg-ink px-6 py-2.5 text-sm font-medium text-canvas-soft hover:bg-brass"
      >
        Ver mis reservas
      </Link>
    </div>
  );
}