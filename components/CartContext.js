// components/CartContext.js
"use client"; // REQUIRED: This component uses useState, useEffect, and sessionStorage

import React, { createContext, useEffect, useState } from "react";

// 1. Create the context
export const CartContext = createContext(null); // Initialize with null or a default shape

// 2. Create the provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from sessionStorage on initial mount
  useEffect(() => {
    // Ensure this runs only on the client side where 'window' and 'sessionStorage' exist
    if (typeof window !== "undefined") {
      const storedCart = sessionStorage.getItem("cart");
      if (storedCart) {
        try {
          setCart(JSON.parse(storedCart));
        } catch (e) {
          console.error("Failed to parse cart from sessionStorage:", e);
          // Optionally, clear invalid data if parsing fails
          sessionStorage.removeItem("cart");
        }
      }
    }
  }, []); // Empty dependency array means this effect runs once on mount

  // Update sessionStorage whenever the cart state changes
  useEffect(() => {
    // Ensure this runs only on the client side
    if (typeof window !== "undefined") {
      if (cart.length === 0) {
        sessionStorage.removeItem("cart"); // Reset when cart is empty
      } else {
        sessionStorage.setItem("cart", JSON.stringify(cart));
      }
    }
  }, [cart]); // Dependency array: runs whenever 'cart' state changes

  const updateCart = (newCart) => {
    setCart(newCart);
    // The useEffect above will handle saving to sessionStorage
  };

  const increment = (index) => {
    const newCart = [...cart];
    if (newCart[index]) {
      // Safety check
      newCart[index].quantity++;
      updateCart(newCart);
    }
  };

  const decrement = (index) => {
    const newCart = [...cart];
    if (newCart[index] && newCart[index].quantity > 1) {
      // Safety check
      newCart[index].quantity--;
      updateCart(newCart);
    }
  };

  const removeItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    updateCart(newCart);
  };

  const addToCart = (product, quantity, selectedOptions) => {
    // Determine if the product object passed is a nested product structure or direct
    const isSingleProduct = product.product; // If `product.product` exists, it's the nested structure

    const basePrice =
      parseFloat(isSingleProduct ? product.product.price : product.price) || 0;
    let optionsTotal = 0;

    // Logic for calculating options total based on your specific 'product.choices' structure
    // This part assumes `product.choices` is available when `isSingleProduct` is true
    // and `selectedOptions` is an object mapping choice IDs to selected option values.
    if (isSingleProduct && product.choices && product.choices.length > 0) {
      product.choices.forEach((choice) => {
        const selectedOptionValue = selectedOptions?.[choice.id]; // Use optional chaining for safety
        const optionIndex = choice.options.indexOf(selectedOptionValue);
        if (
          optionIndex !== -1 &&
          choice.prices &&
          typeof choice.prices[optionIndex] === "string"
        ) {
          optionsTotal += parseFloat(choice.prices[optionIndex]) || 0;
        }
      });
    }

    const finalPrice = basePrice + optionsTotal;

    const cartItem = {
      product_id: isSingleProduct
        ? product.product.product_id
        : product.product_id,
      name: isSingleProduct
        ? product.product.product_name
        : product.product_name,
      price: finalPrice,
      quantity,
      options: selectedOptions || {}, // Ensure options is an object
      image:
        (isSingleProduct
          ? product.product.images?.[0] // If nested product, get image from product.product.images
          : product.images?.[0]) || null, // Otherwise from product.images
    };

    const newCart = [...cart];
    const existingIndex = newCart.findIndex(
      (item) =>
        item.product_id === cartItem.product_id &&
        // Deep compare options object using JSON.stringify for simplicity
        // For more complex objects, consider a proper deep comparison library
        JSON.stringify(item.options) === JSON.stringify(cartItem.options)
    );

    if (existingIndex !== -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push(cartItem);
    }

    updateCart(newCart); // This will trigger the useEffect to save
  };

  const totalPrice = cart.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 0), // Add safety for undefined price/quantity
    0
  );
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const clearCart = () => {
    setCart([]);
    // The useEffect will handle removing from sessionStorage
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        increment,
        decrement,
        removeItem,
        addToCart,
        totalPrice,
        totalItems,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
