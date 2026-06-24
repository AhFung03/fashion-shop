"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  CarCareProduct,
  CarCareStore,
  FitmentDraft,
  ProductCategory,
  ProductDraft,
  RequestStatus,
  ServiceRequest,
  VehicleFitment,
} from "@/types/car-care";

const STORAGE_KEY = "car-care-demo-store-v1";

export const seedStore: CarCareStore = {
  fitments: [
    {
      id: "fitment-myvi-13",
      carBrand: "Perodua",
      carType: "Myvi 1.3",
      tyreSize: "175/65R14",
      batterySize: "NS40ZL",
    },
    {
      id: "fitment-myvi-15",
      carBrand: "Perodua",
      carType: "Myvi 1.5",
      tyreSize: "185/55R15",
      batterySize: "NS40ZL",
    },
    {
      id: "fitment-axia",
      carBrand: "Perodua",
      carType: "Axia",
      tyreSize: "175/65R14",
      batterySize: "NS40ZL",
    },
    {
      id: "fitment-saga",
      carBrand: "Proton",
      carType: "Saga",
      tyreSize: "185/60R14",
      batterySize: "NS60LS",
    },
    {
      id: "fitment-persona",
      carBrand: "Proton",
      carType: "Persona",
      tyreSize: "185/55R16",
      batterySize: "DIN55",
    },
    {
      id: "fitment-city",
      carBrand: "Honda",
      carType: "City",
      tyreSize: "185/55R16",
      batterySize: "NS60LS",
    },
    {
      id: "fitment-vios",
      carBrand: "Toyota",
      carType: "Vios",
      tyreSize: "195/50R16",
      batterySize: "DIN55",
    },
    {
      id: "fitment-almera",
      carBrand: "Nissan",
      carType: "Almera",
      tyreSize: "195/55R16",
      batterySize: "DIN55",
    },
  ],
  products: [
    {
      id: "tyre-cc6-175",
      category: "tyre",
      brand: "Continental",
      name: "ComfortContact CC6",
      size: "175/65R14",
      price: 188,
      stock: 12,
      active: true,
      description: "Quiet daily tyre for compact cars.",
    },
    {
      id: "tyre-ecopia-175",
      category: "tyre",
      brand: "Bridgestone",
      name: "Ecopia EP300",
      size: "175/65R14",
      price: 205,
      stock: 8,
      active: true,
      description: "Fuel saving tyre with balanced wet grip.",
    },
    {
      id: "tyre-primacy-185",
      category: "tyre",
      brand: "Michelin",
      name: "Primacy 4",
      size: "185/55R15",
      price: 298,
      stock: 6,
      active: true,
      description: "Comfort tyre with strong wet braking.",
    },
    {
      id: "tyre-advantage-185",
      category: "tyre",
      brand: "BFGoodrich",
      name: "Advantage Touring",
      size: "185/60R14",
      price: 215,
      stock: 3,
      active: true,
      description: "Reliable daily touring tyre.",
    },
    {
      id: "tyre-bluearth-185",
      category: "tyre",
      brand: "Yokohama",
      name: "BluEarth AE01",
      size: "185/55R16",
      price: 268,
      stock: 10,
      active: true,
      description: "Efficient tyre for city driving.",
    },
    {
      id: "tyre-proxes-195",
      category: "tyre",
      brand: "Toyo",
      name: "Proxes CR1",
      size: "195/50R16",
      price: 285,
      stock: 5,
      active: true,
      description: "Comfort biased tyre with stable handling.",
    },
    {
      id: "tyre-uc7-195",
      category: "tyre",
      brand: "Continental",
      name: "UltraContact UC7",
      size: "195/55R16",
      price: 338,
      stock: 0,
      active: true,
      description: "Premium touring tyre. Currently out of stock.",
    },
    {
      id: "battery-amaron-ns40",
      category: "battery",
      brand: "Amaron",
      name: "Hi-Life NS40ZL",
      size: "NS40ZL",
      price: 238,
      stock: 9,
      active: true,
      description: "Maintenance free battery for compact cars.",
    },
    {
      id: "battery-century-ns40",
      category: "battery",
      brand: "Century",
      name: "Marathoner NS40ZL",
      size: "NS40ZL",
      price: 218,
      stock: 7,
      active: true,
      description: "Daily replacement battery with local warranty.",
    },
    {
      id: "battery-gp-ns60",
      category: "battery",
      brand: "GP",
      name: "MF NS60LS",
      size: "NS60LS",
      price: 265,
      stock: 6,
      active: true,
      description: "Maintenance free battery for sedans.",
    },
    {
      id: "battery-amaron-din55",
      category: "battery",
      brand: "Amaron",
      name: "DIN55",
      size: "DIN55",
      price: 398,
      stock: 4,
      active: true,
      description: "DIN battery for newer sedans.",
    },
    {
      id: "battery-century-din66",
      category: "battery",
      brand: "Century",
      name: "DIN66",
      size: "DIN66",
      price: 468,
      stock: 0,
      active: true,
      description: "Larger DIN battery. Restock required.",
    },
  ],
  requests: [
    {
      id: "request-1001",
      requestNumber: "CC-1001",
      customerName: "Daniel Tan",
      customerEmail: "daniel@example.com",
      customerPhone: "+60 12 345 6789",
      carBrand: "Perodua",
      carType: "Myvi 1.5",
      productId: "tyre-primacy-185",
      productCategory: "tyre",
      productName: "Michelin Primacy 4",
      productSize: "185/55R15",
      estimatePrice: 298,
      quotedPrice: 1192,
      availability: "available",
      status: "quoted",
      preferredDate: "2026-06-28",
      customerNote: "Need four pieces if possible.",
      adminNote: "Quoted for four tyres including installation.",
      createdAt: "2026-06-24T08:30:00.000Z",
    },
    {
      id: "request-1002",
      requestNumber: "CC-1002",
      customerName: "Nur Aina",
      customerEmail: "aina@example.com",
      customerPhone: "+60 17 888 1020",
      carBrand: "Honda",
      carType: "City",
      productId: "battery-gp-ns60",
      productCategory: "battery",
      productName: "GP MF NS60LS",
      productSize: "NS60LS",
      estimatePrice: 265,
      availability: "pending",
      status: "pending",
      preferredDate: "2026-06-29",
      customerNote: "Car is hard to start in the morning.",
      adminNote: "",
      createdAt: "2026-06-24T10:10:00.000Z",
    },
  ],
};

