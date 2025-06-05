"use client"; // REQUIRED: This component uses client-side hooks and browser APIs

import React, { useState, useEffect, useContext, useRef } from "react";
import { useRouter } from "next/navigation"; // Use useRouter from next/navigation
import Image from "next/image"; // Import Next.js Image component

import { CartContext } from "./CartContext"; // Path should be correct if CartContext is in the same directory
import { searchProducts } from "../lib/api"; // Adjust path to your API utility
import SuccessPopup from "./SuccessPopup"; // Path should be correct if SuccessPopup is in the same directory

const IMAGE_BASE_URL =
  "https://orange-wolf-342633.hostingersite.com/uploads/products/";

export default function OverlaySearch() {
  // Ensure CartContext and addToCart are correctly provided
  const cartContext = useContext(CartContext);
  const addToCart = cartContext?.addToCart; // Safely access addToCart

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const router = useRouter(); // Initialize useRouter
  const overlayRef = useRef(null); // Add ref for outside click detection

  useEffect(() => {
    // Only fetch if overlay is open and query is long enough
    if (query.length < 2 || !isOverlayOpen) {
      setResults([]);
      // If query becomes too short while loading, stop loading
      if (loading) setLoading(false);
      return;
    }

    // Debounce the search request
    const delayDebounce = setTimeout(() => {
      setLoading(true);
      searchProducts(query)
        .then((data) => {
          // Assuming data is an array of products
          setResults(data || []); // Ensure results is an array
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 300); // 300ms debounce time

    // Cleanup function to clear the timeout if query or overlay status changes
    return () => clearTimeout(delayDebounce);
  }, [query, isOverlayOpen, loading]); // Added loading to dependencies

  // Effect to handle clicks outside the overlay to close it
  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Check if click is outside the overlay
      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        closeOverlay(); // Close overlay if clicked outside
      }
    };

    if (isOverlayOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    // Cleanup function for event listener
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOverlayOpen]); // Re-run effect when overlay state changes

  const handleAddToCart = (product) => {
    if (!addToCart) {
      console.error("addToCart function not available from CartContext.");
      return;
    }
    const cartItem = {
      product: product, // Assuming 'product' here already has the required structure for CartContext
      quantity: 1,
      selectedOptions: {}, // Assuming live search results don't have complex options
    };
    // The addToCart function expects the product object as its first argument
    addToCart(cartItem.product, cartItem.quantity, cartItem.selectedOptions);
    setSelectedProduct(product); // For the success popup
    setShowPopup(true);
  };

  const handleSeeMore = () => {
    if (query.trim()) {
      setIsOverlayOpen(false); // Close the overlay
      // Use router.push for navigation in Next.js App Router
      router.push(`/searchresult?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);
    setQuery(""); // Clear query when closing
    setResults([]); // Clear results when closing
  };

  return (
    <div className="container">
      {/* Initial Search Input - This should likely be part of your site header */}
      <div className="search-container">
        <div className="input-wrapper">
          <input
            type="text"
            className="input"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOverlayOpen(true)} // Open overlay when input is focused
            // Consider adding onBlur and check relatedTarget to keep overlay open when clicking results
          />
          <span className="icon">
            {loading ? (
              // You might want a better loading indicator like a spinner SVG or GIF
              "🔄"
            ) : (
              // Next.js Image for local assets (from public folder)
              <Image
                src="/search.png"
                alt="Search Icon"
                className="icon-img"
                width={20}
                height={20}
              />
            )}
          </span>
        </div>
      </div>

      {/* Full-Screen Overlay */}
      {isOverlayOpen && (
        <div className="overlay ex" ref={overlayRef}>
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
                  autoFocus // Keeps focus in the overlay input
                />
                <span className="icon">
                  {loading ? (
                    "🔄"
                  ) : (
                    <Image
                      src="/search.png"
                      alt="Search Icon"
                      className="icon-img"
                      width={20}
                      height={20}
                    />
                  )}
                </span>
              </div>
              <button
                className="close-button"
                onClick={closeOverlay} // Use the new closeOverlay function
                aria-label="Close search overlay"
              >
                ×
              </button>
            </div>
          </div>

          {/* Results Area */}
          <div className="results-area">
            <div className="results-container">
              {query.length < 2 && !loading ? (
                <p className="no-results">
                  Type at least 2 characters to search.
                </p>
              ) : results.length > 0 ? (
                <div className="prod_single_card_holder">
                  {results.map((item) => (
                    <div key={item.product_id} className="prod_single_card">
                      {/* Use Next.js Image component */}
                      <Image
                        src={item.image_url || `${IMAGE_BASE_URL}default.jpg`} // Fallback to a default image in public folder or base URL
                        alt={item.product_name || "Product Image"}
                        className="prod_single_img"
                        width={150} // Required: adjust as needed for your card layout
                        height={150} // Required: adjust as needed
                        objectFit="contain" // Or "cover"
                        onError={(e) => {
                          // Handle image loading errors for Next.js Image
                          e.target.onerror = null;
                          e.target.srcset = "";
                          e.target.src = `${IMAGE_BASE_URL}missing.png`; // Fallback image if yours fail
                        }}
                      />
                      <div className="prod_single_info">
                        {/* You might want a Link here to product detail page */}
                        <h3 className="result-text">{item.product_name}</h3>
                        <p className="result-price">
                          €{parseFloat(item.price).toFixed(2)}
                        </p>
                      </div>
                      {/* Only show "Add to Cart" if no choices are required */}
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
                  {/* Show "See more" button only if there are results */}
                  {results.length > 0 && (
                    <button className="btnStyle1" onClick={handleSeeMore}>
                      See more results for <span>{query}</span>
                    </button>
                  )}
                </div>
              ) : (
                <p className="no-results">
                  {loading ? "Searching..." : "No results found."}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Success Popup remains the same, assuming it's a Client Component */}
      {showPopup && selectedProduct && (
        <SuccessPopup
          productName={selectedProduct.product_name}
          choices={{}} // Assuming no choices for live search add-to-cart
          onClose={() => {
            setShowPopup(false);
            setSelectedProduct(null);
            closeOverlay(); // Close overlay after popup dismissal (optional)
          }}
        />
      )}
    </div>
  );
}
