// components/MyFavProducts.js
"use client"; // This component uses useState, useEffect, and useContext

import React, { useEffect, useState, useContext } from "react";
import Link from "next/link"; // Import Next.js Link component
import Image from "next/image"; // Import Next.js Image component
// CartContext needs to be a Client Component and defined in its own file
import { CartContext } from "../components/CartContext"; // Adjust path to your CartContext
import { fetchUserOrders } from "../lib/api"; // This API call is used to derive favorite products
import SuccessPopup from "../components/SuccessPopup"; // This also needs to be a Client Component
import "../styles/prodstyle.css"; // Adjust path to your CSS file

const IMAGE_BASE_URL =
  "https://orange-wolf-342633.hostingersite.com/uploads/products/";

export default function MyFavProducts({ userId }) {
  // Ensure CartContext and addToCart are correctly provided
  const cartContext = useContext(CartContext);
  // Check if cartContext is available before destructuring addToCart
  const addToCart = cartContext?.addToCart;

  const [favProducts, setFavProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false); // No user ID, stop loading
      return;
    }

    setLoading(true); // Start loading
    setError(null); // Clear previous errors

    // fetchUserOrders is used here to derive "favorite" products from past orders
    fetchUserOrders(userId)
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setFavProducts([]); // Clear products on error
          return;
        }

        const productMap = new Map();

        // Ensure data.orders is an array before iterating
        (data.orders || []).forEach((order) => {
          (order.items || []).forEach((item) => {
            // Ensure order.items is an array
            const productId = item.product_id;
            const images = item.images ? JSON.parse(item.images) : []; // Parse images here

            if (productMap.has(productId)) {
              productMap.get(productId).quantity += item.quantity;
            } else {
              productMap.set(productId, {
                productId,
                name: item.product_name || `Product ${productId}`,
                description: item.product_description || "",
                price: parseFloat(item.price) || 0, // Ensure price is a number
                quantity: item.quantity,
                images: images, // Use the parsed images array
              });
            }
          });
        });

        const sortedProducts = Array.from(productMap.values()).sort(
          (a, b) => b.quantity - a.quantity
        );

        // Limit to top 10 favorite products
        setFavProducts(sortedProducts.slice(0, 10));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false)); // End loading
  }, [userId]);

  const handleAddToCart = (product) => {
    if (!addToCart) {
      console.error("addToCart function not available from CartContext.");
      return;
    }
    const cartItem = {
      product: {
        product_id: product.productId,
        product_name: product.name,
        description: product.description,
        price: product.price,
        images: product.images,
      },
      quantity: 1, // Add 1 by default
      selectedOptions: {}, // Assuming no options for favorite products
    };
    addToCart(cartItem.product, cartItem.quantity, cartItem.selectedOptions);
    setSelectedProduct(cartItem.product); // Set for popup
    setShowPopup(true); // Show success popup
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="gen_preloader1"></div>
      </div>
    );
  }

  if (error)
    return <div style={{ padding: "10px", color: "red" }}>Error: {error}</div>;

  if (!favProducts.length)
    return <div style={{ padding: "10px" }}>No favorite products found.</div>;

  return (
    <div className="container mt-5 mb-5">
      <div className="prod_single_card_holder">
        {favProducts.map((product) => (
          <div className="prod_single_card" key={product.productId}>
            <div className="prod_single_img">
              {product.images?.length > 0 ? (
                <Image
                  src={`${IMAGE_BASE_URL}${product.images[0]}`}
                  alt={product.name}
                  width={200} // Adjust width as needed for your design
                  height={200} // Adjust height as needed
                  objectFit="contain" // Or 'cover' depending on desired fit
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.srcset = "";
                    e.target.src = `${IMAGE_BASE_URL}missing.png`;
                  }}
                />
              ) : (
                <Image
                  src={`${IMAGE_BASE_URL}missing.png`}
                  alt="Missing Product"
                  width={200} // Adjust width as needed
                  height={200} // Adjust height as needed
                  objectFit="contain"
                />
              )}
            </div>
            <div className="prod_single_info">
              <h3>
                {/* Use Next.js Link component */}
                <Link
                  href={`/product/${product.productId}`}
                  style={{ textDecoration: "none", color: "#333" }}
                >
                  {product.name}
                </Link>
              </h3>
              <p>{product.description || "No description available"}</p>
              <p className="prod_single_price">
                €{parseFloat(product.price).toFixed(2)}
              </p>
            </div>
            <button
              className="prod_single_add"
              onClick={() => handleAddToCart(product)}
              aria-label={`Add ${product.name} to cart`}
            >
              +
            </button>
          </div>
        ))}
      </div>
      {showPopup && selectedProduct && (
        <SuccessPopup
          productName={selectedProduct.product_name}
          choices={{}} // Assuming no choices for favorite products
          onClose={() => {
            setShowPopup(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}
