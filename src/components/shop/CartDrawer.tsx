"use client";

import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/store/useCart";
import Link from "next/link";
import Image from "next/image";
import { memo } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getTotal } = useCart();

  if (!isOpen) return null;

  const totalItems = items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return (
    <>
      {/* Overlay (lighter, no blur) */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-charcoal/40 z-[100]"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-ivory shadow-xl z-[101] flex flex-col transition-transform duration-300">
        {/* Header */}
        <div className="p-8 border-b border-pebble flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3">
            <ShoppingBag size={24} className="text-sage" />
            <h2 className="text-2xl font-serif text-charcoal">
              Your Bag
            </h2>
            <span className="bg-sage/10 text-sage text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              {totalItems} Items
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-pebble rounded-full transition-colors text-charcoal/40 hover:text-charcoal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-40">
              <div className="w-24 h-24 bg-pebble rounded-full flex items-center justify-center">
                <ShoppingBag size={40} />
              </div>
              <div className="text-center">
                <p className="font-serif text-xl mb-1">
                  Your bag is empty
                </p>
                <p className="text-xs font-light uppercase tracking-widest">
                  Woven memories await
                </p>
              </div>
              <button
                onClick={onClose}
                className="btn-primary-sm"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => {
              const optimizedImage = item.image?.includes(
                "cloudinary.com"
              )
                ? item.image.replace(
                    "/upload/",
                    "/upload/f_auto,q_auto,w_400/"
                  )
                : item.image;

              return (
                <div
                  key={item.id}
                  className="flex gap-6 group"
                >
                  <div className="w-24 h-32 rounded-xl overflow-hidden bg-pebble shadow-sm flex-shrink-0 relative">
                    {optimizedImage && (
                      <Image
                        src={optimizedImage}
                        alt={item.name}
                        fill
                        sizes="150px"
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="space-y-1">
                      <h4 className="font-serif text-lg text-charcoal group-hover:text-terra transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-charcoal font-bold">
                        ₹
                        {item.price.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-pebble rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity - 1
                            )
                          }
                          className="px-3 py-1 hover:bg-pebble transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 py-1 text-xs font-bold border-x border-pebble">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1
                            )
                          }
                          className="px-3 py-1 hover:bg-pebble transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-terra/40 hover:text-terra transition-colors p-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-8 bg-white border-t border-pebble space-y-6">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal/40 font-bold">
                  Subtotal
                </span>
                <p className="text-earth-brown/60 text-xs italic font-light">
                  Shipping & taxes at checkout
                </p>
              </div>
              <p className="text-2xl font-bold text-charcoal">
                ₹{getTotal().toLocaleString("en-IN")}
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/checkout"
                className="w-full btn-primary py-4 flex items-center justify-center text-sm tracking-widest uppercase shadow-lg"
              >
                Secure Checkout
              </Link>

              <button
                onClick={onClose}
                className="w-full text-center text-[10px] uppercase tracking-widest font-bold text-sage py-2 hover:opacity-70 transition-opacity"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default memo(CartDrawer);