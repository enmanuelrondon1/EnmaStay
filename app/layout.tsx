// app/layout.tsx
import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "sonner";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "EnmaStay · Villas, casas y departamentos en alquiler",
    template: "%s · EnmaStay",
  },
  description:
    "Encuentra tu próxima estadía por ubicación real en el mapa. Villas, casas y departamentos verificados, con reserva y pago directo.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
     <body className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} font-sans antialiased`}>
  <AuthSessionProvider>{children}</AuthSessionProvider>
  <Toaster
    position="bottom-right"
    toastOptions={{
      style: {
        background: "#101b18",
        color: "#f6f3ec",
        border: "1px solid #2f5d57",
      },
    }}
  />
</body>
    </html>
  );
}
