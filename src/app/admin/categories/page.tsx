import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { revalidatePath } from "next/cache";
import CategoryList from "@/components/admin/CategoryList";

export default async function AdminCategoriesPage() {
    const categories = await prisma.category.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { name: "asc" },
    });

    async function createCategory(name: string) {
        "use server";
        await prisma.category.create({
            data: {
                name,
                slug: name.toLowerCase().replace(/ /g, "-")
            }
        });
        revalidatePath("/admin/categories");
    }

    async function deleteCategory(id: string) {
        "use server";
        // Check if has products (handled in client but safety check here)
        const productsCount = await prisma.product.count({ where: { categoryId: id } });
        if (productsCount > 0) throw new Error("Category still has products");

        await prisma.category.delete({
            where: { id }
        });
        revalidatePath("/admin/categories");
    }

    return (
        <CategoryList
            categories={categories}
            onCreate={createCategory}
            onDelete={deleteCategory}
        />
    );
}
