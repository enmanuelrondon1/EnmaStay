// components/site/booking-chat.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusher-client";

type Message = {
  id: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string | null; role: string };
};

export function BookingChat({
  bookingId,
  currentUserId,
}: {
  bookingId: string;
  currentUserId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/bookings/${bookingId}/messages`)
      .then((res) => res.json())
      .then((data) => setMessages(data.messages ?? []));

    const channel = pusherClient.subscribe(`private-booking-${bookingId}`);
    channel.bind("new-message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      pusherClient.unsubscribe(`private-booking-${bookingId}`);
    };
  }, [bookingId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input }),
      });
      if (res.ok) setInput("");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-96 flex-col rounded-lg border border-stone-300 bg-white">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-stone-500">
            Aún no hay mensajes. Escribe el primero.
          </p>
        )}
        {messages.map((m) => {
          const isMine = m.sender.id === currentUserId;
          return (
            <div
              key={m.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                  isMine
                    ? "bg-ink text-canvas-soft"
                    : "bg-stone-100 text-ink"
                }`}
              >
                {!isMine && (
                  <p className="mb-0.5 text-xs font-medium text-teal">
                    {m.sender.role === "ADMIN" ? "Soporte" : m.sender.name ?? "Huésped"}
                  </p>
                )}
                <p>{m.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 border-t border-stone-300 p-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Escribe un mensaje..."
          className="flex-1 rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-teal"
        />
        <button
          onClick={handleSend}
          disabled={sending || !input.trim()}
          className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-canvas-soft hover:bg-brass disabled:opacity-50"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}