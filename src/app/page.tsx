import Hero from "@/components/shop/Hero";
import FeaturedCategories from "@/components/shop/FeaturedCategories";
import BestSellers from "@/components/shop/BestSellers";
import StorySection from "@/components/shop/StorySection";
import Testimonials from "@/components/shop/Testimonials";
import { getProducts } from "@/lib/data";

export const revalidate = 60;

export default async function Home() {
  const products = await getProducts({
    take: 4,
  });

  console.log("PROD PRODUCTS:", products);

  return (
    <main className="bg-paper flex flex-col">
      <Hero />
      <FeaturedCategories />
      <BestSellers products={products} />
      <StorySection />
      <Testimonials />
    </main>
  );
}
