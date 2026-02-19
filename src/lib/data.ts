import { prisma } from "./prisma";

export async function getProducts(options?: {
    categoryId?: string;
    isFeatured?: boolean;
    search?: string;
    take?: number;
}) {
    try {
        const products = await prisma.product.findMany({
            where: {
                ...(options?.categoryId && { categoryId: options.categoryId }),
                ...(options?.isFeatured && { isFeatured: options.isFeatured }),
                ...(options?.search && {
                    OR: [
                        { name: { contains: options.search, mode: 'insensitive' } },
                        { description: { contains: options.search, mode: 'insensitive' } },
                    ]
                }),
            },
            include: {
                category: {
                    select: { name: true, slug: true }
                }
            },
            take: options?.take,
            orderBy: { createdAt: 'desc' }
        });
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

export async function getCategories() {
    try {
        return await prisma.category.findMany({
            orderBy: { name: 'asc' }
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}
