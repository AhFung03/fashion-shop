"use client";

import { demoOrders, products } from "@/data/products";
import { formatMYR } from "@/lib/commerce";
import { assetPath } from "@/lib/paths";
import type { OrderStatus } from "@/types/shop";
import {
  Bell,
  Boxes,
  ChevronDown,
  CircleDollarSign,
  Eye,
  LayoutDashboard,
  Megaphone,
  Menu,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Store,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const nav = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ShoppingBag, count: 6 },
  { id: "products", label: "Products", icon: Package },
  { id: "customers", label: "Customers", icon: Users },
  { id: "announcements", label: "Announcements", icon: Megaphone },
  { id: "settings", label: "Shop settings", icon: Settings },
] as const;

const statusClass: Record<OrderStatus, string> = {
  pending_payment: "bg-amber-100 text-amber-800",
  paid: "bg-blue-100 text-blue-800",
  processing: "bg-violet-100 text-violet-800",
  ready_for_pickup: "bg-orange-100 text-orange-800",
  shipped: "bg-sky-100 text-sky-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-100 text-rose-800",
};

const statusLabel: Record<OrderStatus, string> = {
  pending_payment: "Pending payment",
  paid: "Paid",
  processing: "Processing",
  ready_for_pickup: "Ready for pickup",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function OwnerDashboard() {
  const [active, setActive] = useState<(typeof nav)[number]["id"]>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [announcement, setAnnouncement] = useState(
    "Raya collection fitting weekend, 13–14 June at our Bangsar store.",
  );
  const [deliveryFee, setDeliveryFee] = useState("12");
  const [notice, setNotice] = useState("");

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2200);
  }

  return (
    <div className="min-h-screen bg-[#f6f3ef] text-[#28211c]">
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col bg-[#29211c] text-white transition-transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div>
            <p className="font-display text-2xl font-bold">LUMIÈRE</p>
            <p className="text-[8px] tracking-[0.25em] text-white/55 uppercase">Shop admin</p>
          </div>
          <button className="lg:hidden" onClick={() => setMobileOpen(false)}><X size={19} /></button>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActive(item.id);
                  setMobileOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-xs font-bold transition ${
                  active === item.id ? "bg-[#a54f38] text-white" : "text-white/70 hover:bg-white/8 hover:text-white"
                }`}
              >
                <Icon size={17} />
                <span className="flex-1">{item.label}</span>
                {"count" in item && (
                  <span className="rounded-full bg-white/15 px-2 py-0.5 text-[9px]">{item.count}</span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4">
          <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-3 text-xs font-bold text-white/70 hover:bg-white/8">
            <Store size={17} /> View storefront
          </Link>
        </div>
      </aside>

      <div className="lg:pl-[250px]">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#e2ddd7] bg-white px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <button className="icon-button lg:hidden" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
            <div>
              <p className="font-display text-2xl font-bold capitalize">{active.replace("_", " ")}</p>
              <p className="hidden text-[10px] text-[#83766e] sm:block">Tuesday, 9 June 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="icon-button relative"><Bell size={18} /><span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#a54f38]" /></button>
            <div className="ml-2 flex items-center gap-3 border-l border-[#e5dfd9] pl-4">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-[#e9ddd2] text-xs font-extrabold">SO</div>
              <div className="hidden sm:block">
                <p className="text-xs font-extrabold">Shop Owner</p>
                <p className="text-[9px] text-[#83766e]">Administrator</p>
              </div>
              <ChevronDown size={14} />
            </div>
          </div>
        </header>

        <main className="p-5 lg:p-8">
          {notice && (
            <div className="fixed top-24 right-5 z-50 rounded-lg bg-[#29211c] px-5 py-3 text-xs font-bold text-white shadow-xl">
              {notice}
            </div>
          )}

          {active === "overview" && (
            <>
              <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h1 className="font-display text-4xl font-semibold">Good afternoon.</h1>
                  <p className="mt-1 text-xs text-[#7b6f67]">Here is what is happening in your shop today.</p>
                </div>
                <button className="btn-primary" onClick={() => setActive("products")}><Plus size={15} /> Add product</button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  [CircleDollarSign, "Today's sales", "RM 1,486", "+18% from yesterday", "#eaf2e5", "#66755b"],
                  [ShoppingBag, "New orders", "12", "6 need attention", "#f7e9e4", "#a54f38"],
                  [Boxes, "Products", "48", "4 low in stock", "#eceaf6", "#6e66a0"],
                  [Users, "Customers", "328", "+9 this week", "#e5f0f3", "#557887"],
                ].map(([Icon, label, value, copy, bg, color]) => {
                  const MetricIcon = Icon as typeof CircleDollarSign;
                  return (
                    <div key={String(label)} className="soft-card p-5">
                      <div className="flex items-center justify-between">
                        <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: String(bg), color: String(color) }}>
                          <MetricIcon size={19} />
                        </div>
                        <span className="text-[9px] font-bold text-[#8a7e76]">TODAY</span>
                      </div>
                      <p className="mt-5 text-xs font-bold text-[#7c7068]">{String(label)}</p>
                      <p className="font-display mt-1 text-4xl font-bold">{String(value)}</p>
                      <p className="mt-2 text-[10px] text-[#8a7e76]">{String(copy)}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
                <section className="soft-card overflow-hidden">
                  <div className="flex items-center justify-between border-b border-[#ebe5df] p-5">
                    <div>
                      <h2 className="font-display text-2xl font-bold">Recent orders</h2>
                      <p className="text-[10px] text-[#887c74]">Latest customer activity</p>
                    </div>
                    <button onClick={() => setActive("orders")} className="text-[10px] font-extrabold text-[#a54f38] uppercase">View all</button>
                  </div>
                  <OrderTable />
                </section>
                <section className="soft-card p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-2xl font-bold">Low stock</h2>
                      <p className="text-[10px] text-[#887c74]">Variants to restock soon</p>
                    </div>
                    <Boxes size={18} className="text-[#a54f38]" />
                  </div>
                  <div className="mt-5 space-y-4">
                    {products.slice(0, 4).map((product, index) => (
                      <div key={product.id} className="flex items-center gap-3">
                        <div
                          className="product-image h-12 w-10 rounded-md"
                          style={
                            {
                              "--image-position": product.imagePosition,
                              "--product-image": `url("${assetPath("/images/fashion-catalog.png")}")`,
                            } as React.CSSProperties
                          }
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-extrabold">{product.name}</p>
                          <p className="text-[9px] text-[#857970]">{product.variants[0].color} · {product.variants[0].size}</p>
                        </div>
                        <span className="rounded-full bg-rose-50 px-2 py-1 text-[9px] font-bold text-rose-700">{index + 2} left</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </>
          )}

          {active === "orders" && (
            <section className="soft-card overflow-hidden">
              <div className="flex flex-col justify-between gap-4 border-b border-[#ebe5df] p-5 sm:flex-row sm:items-center">
                <div>
                  <h1 className="font-display text-3xl font-bold">Customer orders</h1>
                  <p className="text-xs text-[#7c7068]">Review payment and fulfilment progress.</p>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-[#ded7d0] bg-white px-3">
                  <Search size={15} />
                  <input className="h-10 border-0 text-xs outline-0" placeholder="Search order or customer" />
                </div>
              </div>
              <OrderTable expanded />
            </section>
          )}

          {active === "products" && (
            <section className="soft-card overflow-hidden">
              <div className="flex flex-col justify-between gap-4 border-b border-[#ebe5df] p-5 sm:flex-row sm:items-center">
                <div>
                  <h1 className="font-display text-3xl font-bold">Products and stock</h1>
                  <p className="text-xs text-[#7c7068]">Manage styles, prices, sizes, colours, and quantities.</p>
                </div>
                <button onClick={() => flash("Product form ready for Supabase connection")} className="btn-primary"><Plus size={15} /> Add product</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-left">
                  <thead className="bg-[#faf8f5] text-[9px] tracking-[0.08em] text-[#877b73] uppercase">
                    <tr><th className="px-5 py-4">Product</th><th>Category</th><th>Price</th><th>Variants</th><th>Stock</th><th>Status</th><th /></tr>
                  </thead>
                  <tbody>
                    {products.map((product) => {
                      const stock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);
                      return (
                        <tr key={product.id} className="border-t border-[#eee8e2] text-xs">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="product-image h-12 w-10 rounded-md"
                                style={
                                  {
                                    "--image-position": product.imagePosition,
                                    "--product-image": `url("${assetPath("/images/fashion-catalog.png")}")`,
                                  } as React.CSSProperties
                                }
                              />
                              <strong>{product.name}</strong>
                            </div>
                          </td>
                          <td>{product.category}</td><td className="font-bold">{formatMYR(product.price)}</td><td>{product.variants.length}</td><td>{stock}</td>
                          <td><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700">Active</span></td>
                          <td><button className="icon-button" onClick={() => flash(`${product.name} editor opened`)}><Eye size={15} /></button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {active === "announcements" && (
            <section className="mx-auto max-w-3xl">
              <div className="soft-card p-6 md:p-8">
                <Megaphone size={24} className="text-[#a54f38]" />
                <h1 className="font-display mt-4 text-4xl font-bold">Storefront announcement</h1>
                <p className="mt-2 text-sm leading-6 text-[#766a61]">This message appears directly below the main hero on the shop homepage.</p>
                <label className="mt-7 block">
                  <span className="mb-2 block text-xs font-extrabold uppercase">Message</span>
                  <textarea className="field min-h-32 resize-y py-3" value={announcement} onChange={(event) => setAnnouncement(event.target.value)} maxLength={180} />
                </label>
                <div className="mt-2 flex justify-between text-[10px] text-[#897c73]"><span>Keep it short and useful.</span><span>{announcement.length}/180</span></div>
                <div className="mt-6 rounded-xl bg-[#fff8f3] p-5">
                  <p className="text-[9px] font-extrabold tracking-[0.12em] text-[#a54f38] uppercase">Preview</p>
                  <p className="mt-2 text-sm font-bold">{announcement}</p>
                </div>
                <button onClick={() => flash("Announcement published")} className="btn-primary mt-6">Publish announcement</button>
              </div>
            </section>
          )}

          {active === "settings" && (
            <section className="mx-auto max-w-3xl space-y-5">
              <div className="soft-card p-6 md:p-8">
                <h1 className="font-display text-4xl font-bold">Delivery and pickup</h1>
                <p className="mt-2 text-sm text-[#766a61]">Set the flat delivery charge shown during checkout.</p>
                <label className="mt-7 block max-w-xs">
                  <span className="mb-2 block text-xs font-extrabold uppercase">Malaysia delivery fee (MYR)</span>
                  <input className="field" type="number" min="0" value={deliveryFee} onChange={(event) => setDeliveryFee(event.target.value)} />
                </label>
                <div className="mt-5 rounded-xl bg-[#f6f1ea] p-4 text-xs leading-6 text-[#6f635b]">
                  Store pickup remains free. Cash payment is offered only when pickup is selected.
                </div>
                <button onClick={() => flash(`Delivery fee saved at RM ${deliveryFee}`)} className="btn-primary mt-6">Save settings</button>
              </div>
            </section>
          )}

          {(active === "customers") && (
            <section className="soft-card p-8 text-center">
              <Users size={34} className="mx-auto text-[#a54f38]" />
              <h1 className="font-display mt-4 text-4xl font-bold">328 customer accounts</h1>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#766a61]">Customer profiles, contact details, and order histories will be read from Supabase once production credentials are connected.</p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function OrderTable({ expanded = false }: { expanded?: boolean }) {
  const rows = expanded ? [...demoOrders, ...demoOrders.slice(0, 2).map((order, index) => ({ ...order, id: `${order.id}-x`, orderNumber: `LA-${1044 - index}` }))] : demoOrders;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead className="bg-[#faf8f5] text-[9px] tracking-[0.08em] text-[#877b73] uppercase">
          <tr><th className="px-5 py-4">Order</th><th>Customer</th><th>Type</th><th>Payment</th><th>Total</th><th>Status</th><th /></tr>
        </thead>
        <tbody>
          {rows.map((order) => (
            <tr key={order.id} className="border-t border-[#eee8e2] text-xs">
              <td className="px-5 py-4"><strong>{order.orderNumber}</strong><span className="mt-1 block text-[9px] text-[#8a7e76]">{order.createdAt}</span></td>
              <td><strong className="block">{order.customer}</strong><span className="text-[9px] text-[#8a7e76]">{order.email}</span></td>
              <td className="capitalize">{order.fulfilment}</td>
              <td><span className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${order.payment === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{order.payment === "cash_due" ? "Cash due" : "Paid"}</span></td>
              <td className="font-extrabold">{formatMYR(order.total)}</td>
              <td><span className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${statusClass[order.status]}`}>{statusLabel[order.status]}</span></td>
              <td><button className="icon-button"><Eye size={15} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
