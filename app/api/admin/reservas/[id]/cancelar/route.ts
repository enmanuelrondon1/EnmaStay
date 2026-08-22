// app/api/admin/reservas/[id]/cancelar/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { cancelBooking } from "@/lib/cancel-booking";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;

  try {
    await cancelBooking(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error al cancelar la reserva" }, { status: 500 });
  }
}