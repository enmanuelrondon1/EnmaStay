// app/api/bookings/[id]/messages/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

async function authorize(bookingId: string, userId: string, role?: string) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return null;
  const isOwner = booking.userId === userId;
  const isAdmin = role === "ADMIN";
  if (!isOwner && !isAdmin) return null;
  return booking;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Debes iniciar sesión" }, { status: 401 });
  }

  const { id } = await params;
  const booking = await authorize(id, session.user.id, session.user.role);
  if (!booking) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const messages = await prisma.message.findMany({
    where: { bookingId: id },
    orderBy: { createdAt: "asc" },
    include: { sender: { select: { id: true, name: true, role: true } } },
  });

  return NextResponse.json({ messages });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Debes iniciar sesión" }, { status: 401 });
  }

  const { id } = await params;
  const booking = await authorize(id, session.user.id, session.user.role);
  if (!booking) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { content } = await req.json();
  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json({ error: "El mensaje no puede estar vacío" }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      bookingId: id,
      senderId: session.user.id,
      content: content.trim(),
    },
    include: { sender: { select: { id: true, name: true, role: true } } },
  });

  await pusherServer.trigger(`private-booking-${id}`, "new-message", message);

  return NextResponse.json({ message }, { status: 201 });
}