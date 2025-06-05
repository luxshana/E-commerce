"use client";

import { CartProvider } from "./CartContext"; // Adjust path if needed

export default function ClientWrapper({ children }) {
  return <CartProvider>{children}</CartProvider>;
}
