import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret_123";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret_456";

export async function POST(req: Request) {
    try {
        const { identifier, password } = await req.json();

        if (!identifier || !password) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: identifier },
                    { email: identifier }
                ]
            }
        });

        // Prevention of username enumeration by using generic error
        if (!user || user.role === "CUSTOMER") {
            console.log("Admin Login Failed: User not found or is CUSTOMER", {
                identifier,
                found: !!user,
                role: user?.role
            });
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        if (!user.isActive) {
            console.log("Admin Login Failed: Account disabled", { identifier });
            return NextResponse.json({ message: "Account disabled" }, { status: 403 });
        }

        // Account Lock Logic
        if (user.lockUntil && user.lockUntil > new Date()) {
            console.log("Admin Login Failed: Account locked", { identifier, lockUntil: user.lockUntil });
            await prisma.auditLog.create({
                data: {
                    userId: user.id,
                    action: "LOGIN_ATTEMPT",
                    status: "LOCKED",
                    ip: req.headers.get("x-forwarded-for") || "unknown",
                    userAgent: req.headers.get("user-agent") || "unknown"
                }
            });
            return NextResponse.json({ message: "Account locked temporarily" }, { status: 403 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password || "");

        if (!isPasswordValid) {
            console.log("Admin Login Failed: Invalid password", { identifier });
            const newFailedAttempts = user.failedLoginAttempts + 1;
            let lockUntil = user.lockUntil;

            if (newFailedAttempts >= 3) {
                lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 mins lock
            }

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    failedLoginAttempts: newFailedAttempts,
                    lockUntil
                }
            });

            await prisma.auditLog.create({
                data: {
                    userId: user.id,
                    action: "LOGIN_ATTEMPT",
                    status: "FAILURE",
                    ip: req.headers.get("x-forwarded-for") || "unknown",
                    userAgent: req.headers.get("user-agent") || "unknown"
                }
            });

            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // Reset failed attempts on success
        await prisma.user.update({
            where: { id: user.id },
            data: {
                failedLoginAttempts: 0,
                lockUntil: null,
                lastLogin: new Date()
            }
        });

        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: "LOGIN_SUCCESS",
                status: "SUCCESS",
                ip: req.headers.get("x-forwarded-for") || "unknown",
                userAgent: req.headers.get("user-agent") || "unknown"
            }
        });

        const accessToken = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        const response = NextResponse.json({
            message: "Success",
            user: { username: user.username, role: user.role }
        });

        // Set secure HTTP-only cookies
        response.headers.append('Set-Cookie', serialize('admin_access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 15 * 60
        }));

        response.headers.append('Set-Cookie', serialize('admin_refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 7 * 24 * 60 * 60
        }));

        return response;
    } catch (error) {
        console.error("Admin login error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
