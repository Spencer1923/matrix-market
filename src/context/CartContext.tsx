"use client"; // runs in the browser, needed for state and localStorage

import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  id: number;
  name: string;
  price_cents: number;
  stock: number; // saved so we can cap the quantity in the cart
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  setQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false); // stops us saving an empty cart before loading the real one

  // On first load, restore the saved cart
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    // Intentional: localStorage only exists in the browser, so we load it after mount
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setItems(JSON.parse(saved));
    setLoaded(true);
  }, []);

  // Save the cart whenever it changes
  useEffect(() => {
    if (loaded) localStorage.setItem("cart", JSON.stringify(items));
  }, [items, loaded]);

  // Add a product, or bump its quantity (never above the stock)
  const addItem: CartContextType["addItem"] = (item) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: Math.min(i.quantity + 1, item.stock) }
            : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Set an exact quantity; 0 or less removes the item, and it's capped at stock
  const setQuantity = (id: number, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  };

  const removeItem = (id: number) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{ items, addItem, setQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// Shortcut so components can write: const { items } = useCart();
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
