// components/site/property-gallery.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";

export function PropertyGallery({
  images,
  title,
}: {
  images: { url: string }[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!modalOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setModalOpen(false);
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setActive((i) => (i - 1 + images.length) % images.length);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [modalOpen, images.length]);

  if (images.length === 0) return null;

  return (
    <div>
      <div className="relative h-80 w-full overflow-hidden rounded-lg bg-stone-300/40 sm:h-[420px]">
        <Image
          src={images[active].url}
          alt={title}
          fill
          className="cursor-pointer object-cover"
          priority
          onClick={() => setModalOpen(true)}
        />
        <button
          onClick={() => setModalOpen(true)}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1.5 text-xs font-medium text-canvas-soft hover:bg-ink"
        >
          <Expand size={14} />
          Ver todas ({images.length})
        </button>
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.url}
              onClick={() => setActive(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 ${
                i === active ? "border-brass" : "border-transparent"
              }`}
            >
              <Image src={img.url} alt={`${title} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={() => setModalOpen(false)}
        >
          <button
            onClick={() => setModalOpen(false)}
            className="absolute right-4 top-4 z-10 text-white/80 hover:text-white"
            aria-label="Cerrar"
          >
            <X size={28} />
          </button>

          <span className="absolute left-4 top-4 z-10 font-mono text-sm text-white/60">
            {active + 1} / {images.length}
          </span>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((i) => (i - 1 + images.length) % images.length);
                }}
                className="absolute left-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                aria-label="Anterior"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((i) => (i + 1) % images.length);
                }}
                className="absolute right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                aria-label="Siguiente"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div
            className="relative h-[80vh] w-[90vw] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[active].url}
              alt={`${title} ${active + 1}`}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}