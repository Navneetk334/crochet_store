import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { Plus } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import ProductCatalog from "@/components/admin/ProductCatalog";

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });

    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" }
    });

    async function deleteProduct(id: string) {
        "use server";
        await prisma.product.delete({
            where: { id }
        });
        revalidatePath("/admin/products");
        revalidatePath("/");
    }

    async function updateStock(id: string, newStock: number) {
        "use server";
        await prisma.product.update({
            where: { id },
            data: { stock: newStock }
        });
        revalidatePath("/admin/products");
    }

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.3em] font-bold text-sage">Catalog Management</p>
                    <h1 className="text-4xl font-serif text-charcoal">Artisanal Pieces</h1>
                </div>
                <Link
                    href="/admin/products/new"
                    className="btn-primary py-4 px-8 rounded-2xl flex items-center space-x-3 text-sm tracking-widest uppercase shadow-xl group"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                    <span>Add New Piece</span>
                </Link>
            </div>

            <ProductCatalog
                products={products}
                categories={categories}
                onDelete={deleteProduct}
                onUpdateStock={updateStock}
            />
        </div>
    );
}
