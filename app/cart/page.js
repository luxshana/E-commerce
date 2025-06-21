"use client";
/* app/cart/page.js */
import React, { useContext } from "react";
import Link from "next/link";
import Cart from "../../components/Cart";
import { CartContext } from "../../components/CartContext";

// Note: This is a Server Component by default
export default function CartPage() {
  const { totalPrice, totalItems } =
      useContext(CartContext);
  return (
    <div className="ck-container">
     
      <Cart />
      <div className="go_checkout flex flex-col">
      <div className="flex items-center pt-2">
  <a href="#" className="flex items-center">
    <img className="w-6 h-6 mr-2" src="https://maboutique.app/deliziosa//images/cart.svg" alt="Cart" />
    <span className="text-sm">
      {totalItems} Produits | Montant total: €{totalPrice.toFixed(2)}
    </span>
  </a>
</div>
        <Link href="/checkout">
          <button className="btnStyle1 w-full sm:w-auto">Proceed to Checkout</button>
        </Link>
      </div> 
    </div>
  );
}
