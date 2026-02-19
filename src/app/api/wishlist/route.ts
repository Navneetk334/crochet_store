import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { productId } = await req.json();
        const userId = session.user.id;

        // 1. Get or create wishlist
        let wishlist = await prisma.wishlist.findUnique({
            where: { userId }
        });

        if (!wishlist) {
            wishlist = await prisma.wishlist.create({
                data: { userId }
            });
        }

        // 2. Check if item already exists
        const existingItem = await prisma.wishlistItem.findFirst({
            where: {
                wishlistId: wishlist.id,
                productId
            }
        });

        if (existingItem) {
            // Remove if it exists (Toggle behavior)
            await prisma.wishlistItem.delete({
                where: { id: existingItem.id }
            });
            return NextResponse.json({ active: false });
        } else {
            // Add if it doesn't
            await prisma.wishlistItem.create({
                data: {
                    wishlistId: wishlist.id,
                    productId
                }
            });
            return NextResponse.json({ active: true });
        }
    } catch (error) {
        console.error("[WISHLIST_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ items: [] });
        }

        const wishlist = await prisma.wishlist.findUnique({
            where: { userId: session.user.id },
            include: { items: { select: { productId: true } } }
        });

        return NextResponse.json({
            items: wishlist?.items.map(i => i.productId) || []
        });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
