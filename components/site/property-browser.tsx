// components/site/property-browser.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PropertyCardPublic } from "@/components/site/property-card-public";
import { PropertyMap } from "@/components/site/property-map-wrapper";
import { Pagination } from "@/components/site/pagination";
import {
  Globe3D,
  type GlobeMarker,
} from "@/components/site/property-globe-wrapper";

type Property = {
  id: string;
  title: string;
  city: string;
  country: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  parkings: number;
  latitude: number;
  longitude: number;
  images: { url: string }[];
  reviews?: { rating: number }[];
};

const MAX_COMPARE = 3;

export function PropertyBrowser({
  properties,
  currentPage,
  totalPages,
}: {
  properties: Property[];
  currentPage?: number;
  totalPages?: number;
}) {
  const [view, setView] = useState<"map" | "globe">("map");
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<GlobeMarker | null>(
    null,
  );
  const [compareIds, setCompareIds] = useState<string[]>([]);

  if (properties.length === 0) {
    return (
      <p className="mt-12 text-center text-stone-600">
        No hay propiedades que coincidan con tu búsqueda.
      </p>
    );
  }

  const markers: GlobeMarker[] = properties.map((p) => ({
    lat: p.latitude,
    lng: p.longitude,
    src: p.images[0]?.url ?? "",
    label: p.title,
    propertyId: p.id,
    price: p.price,
  }));

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  }

  const compareProperties = properties.filter((p) => compareIds.includes(p.id));

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {properties.map((property, index) => (
              <PropertyCardPublic
                key={property.id}
                property={property}
                onLocate={() => setFocusedIndex(index)}
                compareSelected={compareIds.includes(property.id)}
                onCompareToggle={() => toggleCompare(property.id)}
              />
            ))}
          </div>
          {currentPage !== undefined && totalPages !== undefined && (
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          )}
        </div>

        <div className="lg:sticky lg:top-20 lg:flex lg:h-[calc(100vh-6rem)] lg:flex-col">
          <div className="mb-3 flex shrink-0 gap-2">
            <button
              onClick={() => setView("map")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                view === "map"
                  ? "bg-ink text-canvas-soft"
                  : "border border-stone-300 text-ink"
              }`}
            >
              Mapa
            </button>
            <button
              onClick={() => setView("globe")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                view === "globe"
                  ? "bg-ink text-canvas-soft"
                  : "border border-stone-300 text-ink"
              }`}
            >
              Vista global
            </button>
          </div>

          <div className="relative h-[400px] flex-1 overflow-hidden lg:h-auto">
         {view === "map" ? (
  <PropertyMap
    properties={properties}
    focusedPropertyId={focusedIndex !== null ? properties[focusedIndex].id : null}
  />
) : (
              <>
                <Globe3D
                  markers={markers}
                  focusedMarker={
                    focusedIndex !== null ? markers[focusedIndex] : null
                  }
                  className="h-full"
                  onMarkerClick={(marker) => setSelectedMarker(marker)}
                  config={{
                    atmosphereColor: "#2f5d57",
                    showAtmosphere: true,
                    atmosphereIntensity: 0.6,
                    autoRotateSpeed: 0.4,
                  }}
                />

                {selectedMarker && (
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-lg border border-stone-300 bg-white p-3 shadow-lg">
                    {selectedMarker.src && (
                      <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-md bg-stone-300/40">
                        <Image
                          src={selectedMarker.src}
                          alt={selectedMarker.label ?? ""}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm text-ink">
                        {selectedMarker.label}
                      </p>
                      {selectedMarker.price !== undefined && (
                        <p className="font-mono text-xs font-medium text-brass-dark">
                          ${selectedMarker.price} / noche
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {selectedMarker.propertyId && (
                        <Link
                          href={`/propiedades/${selectedMarker.propertyId}`}
                          className="rounded-md bg-ink px-3 py-1.5 text-xs font-medium text-canvas-soft hover:bg-brass"
                        >
                          Ver
                        </Link>
                      )}
                      <button
                        onClick={() => setSelectedMarker(null)}
                        className="text-stone-400 hover:text-ink"
                        aria-label="Cerrar"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {compareIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-300 bg-white p-4 shadow-lg">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {compareProperties.map((p) => (
                <div
                  key={p.id}
                  className="relative h-12 w-16 overflow-hidden rounded-md bg-stone-300/40"
                >
                  {p.images[0] && (
                    <Image
                      src={p.images[0].url}
                      alt={p.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              ))}
              <span className="text-sm text-stone-600">
                {compareIds.length} de {MAX_COMPARE} seleccionadas
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCompareIds([])}
                className="text-sm text-stone-600 hover:text-ink"
              >
                Limpiar
              </button>
              <Link
                href={`/comparar?ids=${compareIds.join(",")}`}
                className={`rounded-md px-5 py-2 text-sm font-medium ${
                  compareIds.length >= 2
                    ? "bg-ink text-canvas-soft hover:bg-brass"
                    : "pointer-events-none bg-stone-300 text-stone-500"
                }`}
              >
                Comparar
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
