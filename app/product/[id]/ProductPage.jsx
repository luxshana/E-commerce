"use client";

import React, { useEffect, useState, useMemo, useContext } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { CartContext } from "../../../components/CartContext";
import { fetchSingleProduct } from "../../../lib/api";
import SuccessPopup from "../../../components/SuccessPopup";
import Cart from "../../../components/Cart";
import Link from "next/link";

const IMAGE_BASE_URL =
  "https://orange-wolf-342633.hostingersite.com/uploads/products/";

export default function ProductPage({ initialProduct }) {
  const router = useRouter();
  const { id } = useParams();
  const { addToCart, totalPrice, totalItems } = useContext(CartContext);
  const [product, setProduct] = useState(initialProduct);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedDrink, setSelectedDrink] = useState(null);

  const sizes = [
    { id: 1, name: "Senior", price: "", icon: "🍕" },
    { id: 2, name: "Mega", price: "€5", icon: "🍕" },
  ];
  const Drinks = [
    { id: 1, name: "Cola", price: "", icon: "🥤" },
    { id: 2, name: "Lemonade", price: "€5", icon: "🥤" },
    { id: 3, name: "Water", price: "", icon: "🥤" },
    { id: 4, name: "Iced Tea", price: "€5", icon: "🥤" },
    { id: 5, name: "Sprite", price: "", icon: "🥤" },
    { id: 6, name: "Fanta", price: "€5", icon: "🥤" },
    { id: 7, name: "Ginger Ale", price: "", icon: "🥤" },
    { id: 8, name: "Soda", price: "€5", icon: "🥤" },
    { id: 9, name: "Juice", price: "", icon: "🥤" },
  ];

  useEffect(() => {
    if (!id) return;
    if (!initialProduct || initialProduct.error) {
      fetchSingleProduct(id).then((data) => {
        setProduct(data);
        console.log(setProduct);
        if (data?.choices?.length > 0) {
          const initialOptions = {};
          data.choices.forEach((choice) => {
            initialOptions[choice.id] = choice.options[0];
          });
          setSelectedOptions(initialOptions);
        }
      });
    } else if (initialProduct?.choices?.length > 0) {
      const initialOptions = {};
      initialProduct.choices.forEach((choice) => {
        initialOptions[choice.id] = choice.options[0];
      });
      setSelectedOptions(initialOptions);
    }
  }, [id, initialProduct]);

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleOptionChange = (choiceId, option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [choiceId]: option,
    }));
  };

  const calculateTotalPrice = useMemo(() => {
    if (!product) return "0.00";
    let basePrice = parseFloat(product.product?.price) || 0;
    let optionsTotal = 0;
    product.choices?.forEach((choice) => {
      const selectedOption = selectedOptions[choice.id];
      const index = choice.options.indexOf(selectedOption);
      if (index !== -1) {
        optionsTotal += parseFloat(choice.prices[index]) || 0;
      }
    });
    if (selectedSize) {
      const size = sizes.find((s) => s.name === selectedSize);
      if (size?.price)
        optionsTotal += parseFloat(size.price.replace("€", "")) || 0;
    }
    if (selectedDrink) {
      const drink = Drinks.find((d) => d.name === selectedDrink);
      if (drink?.price)
        optionsTotal += parseFloat(drink.price.replace("€", "")) || 0;
    }
    return ((basePrice + optionsTotal) * quantity).toFixed(2);
  }, [product, selectedOptions, quantity, selectedSize, selectedDrink]);

  const handleAddToCart = () => {
    if (!product?.product) return;
    addToCart(product, quantity, {
      ...selectedOptions,
      size: selectedSize,
      drink: selectedDrink,
    });
    setShowPopup(true);
  };

  if (!product)
    return (
      <div className="text-center text-gray-500 py-10">Loading product...</div>
    );
  if (product.error)
    return (
      <div className="text-center text-red-500 py-10">
        Error: {product.error}
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Product Images */}
        <div className="product-image flex flex-col items-center">
          {product.images?.length > 0 ? (
            product.images.map((img, i) => (
              <div
                key={i}
                className="w-full max-w-[300px] sm:max-w-[400px] rounded-lg shadow-lg mb-4 overflow-hidden" // Card container
              >
                <img
                  src={`${IMAGE_BASE_URL}${img}`}
                  alt={`Image ${i}`}
                  className={`w-full h-full object-cover `}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `${IMAGE_BASE_URL}missing.png`;
                  }}
                />
              </div>
            ))
          ) : (
            <div className="w-24 h-24 rounded-lg shadow-lg overflow-hidden">
              <img
                src={`${IMAGE_BASE_URL}missing.png`}
                alt="Missing"
                className="w-full h-full object-cover animate-[spin_20s_linear_infinite] hover:pause"
              />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info space-y-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            {product.product.product_name}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            €{product.product.price}
          </p>
          <p className="text-lg sm:text-xl font-semibold text-gray-800">
            {product.product.description}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-yellow-400">
            Total: €{calculateTotalPrice} ({quantity} x €{product.product.price}
            )
          </p>

          <div className="p-4 bg-white rounded-lg shadow-md border border-dashed border-black">
            <div className="text-base sm:text-lg font-medium mb-3">Size:</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {sizes.map((size) => (
                <div
                  key={size.id}
                  className={`flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedSize === size.name
                      ? "bg-yellow-400 border-2 border-yellow-400"
                      : "bg-white border border-gray-200 hover:bg-yellow-400"
                  }`}
                  onClick={() => setSelectedSize(size.name)}>
                  <img
                    src={`${IMAGE_BASE_URL}${
                      size.images?.[0] || "missing.png"
                    }`}
                    alt={size.name}
                    className="w-full max-w-[120px] h-auto rounded-lg object-cover mb-2"
                  />
                  <div className="text-sm text-center font-medium">
                    {size.name}
                  </div>
                  {size.price && (
                    <div className="text-xs text-gray-500">{size.price}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-md border border-dashed border-red-600">
            <div className="text-base sm:text-lg font-medium mb-3">Drinks:</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Drinks.map((drink) => (
                <div
                  key={drink.id}
                  className={`flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedDrink === drink.name
                      ? "bg-yellow-400 border-2 border-yellow-400"
                      : "bg-white border hover:bg-yellow-400"
                  }`}
                  onClick={() => setSelectedDrink(drink.name)}>
                  <img
                    src={`${IMAGE_BASE_URL}${
                      drink.images?.[0] || "missing.png"
                    }`}
                    alt={drink.name}
                    className="w-full max-w-[120px] h-auto rounded-lg object-cover mb-2"
                  />

                  <div className="text-sm text-center font-medium">
                    {drink.name}
                  </div>
                  {drink.price && (
                    <div className="text-xs text-gray-500">{drink.price}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Options */}
          {product.choices?.map((choice) => (
            <div key={choice.id} className="product-option-group space-y-2">
              <h4 className="text-base sm:text-lg font-semibold text-gray-700">
                {choice.name}
              </h4>
              {choice.style === "radio" ? (
                <div className="flex flex-wrap gap-2">
                  {choice.options.map((opt, i) => {
                    const selected = selectedOptions[choice.id] === opt;
                    return (
                      <button
                        key={i}
                        onClick={() => handleOptionChange(choice.id, opt)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors duration-200 ${
                          selected
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}>
                        {choice.icons?.[i] && (
                          <img
                            src={choice.icons[i]}
                            alt={opt}
                            className="w-5 h-5 object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `${IMAGE_BASE_URL}missing.png`;
                            }}
                          />
                        )}
                        <span className="text-sm">
                          {opt} (€{choice.prices[i]})
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <select
                  onChange={(e) =>
                    handleOptionChange(choice.id, e.target.value)
                  }
                  value={selectedOptions[choice.id]}
                  className="w-full max-w-xs p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                  {choice.options.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt} (€{choice.prices[i]})
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}

          {/* Quantity and Add to Cart */}
          <div className="fixed bottom-12 left-0 right-0 bg-white border-t border-gray-200 shadow-lg py-4 rounded-t-2xl px-4 z-10 md:py-4 md:px-6">
            <div className="container mx-auto max-w-7xl">
              <div className="flex items-center justify-between gap-3 md:gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center border border-gray-200 rounded-full overflow-hidden shadow-sm bg-white">
                  <button
                    onClick={decrement}
                    className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-base md:text-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 md:px-4 md:py-3"
                    aria-label="Decrease quantity">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 md:h-5 md:w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>

                  <span className="px-3 py-1 text-base md:text-lg font-semibold text-gray-800 min-w-[30px] md:min-w-[40px] text-center">
                    {quantity}
                  </span>

                  <button
                    onClick={increment}
                    className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-base md:text-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 md:px-4 md:py-3"
                    aria-label="Increase quantity">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 md:h-5 md:w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-500 text-white py-2 px-4 md:py-3 md:px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                  <span className="font-bold text-sm md:text-lg flex items-center justify-center gap-1 md:gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 md:h-6 md:w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="hidden xs:inline">Add to Cart</span> - €
                    {calculateTotalPrice}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      <div className="group relative block w-full max-w-[600px] mx-auto rounded-lg shadow-lg bg-red-700
      h-[400px] sm:h-[450px] md:h-[500px]">
      <div className="flex flex-col h-full">
        <div className="flex-1 p-1 sm:p-1 md:p-1 lg:p-1 overflow-y-auto max-h-screen">
          <Cart />
        </div>
        {totalItems > 0 && (
          <div className="flex flex-col p-3 sm:p-4 border-t border-red-600 bg-red-700">
            <span className="text-xs sm:text-sm text-yellow-500 font-bold">
              {totalItems} Produit{totalItems > 1 ? 's' : ''} | Montant total: €{totalPrice.toFixed(2)}
            </span>
            <Link href="/checkout">
              <button className="mt-2 sm:mt-3 bg-yellow-500 text-red-700 font-semibold py-2 px-4 rounded-lg
                hover:bg-yellow-400 transition-colors duration-200 w-full sm:w-auto text-sm sm:text-base">
                Passer la commande
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-[slideUp_0.3s_ease-out] mx-2 sm:mx-0">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-100 p-2 sm:p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-8 sm:w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-center text-gray-800 mb-2">
              Added to Cart!
            </h3>

            <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6">
              {product.product.product_name} × {quantity}
            </p>

            <div className="max-h-[40vh] overflow-y-auto mb-4 sm:mb-6">
              {Object.entries({
                ...selectedOptions,
                size: selectedSize,
                drink: selectedDrink,
              })
                .filter(([_, value]) => value)
                .map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between py-2 border-b border-gray-100 last:border-0 text-sm sm:text-base">
                    <span className="text-gray-600 capitalize">{key}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => setShowPopup(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base">
                Continue Shopping
              </button>
              <button
                onClick={() => {
                  setShowPopup(false);
                  router.push("/cart");
                }}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base">
                View Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
