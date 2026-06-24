"use client";

import { useAuth } from "@/components/auth-provider";
import {
  formatMYR,
  getRequestDisplayPrice,
  useCarCareStore,
} from "@/lib/demo-car-care-store";
import type {
  AvailabilityStatus,
  FitmentDraft,
  ProductCategory,
  ProductDraft,
  RequestStatus,
  ServiceRequest,
  VehicleFitment,
} from "@/types/car-care";
import {
  BatteryCharging,
  Boxes,
  Car,
  Gauge,
  LayoutDashboard,
  LogIn,
  LogOut,
  PackagePlus,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

const nav = [
  { id: "requests", label: "Requests", icon: LayoutDashboard },
  { id: "stock", label: "Stock", icon: Boxes },
  { id: "fitment", label: "Vehicle fitment", icon: Car },
  { id: "customers", label: "Customers", icon: Users },
] as const;

const emptyProduct: ProductDraft = {
  category: "tyre",
  brand: "",
  name: "",
  size: "",
  price: 0,
  stock: 0,
  active: true,
  description: "",
};

const emptyFitment: FitmentDraft = {
  carBrand: "",
  carType: "",
  tyreSize: "",
  batterySize: "",
};

const statusOptions: RequestStatus[] = [
  "pending",
  "quoted",
  "available",
  "not_available",
  "confirmed",
  "completed",
  "cancelled",
];

const availabilityOptions: AvailabilityStatus[] = [
  "pending",
  "available",
  "not_available",
];

export function OwnerDashboard() {
  const { user, signIn, signOut } = useAuth();
  const { store, saveProduct, saveFitment, updateRequest, reset } = useCarCareStore();
  const [active, setActive] = useState<(typeof nav)[number]["id"]>("requests");
  const [productDraft, setProductDraft] = useState<ProductDraft>(emptyProduct);
  const [fitmentDraft, setFitmentDraft] = useState<FitmentDraft>(emptyFitment);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");

  const filteredProducts = store.products.filter((product) => {
    const haystack = `${product.brand} ${product.name} ${product.size} ${product.category}`;
    return haystack.toLowerCase().includes(query.toLowerCase());
  });
  const lowStock = store.products.filter((product) => product.active && product.stock <= 3);
  const pendingRequests = store.requests.filter(
    (request) => request.status === "pending" || request.status === "quoted",
  );
  const customers = useMemo(() => {
    const grouped = new Map<
      string,
      { name: string; email: string; phone: string; requests: ServiceRequest[] }
    >();
    store.requests.forEach((request) => {
      const existing = grouped.get(request.customerEmail);
      if (existing) {
        existing.requests.push(request);
      } else {
        grouped.set(request.customerEmail, {
          name: request.customerName,
          email: request.customerEmail,
          phone: request.customerPhone,
          requests: [request],
        });
      }
    });
    return Array.from(grouped.values());
  }, [store.requests]);

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2500);
  }

  function submitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveProduct(productDraft);
    setProductDraft(emptyProduct);
    flash("Stock saved.");
  }

  function submitFitment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveFitment(fitmentDraft);
    setFitmentDraft(emptyFitment);
    flash("Vehicle fitment saved.");
  }

  if (user?.role !== "admin") {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f5f6f3] px-5 text-[#1f2522]">
        <section className="soft-card w-full max-w-md p-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-[#1f4336] text-white">
            <ShieldCheck size={24} />
          </div>
          <h1 className="mt-5 text-3xl font-extrabold">Admin access</h1>
          <p className="mt-2 text-sm leading-6 text-[#617069]">
            Sign in as admin to manage requests, stock, prices, and vehicle fitment.
          </p>
          <div className="mt-6 grid gap-3">
            <button
              className="btn-primary w-full"
              onClick={() => signIn("admin@example.com", "admin")}
            >
              <LogIn size={16} /> Use demo admin
            </button>
            <Link href="/" className="btn-secondary w-full">
              Back to customer side
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6f3] text-[#1f2522]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] flex-col border-r border-[#dfe5dd] bg-white lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-[#dfe5dd] px-5">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#1f4336] text-white">
            <Wrench size={19} />
          </span>
          <div>
            <p className="text-lg font-extrabold">CarCare Demo</p>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#617069]">
              Admin
            </p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-extrabold ${
                  active === item.id
                    ? "bg-[#1f4336] text-white"
                    : "text-[#617069] hover:bg-[#eef3ef]"
                }`}
              >
                <Icon size={17} /> {item.label}
              </button>
            );
          })}
        </nav>
        <div className="space-y-2 border-t border-[#dfe5dd] p-4">
          <Link href="/" className="btn-secondary w-full">
            Customer side
          </Link>
          <button className="btn-dark w-full" onClick={signOut}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-[250px]">
        <header className="sticky top-0 z-30 border-b border-[#dfe5dd] bg-white/95 backdrop-blur">
          <div className="flex min-h-20 flex-col justify-between gap-3 px-5 py-4 lg:flex-row lg:items-center lg:px-8">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#617069]">
                Demo database
              </p>
              <h1 className="mt-1 text-3xl font-extrabold capitalize">
                {active === "fitment" ? "Vehicle fitment" : active}
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex rounded-lg border border-[#d7ded6] bg-[#eef3ef] p-1 lg:hidden">
                {nav.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActive(item.id)}
                    className={`rounded-md px-3 py-2 text-xs font-extrabold ${
                      active === item.id ? "bg-white shadow-sm" : "text-[#617069]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <button
                className="btn-secondary"
                onClick={() => {
                  reset();
                  setProductDraft(emptyProduct);
                  setFitmentDraft(emptyFitment);
                  flash("Demo data reset.");
                }}
              >
                <RotateCcw size={16} /> Reset demo
              </button>
            </div>
          </div>
        </header>

        {notice && (
          <div className="fixed right-5 top-24 z-50 rounded-lg bg-[#1f4336] px-5 py-3 text-sm font-bold text-white shadow-xl">
            {notice}
          </div>
        )}

        <main className="space-y-6 p-5 lg:p-8">
          {active === "requests" && (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <Metric label="Pending quote" value={pendingRequests.length} />
                <Metric label="Total requests" value={store.requests.length} />
                <Metric label="Low stock" value={lowStock.length} />
              </div>
              <section className="soft-card overflow-hidden">
                <div className="border-b border-[#dfe5dd] p-5">
                  <h2 className="text-xl font-extrabold">Customer requests</h2>
                </div>
                <div className="divide-y divide-[#dfe5dd]">
                  {store.requests.map((request) => (
                    <RequestEditor
                      key={request.id}
                      request={request}
                      onSave={(updates) => {
                        updateRequest(request.id, updates);
                        flash(`${request.requestNumber} updated.`);
                      }}
                    />
                  ))}
                </div>
              </section>
            </>
          )}

          {active === "stock" && (
            <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
              <section className="soft-card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="eyebrow">Stock form</p>
                    <h2 className="mt-1 text-xl font-extrabold">
                      {productDraft.id ? "Edit product" : "Add product"}
                    </h2>
                  </div>
                  <PackagePlus size={20} className="text-[#1f4336]" />
                </div>
                <ProductForm
                  draft={productDraft}
                  onChange={setProductDraft}
                  onSubmit={submitProduct}
                  onCancel={() => setProductDraft(emptyProduct)}
                />
              </section>

              <section className="soft-card overflow-hidden">
                <div className="flex flex-col justify-between gap-3 border-b border-[#dfe5dd] p-5 md:flex-row md:items-center">
                  <h2 className="text-xl font-extrabold">Tyres and batteries</h2>
                  <label className="flex h-11 items-center gap-2 rounded-lg border border-[#d7ded6] bg-white px-3">
                    <Search size={15} className="text-[#617069]" />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      className="h-full border-0 bg-transparent text-sm outline-0"
                      placeholder="Search stock"
                    />
                  </label>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                    <thead className="bg-[#f8faf7] text-[11px] uppercase tracking-[0.1em] text-[#617069]">
                      <tr>
                        <th className="px-5 py-4">Product</th>
                        <th>Category</th>
                        <th>Size</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="border-t border-[#dfe5dd]">
                          <td className="px-5 py-4">
                            <strong>{product.brand}</strong>
                            <span className="block text-xs text-[#617069]">
                              {product.name}
                            </span>
                          </td>
                          <td className="capitalize">{product.category}</td>
                          <td>{product.size}</td>
                          <td className="font-extrabold">{formatMYR(product.price)}</td>
                          <td>{product.stock}</td>
                          <td>
                            <span className="rounded-full bg-[#eef3ef] px-2 py-1 text-xs font-extrabold">
                              {product.active ? "Active" : "Hidden"}
                            </span>
                          </td>
                          <td className="pr-5 text-right">
                            <button
                              className="btn-secondary min-h-9 px-4"
                              onClick={() => setProductDraft(product)}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {active === "fitment" && (
            <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
              <section className="soft-card p-5">
                <p className="eyebrow">Fitment form</p>
                <h2 className="mt-1 text-xl font-extrabold">
                  {fitmentDraft.id ? "Edit car" : "Add car"}
                </h2>
                <FitmentForm
                  draft={fitmentDraft}
                  onChange={setFitmentDraft}
                  onSubmit={submitFitment}
                  onCancel={() => setFitmentDraft(emptyFitment)}
                />
              </section>

              <section className="soft-card overflow-hidden">
                <div className="border-b border-[#dfe5dd] p-5">
                  <h2 className="text-xl font-extrabold">Car size mapping</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                    <thead className="bg-[#f8faf7] text-[11px] uppercase tracking-[0.1em] text-[#617069]">
                      <tr>
                        <th className="px-5 py-4">Car</th>
                        <th>Tyre size</th>
                        <th>Battery size</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {store.fitments.map((fitment) => (
                        <FitmentRow
                          key={fitment.id}
                          fitment={fitment}
                          onEdit={() => setFitmentDraft(fitment)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {active === "customers" && (
            <section className="soft-card overflow-hidden">
              <div className="border-b border-[#dfe5dd] p-5">
                <h2 className="text-xl font-extrabold">Customers</h2>
              </div>
              <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
                {customers.map((customer) => (
                  <div key={customer.email} className="rounded-lg border border-[#dfe5dd] p-4">
                    <p className="font-extrabold">{customer.name}</p>
                    <p className="mt-1 text-sm text-[#617069]">{customer.email}</p>
                    <p className="mt-1 text-sm text-[#617069]">{customer.phone}</p>
                    <p className="mt-4 text-2xl font-extrabold">
                      {customer.requests.length}
                      <span className="ml-2 text-sm font-bold text-[#617069]">requests</span>
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="soft-card p-5">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#617069]">
        {label}
      </p>
      <p className="mt-2 text-4xl font-extrabold">{value}</p>
    </div>
  );
}

function ProductForm({
  draft,
  onChange,
  onSubmit,
  onCancel,
}: {
  draft: ProductDraft;
  onChange: (draft: ProductDraft) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-4">
      <label>
        <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.08em]">
          Category
        </span>
        <select
          className="field"
          value={draft.category}
          onChange={(event) =>
            onChange({ ...draft, category: event.target.value as ProductCategory })
          }
        >
          <option value="tyre">Tyre</option>
          <option value="battery">Battery</option>
        </select>
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField label="Brand" value={draft.brand} onChange={(brand) => onChange({ ...draft, brand })} />
        <TextField label="Name" value={draft.name} onChange={(name) => onChange({ ...draft, name })} />
      </div>
      <TextField label="Size" value={draft.size} onChange={(size) => onChange({ ...draft, size })} />
      <div className="grid gap-3 sm:grid-cols-2">
        <NumberField
          label="Price"
          value={draft.price}
          onChange={(price) => onChange({ ...draft, price: Number(price) })}
        />
        <NumberField
          label="Stock"
          value={draft.stock}
          onChange={(stock) => onChange({ ...draft, stock: Number(stock) })}
        />
      </div>
      <label>
        <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.08em]">
          Description
        </span>
        <textarea
          className="field min-h-24 resize-y py-3"
          value={draft.description}
          onChange={(event) => onChange({ ...draft, description: event.target.value })}
        />
      </label>
      <label className="flex items-center gap-3 text-sm font-bold">
        <input
          type="checkbox"
          checked={draft.active}
          onChange={(event) => onChange({ ...draft, active: event.target.checked })}
        />
        Active for customers
      </label>
      <div className="flex gap-2">
        <button className="btn-primary flex-1">
          <Save size={16} /> Save
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Clear
        </button>
      </div>
    </form>
  );
}

function FitmentForm({
  draft,
  onChange,
  onSubmit,
  onCancel,
}: {
  draft: FitmentDraft;
  onChange: (draft: FitmentDraft) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-4">
      <TextField label="Car brand" value={draft.carBrand} onChange={(carBrand) => onChange({ ...draft, carBrand })} />
      <TextField label="Car type" value={draft.carType} onChange={(carType) => onChange({ ...draft, carType })} />
      <TextField label="Tyre size" value={draft.tyreSize} onChange={(tyreSize) => onChange({ ...draft, tyreSize })} />
      <TextField label="Battery size" value={draft.batterySize} onChange={(batterySize) => onChange({ ...draft, batterySize })} />
      <div className="flex gap-2">
        <button className="btn-primary flex-1">
          <Save size={16} /> Save
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Clear
        </button>
      </div>
    </form>
  );
}

function RequestEditor({
  request,
  onSave,
}: {
  request: ServiceRequest;
  onSave: (updates: {
    status: RequestStatus;
    availability: AvailabilityStatus;
    quotedPrice?: number;
    adminNote: string;
  }) => void;
}) {
  const [status, setStatus] = useState<RequestStatus>(request.status);
  const [availability, setAvailability] = useState<AvailabilityStatus>(request.availability);
  const [quotedPrice, setQuotedPrice] = useState(
    request.quotedPrice === undefined ? "" : String(request.quotedPrice),
  );
  const [adminNote, setAdminNote] = useState(request.adminNote);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({
      status,
      availability,
      quotedPrice: quotedPrice === "" ? undefined : Number(quotedPrice),
      adminNote,
    });
  }

  return (
    <form onSubmit={submit} className="grid gap-4 p-5 xl:grid-cols-[1.15fr_1fr_auto] xl:items-end">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <strong>{request.requestNumber}</strong>
          <span className="rounded-full bg-[#eef3ef] px-2 py-1 text-[10px] font-extrabold uppercase">
            {request.productCategory}
          </span>
        </div>
        <p className="mt-2 text-sm font-bold">
          {request.customerName} · {request.customerPhone}
        </p>
        <p className="mt-1 text-sm text-[#617069]">
          {request.carBrand} {request.carType} · {request.productName} · {request.productSize}
        </p>
        <p className="mt-1 text-sm text-[#617069]">
          Estimate {formatMYR(request.estimatePrice)} · Current{" "}
          {formatMYR(getRequestDisplayPrice(request))}
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label>
          <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.08em]">
            Status
          </span>
          <select
            className="field"
            value={status}
            onChange={(event) => setStatus(event.target.value as RequestStatus)}
          >
            {statusOptions.map((item) => (
              <option key={item} value={item}>
                {item.replace("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.08em]">
            Availability
          </span>
          <select
            className="field"
            value={availability}
            onChange={(event) => setAvailability(event.target.value as AvailabilityStatus)}
          >
            {availabilityOptions.map((item) => (
              <option key={item} value={item}>
                {item.replace("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <NumberField
          label="Quote"
          value={quotedPrice}
          onChange={(value) => setQuotedPrice(String(value))}
          allowEmpty
        />
        <TextField label="Admin note" value={adminNote} onChange={setAdminNote} />
      </div>
      <button className="btn-primary">
        <Save size={16} /> Update
      </button>
    </form>
  );
}

function FitmentRow({
  fitment,
  onEdit,
}: {
  fitment: VehicleFitment;
  onEdit: () => void;
}) {
  return (
    <tr className="border-t border-[#dfe5dd]">
      <td className="px-5 py-4">
        <strong>{fitment.carBrand}</strong>
        <span className="block text-xs text-[#617069]">{fitment.carType}</span>
      </td>
      <td>
        <span className="inline-flex items-center gap-2 font-bold">
          <Gauge size={15} /> {fitment.tyreSize}
        </span>
      </td>
      <td>
        <span className="inline-flex items-center gap-2 font-bold">
          <BatteryCharging size={15} /> {fitment.batterySize}
        </span>
      </td>
      <td className="pr-5 text-right">
        <button className="btn-secondary min-h-9 px-4" onClick={onEdit}>
          Edit
        </button>
      </td>
    </tr>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.08em]">
        {label}
      </span>
      <input
        className="field"
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  allowEmpty = false,
}: {
  label: string;
  value: number | string;
  onChange: (value: number | string) => void;
  allowEmpty?: boolean;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.08em]">
        {label}
      </span>
      <input
        className="field"
        required={!allowEmpty}
        type="number"
        min="0"
        value={value}
        onChange={(event) =>
          onChange(allowEmpty && event.target.value === "" ? "" : Number(event.target.value))
        }
      />
    </label>
  );
}
