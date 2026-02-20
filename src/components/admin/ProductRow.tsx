"use client";

import React, { useState, memo, useCallback } from "react";
import { Edit, Trash2, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProductRowProps {
  product: any;
  onDelete: (id: string) => Promise<void>;
  onUpdateStock: (id: string, newStock: number) => Promise<void>;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function ProductRow({
  product,
  onDelete,
  onUpdateStock,
  isSelected,
  onSelect,
}: ProductRowProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);

  const optimizedImage =
    product.images?.[0]?.replace(
      "/upload/",
      "/upload/f_auto,q_auto,w_300/"
    ) || "";

  /* ---------------- DELETE ---------------- */
  const handleDelete = useCallback(async () => {
    const confirmed = window.confirm(
      `Remove "${product.name}" from catalog?`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await onDelete(product.id);
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setIsDeleting(false);
    }
  }, [product.id, product.name, onDelete]);

  /* ---------------- UPDATE STOCK ---------------- */
  const handleUpdateStock = useCallback(async () => {
    const input = window.prompt(
      `Update stock for "${product.name}":`,
      product.stock.toString()
    );

    if (!input) return;

    const newStock = parseInt(input);
    if (isNaN(newStock)) return;

    setIsUpdatingStock(true);
    try {
      await onUpdateStock(product.id, newStock);
    } catch (error) {
      console.error("Stock update failed", error);
    } finally {
      setIsUpdatingStock(false);
    }
  }, [product.id, product.name, product.stock, onUpdateStock]);

  const stockColor =
    product.stock > 10
      ? "bg-green-500"
      : product.stock > 0
      ? "bg-terra"
      : "bg-red-500";

  return (
    <tr
      className={`group hover:bg-pebble/20 transition-colors ${
        isDeleting || isUpdatingStock
          ? "opacity-50 pointer-events-none"
          : ""
      }`}
    >
      {/* Checkbox */}
      <td className="px-8 py-6">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(product.id)}
          className="w-4 h-4 rounded border-pebble text-sage accent-sage cursor-pointer"
        />
      </td>

      {/* Product Info */}
      <td className="px-4 py-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-16 rounded-lg overflow-hidden bg-pebble flex-shrink-0 relative">
            {optimizedImage && (
              <Image
                src={optimizedImage}
                alt={product.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold text-charcoal group-hover:text-sage transition-colors">
              {product.name}
            </p>
            <p className="text-[10px] uppercase text-charcoal/30 font-mono">
              SKU-{product.id.slice(-6).toUpperCase()}
            </p>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-8 py-6">
        <span className="text-[10px] uppercase font-bold text-charcoal/60 px-3 py-1 bg-pebble rounded-full">
          {product.category.name}
        </span>
      </td>

      {/* Price */}
      <td className="px-8 py-6">
        <p className="text-sm font-bold text-charcoal">
          ₹{product.price.toLocaleString("en-IN")}
        </p>
      </td>

      {/* Stock */}
      <td className="px-8 py-6">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${stockColor}`} />
          <span className="text-sm font-medium text-charcoal/80">
            {product.stock} in stock
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="px-8 py-6">
        <span className="px-3 py-1 bg-sage/10 text-sage text-[10px] font-bold rounded-full uppercase">
          Published
        </span>
      </td>

      {/* Actions */}
      <td className="px-8 py-6 text-right">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={handleUpdateStock}
            title="Update Inventory"
            className="p-2 text-charcoal/40 hover:text-sage transition-colors"
          >
            <RefreshCw
              size={18}
              className={isUpdatingStock ? "animate-spin" : ""}
            />
          </button>

          <Link
            href={`/admin/products/${product.id}`}
            className="p-2 text-charcoal/40 hover:text-sage transition-colors"
          >
            <Edit size={18} />
          </Link>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-charcoal/40 hover:text-terra transition-colors disabled:opacity-50"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default memo(ProductRow);