"use client";

import { CartDrawer } from "@/components/cart-drawer";
import { useCart } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatMYR } from "@/lib/commerce";
import { assetPath } from "@/lib/paths";
import type { Product } from "@/types/shop";
import { Check, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export function ProductDetail({ product }: { product: Product }) {
  const colors = [...new Set(product.variants.map((variant) => variant.color))];
  const [color, setColor] = useState(colors[0]);
  const sizes = [
    ...new Set(
      product.variants
        .filter((variant) => variant.color === color)
        .map((variant) => variant.size),
    ),
  ];
  const [size, setSize] = useState(sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const variant = useMemo(
    () =>
      product.variants.find(
        (candidate) => candidate.color === color && candidate.size === size,
      ),
    [color, product.variants, size],
  );

  function chooseColor(nextColor: string) {
    setColor(nextColor);
    const firstSize = product.variants.find(
      (candidate) => candidate.color === nextColor && candidate.stock > 0,
    )?.size;
    if (firstSize) setSize(firstSize);
  }

  return (
    <>
      <SiteHeader />
      <CartDrawer />
      <main className="page-shell py-8 md:py-14">
        <div className="mb-7 text-xs text-[#81736a]">
          <Link href="/">Home</Link> / <Link href="/#shop">{product.category}</Link> /{" "}
          <span className="text-[#29211c]">{product.name}</span>
        </div>
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
          <div
            className="product-image aspect-[4/5] rounded-[24px]"
            style={
              {
                "--image-position": product.imagePosition,
                "--product-image": `url("${assetPath("/images/fashion-catalog.png")}")`,
              } as React.CSSProperties
            }
          />
          <div className="md:py-6">
            <p className="eyebrow">{product.category}</p>
            <h1 className="font-display mt-3 text-5xl font-semibold leading-none">
              {product.name}
            </h1>
            <div className="mt-5 flex items-center gap-3">
              <p className="text-lg font-extrabold">{formatMYR(product.price)}</p>
              {product.compareAtPrice && (
                <p className="text-sm text-[#9b8e85] line-through">
                  {formatMYR(product.compareAtPrice)}
                </p>
              )}
            </div>
            <p className="mt-7 max-w-lg text-sm leading-7 text-[#6f6259]">
              {product.description}
            </p>

            <div className="mt-8">
              <div className="mb-3 flex justify-between text-xs font-extrabold uppercase">
                <span>Colour</span>
                <span className="text-[#7f7167]">{color}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.map((item) => (
                  <button
                    key={item}
                    className={`rounded-full border px-4 py-2 text-xs font-bold ${
                      color === item
                        ? "border-[#29211c] bg-[#29211c] text-white"
                        : "border-[#ddd2c6]"
                    }`}
                    onClick={() => chooseColor(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <div className="mb-3 flex justify-between text-xs font-extrabold uppercase">
                <span>Size</span>
                <span className="text-[#7f7167]">
                  {variant?.stock ?? 0} available
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((item) => {
                  const sizeVariant = product.variants.find(
                    (candidate) =>
                      candidate.color === color && candidate.size === item,
                  );
                  return (
                    <button
                      key={item}
                      disabled={!sizeVariant?.stock}
                      className={`grid min-h-11 min-w-12 place-items-center rounded-lg border px-3 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-30 ${
                        size === item
                          ? "border-[#a54f38] bg-[#a54f38] text-white"
                          : "border-[#ddd2c6]"
                      }`}
                      onClick={() => setSize(item)}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <div className="flex h-12 items-center rounded-full border border-[#ddd2c6]">
                <button
                  className="grid h-12 w-10 place-items-center"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-sm font-extrabold">
                  {quantity}
                </span>
                <button
                  className="grid h-12 w-10 place-items-center"
                  onClick={() =>
                    setQuantity((value) =>
                      Math.min(variant?.stock ?? 1, value + 1),
                    )
                  }
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                disabled={!variant?.stock}
                className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() =>
                  variant &&
                  addItem({
                    productId: product.id,
                    variantId: variant.id,
                    quantity,
                  })
                }
              >
                Add to bag
              </button>
            </div>
            <div className="mt-8 space-y-3 border-t border-[#e7ded2] pt-6 text-xs text-[#665a52]">
              <p className="flex items-center gap-3">
                <Truck size={17} /> Flat-rate Malaysia delivery or free store pickup
              </p>
              <p className="flex items-center gap-3">
                <ShieldCheck size={17} /> Secure card and FPX checkout
              </p>
              <p className="flex items-center gap-3">
                <Check size={17} /> Stock tracked for every size and colour
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
