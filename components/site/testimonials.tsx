// components/site/testimonials.tsx
type Testimonial = {
  id: string;
  rating: number;
  comment: string | null;
  userName: string | null;
  propertyTitle: string;
};

export function Testimonials({ reviews }: { reviews: Testimonial[] }) {
  if (reviews.length === 0) return null;

  return (
    <section className="border-y border-stone-300 bg-canvas-soft px-4 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h2 className="font-display text-2xl text-ink">
            Lo que dicen nuestros huéspedes
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-stone-300 bg-white p-6"
            >
              <div className="mb-3 text-brass">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </div>
              {r.comment && (
                <p className="text-sm italic text-stone-700">“{r.comment}”</p>
              )}
              <p className="mt-4 text-xs uppercase tracking-widest text-stone-500">
                {r.userName ?? "Huésped"} · {r.propertyTitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}