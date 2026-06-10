"use client";

import type { CartItem } from "@/types/shop";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "lumiere-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored) as CartItem[]);
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [hydrated, items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      isOpen,
      setIsOpen,
      addItem: (item) => {
        setItems((current) => {
          const existing = current.find(
            (candidate) => candidate.variantId === item.variantId,
          );
          if (!existing) return [...current, item];
          return current.map((candidate) =>
            candidate.variantId === item.variantId
              ? { ...candidate, quantity: candidate.quantity + item.quantity }
              : candidate,
          );
        });
        setIsOpen(true);
      },
      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          setItems((current) =>
            current.filter((item) => item.variantId !== variantId),
          );
          return;
        }
        setItems((current) =>
          current.map((item) =>
            item.variantId === variantId ? { ...item, quantity } : item,
          ),
        );
      },
      removeItem: (variantId) =>
        setItems((current) =>
          current.filter((item) => item.variantId !== variantId),
        ),
      clearCart: () => setItems([]),
    }),
    [isOpen, items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
