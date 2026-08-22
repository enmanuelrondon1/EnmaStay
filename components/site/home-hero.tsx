// components/site/home-hero.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function HomeHero({ cities }: { cities: string[] }) {
  const router = useRouter();
  const [city, setCity] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    router.push(`/buscar?${params.toString()}`);
  }

  return (
    <section className="border-b border-stone-300 bg-canvas px-4 py-20 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-teal">
        Villas · Casas · Departamentos
      </p>
      <h1 className="mx-auto mt-3 max-w-2xl font-display text-4xl italic text-ink sm:text-5xl">
        Encuentra tu próxima estadía, en el lugar exacto
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-stone-600">
        Explora propiedades por ubicación real en el mapa y reserva directo,
        sin intermediarios.
      </p>

      <form
        onSubmit={handleSearch}
        className="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-full border border-stone-300 bg-white p-1.5 shadow-sm"
      >
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 rounded-full bg-transparent px-4 py-2 text-sm text-ink outline-none"
        >
          <option value="">¿A dónde vas?</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-canvas-soft hover:bg-brass"
        >
          Buscar
        </button>
      </form>
    </section>
  );
}