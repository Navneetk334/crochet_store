import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(
    process.env.ACCESS_TOKEN_SECRET || "access_secret_123"
);

export default auth(async (req) => {
    const isAuth = !!req.auth;
    const { pathname } = req.nextUrl;

    const isAdminPath = pathname.startsWith("/admin");
    const isAdminLoginPath = pathname === "/admin/login";
    const isAdminApi = pathname.startsWith("/api/admin");
    const isDashboardPath = pathname.startsWith("/dashboard");

    // Admin Access Control
    if (isAdminPath && !isAdminLoginPath && !isAdminApi) {
        const accessToken = req.cookies.get("admin_access_token")?.value;

        if (!accessToken) {
            const loginUrl = new URL("/admin/login", req.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }

        try {
            const { payload } = await jwtVerify(accessToken, ACCESS_TOKEN_SECRET);
            const role = payload.role as string;

            // Allow access if role is one of the admin roles
            if (!["SUPER_ADMIN", "ADMIN", "STAFF"].includes(role)) {
                return NextResponse.redirect(new URL("/", req.url));
            }
        } catch (error) {
            // Token invalid or expired, check for refresh token or redirect
            const loginUrl = new URL("/admin/login", req.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Customer / Dashboard Access Control
    if (isDashboardPath && !isAuth) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/admin/:path*", "/dashboard/:path*"],
};
