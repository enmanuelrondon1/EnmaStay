// components/site/property-reviews.tsx
import { StarRating } from "@/components/site/star-rating";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: { name: string | null };
};

const dateFormatter = new Intl.DateTimeFormat("es", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function PropertyReviews({ reviews }: { reviews: Review[] }) {
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
          <div key={review.id} className="border-t border-stone-300 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink">
                {review.user.name ?? "Huésped"}
              </span>
              <span className="text-xs text-stone-600">
                {dateFormatter.format(review.createdAt)}
              </span>
            </div>
            <StarRating value={review.rating} readOnly size={14} />
            {review.comment && (
              <p className="mt-1 text-sm text-stone-600">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}