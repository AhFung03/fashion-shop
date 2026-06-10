"use client";

import { CartDrawer } from "@/components/cart-drawer";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { products } from "@/data/products";
import { assetPath } from "@/lib/paths";
import type { Category } from "@/types/shop";
import { ArrowRight, Clock3, PackageCheck, RefreshCw, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const categories: Array<"All" | Category> = [
  "All",
  "Dresses",
  "Sets",
  "Tops",
  "Bottoms",
  "Accessories",
];

export function Storefront() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [query, setQuery] = useState("");
  const visibleProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          (category === "All" || product.category === category) &&
          product.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [category, query],
  );

  return (
    <>
      <SiteHeader />
      <CartDrawer />
      <main>
        <section className="relative min-h-[650px] overflow-hidden bg-[#eee5d8]">
          <Image
            src={assetPath("/images/fashion-hero.png")}
            alt="Lumière Atelier summer collection"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f3eadc]/95 via-[#f3eadc]/50 to-transparent" />
          <div className="page-shell relative flex min-h-[650px] items-center py-20">
            <div className="max-w-[580px]">
              <p className="eyebrow">The summer edit · 2026</p>
              <h1 className="font-display mt-4 text-[clamp(3.7rem,7vw,6.5rem)] leading-[0.82] font-semibold tracking-[-0.04em]">
                Ease, made
                <br />
                <span className="italic">beautiful.</span>
              </h1>
              <p className="mt-7 max-w-md text-[15px] leading-7 text-[#66584f]">
                Soft tailoring, natural textures, and thoughtful silhouettes made
                for warm days and unhurried evenings.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="#shop" className="btn-primary">
                  Shop the collection <ArrowRight size={16} />
                </Link>
                <Link href="#story" className="btn-secondary">
                  Our story
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-[9px] font-bold tracking-[0.2em] uppercase md:block">
            Scroll to discover
          </div>
        </section>

        <section id="announcement" className="border-y border-[#e7ded2] bg-[#fffaf3]">
          <div className="page-shell flex flex-col items-center justify-between gap-3 py-5 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-[#a54f38] px-3 py-1 text-[9px] font-extrabold tracking-[0.1em] text-white uppercase">
                Shop note
              </span>
              <p className="text-sm font-semibold">
                Raya collection fitting weekend, 13–14 June at our Bangsar store.
              </p>
            </div>
            <Link href="#shop" className="text-xs font-extrabold underline underline-offset-4">
              View collection
            </Link>
          </div>
        </section>

        <section id="new" className="page-shell py-24">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="eyebrow">Freshly arrived</p>
              <h2 className="font-display mt-2 text-5xl font-semibold">New this week</h2>
            </div>
            <Link href="#shop" className="hidden items-center gap-2 text-xs font-extrabold uppercase sm:flex">
              View all <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section id="story" className="bg-[#78816c] text-white">
          <div className="page-shell grid min-h-[520px] items-center gap-12 py-16 md:grid-cols-2">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-[28px]">
              <Image
                src={assetPath("/images/fashion-catalog.png")}
                alt="Details from the Lumière collection"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 45vw"
              />
            </div>
            <div className="max-w-lg">
              <p className="text-[10px] font-extrabold tracking-[0.18em] text-[#eee7dc] uppercase">
                Clothes with a longer life
              </p>
              <h2 className="font-display mt-4 text-5xl leading-[0.95] font-semibold">
                Designed for the way you actually live.
              </h2>
              <p className="mt-6 text-sm leading-7 text-[#f1ece4]">
                We choose pieces that feel special without being difficult. Every
                collection is built around breathable fabrics, useful details, and
                shapes you can return to season after season.
              </p>
              <Link href="#shop" className="mt-8 inline-flex items-center gap-2 border-b border-white pb-1 text-xs font-extrabold uppercase">
                Explore the edit <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        <section id="shop" className="page-shell py-24">
          <div className="text-center">
            <p className="eyebrow">The full collection</p>
            <h2 className="font-display mt-2 text-5xl font-semibold">Find your next favourite</h2>
          </div>
          <div className="mt-9 flex flex-col items-center justify-between gap-5 border-b border-[#e7ded2] pb-5 md:flex-row">
            <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`shrink-0 rounded-full px-4 py-2 text-[10px] font-extrabold tracking-[0.08em] uppercase transition ${
                    category === item
                      ? "bg-[#29211c] text-white"
                      : "bg-[#f4eee6] hover:bg-[#e9ded2]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <label className="flex h-10 w-full max-w-[250px] items-center gap-2 rounded-full border border-[#ded3c6] bg-white px-4">
              <Search size={15} className="text-[#8d7f75]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search styles"
                className="w-full border-0 bg-transparent text-xs outline-0"
              />
            </label>
          </div>
          <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-6">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {visibleProducts.length === 0 && (
            <div className="py-20 text-center text-sm text-[#766a61]">
              No styles match that search yet.
            </div>
          )}
        </section>

        <section className="border-y border-[#e7ded2] bg-[#faf6ef]">
          <div className="page-shell grid gap-8 py-10 sm:grid-cols-3">
            {[
              [PackageCheck, "Delivery across Malaysia", "Flat-rate delivery with live order updates."],
              [RefreshCw, "Easy order support", "Contact the shop if something is not quite right."],
              [Clock3, "Free store pickup", "Collect from our Bangsar store at no charge."],
            ].map(([Icon, title, copy]) => {
              const FeatureIcon = Icon as typeof PackageCheck;
              return (
                <div key={String(title)} className="flex items-start gap-4">
                  <FeatureIcon size={22} className="mt-1 shrink-0 text-[#a54f38]" />
                  <div>
                    <p className="font-display text-xl font-bold">{String(title)}</p>
                    <p className="mt-1 text-xs leading-5 text-[#766a61]">{String(copy)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
