/* components/cart/Cart.js */
"use client"; // Mark as Client Component to use useContext
import React, { useContext } from "react";
import { CartContext } from "./CartContext"; // Adjust path: relative to components/cart/
import Link from "next/link";
import { useState } from "react";
const IMAGE_BASE_URL =
  "https://orange-wolf-342633.hostingersite.com/uploads/products/";

export default function Cart() {
  const { cart, increment, decrement, removeItem, totalPrice, totalItems } =
    useContext(CartContext);

  if (cart.length === 0) {
    return (
      <div>
        <div>
          <div
            style={{
              marginTop: "20px",
              fontSize: "18px",
              color: "rgb(51, 51, 51)",
              padding: "20px",
              border: "1px solid rgb(221, 221, 221)",
              borderRadius: "8px",
              textAlign: "center",
            }}>
            Your cart is empty
            <div className="secondary-buttons">
              <Link href="/categories">Nos catégories</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="prod_single_card_holder p-6 m-4 max-w-5xl mx-auto">
      {/* Cart Items */}
      {cart.map((item, index) => (
        <div
          key={index}
          className="prod_single_card  flex flex-col sm:flex-row items-center justify-between p-4 mb-4 bg-white rounded-lg shadow-md gap-4">
          <img
            src={`${IMAGE_BASE_URL}${item.images?.[0] || "missing.png"}`}
            alt={item.name}
            className="w-full sm:w-24 h-auto rounded-lg object-cover"
          />
          <div className="flex-1 text-left sm:text-left">
            <p className=" font-semibold  ">{item.name}</p>
            <div className="mt-2 space-y-1">
              {item.options &&
                Object.entries(item.options).map(([choiceId, option]) => (
                  <div key={choiceId} className="text-sm">
                    <strong>{choiceId}:</strong> {option}
                  </div>
                ))}
            </div>
            <p className="text-base font-medium mt-2">
              €{(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
          <div className="flex flex-col items-center sm:items-end mt-4 sm:mt-0 gap-2">
            <button
              className="remove bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-600 transition text-lg"
              onClick={() => removeItem(index)}
              aria-label={`Remove ${item.name} from cart`}>
              ×
            </button>
            <div className="prod_qts_control md:flex  grid grid-col items-center gap-2">
              <button
                className="bg-gray-200 w-10 h-10 rounded flex items-center justify-center hover:bg-gray-300 transition text-lg"
                onClick={() => decrement(index)}
                aria-label={`Decrease quantity of ${item.name}`}>
                −
              </button>
              <span className="mx-2 text-base min-w-[2rem] text-center">
                {item.quantity}
              </span>
              <button
                className="bg-gray-200 w-10 h-10 rounded flex items-center justify-center hover:bg-gray-300 transition text-lg"
                onClick={() => increment(index)}
                aria-label={`Increase quantity of ${item.name}`}>
                +
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Checkout Details */}
      {/* <div className="ckdetails p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">
          Total: <span>€{totalPrice.toFixed(2)}</span>
        </h3>
        <h3 className="text-lg font-semibold mt-2">
          Total ({cart.length} items): <span>€{totalPrice.toFixed(2)}</span>
        </h3>
        <h3 className="text-lg font-semibold mt-2">
          Total ({totalItems} products): <span>€{totalPrice.toFixed(2)}</span>
        </h3>
      </div> */}
    </div>
  );
}
