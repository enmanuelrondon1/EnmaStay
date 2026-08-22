// app/api/bookings/availability/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PENDING_EXPIRATION_MINUTES = 30;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const propertyId = searchParams.get("propertyId");

  if (!propertyId) {
    return NextResponse.json({ error: "Falta propertyId" }, { status: 400 });
  }

  const expirationCutoff = new Date(Date.now() - PENDING_EXPIRATION_MINUTES * 60 * 1000);

  const bookings = await prisma.booking.findMany({
    where: {
      propertyId,
      OR: [
        { status: "CONFIRMED" },
        { status: "PENDING", createdAt: { gte: expirationCutoff } },
      ],
    },
    select: { checkIn: true, checkOut: true },
  });

  return NextResponse.json({ bookings });
}