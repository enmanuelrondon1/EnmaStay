// app/api/vapi/webhook/route.ts
import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";
import { AdminNewLeadEmail } from "@/lib/emails/admin-new-lead-email";

async function fetchStructuredDataWithRetry(
  callId: string,
  retries = 4,
  delayMs = 2500
) {
  for (let i = 0; i < retries; i++) {
    await new Promise((r) => setTimeout(r, delayMs));
    try {
      const res = await fetch(`https://api.vapi.ai/call/${callId}`, {
        headers: { Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}` },
      });

      if (i === 0) {
        // LOG TEMPORAL: solo en el primer intento, para ver la forma real del JSON
        const rawText = await res.text();
        console.log(`[VAPI WEBHOOK] DEBUG - status: ${res.status}`);
        console.log(`[VAPI WEBHOOK] DEBUG - raw response: ${rawText}`);
        const data = JSON.parse(rawText);
        const sd = data?.analysis?.structuredData;
        if (sd) return sd;
        continue;
      }

      if (!res.ok) {
        console.log(`[VAPI WEBHOOK] Retry ${i + 1}: API respondió ${res.status}`);
        continue;
      }
      const data = await res.json();
      const sd = data?.analysis?.structuredData;
      if (sd) {
        console.log(`[VAPI WEBHOOK] structuredData obtenido en retry ${i + 1}`);
        return sd;
      }
      console.log(`[VAPI WEBHOOK] Retry ${i + 1}: aún sin structuredData`);
    } catch (err) {
      console.error(`[VAPI WEBHOOK] Retry ${i + 1} falló:`, err);
    }
  }
  return null;
}

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

  let structuredData = message.analysis?.structuredData;

  if (!structuredData) {
    console.log("[VAPI WEBHOOK] No hay structuredData en el reporte, reintentando contra la API...");
    const callId = message.call?.id;
    console.log("[VAPI WEBHOOK] DEBUG - callId:", callId);
    if (callId) {
      structuredData = await fetchStructuredDataWithRetry(callId);
    }
  }

  console.log("[VAPI WEBHOOK] structuredData:", JSON.stringify(structuredData));

  if (!structuredData) {
    console.log("[VAPI WEBHOOK] No hay structuredData tras reintentos, abandonando");
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