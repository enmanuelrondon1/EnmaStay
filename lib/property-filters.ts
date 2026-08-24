// lib/property-filters.ts
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type SearchParams = { [key: string]: string | string[] | undefined };

function toNumber(value: string | string[] | undefined): number | undefined {
  if (typeof value !== "string") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function toDate(value: string | string[] | undefined): Date | undefined {
  if (typeof value !== "string" || !value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export function buildPropertyWhere(params: SearchParams): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = {};

  if (typeof params.city === "string" && params.city !== "") {
    where.city = params.city;
  }

  const minPrice = toNumber(params.minPrice);
  const maxPrice = toNumber(params.maxPrice);
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {
      ...(minPrice !== undefined ? { gte: minPrice } : {}),
      ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
    };
  }

  const bedrooms = toNumber(params.bedrooms);
  if (bedrooms !== undefined) where.bedrooms = { gte: bedrooms };

  const bathrooms = toNumber(params.bathrooms);
  if (bathrooms !== undefined) where.bathrooms = { gte: bathrooms };

  const parkings = toNumber(params.parkings);
  if (parkings !== undefined) where.parkings = { gte: parkings };

  return where;
}

/**
 * Devuelve los IDs de propiedades ocupadas (reserva CONFIRMED, o PENDING no expirado)
 * que se solapan con el rango checkIn/checkOut dado.
 */
export async function getUnavailablePropertyIds(
  params: SearchParams
): Promise<string[] | null> {
  const checkIn = toDate(params.checkIn);
  const checkOut = toDate(params.checkOut);

  if (!checkIn || !checkOut || checkOut <= checkIn) {
    return null; // sin filtro de fechas válido, no excluir nada
  }

  const expirationCutoff = new Date(Date.now() - 30 * 60 * 1000);

  const overlapping = await prisma.booking.findMany({
    where: {
      OR: [
        { status: "CONFIRMED" },
        { status: "PENDING", createdAt: { gte: expirationCutoff } },
      ],
      checkIn: { lt: checkOut },
      checkOut: { gt: checkIn },
    },
    select: { propertyId: true },
  });

  return [...new Set(overlapping.map((b) => b.propertyId))];
}