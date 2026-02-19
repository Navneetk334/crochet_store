import { NextResponse } from "next/server";

// Simple memory-based rate limiter (Reset on server restart)
const rateLimitMap = new Map();

export function rateLimit(ip: string, limit: number = 10, windowMs: number = 60000) {
    const current = Date.now();
    const userData = rateLimitMap.get(ip) || { count: 0, start: current };

    if (current - userData.start > windowMs) {
        userData.count = 1;
        userData.start = current;
    } else {
        userData.count++;
    }

    rateLimitMap.set(ip, userData);

    return userData.count <= limit;
}

export async function POST(req: Request) {
    // Example usage in API route
    // const ip = req.headers.get("x-forwarded-for") || "anonymous";
    // if (!rateLimit(ip)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
}
