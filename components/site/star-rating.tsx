// components/site/star-rating.tsx
"use client";

import { Star } from "lucide-react";

type StarRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readOnly?: boolean;
};

export function StarRating({ value, onChange, size = 18, readOnly = false }: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={readOnly ? "cursor-default" : "cursor-pointer"}
          aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
        >
          <Star
            size={size}
            className={star <= value ? "fill-brass text-brass" : "text-stone-300"}
          />
        </button>
      ))}
    </div>
  );
}