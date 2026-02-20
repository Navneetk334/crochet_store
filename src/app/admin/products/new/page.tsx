import { prisma } from "@/lib/prisma";
//export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { revalidatePath } from "next/cache";

export default async function NewProductPage() {
    const categories = await prisma.category.findMany();

    async function createProduct(formData: FormData) {
        "use server";

        const name = formData.get("name") as string;
        const price = parseFloat(formData.get("price") as string);
        const categoryId = formData.get("categoryId") as string;
        const description = formData.get("description") as string;
        const care = formData.get("care") as string;
        const sizeChart = formData.get("sizeChart") as string;
        const stock = parseInt(formData.get("stock") as string);
        const imagesJson = formData.get("imagesJson") as string;

        const images = JSON.parse(imagesJson || "[]");

        await prisma.product.create({
            data: {
                name,
                price,
                description,
                care,
                sizeChart,
                stock,
                categoryId,
                images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=1000&auto=format&fit=crop"],
                slug: name.toLowerCase().replace(/ /g, "-"),
            }
        });

        revalidatePath("/admin/products");
        revalidatePath("/");
        redirect("/admin/products");
    }

    return (
        <ProductForm
            categories={categories}
            action={createProduct}
            mode="create"
        />
    );
}
