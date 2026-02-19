import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "anonymous";
        if (!rateLimit(ip, 5)) {
            return NextResponse.json({ error: "Too many attempts. Please try later." }, { status: 429 });
        }

        const { amount, items } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        const options = {
            amount: Math.round(amount * 100), // Razorpay expects paise
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        console.error("Razorpay order creation error:", error);
        return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
    }
}
