// components/site/property-globe-wrapper.tsx
"use client";

import dynamic from "next/dynamic";

const Globe3D = dynamic(
  () => import("@/components/ui/3d-globe").then((mod) => mod.Globe3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[500px] w-full items-center justify-center rounded-lg bg-stone-300/40 text-sm text-stone-600">
        Cargando globo...
      </div>
    ),
  }
);

export { Globe3D };
export type { GlobeMarker } from "@/components/ui/3d-globe";