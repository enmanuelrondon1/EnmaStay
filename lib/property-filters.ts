// lib/property-filters.ts
import { Prisma } from "@prisma/client";

type SearchParams = { [key: string]: string | string[] | undefined };

function toNumber(value: string | string[] | undefined): number | undefined {
  if (typeof value !== "string") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
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