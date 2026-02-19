import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

export default async function sitemap() {
    const baseUrl = "https://caughtcrafthanded.com";

    // Get all products
    const products = await prisma.product.findMany({
        select: { slug: true, updatedAt: true },
    });

    const productEntries = products.map((product: any) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: product.updatedAt,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.8,
        },
        ...productEntries,
    ];
}
