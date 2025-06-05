"use client"; // Client component for dynamic fetching and state

import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation"; // To get dynamic route params
import { fetchProductsByCategory, fetchCategories } from "../../../lib/api"; // Adjust path
import "../../../styles/catstyle.css"; // Adjusted path
import { CartContext } from "../../../components/CartContext"; // Adjust path to your CartContext
import SuccessPopup from "../../../components/SuccessPopup";

const IMAGE_BASE_URL =
  "https://orange-wolf-342633.hostingersite.com/uploads/products/";

export default function CategoryPage() {
  const { id } = useParams(); // Get the dynamic 'id' from the URL
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

  // Popup state for SuccessPopup
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch category details
        const categoriesData = await fetchCategories();
        const categoryMatch = (categoriesData.categories || []).find(
          (cat) => cat.id === id || cat.id.toString() === id
        );
        setCategory(categoryMatch || null);

        // Fetch products for this category
        const productsData = await fetchProductsByCategory(id);
        setProducts(productsData.products || []);
      } catch (err) {
        setError("Failed to load category or products: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    } else {
      setError("No category ID provided");
      setLoading(false);
    }
  }, [id]);

  const handleAddToCart = (product) => {
    const initialOptions = {};
    // If product has choices, initialize with first option like ProductPage
    if (product.choices?.length > 0) {
      product.choices.forEach((choice) => {
        initialOptions[choice.id] = choice.options[0];
      });
    }
    setSelectedOptions(initialOptions);
    setSelectedProduct(product);
    addToCart(product, 1, initialOptions); // Quantity = 1, options initialized
    setShowPopup(true);
  };

  if (loading) {
    return (
      <div className="">
        <div className="gen_preloader1"></div>
      </div>
    );
  }

  if (error) {
    return <div style={{ padding: "20px", color: "red" }}>{error}</div>;
  }

  if (!category) {
    return <div style={{ padding: "20px" }}>Category not found.</div>;
  }

  return (
    <div className="category-page" style={{ position: "relative" }}>
      {/* <h1>{category.title}</h1> */}
      {category.texts && <p className="long600">{category.texts}</p>}
      <div className="products" style={{ padding: "0 0.75rem 0.75rem" }}>
        {/* <h4 style={{ fontSize: "1.1em", margin: "10px 0" }}>Products</h4> */}
        {products.length === 0 ? (
          <p>No products found for this category.</p>
        ) : (
          <div
            className="md:grid grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.product_id}
                className="prod_single_card"
                style={{ background: "#f9f9f9" }}>
                <div className="prod_single_img">
                  <Image
                    src={`${IMAGE_BASE_URL}${
                      product.images?.[0] || "missing.png"
                    }`}
                    alt={product.product_name}
                    width={100}
                    height={100}
                    style={{ objectFit: "cover" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `${IMAGE_BASE_URL}missing.png`;
                    }}
                  />
                </div>
                <div className="prod_single_info">
                  <h5 style={{ fontSize: "1em", margin: "5px 0" }}>
                    <Link
                      href={`/product/${product.product_id}`}
                      style={{ color: "#333", textDecoration: "none" }}>
                      {product.product_name}
                    </Link>
                  </h5>
                  <p style={{ fontSize: "0.9em", color: "#666" }}>
                    {product.description || "No description available"}
                  </p>
                  <p style={{ fontSize: "0.9em", fontWeight: "bold" }}>
                    €{parseFloat(product.price).toFixed(2)}
                  </p>
                </div>
                {(!product.choices || product.choices.length === 0) && (
                  <button
                    className="prod_single_add"
                    onClick={() => handleAddToCart(product)}
                    aria-label={`Add ${product.product_name} to cart`}>
                    +
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SuccessPopup consistent with ProductPage */}
      {showPopup && selectedProduct && (
        <SuccessPopup
          productName={selectedProduct.product_name}
          choices={selectedOptions}
          onClose={() => {
            setShowPopup(false);
            setSelectedProduct(null);
            setSelectedOptions({});
          }}
        />
      )}
    </div>
  );
}
