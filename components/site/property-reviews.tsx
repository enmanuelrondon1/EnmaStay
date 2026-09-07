// components/site/property-reviews.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StarRating } from "@/components/site/star-rating";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  userId: string;
  user: { name: string | null };
};

const dateFormatter = new Intl.DateTimeFormat("es", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function PropertyReviews({ reviews }: { reviews: Review[] }) {
  const { data: session } = useSession();

  if (reviews.length === 0) {
    return (
      <p className="mt-3 text-sm text-stone-600">
        Todavía no hay reseñas para esta propiedad.
      </p>
    );
  }

  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2">
        <StarRating value={Math.round(average)} readOnly size={16} />
        <span className="font-mono text-sm text-ink">{average.toFixed(1)}</span>
        <span className="text-sm text-stone-600">
          ({reviews.length} reseña{reviews.length > 1 ? "s" : ""})
        </span>
      </div>

      <div className="mt-4 space-y-4">
             {reviews.map((review) => (
          <ReviewItem
            key={review.id}
            review={review}
            isOwner={session?.user?.id === review.userId}
            isAdmin={session?.user?.role === "ADMIN"}
          />
        ))}
      </div>
    </div>
  );
}

function ReviewItem({
  review,
  isOwner,
  isAdmin,
}: {
  review: Review;
  isOwner: boolean;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Error al guardar");
        setSaving(false);
        return;
      }

      toast.success("Reseña actualizada");
      setEditing(false);
      router.refresh();
    } catch {
      toast.error("Error de conexión");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("¿Borrar tu reseña? Esta acción no se puede deshacer.")) return;

    try {
      const res = await fetch(`/api/reviews/${review.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Error al borrar");
        return;
      }
      toast.success("Reseña eliminada");
      router.refresh();
    } catch {
      toast.error("Error de conexión");
    }
  }

  if (editing) {
    return (
      <div className="border-t border-stone-300 pt-4">
        <StarRating value={rating} onChange={setRating} size={18} />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
          className="mt-2 w-full rounded-md border border-stone-300 px-2 py-1.5 text-sm"
        />
        <div className="mt-2 flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-ink px-3 py-1.5 text-xs font-medium text-canvas-soft hover:bg-brass disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
          <button
            onClick={() => setEditing(false)}
            className="rounded-md border border-stone-300 px-3 py-1.5 text-xs text-ink hover:bg-canvas-soft"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-stone-300 pt-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink">
          {review.user.name ?? "Huésped"}
        </span>
        <span className="text-xs text-stone-600">{dateFormatter.format(review.createdAt)}</span>
      </div>
      <StarRating value={review.rating} readOnly size={14} />
      {review.comment && <p className="mt-1 text-sm text-stone-600">{review.comment}</p>}

         {(isOwner || isAdmin) && (
        <div className="mt-2 flex items-center gap-3">
          <button
            onClick={() => setEditing(true)}
            className="text-xs font-medium text-teal hover:underline"
          >
            Editar
          </button>
          <button
            onClick={handleDelete}
            className="text-xs font-medium text-red-600 hover:underline"
          >
            Borrar
          </button>
          {!isOwner && isAdmin && (
            <span className="text-xs text-stone-400">(como admin)</span>
          )}
        </div>
      )}
    </div>
  );
}