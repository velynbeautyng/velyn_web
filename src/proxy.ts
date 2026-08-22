import { NextResponse, type NextRequest } from "next/server";
import { maintenancePage } from "@/lib/maintenance-page";

/**
 * Maintenance switch. The storefront is held behind a holding page unless
 * MAINTENANCE_MODE is explicitly turned off in the environment, so lifting it
 * is an env change in Vercel rather than a deploy.
 *
 * Set MAINTENANCE_PREVIEW_TOKEN to let the team walk the live site while the
 * page is up: visit /?preview=<token> once and the session is exempt.
 */
const OFF_VALUES = new Set(["0", "off", "false", "no"]);
const PREVIEW_COOKIE = "velyn_preview";
const PREVIEW_MAX_AGE = 60 * 60 * 24 * 7;

const maintenanceOn = !OFF_VALUES.has(
  (process.env.MAINTENANCE_MODE ?? "on").trim().toLowerCase(),
);
const previewToken = process.env.MAINTENANCE_PREVIEW_TOKEN?.trim();

export function proxy(request: NextRequest) {
  if (!maintenanceOn) return NextResponse.next();

  if (previewToken) {
    if (request.nextUrl.searchParams.get("preview") === previewToken) {
      const url = request.nextUrl.clone();
      url.searchParams.delete("preview");
      const response = NextResponse.redirect(url);
      response.cookies.set(PREVIEW_COOKIE, previewToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: PREVIEW_MAX_AGE,
      });
      return response;
    }
    if (request.cookies.get(PREVIEW_COOKIE)?.value === previewToken) {
      return NextResponse.next();
    }
  }

  // 503 rather than 200 so search engines hold the existing index and retry.
  return new NextResponse(request.method === "HEAD" ? null : maintenancePage, {
    status: 503,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store, must-revalidate",
      "retry-after": "3600",
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|icon.svg|brand/).*)"],
};
