import { prisma } from "@/lib/prisma";
import Image from "next/image";
import {
  Star,
  Trash2,
  CheckCircle,
  MessageSquare,
  User,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

// Cache page for 30 seconds instead of forcing dynamic render
export const revalidate = 30;

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: { product: true, user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-sage">
            Transparency & Feedback
          </p>
          <h1 className="text-4xl font-serif text-charcoal">
            Customer Reviews
          </h1>
        </div>
        <div className="px-6 py-3 bg-white border border-pebble rounded-xl text-xs font-bold uppercase tracking-widest text-charcoal/60 flex items-center gap-3">
          <Star size={16} className="text-terra fill-terra" />
          <span>4.8 Avg Rating</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {reviews.length === 0 ? (
          <div className="py-24 text-center space-y-4 opacity-20 bg-white rounded-3xl border border-pebble">
            <MessageSquare size={48} className="mx-auto" />
            <p className="font-serif text-2xl">
              Awaiting the first whisper of appreciation...
            </p>
          </div>
        ) : (
          reviews.map((review: any) => {
            const optimizedImage =
              review.product.images?.[0]?.replace(
                "/upload/",
                "/upload/f_auto,q_auto,w_600/"
              ) || "";

            return (
              <div
                key={review.id}
                className="bg-white p-8 rounded-3xl border border-pebble shadow-sm hover:shadow transition-all duration-200 flex flex-col md:flex-row gap-8"
              >
                {/* Product Info */}
                <div className="w-full md:w-48 space-y-4">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-pebble border border-pebble relative">
                    {optimizedImage && (
                      <Image
                        src={optimizedImage}
                        alt={review.product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 200px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40">
                      Reviewed Item
                    </p>
                    <Link
                      href={`/products/${review.product.id}`}
                      className="text-sm font-bold text-charcoal hover:text-sage transition-colors block leading-tight"
                    >
                      {review.product.name}
                    </Link>
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < review.rating
                                ? "text-terra fill-terra"
                                : "text-pebble fill-pebble"
                            }
                          />
                        ))}
                      </div>
                      <div className="flex items-center space-x-3">
                        <p className="font-serif text-xl text-charcoal italic tracking-tight">
                          "
                          {review.comment.slice(0, 40)}
                          {review.comment.length > 40 ? "..." : ""}
                          "
                        </p>
                        <span className="px-3 py-0.5 bg-sage/10 text-sage text-[10px] font-bold rounded-full uppercase tracking-widest">
                          Published
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="p-2 bg-pebble rounded-lg text-charcoal/40 hover:text-sage transition-colors">
                        <CheckCircle size={18} />
                      </button>
                      <button className="p-2 bg-pebble rounded-lg text-charcoal/40 hover:text-terra transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-pebble/30 p-6 rounded-2xl border border-pebble/50">
                    <p className="text-sm text-charcoal/80 leading-relaxed font-light italic">
                      {review.comment}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-pebble flex items-center justify-center text-charcoal/20">
                        <User size={16} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-charcoal">
                          {review.user.name || "Anonymous Patron"}
                        </p>
                        <p className="text-[10px] text-charcoal/40 uppercase tracking-widest">
                          {new Date(
                            review.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <button className="text-[10px] uppercase tracking-widest font-bold text-sage underline underline-offset-4 flex items-center gap-2">
                      Reply to Review
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}