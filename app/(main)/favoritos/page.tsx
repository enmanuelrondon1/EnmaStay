// app/(main)/favoritos/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PropertyCardPublic } from "@/components/site/property-card-public";

export default async function FavoritosPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      property: {
        include: {
          images: { orderBy: { order: "asc" }, take: 1 },
          reviews: { select: { rating: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 font-display text-2xl text-ink">Tus favoritos</h1>

      {favorites.length === 0 ? (
        <p className="mt-12 text-center text-stone-600">
          Todavía no has guardado ninguna propiedad.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((f) => (
            <PropertyCardPublic key={f.id} property={f.property} />
          ))}
        </div>
      )}
    </div>
  );
}