import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = await req.json();

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // 1. Create Address
            const address = await prisma.address.create({
                data: {
                    street: orderData.address,
                    city: orderData.city,
                    state: orderData.state,
                    pincode: orderData.pincode,
                },
            });

            // 2. Create Order in Database
            // Note: In a real app, you'd get the userId from the session
            // For now, we'll use a placeholder or handle Guest checkout
            const order = await prisma.order.create({
                data: {
                    orderNumber: `ORD-${Date.now()}`,
                    totalAmount: orderData.total,
                    paymentStatus: "paid",
                    paymentMethod: "razorpay",
                    razorpayId: razorpay_payment_id,
                    addressId: address.id,
                    userId: "anonymous", // Placeholder for actual auth user
                    status: "PROCESSING",
                    items: {
                        create: orderData.items.map((item: any) => ({
                            productId: item.id,
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                },
            });

            return NextResponse.json({ success: true, orderId: order.id });
        } else {
            return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
        }
    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
