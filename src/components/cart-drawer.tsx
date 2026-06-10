"use client";

import { useCart } from "@/components/cart-provider";
import { products } from "@/data/products";
import { formatMYR, getCartSubtotal } from "@/lib/commerce";
import { assetPath } from "@/lib/paths";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Link from "next/link";

export function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeItem,
  } = useCart();
  const subtotal = getCartSubtotal(items, products);

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <button
        className={`absolute inset-0 bg-[#211914]/45 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
        aria-label="Close cart"
      />
      <aside
        className={`absolute top-0 right-0 flex h-full w-full max-w-[430px] flex-col bg-[#fffdf9] shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-[#e7ded2] px-6">
          <div>
            <p className="font-display text-2xl font-bold">Your bag</p>
            <p className="text-xs text-[#766a61]">
              {items.length} {items.length === 1 ? "style" : "styles"} selected
            </p>
          </div>
          <button className="icon-button" onClick={() => setIsOpen(false)} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="grid flex-1 place-items-center px-8 text-center">
            <div>
              <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-[#f2eae0]">
                <ShoppingBag size={26} />
              </div>
              <h2 className="font-display text-3xl font-semibold">Your bag is waiting</h2>
              <p className="mt-2 text-sm leading-6 text-[#766a61]">
                Add a few pieces you love and they will stay here while you browse.
              </p>
              <button className="btn-primary mt-6" onClick={() => setIsOpen(false)}>
                Continue shopping
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-5">
                {items.map((item) => {
                  const product = products.find(
                    (candidate) => candidate.id === item.productId,
                  );
                  const variant = product?.variants.find(
                    (candidate) => candidate.id === item.variantId,
                  );
                  if (!product || !variant) return null;
                  return (
                    <div key={item.variantId} className="flex gap-4">
                      <div
                        className="product-image h-[126px] w-[96px] shrink-0 rounded-xl"
                        style={
                          {
                            "--image-position": product.imagePosition,
                            "--product-image": `url("${assetPath("/images/fashion-catalog.png")}")`,
                          } as React.CSSProperties
                        }
                      />
                      <div className="min-w-0 flex-1 py-1">
                        <div className="flex justify-between gap-3">
                          <div>
                            <p className="font-display text-xl font-bold leading-5">
                              {product.name}
                            </p>
                            <p className="mt-2 text-xs text-[#766a61]">
                              {variant.color} · {variant.size}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="text-[#96877c] transition hover:text-[#a54f38]"
                            aria-label={`Remove ${product.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-[#e1d7cb]">
                            <button
                              className="grid h-8 w-8 place-items-center"
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity - 1)
                              }
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-7 text-center text-xs font-bold">
                              {item.quantity}
                            </span>
                            <button
                              className="grid h-8 w-8 place-items-center"
                              onClick={() =>
                                updateQuantity(
                                  item.variantId,
                                  Math.min(variant.stock, item.quantity + 1),
                                )
                              }
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <p className="text-sm font-extrabold">
                            {formatMYR(product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="border-t border-[#e7ded2] bg-white p-6">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-[#766a61]">Subtotal</span>
                <span className="font-extrabold">{formatMYR(subtotal)}</span>
              </div>
              <p className="mb-5 text-[11px] leading-5 text-[#8c7e74]">
                Delivery or pickup options are calculated at checkout.
              </p>
              <Link
                href="/checkout"
                className="btn-primary w-full"
                onClick={() => setIsOpen(false)}
              >
                Proceed to checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