export function formatMYR(amount: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getCarBrands(fitments: VehicleFitment[]) {
  return Array.from(new Set(fitments.map((fitment) => fitment.carBrand))).sort();
}

export function getCarTypes(fitments: VehicleFitment[], carBrand: string) {
  return fitments
    .filter((fitment) => fitment.carBrand === carBrand)
    .map((fitment) => fitment.carType)
    .sort();
}

export function findFitment(
  fitments: VehicleFitment[],
  carBrand: string,
  carType: string,
) {
  return fitments.find(
    (fitment) => fitment.carBrand === carBrand && fitment.carType === carType,
  );
}

export function getMatchingProducts(
  products: CarCareProduct[],
  category: ProductCategory,
  size?: string,
) {
  return products
    .filter(
      (product) =>
        product.active &&
        product.category === category &&
        product.stock > 0 &&
        (!size || product.size === size),
    )
    .sort((first, second) => first.price - second.price);
}

export function getRequestDisplayPrice(request: ServiceRequest) {
  return request.quotedPrice ?? request.estimatePrice;
}

export function readCarCareStore(): CarCareStore {
  if (typeof window === "undefined") return seedStore;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return seedStore;

    const parsed = JSON.parse(stored) as CarCareStore;
    if (!Array.isArray(parsed.products) || !Array.isArray(parsed.fitments)) {
      return seedStore;
    }

    return {
      products: parsed.products,
      fitments: parsed.fitments,
      requests: Array.isArray(parsed.requests) ? parsed.requests : [],
    };
  } catch {
    return seedStore;
  }
}

function notifyStoreChanged() {
  window.dispatchEvent(new Event("car-care-store-change"));
}

function writeCarCareStore(store: CarCareStore) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  notifyStoreChanged();
}

function nextId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;
}

