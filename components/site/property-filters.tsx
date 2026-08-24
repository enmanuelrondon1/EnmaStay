// components/site/property-filters.tsx
"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type PropertyFiltersProps = {
  cities: string[];
};

export function PropertyFilters({ cities }: PropertyFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") ?? "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") ?? "");
  const [bathrooms, setBathrooms] = useState(
    searchParams.get("bathrooms") ?? "",
  );
  const [parkings, setParkings] = useState(searchParams.get("parkings") ?? "");

   function applyFilters(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (bathrooms) params.set("bathrooms", bathrooms);
    if (parkings) params.set("parkings", parkings);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    setCity("");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("");
    setBathrooms("");
    setParkings("");
    setCheckIn("");
    setCheckOut("");
    router.push(pathname);
  }
  return (
    <form
      onSubmit={applyFilters}
      className="mb-6 flex flex-wrap items-end gap-3 rounded-lg border border-stone-300 bg-white p-4"
    >
            <div>
        <label className="block text-xs font-medium text-stone-600">Entrada</label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="mt-1 rounded-md border border-stone-300 px-2 py-1.5 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-stone-600">Salida</label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="mt-1 rounded-md border border-stone-300 px-2 py-1.5 text-sm"
        />
      </div>

   
      <div>
        <label className="block text-xs font-medium text-stone-600">
          Ciudad
        </label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="mt-1 rounded-md border border-stone-300 px-2 py-1.5 text-sm"
        >
          <option value="">Todas</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-stone-600">
          Precio mín.
        </label>
        <input
          type="number"
          min="0"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="mt-1 w-24 rounded-md border border-stone-300 px-2 py-1.5 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-stone-600">
          Precio máx.
        </label>
        <input
          type="number"
          min="0"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="mt-1 w-24 rounded-md border border-stone-300 px-2 py-1.5 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-stone-600">
          Habitaciones
        </label>
        <input
          type="number"
          min="0"
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          className="mt-1 w-20 rounded-md border border-stone-300 px-2 py-1.5 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-stone-600">
          Baños
        </label>
        <input
          type="number"
          min="0"
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
          className="mt-1 w-20 rounded-md border border-stone-300 px-2 py-1.5 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-stone-600">
          Estacionamientos
        </label>
        <input
          type="number"
          min="0"
          value={parkings}
          onChange={(e) => setParkings(e.target.value)}
          className="mt-1 w-20 rounded-md border border-stone-300 px-2 py-1.5 text-sm"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-ink px-4 py-1.5 text-sm font-medium text-canvas-soft hover:bg-brass"
        >
          Buscar
        </button>
        <button
          type="button"
          onClick={clearFilters}
          className="rounded-md border border-stone-300 px-4 py-1.5 text-sm hover:bg-canvas-soft"
        >
          Limpiar
        </button>
      </div>
    </form>
  );
}
