// app/(main)/favoritos/loading.tsx
import { PropertyCardSkeleton } from "@/components/site/property-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function FavoritosLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Skeleton className="mb-6 h-8 w-40" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}