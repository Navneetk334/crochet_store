import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(
    process.env.ACCESS_TOKEN_SECRET || "access_secret_123"
);

async function getAdminFromToken(req: Request) {
    const cookies = req.headers.get('cookie') || '';
    const accessToken = cookies
        .split('; ')
        .find(row => row.startsWith('admin_access_token='))
        ?.split('=')[1];

    if (!accessToken) return null;

    try {
        const { payload } = await jwtVerify(accessToken, ACCESS_TOKEN_SECRET);
        return payload as { id: string, role: string };
    } catch (e) {
        return null;
    }
}

export async function GET(req: Request) {
    const admin = await getAdminFromToken(req);
    if (!admin || admin.role !== "SUPER_ADMIN") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
        where: {
            role: { in: ["SUPER_ADMIN", "ADMIN", "STAFF"] }
        },
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            isActive: true,
            lastLogin: true,
            createdAt: true
        }
    });

    return NextResponse.json(users);
}

export async function POST(req: Request) {
    const admin = await getAdminFromToken(req);
    if (!admin || admin.role !== "SUPER_ADMIN") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    try {
        const { username, email, password, role } = await req.json();

        if (!username || !email || !password || !role) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Validate role
        if (!["SUPER_ADMIN", "ADMIN", "STAFF"].includes(role)) {
            return NextResponse.json({ message: "Invalid role selected" }, { status: 400 });
        }

        // Check for existing user by email
        const existingUserByEmail = await prisma.user.findUnique({ where: { email } });

        // Check for existing user by username
        const existingUserByUsername = await prisma.user.findUnique({ where: { username } });

        // If username exists and it's NOT the same user as the email holder
        if (existingUserByUsername && existingUserByUsername.email !== email) {
            return NextResponse.json({ message: "Username already taken by another user" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (existingUserByEmail) {
            // User exists - check if already admin
            if (["SUPER_ADMIN", "ADMIN", "STAFF"].includes(existingUserByEmail.role)) {
                return NextResponse.json({ message: "User with this email is already an admin" }, { status: 400 });
            }

            // User is a CUSTOMER (or other) - Promote them
            const updatedUser = await prisma.user.update({
                where: { email },
                data: {
                    username, // Set/Update username
                    password: hashedPassword, // Set secure password
                    role: role as any,
                    isActive: true
                }
            });

            return NextResponse.json({ message: "Existing customer promoted to Admin", id: updatedUser.id }, { status: 200 });
        }

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: role as any,
                isActive: true
            }
        });

        return NextResponse.json({ message: "Admin created successfully", id: newUser.id }, { status: 201 });
    } catch (error) {
        console.error("Admin creation error:", error);
        return NextResponse.json({ message: "Failed to create admin. Please check server logs." }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const admin = await getAdminFromToken(req);
    if (!admin || admin.role !== "SUPER_ADMIN") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });

    // Prevent deleting self
    if (id === admin.id) {
        return NextResponse.json({ message: "Cannot delete yourself" }, { status: 400 });
    }

    await prisma.user.delete({
        where: { id }
    });

    return NextResponse.json({ message: "Admin deleted" });
}
