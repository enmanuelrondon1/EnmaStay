// app/api/vapi/webhook/route.ts
import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";
import { AdminNewLeadEmail } from "@/lib/emails/admin-new-lead-email";

export async function POST(req: Request) {
  const secret = req.headers.get("x-vapi-secret");
  if (secret !== process.env.VAPI_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const message = body.message;

  if (message?.type !== "end-of-call-report") {
    return NextResponse.json({ received: true });
  }

  const structuredData = message.analysis?.structuredData;
  const leadData = structuredData?.interes_visitante_enmastay;

  if (!leadData?.propertyId) {
    return NextResponse.json({ received: true });
  }

  try {
    const property = await prisma.property.findUnique({
      where: { id: leadData.propertyId },
      select: { title: true, city: true },
    });

    if (!property) {
      console.warn("Lead de voz con propertyId inválido:", leadData.propertyId);
      return NextResponse.json({ received: true });
    }

    await prisma.voiceLead.create({
      data: {
        propertyId: leadData.propertyId,
        name: leadData.name ?? null,
        contact: leadData.contact ?? null,
        preferredTime: leadData.preferredTime ?? null,
        notes: leadData.notes ?? null,
      },
    });

    if (process.env.ADMIN_NOTIFICATION_EMAIL) {
      const adminHtml = await render(
        AdminNewLeadEmail({
          propertyTitle: property.title,
          city: property.city,
          name: leadData.name,
          contact: leadData.contact,
          preferredTime: leadData.preferredTime,
          notes: leadData.notes,
        })
      );
      await sendEmail({
        to: process.env.ADMIN_NOTIFICATION_EMAIL,
        subject: `Nuevo interés por voz: ${property.title}`,
        html: adminHtml,
      });
    }
  } catch (error) {
    console.error("Error al registrar lead de voz:", error);
  }

  return NextResponse.json({ received: true });
}