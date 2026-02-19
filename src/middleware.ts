import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(
  process.env.ACCESS_TOKEN_SECRET || "access_secret_123"
);

export async function middleware(req: any) {
  const { pathname } = req.nextUrl;

  const isAdminPath = pathname.startsWith("/admin");
  const isAdminLoginPath = pathname === "/admin/login";
  const isDashboardPath = pathname.startsWith("/dashboard");

  // ===== ADMIN PROTECTION =====
  if (isAdminPath && !isAdminLoginPath) {
    const accessToken = req.cookies.get("admin_access_token")?.value;

    if (!accessToken) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(accessToken, ACCESS_TOKEN_SECRET);
      const role = payload.role as string;

      if (!["SUPER_ADMIN", "ADMIN", "STAFF"].includes(role)) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ===== CUSTOMER DASHBOARD PROTECTION =====
  if (isDashboardPath) {
    const userToken = req.cookies.get("next-auth.session-token")?.value;

    if (!userToken) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
