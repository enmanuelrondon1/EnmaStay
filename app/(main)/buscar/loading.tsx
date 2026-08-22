// app/(main)/buscar/loading.tsx
import { PropertyCardSkeleton } from "@/components/site/property-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function BuscarLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Skeleton className="mb-6 h-20 w-full" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
        <Skeleton className="h-[70vh] w-full rounded-lg" />
      </div>
    </div>
  );
}