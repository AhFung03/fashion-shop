"use client";

import { useAuth } from "@/components/auth-provider";
import {
  findFitment,
  formatMYR,
  getCarBrands,
  getCarTypes,
  getMatchingProducts,
  getRequestDisplayPrice,
  useCarCareStore,
} from "@/lib/demo-car-care-store";
import type { CarCareProduct, ProductCategory } from "@/types/car-care";
import {
  BatteryCharging,
  CalendarDays,
  Gauge,
  LayoutDashboard,
  LogIn,
  LogOut,
  Phone,
  Save,
  Search,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

const categoryCopy: Record<ProductCategory, string> = {
  tyre: "Tyres",
  battery: "Batteries",
};

export function Storefront() {
  const { user, signOut } = useAuth();
  const { store, createRequest } = useCarCareStore();
  const brands = useMemo(() => getCarBrands(store.fitments), [store.fitments]);
  const [selectedBrand, setSelectedBrand] = useState(brands[0] ?? "");
  const selectedBrandValue = selectedBrand || brands[0] || "";
  const carTypes = useMemo(
    () => getCarTypes(store.fitments, selectedBrandValue),
    [selectedBrandValue, store.fitments],
  );
  const [selectedType, setSelectedType] = useState("");
  const selectedTypeValue = selectedType || carTypes[0] || "";
  const [category, setCategory] = useState<ProductCategory>("tyre");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [customerName, setCustomerName] = useState(user?.name ?? "");
  const [customerEmail, setCustomerEmail] = useState(user?.email ?? "");
  const [customerPhone, setCustomerPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [notice, setNotice] = useState("");

  const fitment = findFitment(store.fitments, selectedBrandValue, selectedTypeValue);
  const targetSize = category === "tyre" ? fitment?.tyreSize : fitment?.batterySize;
  const matchingProducts = useMemo(
    () => getMatchingProducts(store.products, category, targetSize),
    [category, store.products, targetSize],
  );
  const selectedProduct =
    matchingProducts.find((product) => product.id === selectedProductId) ??
    matchingProducts[0];
  const ownRequests = user
    ? store.requests.filter((request) => request.customerEmail === user.email)
    : [];

  function updateBrand(value: string) {
    setSelectedBrand(value);
    const firstType = getCarTypes(store.fitments, value)[0] ?? "";
    setSelectedType(firstType);
    setSelectedProductId("");
  }

  function updateType(value: string) {
    setSelectedType(value);
    setSelectedProductId("");
  }

  function updateCategory(value: ProductCategory) {
    setCategory(value);
    setSelectedProductId("");
  }

  function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedProduct || !fitment) return;

    const request = createRequest({
      customerName,
      customerEmail,
      customerPhone,
      carBrand: selectedBrandValue,
      carType: selectedTypeValue,
      product: selectedProduct,
      preferredDate,
      customerNote,
    });

    setNotice(`Request ${request.requestNumber} sent for admin quote.`);
    setCustomerPhone("");
    setCustomerNote("");
    window.setTimeout(() => setNotice(""), 3500);
  }

  return (
    <main className="min-h-screen bg-[#f5f6f3] text-[#1f2522]">
      <header className="sticky top-0 z-40 border-b border-[#dfe5dd] bg-white/95 backdrop-blur">
        <div className="page-shell flex min-h-[72px] flex-wrap items-center justify-between gap-3 py-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#1f4336] text-white">
              <ShieldCheck size={20} />
            </span>
            <span>
              <span className="block text-lg font-extrabold">CarCare Demo</span>
              <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#617069]">
                Tyres and batteries
              </span>
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/dashboard" className="btn-secondary">
              <LayoutDashboard size={16} /> Admin
            </Link>
            {user ? (
              <button className="btn-dark" onClick={signOut}>
                <LogOut size={16} /> Sign out
              </button>
            ) : (
              <Link href="/login" className="btn-dark">
                <LogIn size={16} /> Sign in
              </Link>
            )}
          </nav>
        </div>
      </header>

      {notice && (
        <div className="fixed right-5 top-24 z-50 rounded-lg bg-[#1f4336] px-5 py-3 text-sm font-bold text-white shadow-xl">
          {notice}
        </div>
      )}

      <section className="page-shell grid gap-6 py-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="soft-card p-5 md:p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="eyebrow">Vehicle fitment</p>
                <h1 className="mt-2 text-3xl font-extrabold tracking-normal md:text-4xl">
                  Find matching stock
                </h1>
              </div>
              <div className="flex rounded-lg border border-[#d7ded6] bg-[#eef3ef] p-1">
                {(["tyre", "battery"] as const).map((item) => (
                  <button
                    key={item}
                    className={`inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-extrabold ${
                      category === item ? "bg-white shadow-sm" : "text-[#617069]"
                    }`}
                    onClick={() => updateCategory(item)}
                  >
                    {item === "tyre" ? <Gauge size={16} /> : <BatteryCharging size={16} />}
                    {categoryCopy[item]}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label>
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.08em]">
                  Car brand
                </span>
                <select
                  className="field"
                  value={selectedBrandValue}
                  onChange={(event) => updateBrand(event.target.value)}
                >
                  {brands.map((brand) => (
                    <option key={brand}>{brand}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.08em]">
                  Car type
                </span>
                <select
                  className="field"
                  value={selectedTypeValue}
                  onChange={(event) => updateType(event.target.value)}
                >
                  {carTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </label>
            </div>

            {fitment && (
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-[#dfe5dd] bg-[#f8faf7] p-4">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#617069]">
                    Tyre size
                  </p>
                  <p className="mt-1 text-2xl font-extrabold">{fitment.tyreSize}</p>
                </div>
                <div className="rounded-lg border border-[#dfe5dd] bg-[#f8faf7] p-4">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#617069]">
                    Battery size
                  </p>
                  <p className="mt-1 text-2xl font-extrabold">{fitment.batterySize}</p>
                </div>
              </div>
            )}
          </section>

          <section className="soft-card overflow-hidden">
            <div className="flex flex-col justify-between gap-3 border-b border-[#dfe5dd] p-5 md:flex-row md:items-center">
              <div>
                <p className="eyebrow">Available stock</p>
                <h2 className="mt-1 text-2xl font-extrabold">
                  {categoryCopy[category]} for {targetSize ?? "selected car"}
                </h2>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-[#d7ded6] bg-white px-3">
                <Search size={15} className="text-[#617069]" />
                <span className="h-10 text-sm font-bold leading-10 text-[#617069]">
                  {matchingProducts.length} match
                </span>
              </div>
            </div>

            <div className="grid gap-3 p-5 md:grid-cols-2">
              {matchingProducts.map((product) => (
                <ProductChoice
                  key={product.id}
                  product={product}
                  selected={selectedProduct?.id === product.id}
                  onSelect={() => setSelectedProductId(product.id)}
                />
              ))}
              {matchingProducts.length === 0 && (
                <div className="rounded-lg border border-dashed border-[#cfd8d1] bg-[#fafcf9] p-8 text-center text-sm text-[#617069] md:col-span-2">
                  No active stock matches this size.
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="soft-card p-5 md:p-6">
            <p className="eyebrow">Booking request</p>
            <h2 className="mt-2 text-2xl font-extrabold">Send for quote</h2>
            {selectedProduct ? (
              <div className="mt-4 rounded-lg bg-[#eef3ef] p-4">
                <p className="text-sm font-extrabold">
                  {selectedProduct.brand} {selectedProduct.name}
                </p>
                <p className="mt-1 text-xs text-[#617069]">
                  {selectedProduct.size} · Estimate {formatMYR(selectedProduct.price)}
                </p>
              </div>
            ) : (
              <div className="mt-4 rounded-lg bg-[#fff7ed] p-4 text-sm font-bold text-[#9a5b20]">
                Select available stock first.
              </div>
            )}

            <form onSubmit={submitRequest} className="mt-5 space-y-4">
              <label>
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.08em]">
                  Name
                </span>
                <input
                  className="field"
                  required
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                />
              </label>
              <label>
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.08em]">
                  Email
                </span>
                <input
                  className="field"
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(event) => setCustomerEmail(event.target.value)}
                />
              </label>
              <label>
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.08em]">
                  Phone
                </span>
                <input
                  className="field"
                  required
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  placeholder="+60 12 345 6789"
                />
              </label>
              <label>
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.08em]">
                  Preferred date
                </span>
                <input
                  className="field"
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(event) => setPreferredDate(event.target.value)}
                />
              </label>
              <label>
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.08em]">
                  Note
                </span>
                <textarea
                  className="field min-h-24 resize-y py-3"
                  value={customerNote}
                  onChange={(event) => setCustomerNote(event.target.value)}
                  placeholder="Quantity, issue, or timing"
                />
              </label>
              <button className="btn-primary w-full" disabled={!selectedProduct}>
                <Save size={16} /> Submit request
              </button>
            </form>
          </section>

          {user && (
            <section className="soft-card p-5 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="eyebrow">My requests</p>
                  <h2 className="mt-1 text-xl font-extrabold">{ownRequests.length} open</h2>
                </div>
                <Phone size={18} className="text-[#1f4336]" />
              </div>
              <div className="mt-4 space-y-3">
                {ownRequests.slice(0, 4).map((request) => (
                  <div key={request.id} className="rounded-lg border border-[#dfe5dd] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-extrabold">{request.requestNumber}</p>
                      <span className="rounded-full bg-[#eef3ef] px-2 py-1 text-[10px] font-extrabold uppercase">
                        {request.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-[#617069]">
                      {request.productName} · {formatMYR(getRequestDisplayPrice(request))}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-[#617069]">
                      <CalendarDays size={12} /> {request.preferredDate}
                    </p>
                  </div>
                ))}
                {ownRequests.length === 0 && (
                  <p className="rounded-lg border border-dashed border-[#cfd8d1] p-4 text-sm text-[#617069]">
                    No requests for this account yet.
                  </p>
                )}
              </div>
            </section>
          )}
        </aside>
      </section>
    </main>
  );
}

function ProductChoice({
  product,
  selected,
  onSelect,
}: {
  product: CarCareProduct;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-lg border p-4 text-left transition ${
        selected
          ? "border-[#1f4336] bg-[#eef3ef] shadow-sm"
          : "border-[#dfe5dd] bg-white hover:border-[#9fb0a5]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#617069]">
            {product.brand}
          </p>
          <h3 className="mt-1 text-lg font-extrabold">{product.name}</h3>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold text-[#1f4336]">
          {product.stock} left
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-[#617069]">{product.description}</p>
      <div className="mt-4 flex items-end justify-between gap-3">
        <p>
          <span className="block text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#617069]">
            Size
          </span>
          <span className="text-base font-extrabold">{product.size}</span>
        </p>
        <p className="text-2xl font-extrabold">{formatMYR(product.price)}</p>
      </div>
    </button>
  );
}
