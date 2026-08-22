// components/site/favorite-button.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function FavoriteButton({ propertyId }: { propertyId: string }) {
  const { status } = useSession();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (status !== "authenticated") {
      setLoaded(true);
      return;
    }

    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => {
        setIsFavorite((data.propertyIds ?? []).includes(propertyId));
      })
      .finally(() => setLoaded(true));
  }, [propertyId, status]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    const next = !isFavorite;
    setIsFavorite(next);

    startTransition(async () => {
      if (next) {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId }),
        });
        toast.success("Agregado a favoritos");
      } else {
        await fetch(`/api/favorites/${propertyId}`, { method: "DELETE" });
        toast("Quitado de favoritos");
      }
      router.refresh();
    });
  }

  if (!loaded) return null;

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white"
    >
      <Heart
        className={`h-4 w-4 ${isFavorite ? "fill-brass text-brass" : "text-ink"}`}
        strokeWidth={1.5}
      />
    </button>
  );
}
