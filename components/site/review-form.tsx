// components/site/review-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StarRating } from "@/components/site/star-rating";

const QUICK_EMOJIS = ["😊", "🥰", "😍", "👍", "🎉", "✨", "🏡", "🌅", "💯", "🙌"];

export function ReviewForm({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function insertEmoji(emoji: string) {
    setComment((prev) => prev + emoji);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Selecciona una calificación");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, rating, comment }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Error al enviar la reseña");
        setSubmitting(false);
        return;
      }

      toast.success("¡Gracias por tu reseña!");
      setSubmitted(true);
      router.refresh();
    } catch {
      toast.error("Error de conexión, intenta de nuevo");
      setSubmitting(false);
    }
  }

  if (submitted) {
    return <p className="text-xs text-teal">Reseña enviada</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-2 rounded-md border border-stone-300 bg-canvas-soft p-3">
      <p className="text-xs font-medium text-ink">¿Cómo estuvo tu estadía?</p>
      <StarRating value={rating} onChange={setRating} size={20} />

      <div className="relative">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Cuéntanos más (opcional)"
          rows={2}
          className="w-full rounded-md border border-stone-300 px-2 py-1.5 pr-8 text-sm"
        />
        <button
          type="button"
          onClick={() => setShowEmojis((prev) => !prev)}
          className="absolute right-1.5 top-1.5 text-base hover:opacity-70"
          aria-label="Agregar emoji"
        >
          🙂
        </button>
      </div>

      {showEmojis && (
        <div className="flex flex-wrap gap-1 rounded-md border border-stone-300 bg-white p-2">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => insertEmoji(emoji)}
              className="rounded p-1 text-lg hover:bg-canvas-soft"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-ink px-3 py-1.5 text-xs font-medium text-canvas-soft hover:bg-brass disabled:opacity-50"
      >
        {submitting ? "Enviando..." : "Enviar reseña"}
      </button>
    </form>
  );
}