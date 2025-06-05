"use client";

import React, { useEffect, useState, useMemo, useContext } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { CartContext } from "../../../components/CartContext";
import { fetchSingleProduct } from "../../../lib/api";
import SuccessPopup from "../../../components/SuccessPopup";

const IMAGE_BASE_URL =
  "https://orange-wolf-342633.hostingersite.com/uploads/products/";

export default function ProductPage({ initialProduct }) {
  const router = useRouter();
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
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
      if (size?.price) optionsTotal += parseFloat(size.price.replace("€", "")) || 0;
    }
    if (selectedDrink) {
      const drink = Drinks.find((d) => d.name === selectedDrink);
      if (drink?.price) optionsTotal += parseFloat(drink.price.replace("€", "")) || 0;
    }
    return ((basePrice + optionsTotal) * quantity).toFixed(2);
  }, [product, selectedOptions, quantity, selectedSize, selectedDrink]);

  const handleAddToCart = () => {
    if (!product?.product) return;
    addToCart(product, quantity, { ...selectedOptions, size: selectedSize, drink: selectedDrink });
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Images */}
        <div className="product-image flex flex-col items-center">
          {product.images?.length > 0 ? (
            product.images.map((img, i) => (
              <img
                key={i}
                src={`${IMAGE_BASE_URL}${img}`}
                alt={`Image ${i}`}
                className="w-full max-w-[300px] sm:max-w-[400px] rounded-lg shadow-lg mb-4 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `${IMAGE_BASE_URL}missing.png`;
                }}
              />
            ))
          ) : (
            <img
              src={`${IMAGE_BASE_URL}missing.png`}
              alt="Missing"
              className="w-24 h-24 rounded-lg shadow-lg object-cover"
            />
          )}
        </div>

        {/* Product Info */}
        <div className="product-info space-y-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            {product.product.product_name}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">{product.product.description}</p>
          <p className="text-lg sm:text-xl font-semibold text-gray-800">
            Base Price: €{product.product.price}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-blue-600">
            Total: €{calculateTotalPrice} ({quantity} x €{product.product.price})
          </p>

          {/* Size Selection */}
          <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="text-base sm:text-lg font-medium mb-3">Size:</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {sizes.map((size) => (
                <div
                  key={size.id}
                  className={`flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedSize === size.name
                      ? "bg-blue-100 border-2 border-blue-500"
                      : "bg-white border border-gray-200 hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedSize(size.name)}
                >
                 <img
                    src={`${IMAGE_BASE_URL}${
                      size.images?.[0] || "missing.png"
                    }`}
                    alt={size.name}
                    className="w-full max-w-[120px] h-auto rounded-lg object-cover mb-2"
                  />
                  <div className="text-sm text-center font-medium">{size.name}</div>
                  {size.price && (
                    <div className="text-xs text-gray-500">{size.price}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Drinks Selection */}
          <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="text-base sm:text-lg font-medium mb-3">Drinks:</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Drinks.map((drink) => (
                <div
                  key={drink.id}
                  className={`flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedDrink === drink.name
                      ? "bg-blue-100 border-2 border-blue-500"
                      : "bg-white border border-gray-200 hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedDrink(drink.name)}
                >
                  <img
                    src={`${IMAGE_BASE_URL}${
                      drink.images?.[0] || "missing.png"
                    }`}
                    alt={drink.name}
                    className="w-full max-w-[120px] h-auto rounded-lg object-cover mb-2"
                  />

                  <div className="text-sm text-center font-medium">{drink.name}</div>
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
                        }`}
                      >
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
                  onChange={(e) => handleOptionChange(choice.id, e.target.value)}
                  value={selectedOptions[choice.id]}
                  className="w-full max-w-xs p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
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
             <div className="prod_add_options">
            <div className="prod_qts_control">
              <button onClick={decrement} style={{ marginRight: 10 }}>
                -
              </button>
              <span>{quantity}</span>
              <button onClick={increment} style={{ marginLeft: 10 }}>
                +
              </button>
            </div>
            <div className="prod_add_to_cart_single">
              <button onClick={handleAddToCart} className="">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <SuccessPopup
          productName={product.product.product_name}
          choices={{ ...selectedOptions, size: selectedSize, drink: selectedDrink }}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}