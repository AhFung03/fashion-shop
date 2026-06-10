export type Category = "Dresses" | "Sets" | "Tops" | "Bottoms" | "Accessories";

export type ProductVariant = {
  id: string;
  size: string;
  color: string;
  stock: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  compareAtPrice?: number;
  description: string;
  imagePosition: string;
  badge?: string;
  variants: ProductVariant[];
};

export type CartItem = {
  productId: string;
  variantId: string;
  quantity: number;
};

export type FulfilmentMethod = "delivery" | "pickup";
export type PaymentMethod = "card" | "fpx" | "cash";

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "ready_for_pickup"
  | "shipped"
  | "completed"
  | "cancelled";

export type ShopOrder = {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  total: number;
  status: OrderStatus;
  payment: "paid" | "cash_due" | "pending";
  fulfilment: FulfilmentMethod;
  createdAt: string;
  itemCount: number;
};
