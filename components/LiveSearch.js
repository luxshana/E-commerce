"use client"; // Client component for dynamic fetching and navigation

import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { CartContext } from "./CartContext";
import { searchProducts } from "../lib/api";
import SuccessPopup from "./SuccessPopup";
import Image from "next/image"; // Import next/image

export default function LiveSearch() {
  const { addToCart } = useContext(CartContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (query.length < 2 || !isOverlayOpen) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      setLoading(true);
      searchProducts(query)
        .then(setResults)
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, isOverlayOpen]);

  const handleAddToCart = (product) => {
    const cartItem = {
      product,
      quantity: 1,
      selectedOptions: {},
    };
    addToCart(cartItem.product, cartItem.quantity, cartItem.selectedOptions);
    setSelectedProduct(product);
    setShowPopup(true);
  };

  const handleSeeMore = () => {
    if (query.trim()) {
      setIsOverlayOpen(false);
      router.push(`/searchresult?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="container">
      {/* Initial Search Input */}
      <div className="search-container">
        <div className="input-wrapper">
          <input
            type="text"
            className="input"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOverlayOpen(true)}
          />
          <span className="icon">
            {loading ? (
              "🔄"
            ) : (
              <Image
                src="/search.png"
                alt="search"
                width={24} // Adjust based on your icon size
                height={24} // Adjust based on your icon size
                className="icon-img"
                style={{ width: "100%", height: "auto" }}
              />
            )}
          </span>
        </div>
      </div>

      {/* Full-Screen Overlay */}
      {isOverlayOpen && (
        <div className="overlay ex">
          {/* Overlay Header */}
          <div className="overlay-header">
            <div className="header-content">
              <div className="input-wrapper">
                <input
                  type="text"
                  className="overlay-input"
                  placeholder="Search products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
                <span className="icon">
                  {loading ? (
                    "🔄"
                  ) : (
                    <Image
                      src="/search.png"
                      alt="search"
                      width={24} // Adjust based on your icon size
                      height={24} // Adjust based on your icon size
                      className="icon-img"
                      style={{ width: "100%", height: "auto" }}
                    />
                  )}
                </span>
              </div>
              <button
                className="close-button"
                onClick={() => setIsOverlayOpen(false)}
              >
                ×
              </button>
            </div>
          </div>

          {/* Results Area */}
          <div className="results-area">
            <div className="results-container">
              {results.length > 0 ? (
                <div className="prod_single_card_holder">
                  {results.map((item) => (
                    <div key={item.product_id} className="prod_single_card">
                      <Image
                        src={item.image_url || "/default.jpg"}
                        alt={item.product_name}
                        width={100} // Adjust based on your design
                        height={100} // Adjust based on your design
                        className="prod_single_img"
                        style={{ width: "100%", height: "auto" }}
                      />
                      <div className="prod_single_info">
                        <h3 className="result-text">{item.product_name}</h3>
                        <p className="result-price">{item.price}€</p>
                      </div>
                      {(!item.choices || item.choices.length === 0) && (
                        <button
                          className="prod_single_add"
                          onClick={() => handleAddToCart(item)}
                          aria-label={`Add ${item.product_name} to cart`}
                        >
                          +
                        </button>
                      )}
                    </div>
                  ))}
                  <button className="btnStyle1" onClick={handleSeeMore}>
                    See more results for &quot;{query}&quot;
                  </button>
                </div>
              ) : (
                <p className="no-results">
                  {loading ? "Loading..." : "No results found"}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      {showPopup && selectedProduct && (
        <SuccessPopup
          productName={selectedProduct.product_name}
          choices={{}}
          onClose={() => {
            setShowPopup(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}
