// app/(main)/propiedades/[id]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function PropiedadLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-2 h-9 w-2/3" />
      <Skeleton className="mt-2 h-4 w-1/2" />

      <Skeleton className="mt-6 h-80 w-full sm:h-[420px]" />

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-64 w-full lg:col-span-1" />
      </div>
    </div>
  );
}