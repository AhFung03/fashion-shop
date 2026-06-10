"use client";

import { useCart } from "@/components/cart-provider";
import { formatMYR } from "@/lib/commerce";
import { assetPath } from "@/lib/paths";
import type { Product } from "@/types/shop";
import { Heart, Plus } from "lucide-react";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const firstAvailable =
    product.variants.find((variant) => variant.stock > 0) ?? product.variants[0];

  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-[18px] bg-[#eee6dc]">
        <Link href={`/products/${product.slug}`} aria-label={product.name}>
          <div
            className="product-image aspect-[4/5] transition duration-500 group-hover:scale-[1.025]"
            style={
              {
                "--image-position": product.imagePosition,
                "--product-image": `url("${assetPath("/images/fashion-catalog.png")}")`,
              } as React.CSSProperties
            }
          />
        </Link>
        {product.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-[#fffdf9]/95 px-3 py-1.5 text-[9px] font-extrabold tracking-[0.1em] uppercase shadow-sm">
            {product.badge}
          </span>
        )}
        <button
          className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-[#fffdf9]/90 transition hover:bg-white hover:text-[#a54f38]"
          aria-label={`Save ${product.name}`}
        >
          <Heart size={16} />
        </button>
        <button
          className="absolute right-3 bottom-3 flex h-10 items-center gap-2 rounded-full bg-[#29211c] px-4 text-[10px] font-extrabold tracking-[0.08em] text-white uppercase opacity-0 translate-y-2 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 max-md:opacity-100 max-md:translate-y-0"
          onClick={() =>
            addItem({
              productId: product.id,
              variantId: firstAvailable.id,
              quantity: 1,
            })
          }
        >
          <Plus size={14} /> Quick add
        </button>
      </div>
      <div className="pt-4">
        <p className="text-[10px] font-bold tracking-[0.12em] text-[#87786e] uppercase">
          {product.category}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-display mt-1 text-[21px] font-bold transition group-hover:text-[#a54f38]">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1 flex items-center gap-2 text-sm">
          <span className="font-extrabold">{formatMYR(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-[#9b8e85] line-through">
              {formatMYR(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
