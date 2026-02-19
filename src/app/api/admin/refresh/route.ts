import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret_123";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret_456";

export async function POST(req: Request) {
    try {
        const cookies = req.headers.get('cookie') || '';
        const refreshToken = cookies
            .split('; ')
            .find(row => row.startsWith('admin_refresh_token='))
            ?.split('=')[1];

        if (!refreshToken) {
            return NextResponse.json({ message: "No refresh token" }, { status: 401 });
        }

        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { id: string };
        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!user || user.role === "CUSTOMER" || !user.isActive) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const newAccessToken = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        const response = NextResponse.json({ message: "Token refreshed" });

        response.headers.append('Set-Cookie', serialize('admin_access_token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 15 * 60
        }));

        return response;
    } catch (error) {
        return NextResponse.json({ message: "Invalid refresh token" }, { status: 401 });
    }
}
