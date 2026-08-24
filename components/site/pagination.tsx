// components/site/pagination.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="rounded-md border border-stone-300 px-3 py-1.5 text-sm text-ink hover:bg-canvas-soft disabled:opacity-40"
      >
        Anterior
      </button>

      <span className="px-3 text-sm text-stone-600">
        Página {currentPage} de {totalPages}
      </span>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="rounded-md border border-stone-300 px-3 py-1.5 text-sm text-ink hover:bg-canvas-soft disabled:opacity-40"
      >
        Siguiente
      </button>
    </div>
  );
}