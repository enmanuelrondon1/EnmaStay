// components/site/property-gallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

export function PropertyGallery({
  images,
  title,
}: {
  images: { url: string }[];
  title: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) return null;

  return (
    <div>
      <div className="relative h-80 w-full overflow-hidden rounded-lg bg-stone-300/40 sm:h-[420px]">
        <Image
          src={images[active].url}
          alt={title}
          fill
          className="object-cover"
          priority
        />
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
    </div>
  );
}