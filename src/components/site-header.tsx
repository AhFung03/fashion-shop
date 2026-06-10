"use client";

import { useAuth } from "@/components/auth-provider";
import { useCart } from "@/components/cart-provider";
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/#new", label: "New in" },
  { href: "/#shop", label: "Shop" },
  { href: "/#story", label: "Our story" },
  { href: "/#announcement", label: "Announcements" },
];

export function SiteHeader() {
  const { itemCount, setIsOpen } = useCart();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="bg-[#29211c] px-4 py-2 text-center text-[11px] font-bold tracking-[0.12em] text-white uppercase">
        Free pickup in store · Delivery across Malaysia
      </div>
      <header className="sticky top-0 z-40 border-b border-[#e9e0d5] bg-[#fffdf9]/95 backdrop-blur">
        <div className="page-shell flex h-[74px] items-center justify-between">
          <button
            className="icon-button md:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Open menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-display text-[28px] font-bold tracking-[0.04em]">
              LUMIÈRE
            </span>
            <span className="mt-1 text-[8px] font-bold tracking-[0.36em] text-[#8b796c]">
              ATELIER
            </span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[12px] font-bold tracking-[0.08em] uppercase transition hover:text-[#a54f38]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <Link href="/#shop" className="icon-button hidden sm:grid" aria-label="Search">
              <Search size={19} />
            </Link>
            <Link href={user ? "/account/orders" : "/login"} className="icon-button" aria-label="Account">
              <UserRound size={19} />
            </Link>
            <button
              className="icon-button relative"
              onClick={() => setIsOpen(true)}
              aria-label={`Cart with ${itemCount} items`}
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#a54f38] px-1 text-[9px] font-extrabold text-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="border-t border-[#eee5da] bg-white px-6 py-5 md:hidden">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block border-b border-[#f1ebe4] py-3 text-sm font-bold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
