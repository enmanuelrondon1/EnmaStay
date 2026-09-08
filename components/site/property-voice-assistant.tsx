// components/site/property-voice-assistant.tsx
"use client";

import { useState, useCallback, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { Phone, PhoneOff } from "lucide-react";

type PropertyVoiceAssistantProps = {
  propertyId: string;
  title: string;
  price: number;
  city: string;
  country: string;
  bedrooms: number;
  bathrooms: number;
  description: string;
};

export function PropertyVoiceAssistant({
  propertyId,
  title,
  price,
  city,
  country,
  bedrooms,
  bathrooms,
  description,
}: PropertyVoiceAssistantProps) {
  const [status, setStatus] = useState<"idle" | "connecting" | "active">("idle");
  const vapiRef = useRef<Vapi | null>(null);

  const startCall = useCallback(() => {
    setStatus("connecting");

    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY as string);
    vapiRef.current = vapi;

    vapi.on("call-start", () => setStatus("active"));
    vapi.on("call-end", () => setStatus("idle"));
    vapi.on("error", (error) => {
      console.error("Error en la llamada de Vapi:", error);
      setStatus("idle");
    });

    const propertyContext = `
Contexto de la propiedad actual (usa SOLO estos datos, no inventes nada):
- ID: ${propertyId}
- Título: ${title}
- Precio: $${price}/noche
- Ubicación: ${city}, ${country}
- Habitaciones: ${bedrooms}
- Baños: ${bathrooms}
- Descripción: ${description}
    `.trim();

    vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID as string, {
      variableValues: {
        propertyContext,
      },
    });
  }, [propertyId, title, price, city, country, bedrooms, bathrooms, description]);

  const endCall = useCallback(() => {
    vapiRef.current?.stop();
    setStatus("idle");
  }, []);

  if (status === "idle") {
    return (
      <button
        onClick={startCall}
        className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-white shadow-lg transition hover:bg-emerald-800"
      >
        <Phone className="h-4 w-4" />
        Habla con un asesor
      </button>
    );
  }

  return (
    <button
      onClick={endCall}
      className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-white shadow-lg transition hover:bg-red-700"
    >
      <PhoneOff className="h-4 w-4" />
      {status === "connecting" ? "Conectando..." : "Terminar llamada"}
    </button>
  );
}