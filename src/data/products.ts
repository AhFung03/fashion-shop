import type { Product, ShopOrder } from "@/types/shop";

const standardVariants = (prefix: string, colors: string[]) =>
  colors.flatMap((color, colorIndex) =>
    ["XS", "S", "M", "L", "XL"].map((size, sizeIndex) => ({
      id: `${prefix}-${colorIndex}-${size.toLowerCase()}`,
      size,
      color,
      stock: Math.max(0, 12 - colorIndex * 2 - sizeIndex),
    })),
  );

export const products: Product[] = [
  {
    id: "p1",
    slug: "amara-wrap-dress",
    name: "Amara Wrap Dress",
    category: "Dresses",
    price: 189,
    description:
      "A softly structured midi dress with an adjustable wrap waist and easy movement.",
    imagePosition: "0% 0%",
    badge: "Bestseller",
    variants: standardVariants("amara", ["Terracotta", "Black"]),
  },
  {
    id: "p2",
    slug: "sora-linen-set",
    name: "Sora Linen Set",
    category: "Sets",
    price: 229,
    description:
      "A breathable two-piece set cut for relaxed days, polished enough for dinner.",
    imagePosition: "100% 0%",
    badge: "New",
    variants: standardVariants("sora", ["Sage", "Oat"]),
  },
  {
    id: "p3",
    slug: "elle-satin-blouse",
    name: "Elle Satin Blouse",
    category: "Tops",
    price: 119,
    description:
      "A fluid satin blouse with a neat collar and a gentle sheen that dresses up denim.",
    imagePosition: "0% 100%",
    variants: standardVariants("elle", ["Ivory", "Cocoa"]),
  },
  {
    id: "p4",
    slug: "noa-shoulder-bag",
    name: "Noa Shoulder Bag",
    category: "Accessories",
    price: 149,
    description:
      "A compact structured bag with a comfortable shoulder strap and secure zip closure.",
    imagePosition: "100% 100%",
    badge: "Low stock",
    variants: [
      { id: "noa-cocoa", size: "One size", color: "Cocoa", stock: 4 },
      { id: "noa-cream", size: "One size", color: "Cream", stock: 7 },
    ],
  },
  {
    id: "p5",
    slug: "maya-pleated-dress",
    name: "Maya Pleated Dress",
    category: "Dresses",
    price: 209,
    compareAtPrice: 249,
    description:
      "Fine pleats and a clean neckline make this an easy choice for celebrations.",
    imagePosition: "0% 0%",
    badge: "Sale",
    variants: standardVariants("maya", ["Rust", "Olive"]),
  },
  {
    id: "p6",
    slug: "ria-relaxed-trousers",
    name: "Ria Relaxed Trousers",
    category: "Bottoms",
    price: 139,
    description:
      "High-rise trousers with a wide leg, practical pockets, and a smooth front finish.",
    imagePosition: "0% 100%",
    variants: standardVariants("ria", ["Cocoa", "Black"]),
  },
  {
    id: "p7",
    slug: "lina-weekend-set",
    name: "Lina Weekend Set",
    category: "Sets",
    price: 219,
    description:
      "A comfortable matching set with thoughtful tailoring through the shoulder and waist.",
    imagePosition: "100% 0%",
    variants: standardVariants("lina", ["Sage", "Stone"]),
  },
  {
    id: "p8",
    slug: "mira-everyday-shirt",
    name: "Mira Everyday Shirt",
    category: "Tops",
    price: 109,
    description:
      "A light, slightly oversized shirt designed for layering throughout the week.",
    imagePosition: "0% 100%",
    variants: standardVariants("mira", ["Ivory", "Blue"]),
  },
];

export const demoOrders: ShopOrder[] = [
  {
    id: "o1",
    orderNumber: "LA-1048",
    customer: "Nadia Farah",
    email: "nadia@example.com",
    total: 338,
    status: "processing",
    payment: "paid",
    fulfilment: "delivery",
    createdAt: "9 Jun, 11:24 AM",
    itemCount: 2,
  },
  {
    id: "o2",
    orderNumber: "LA-1047",
    customer: "Aina Rahman",
    email: "aina@example.com",
    total: 229,
    status: "ready_for_pickup",
    payment: "cash_due",
    fulfilment: "pickup",
    createdAt: "9 Jun, 9:02 AM",
    itemCount: 1,
  },
  {
    id: "o3",
    orderNumber: "LA-1046",
    customer: "Mei Ling",
    email: "mei@example.com",
    total: 367,
    status: "shipped",
    payment: "paid",
    fulfilment: "delivery",
    createdAt: "8 Jun, 4:38 PM",
    itemCount: 2,
  },
  {
    id: "o4",
    orderNumber: "LA-1045",
    customer: "Sara Ismail",
    email: "sara@example.com",
    total: 189,
    status: "completed",
    payment: "paid",
    fulfilment: "pickup",
    createdAt: "8 Jun, 1:15 PM",
    itemCount: 1,
  },
];
