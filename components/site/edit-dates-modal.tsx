// components/site/edit-dates-modal.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type EditDatesModalProps = {
  bookingId: string;
  currentCheckIn: Date;
  currentCheckOut: Date;
  nights: number;
  onClose: () => void;
};

const dateInputFormatter = (d: Date) => d.toISOString().split("T")[0];

export function EditDatesModal({
  bookingId,
  currentCheckIn,
  currentCheckOut,
  nights,
  onClose,
}: EditDatesModalProps) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(dateInputFormatter(new Date(currentCheckIn)));
  const [saving, setSaving] = useState(false);

  // El checkOut se calcula automáticamente para mantener las mismas noches
  const checkOutDate = new Date(checkIn);
  checkOutDate.setDate(checkOutDate.getDate() + nights);
  const checkOut = dateInputFormatter(checkOutDate);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/editar-fechas`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkIn, checkOut }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Error al editar fechas");
        return;
      }

      toast.success("Fechas actualizadas correctamente");
      router.refresh();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6">
        <h3 className="font-display text-lg text-ink">Editar fechas</h3>
        <p className="mt-1 text-sm text-stone-600">
          Puedes cambiar las fechas manteniendo la misma cantidad de noches (
          <strong>{nights} {nights === 1 ? "noche" : "noches"}</strong>). La
          fecha de salida se ajusta automáticamente.
        </p>

        <label className="mt-4 block text-xs font-medium uppercase tracking-widest text-stone-600">
          Nueva fecha de entrada
        </label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          min={dateInputFormatter(new Date())}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
        />

        <p className="mt-2 text-xs text-stone-500">
          Nueva fecha de salida: <strong>{checkOut}</strong>
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm text-stone-600 hover:bg-stone-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-canvas-soft hover:bg-brass disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}