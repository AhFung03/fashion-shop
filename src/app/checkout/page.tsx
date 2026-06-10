"use client";

import { useAuth } from "@/components/auth-provider";
import { useCart } from "@/components/cart-provider";
import { products } from "@/data/products";
import {
  DEFAULT_DELIVERY_FEE,
  formatMYR,
  getAllowedPaymentMethods,
  getCartSubtotal,
  getOrderTotal,
  makeOrderNumber,
} from "@/lib/commerce";
import { assetPath } from "@/lib/paths";
import type { FulfilmentMethod, PaymentMethod } from "@/types/shop";
import {
  ArrowLeft,
  Banknote,
  Building2,
  Check,
  CreditCard,
  LockKeyhole,
  MapPin,
  Package,
  Store,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const paymentDetails = {
  card: { icon: CreditCard, title: "Credit or debit card", copy: "Secure Stripe checkout" },
  fpx: { icon: Building2, title: "Online banking (FPX)", copy: "Choose your Malaysian bank" },
  cash: { icon: Banknote, title: "Cash at pickup", copy: "Pay when collecting in store" },
};

export default function CheckoutPage() {
  const { user, ready } = useAuth();
  const { items, clearCart } = useCart();
  const router = useRouter();
  const [fulfilment, setFulfilment] = useState<FulfilmentMethod>("delivery");
  const [payment, setPayment] = useState<PaymentMethod>("card");
  const [submitting, setSubmitting] = useState(false);
  const subtotal = getCartSubtotal(items, products);
  const total = getOrderTotal(subtotal, fulfilment);
  const allowedPayments = getAllowedPaymentMethods(fulfilment);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    if (process.env.NEXT_PUBLIC_STATIC_DEMO === "true") {
      const orderNumber = makeOrderNumber();
      window.sessionStorage.setItem("lumiere-demo-order", orderNumber);
      await new Promise((resolve) => window.setTimeout(resolve, 500));
      clearCart();
      router.push("/order-success");
      return;
    }

    const endpoint = payment === "cash" ? "/api/orders/cash" : "/api/checkout";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, fulfilment, payment, customerEmail: user?.email }),
    });
    const result = (await response.json()) as {
      orderNumber?: string;
      checkoutUrl?: string;
      error?: string;
    };
    setSubmitting(false);
    if (!response.ok) {
      window.alert(result.error ?? "Checkout could not be completed.");
      return;
    }
    clearCart();
    if (result.checkoutUrl) {
      window.location.href = result.checkoutUrl;
      return;
    }
    router.push(`/order-success?order=${result.orderNumber}`);
  }

  if (!ready) {
    return <main className="grid min-h-screen place-items-center bg-[#faf6ef]">Loading checkout...</main>;
  }

  if (!user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#faf6ef] px-5">
        <div className="soft-card max-w-md p-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#f0e6dc]">
            <LockKeyhole size={22} />
          </div>
          <h1 className="font-display mt-5 text-4xl font-semibold">Sign in to check out</h1>
          <p className="mt-3 text-sm leading-6 text-[#766a61]">
            Your bag is saved. Create an account or sign in before entering
            delivery and payment details.
          </p>
          <Link href="/login" className="btn-primary mt-7 w-full">
            Continue to sign in
          </Link>
          <Link href="/" className="mt-4 block text-xs font-bold underline underline-offset-4">
            Return to shopping
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#faf6ef] px-5 text-center">
        <div>
          <Package size={42} className="mx-auto text-[#a54f38]" />
          <h1 className="font-display mt-4 text-5xl font-semibold">Your bag is empty</h1>
          <Link href="/#shop" className="btn-primary mt-7">Browse the collection</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf6ef]">
      <div className="border-b border-[#e7ded2] bg-white">
        <div className="page-shell flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-extrabold uppercase">
            <ArrowLeft size={15} /> Shop
          </Link>
          <p className="font-display text-2xl font-bold">LUMIÈRE</p>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase text-[#77695f]">
            <LockKeyhole size={13} /> Secure checkout
          </p>
        </div>
      </div>
      <form onSubmit={submit} className="page-shell grid gap-8 py-10 lg:grid-cols-[1fr_390px]">
        <div className="space-y-6">
          <section className="soft-card p-6 md:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow">Step 1</p>
                <h2 className="font-display mt-1 text-3xl font-bold">Contact details</h2>
              </div>
              <span className="rounded-full bg-[#edf1e9] px-3 py-1 text-[10px] font-extrabold text-[#65715b]">
                Signed in
              </span>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label>
                <span className="mb-2 block text-xs font-bold">Full name</span>
                <input className="field" required defaultValue={user.name} />
              </label>
              <label>
                <span className="mb-2 block text-xs font-bold">Email</span>
                <input className="field" type="email" required defaultValue={user.email} />
              </label>
              <label>
                <span className="mb-2 block text-xs font-bold">Phone number</span>
                <input className="field" required placeholder="+60 12 345 6789" />
              </label>
            </div>
          </section>

          <section className="soft-card p-6 md:p-8">
            <p className="eyebrow">Step 2</p>
            <h2 className="font-display mt-1 text-3xl font-bold">How would you like it?</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {([
                ["delivery", MapPin, "Delivery", `Flat fee ${formatMYR(DEFAULT_DELIVERY_FEE)}`],
                ["pickup", Store, "Store pickup", "Free · Bangsar"],
              ] as const).map(([value, Icon, title, copy]) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => {
                    setFulfilment(value);
                    if (value === "delivery" && payment === "cash") {
                      setPayment("card");
                    }
                  }}
                  className={`flex items-center gap-4 rounded-xl border p-4 text-left ${
                    fulfilment === value
                      ? "border-[#a54f38] bg-[#fff8f3]"
                      : "border-[#e2d8cc]"
                  }`}
                >
                  <Icon size={21} className="text-[#a54f38]" />
                  <span className="flex-1">
                    <span className="block text-sm font-extrabold">{title}</span>
                    <span className="block text-xs text-[#7c6e64]">{copy}</span>
                  </span>
                  {fulfilment === value && <Check size={17} />}
                </button>
              ))}
            </div>
            {fulfilment === "delivery" ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="md:col-span-2">
                  <span className="mb-2 block text-xs font-bold">Address</span>
                  <input className="field" required placeholder="Street and unit number" />
                </label>
                <label>
                  <span className="mb-2 block text-xs font-bold">Postcode</span>
                  <input className="field" required placeholder="59100" />
                </label>
                <label>
                  <span className="mb-2 block text-xs font-bold">City</span>
                  <input className="field" required placeholder="Kuala Lumpur" />
                </label>
                <label>
                  <span className="mb-2 block text-xs font-bold">State</span>
                  <select className="field" required defaultValue="Kuala Lumpur">
                    <option>Kuala Lumpur</option>
                    <option>Selangor</option>
                    <option>Johor</option>
                    <option>Penang</option>
                    <option>Perak</option>
                    <option>Other</option>
                  </select>
                </label>
              </div>
            ) : (
              <div className="mt-5 rounded-xl bg-[#f4eee6] p-4 text-sm leading-6">
                <strong>Lumière Atelier, Bangsar</strong>
                <br />
                28 Jalan Telawi, Bangsar Baru, 59100 Kuala Lumpur
              </div>
            )}
          </section>

          <section className="soft-card p-6 md:p-8">
            <p className="eyebrow">Step 3</p>
            <h2 className="font-display mt-1 text-3xl font-bold">Payment</h2>
            <div className="mt-6 space-y-3">
              {allowedPayments.map((method) => {
                const detail = paymentDetails[method];
                const Icon = detail.icon;
                return (
                  <button
                    type="button"
                    key={method}
                    onClick={() => setPayment(method)}
                    className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left ${
                      payment === method
                        ? "border-[#a54f38] bg-[#fff8f3]"
                        : "border-[#e2d8cc]"
                    }`}
                  >
                    <Icon size={21} className="text-[#a54f38]" />
                    <span className="flex-1">
                      <span className="block text-sm font-extrabold">{detail.title}</span>
                      <span className="block text-xs text-[#7c6e64]">{detail.copy}</span>
                    </span>
                    <span
                      className={`grid h-5 w-5 place-items-center rounded-full border ${
                        payment === method
                          ? "border-[#a54f38] bg-[#a54f38] text-white"
                          : "border-[#cbbfb3]"
                      }`}
                    >
                      {payment === method && <Check size={12} />}
                    </span>
                  </button>
                );
              })}
            </div>
            {fulfilment === "delivery" && (
              <p className="mt-4 text-xs leading-5 text-[#7d7067]">
                Cash is available for store pickup only. Delivery orders must be
                paid by card or FPX.
              </p>
            )}
          </section>
        </div>

        <aside className="h-fit lg:sticky lg:top-6">
          <div className="soft-card p-6">
            <h2 className="font-display text-3xl font-bold">Order summary</h2>
            <div className="mt-5 space-y-4">
              {items.map((item) => {
                const product = products.find((candidate) => candidate.id === item.productId);
                const variant = product?.variants.find((candidate) => candidate.id === item.variantId);
                if (!product || !variant) return null;
                return (
                  <div key={item.variantId} className="flex gap-3">
                    <div
                      className="product-image h-20 w-16 shrink-0 rounded-lg"
                      style={
                        {
                          "--image-position": product.imagePosition,
                          "--product-image": `url("${assetPath("/images/fashion-catalog.png")}")`,
                        } as React.CSSProperties
                      }
                    />
                    <div className="min-w-0 flex-1 py-1">
                      <p className="font-display text-lg font-bold leading-5">{product.name}</p>
                      <p className="mt-1 text-[10px] text-[#7c6e64]">
                        {variant.color} · {variant.size} · Qty {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-extrabold">
                      {formatMYR(product.price * item.quantity)}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 space-y-3 border-t border-[#e7ded2] pt-5 text-sm">
              <div className="flex justify-between">
                <span className="text-[#766a61]">Subtotal</span>
                <strong>{formatMYR(subtotal)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#766a61]">Delivery</span>
                <strong>
                  {fulfilment === "delivery" ? formatMYR(DEFAULT_DELIVERY_FEE) : "Free"}
                </strong>
              </div>
              <div className="flex justify-between border-t border-[#e7ded2] pt-4 text-lg">
                <span className="font-display text-2xl font-bold">Total</span>
                <strong>{formatMYR(total)}</strong>
              </div>
            </div>
            <button disabled={submitting} className="btn-primary mt-6 w-full disabled:opacity-60">
              {submitting
                ? "Processing..."
                : payment === "cash"
                  ? "Place pickup order"
                  : `Pay ${formatMYR(total)}`}
            </button>
            <p className="mt-4 flex items-center justify-center gap-2 text-[10px] text-[#7f7269]">
              <LockKeyhole size={12} /> Payment details are encrypted and secure
            </p>
          </div>
        </aside>
      </form>
    </main>
  );
}
