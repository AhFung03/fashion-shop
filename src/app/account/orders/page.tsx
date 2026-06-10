"use client";

import { useAuth } from "@/components/auth-provider";
import { SiteHeader } from "@/components/site-header";
import { demoOrders } from "@/data/products";
import { formatMYR } from "@/lib/commerce";
import { Check, Circle, LogOut, PackageCheck, Truck } from "lucide-react";
import Link from "next/link";

const labels = {
  pending_payment: "Pending payment",
  paid: "Paid",
  processing: "Being prepared",
  ready_for_pickup: "Ready for pickup",
  shipped: "On the way",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function CustomerOrdersPage() {
  const { user, signOut, ready } = useAuth();
  const orders = demoOrders.slice(0, 3);

  if (ready && !user) {
    return (
      <>
        <SiteHeader />
        <main className="grid min-h-[70vh] place-items-center px-5 text-center">
          <div>
            <h1 className="font-display text-5xl font-semibold">Sign in to see your orders</h1>
            <Link href="/login" className="btn-primary mt-6">Sign in</Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-[80vh] bg-[#faf6ef] py-12">
        <div className="page-shell">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Your account</p>
              <h1 className="font-display mt-2 text-5xl font-semibold">Orders</h1>
              <p className="mt-2 text-sm text-[#766a61]">
                Signed in as {user?.email ?? "customer@example.com"}
              </p>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-xs font-extrabold uppercase"
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>

          <div className="mt-9 space-y-5">
            {orders.map((order, index) => (
              <article key={order.id} className="soft-card overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e7ded2] bg-white px-6 py-5">
                  <div>
                    <p className="font-display text-2xl font-bold">{order.orderNumber}</p>
                    <p className="mt-1 text-[11px] text-[#7b6e65]">{order.createdAt}</p>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full bg-[#edf1e9] px-3 py-1.5 text-[10px] font-extrabold text-[#627058]">
                      {labels[order.status]}
                    </span>
                    <p className="mt-2 text-sm font-extrabold">{formatMYR(order.total)}</p>
                  </div>
                </div>
                <div className="grid gap-7 p-6 md:grid-cols-[1fr_220px]">
                  <div>
                    <div className="mb-5 flex items-center gap-3">
                      {order.fulfilment === "delivery" ? <Truck size={20} /> : <PackageCheck size={20} />}
                      <div>
                        <p className="text-sm font-extrabold">
                          {order.fulfilment === "delivery" ? "Malaysia delivery" : "Bangsar store pickup"}
                        </p>
                        <p className="text-xs text-[#766a61]">
                          {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                        </p>
                      </div>
                    </div>
                    <div className="flex max-w-lg items-center">
                      {[0, 1, 2, 3].map((step) => {
                        const reached = step <= Math.min(index + 1, 3);
                        return (
                          <div key={step} className={`flex items-center ${step < 3 ? "flex-1" : ""}`}>
                            <span
                              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                                reached ? "bg-[#75816a] text-white" : "bg-[#e7ded2] text-[#a99c92]"
                              }`}
                            >
                              {reached ? <Check size={13} /> : <Circle size={8} fill="currentColor" />}
                            </span>
                            {step < 3 && (
                              <span className={`h-[2px] w-full ${reached ? "bg-[#75816a]" : "bg-[#e7ded2]"}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-2 flex max-w-lg justify-between text-[9px] font-bold text-[#887b72] uppercase">
                      <span>Confirmed</span><span>Preparing</span><span>Ready</span><span>Done</span>
                    </div>
                  </div>
                  <div className="rounded-xl bg-[#f8f3ec] p-4 text-xs leading-5 text-[#6f6259]">
                    <strong className="block text-[#29211c]">Need help?</strong>
                    Reply to your confirmation email or call +60 3 2201 8820.
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
