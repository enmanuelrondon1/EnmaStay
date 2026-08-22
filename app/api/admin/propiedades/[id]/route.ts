// app/api/admin/propiedades/[id]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const {
      title,
      description,
      price,
      address,
      city,
      country,
      latitude,
      longitude,
      bedrooms,
      bathrooms,
      parkings,
      images,
    } = body;

    if (
      !title ||
      !description ||
      !price ||
      !address ||
      !city ||
      !country ||
      latitude === undefined ||
      longitude === undefined ||
      !Array.isArray(images) ||
      images.length === 0
    ) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Reemplazamos todas las imágenes: simple y evita reconciliar diffs de orden.
    await prisma.propertyImage.deleteMany({ where: { propertyId: id } });

    await prisma.property.update({
      where: { id },
      data: {
        title,
        description,
        price,
        address,
        city,
        country,
        latitude,
        longitude,
        bedrooms,
        bathrooms,
        parkings,
        images: {
          create: images.map((img: { url: string; order: number }) => ({
            url: img.url,
            order: img.order,
          })),
        },
      },
    });

    await prisma.$executeRaw`
      UPDATE "Property"
      SET "location" = ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography
      WHERE "id" = ${id}
    `;

    return NextResponse.json({ id }, { status: 200 });
  } catch (error) {
    console.error("Error al editar propiedad:", error);
    return NextResponse.json(
      { error: "Error al editar la propiedad" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;

  const activeBookingsCount = await prisma.booking.count({
    where: {
      propertyId: id,
      status: { in: ["PENDING", "CONFIRMED"] },
    },
  });

  if (activeBookingsCount > 0) {
    return NextResponse.json(
      {
        error: `No se puede borrar esta propiedad: tiene ${activeBookingsCount} reserva(s) activa(s). Cancélalas primero desde el panel de Reservas.`,
      },
      { status: 409 }
    );
  }

  try {
    await prisma.property.delete({ where: { id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Error al borrar propiedad:", error);
    return NextResponse.json(
      { error: "Error al borrar la propiedad" },
      { status: 500 }
    );
  }
}