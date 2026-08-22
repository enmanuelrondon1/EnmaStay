// components/site/property-map-wrapper.tsx
"use client";

import dynamic from "next/dynamic";

const PropertyMap = dynamic(
  () => import("@/components/site/property-map").then((mod) => mod.PropertyMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse rounded-lg bg-stone-300/50" />
    ),
  },
);

export { PropertyMap };
