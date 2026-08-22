// app/api/admin/propiedades/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

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

    const property = await prisma.property.create({
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
      WHERE "id" = ${property.id}
    `;

    return NextResponse.json({ id: property.id }, { status: 201 });
  } catch (error) {
    console.error("Error al crear propiedad:", error);
    return NextResponse.json(
      { error: "Error al crear la propiedad" },
      { status: 500 }
    );
  }
}