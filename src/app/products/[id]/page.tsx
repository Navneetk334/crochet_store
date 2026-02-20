import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Truck,
  ShieldCheck,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/shop/ProductCard";
import ProductActions from "./ProductActions";

export const revalidate = 60;

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // 🔥 FIX: Support BOTH id and slug
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: params.id },
        { slug: params.id },
      ],
    },
    include: {
      category: { select: { name: true, slug: true } },
    },
  });

  if (!product) notFound();

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      NOT: { id: product.id },
    },
    include: {
      category: { select: { name: true } },
    },
    take: 4,
  });

  const finalPrice = product.price;

  const optimizedMainImage =
    product.images?.[0]?.replace(
      "/upload/",
      "/upload/f_auto,q_auto,w_1200/"
    ) || "";

  return (
    <div className="bg-ivory min-h-screen pt-44 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-charcoal/40 mb-12">
          <Link href="/" className="hover:text-sage">
            Home
          </Link>
          <ChevronRight size={10} />
          <Link href="/products" className="hover:text-sage">
            Collection
          </Link>
          <ChevronRight size={10} />
          <span className="text-charcoal/80">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
          {/* IMAGE */}
          <div className="space-y-6">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-pebble relative">
              {optimizedMainImage && (
                <Image
                  src={optimizedMainImage}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover"
                />
              )}
            </div>

            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img: string, i: number) => {
                  const optimizedThumb = img.replace(
                    "/upload/",
                    "/upload/f_auto,q_auto,w_300/"
                  );

                  return (
                    <div
                      key={i}
                      className="aspect-square rounded-xl overflow-hidden bg-pebble relative opacity-80 hover:opacity-100 transition-opacity"
                    >
                      <Image
                        src={optimizedThumb}
                        alt={`${product.name} ${i}`}
                        fill
                        sizes="100px"
                        className="object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div className="space-y-10">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-widest text-sage font-bold px-3 py-1 bg-sage/5 rounded-full">
                {product.category?.name}
              </span>

              <h1 className="text-4xl md:text-5xl font-serif text-charcoal">
                {product.name}
              </h1>

              <p className="text-3xl font-bold text-charcoal">
                ₹{finalPrice.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="space-y-6 text-earth-brown/80 leading-relaxed font-light">
              <p>{product.description}</p>

              {product.care && (
                <div className="p-6 bg-pebble/30 rounded-2xl border border-pebble">
                  <h4 className="font-serif text-lg mb-2 text-charcoal">
                    Care Instructions
                  </h4>
                  <p className="text-xs italic">{product.care}</p>
                </div>
              )}
            </div>

            <ProductActions product={product} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-pebble">
              <div className="flex items-center space-x-3">
                <Truck size={20} className="text-sage" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60">
                  Free Shipping
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <ShieldCheck size={20} className="text-sage" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60">
                  Secure Checkout
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <RefreshCcw size={20} className="text-sage" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60">
                  Artisan Quality
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED */}
        {relatedProducts.length > 0 && (
          <div className="space-y-12">
            <h2 className="text-3xl font-serif text-charcoal">
              Related Pieces
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}