function nextRequestNumber(requests: ServiceRequest[]) {
  const latest = requests.reduce((max, request) => {
    const number = Number(request.requestNumber.replace(/\D/g, ""));
    return Number.isFinite(number) ? Math.max(max, number) : max;
  }, 1000);
  return `CC-${latest + 1}`;
}

function normalizeProductDraft(draft: ProductDraft): CarCareProduct {
  return {
    ...draft,
    id: draft.id ?? nextId("product"),
    brand: draft.brand.trim(),
    name: draft.name.trim(),
    size: draft.size.trim().toUpperCase(),
    description: draft.description.trim(),
    price: Math.max(0, Number(draft.price) || 0),
    stock: Math.max(0, Math.trunc(Number(draft.stock) || 0)),
  };
}

function normalizeFitmentDraft(draft: FitmentDraft): VehicleFitment {
  return {
    id: draft.id ?? nextId("fitment"),
    carBrand: draft.carBrand.trim(),
    carType: draft.carType.trim(),
    tyreSize: draft.tyreSize.trim().toUpperCase(),
    batterySize: draft.batterySize.trim().toUpperCase(),
  };
}

export function useCarCareStore() {
  const [store, setStore] = useState<CarCareStore>(seedStore);

  useEffect(() => {
    function sync() {
      setStore(readCarCareStore());
    }

    const timeout = window.setTimeout(sync, 0);
    window.addEventListener("storage", sync);
    window.addEventListener("car-care-store-change", sync);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("storage", sync);
      window.removeEventListener("car-care-store-change", sync);
    };
  }, []);

  const actions = useMemo(
    () => ({
      reset() {
        writeCarCareStore(seedStore);
      },
      saveProduct(draft: ProductDraft) {
        const product = normalizeProductDraft(draft);
        const current = readCarCareStore();
        const exists = current.products.some((item) => item.id === product.id);
        const products = exists
          ? current.products.map((item) => (item.id === product.id ? product : item))
          : [product, ...current.products];
        writeCarCareStore({ ...current, products });
      },
      saveFitment(draft: FitmentDraft) {
        const fitment = normalizeFitmentDraft(draft);
        const current = readCarCareStore();
        const exists = current.fitments.some((item) => item.id === fitment.id);
        const fitments = exists
          ? current.fitments.map((item) => (item.id === fitment.id ? fitment : item))
          : [fitment, ...current.fitments];
        writeCarCareStore({ ...current, fitments });
      },
      createRequest(input: {
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        carBrand: string;
        carType: string;
        product: CarCareProduct;
        preferredDate: string;
        customerNote: string;
      }) {
        const current = readCarCareStore();
        const request: ServiceRequest = {
          id: nextId("request"),
          requestNumber: nextRequestNumber(current.requests),
          customerName: input.customerName.trim(),
          customerEmail: input.customerEmail.trim(),
          customerPhone: input.customerPhone.trim(),
          carBrand: input.carBrand,
          carType: input.carType,
          productId: input.product.id,
          productCategory: input.product.category,
          productName: `${input.product.brand} ${input.product.name}`,
          productSize: input.product.size,
          estimatePrice: input.product.price,
          availability: "pending",
          status: "pending",
          preferredDate: input.preferredDate,
          customerNote: input.customerNote.trim(),
          adminNote: "",
          createdAt: new Date().toISOString(),
        };
        writeCarCareStore({
          ...current,
          requests: [request, ...current.requests],
        });
        return request;
      },
      updateRequest(
        id: string,
        updates: {
          status: RequestStatus;
          availability: ServiceRequest["availability"];
          quotedPrice?: number;
          adminNote: string;
        },
      ) {
        const current = readCarCareStore();
        writeCarCareStore({
          ...current,
          requests: current.requests.map((request) =>
            request.id === id
              ? {
                  ...request,
                  status: updates.status,
                  availability: updates.availability,
                  quotedPrice:
                    updates.quotedPrice === undefined || Number.isNaN(updates.quotedPrice)
                      ? undefined
                      : Math.max(0, updates.quotedPrice),
                  adminNote: updates.adminNote.trim(),
                }
              : request,
          ),
        });
      },
    }),
    [],
  );

  return { store, ...actions };
}
