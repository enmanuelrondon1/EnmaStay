// app/api/cron/expire-bookings/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PENDING_EXPIRATION_MINUTES = 30;

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const expirationCutoff = new Date(Date.now() - PENDING_EXPIRATION_MINUTES * 60 * 1000);

  const result = await prisma.booking.updateMany({
    where: {
      status: "PENDING",
      createdAt: { lt: expirationCutoff },
    },
    data: { status: "CANCELLED" },
  });

  return NextResponse.json({ cancelled: result.count });
}