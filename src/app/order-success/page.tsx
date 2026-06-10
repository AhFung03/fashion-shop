"use client";

import { Check, Mail, PackageCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrderSuccessPage() {
  const [order, setOrder] = useState("LA-DEMO");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setOrder(window.sessionStorage.getItem("lumiere-demo-order") ?? "LA-DEMO");
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <main className="grid min-h-screen place-items-center bg-[#f6f0e8] px-5 py-12">
      <div className="soft-card w-full max-w-xl p-8 text-center md:p-12">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#e5ecdf] text-[#65725b]">
          <Check size={36} strokeWidth={2.5} />
        </div>
        <p className="eyebrow mt-7">Demo order confirmed</p>
        <h1 className="font-display mt-2 text-5xl font-semibold">
          Thank you for testing the shop.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#74675e]">
          Demo order <strong>{order}</strong> was created in this browser. No
          payment was taken and no order was sent to a live database.
        </p>
        <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
          <div className="rounded-xl bg-[#f8f3ec] p-4">
            <Mail size={18} className="text-[#a54f38]" />
            <p className="mt-3 text-xs font-extrabold uppercase">Demo email</p>
            <p className="mt-1 text-xs leading-5 text-[#766a61]">
              Email delivery will be connected during the live deployment.
            </p>
          </div>
          <div className="rounded-xl bg-[#f8f3ec] p-4">
            <PackageCheck size={18} className="text-[#a54f38]" />
            <p className="mt-3 text-xs font-extrabold uppercase">Order preview</p>
            <p className="mt-1 text-xs leading-5 text-[#766a61]">
              The dashboard contains sample order and fulfilment records.
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/account/orders" className="btn-primary">
            View sample orders
          </Link>
          <Link href="/" className="btn-secondary">
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
