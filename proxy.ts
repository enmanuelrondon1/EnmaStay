// proxy.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const ADMIN_ROUTES = ["/admin"];
const PROTECTED_ROUTES = ["/mi-cuenta", "/reservas"];

const RATE_LIMIT_RULES: Record<string, { limit: number; windowMs: number }> = {
  "/api/register": { limit: 5, windowMs: 60 * 60 * 1000 },
  "/api/bookings/checkout": { limit: 10, windowMs: 15 * 60 * 1000 },
  "/api/reviews": { limit: 10, windowMs: 60 * 60 * 1000 },
  "/api/auth/forgot-password": { limit: 3, windowMs: 60 * 60 * 1000 },
};

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // --- Rate limiting para endpoints públicos sensibles ---
  const rule = RATE_LIMIT_RULES[pathname];
  if (rule) {
    const ip = getClientIp(req);
    const identifier = `${pathname}:${ip}`;
    const result = rateLimit(identifier, rule);

    if (!result.success) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta de nuevo más tarde." },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((result.resetAt - Date.now()) / 1000).toString(),
          },
        }
      );
    }
  }

  // --- Protección de rutas admin/usuario ---
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  const isProtectedRoute = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));

  if (isAdminRoute && (!isLoggedIn || role !== "ADMIN")) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/mi-cuenta/:path*",
    "/reservas/:path*",
    "/api/register",
    "/api/bookings/checkout",
    "/api/reviews",
    "/api/auth/forgot-password",
  ],
};