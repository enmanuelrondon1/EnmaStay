// app/api/vapi/webhook/route.ts
import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";
import { AdminNewLeadEmail } from "@/lib/emails/admin-new-lead-email";

export async function POST(req: Request) {
  const secret = req.headers.get("x-vapi-secret");
  if (secret !== process.env.VAPI_WEBHOOK_SECRET) {
    console.log("[VAPI WEBHOOK] Secret inválido o ausente");
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const message = body.message;

  console.log("[VAPI WEBHOOK] Evento recibido:", message?.type);

  if (message?.type !== "end-of-call-report") {
    return NextResponse.json({ received: true });
  }

  console.log("[VAPI WEBHOOK] Es end-of-call-report, procesando...");

  // Vapi v4 guarda los datos extraídos en artifact.structuredOutputs,
  // no en analysis.structuredData (eso era de la versión legacy).
  const structuredData = message.artifact?.structuredOutputs;

  console.log("[VAPI WEBHOOK] structuredData:", JSON.stringify(structuredData));

  if (!structuredData) {
    console.log("[VAPI WEBHOOK] No hay structuredOutputs en el reporte");
    return NextResponse.json({ received: true });
  }

  const entry = Object.values(structuredData).find(
    (item: any) => item?.name === "interes_visitante_enmastay"
  ) as { result?: Record<string, string> } | undefined;

  const leadData = entry?.result;
  console.log("[VAPI WEBHOOK] leadData extraído:", JSON.stringify(leadData));

  if (!leadData?.propertyId) {
    console.log("[VAPI WEBHOOK] Falta propertyId en leadData");
    return NextResponse.json({ received: true });
  }

  try {
    const property = await prisma.property.findUnique({
      where: { id: leadData.propertyId },
      select: { title: true, city: true },
    });

    console.log("[VAPI WEBHOOK] Propiedad encontrada:", JSON.stringify(property));

    if (!property) {
      console.log("[VAPI WEBHOOK] propertyId no coincide con ninguna propiedad:", leadData.propertyId);
      return NextResponse.json({ received: true });
    }

    const created = await prisma.voiceLead.create({
      data: {
        propertyId: leadData.propertyId,
        name: leadData.name ?? null,
        contact: leadData.contact ?? null,
        preferredTime: leadData.preferredTime ?? null,
        notes: leadData.notes ?? null,
      },
    });

    console.log("[VAPI WEBHOOK] VoiceLead creado con éxito:", created.id);

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
      console.log("[VAPI WEBHOOK] Email enviado a admin");
    }
  } catch (error) {
    console.error("[VAPI WEBHOOK] ERROR al registrar lead de voz:", error);
  }

  return NextResponse.json({ received: true });
}