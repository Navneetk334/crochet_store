import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { revalidatePath } from "next/cache";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  const categories = await prisma.category.findMany();

  async function updateProduct(formData: FormData) {
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

    await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        description,
        care,
        sizeChart,
        stock,
        categoryId,
        images: images.length > 0 ? images : product.images,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
      },
    });

    revalidatePath("/admin/products");
    revalidatePath(`/products/${id}`);
    revalidatePath("/");
    redirect("/admin/products");
  }

  return (
    <ProductForm
      initialData={product}
      categories={categories}
      action={updateProduct}
      mode="edit"
    />
  );
}