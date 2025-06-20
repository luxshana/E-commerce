"use client";

import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { CartContext } from "./CartContext";
import { fetchCategories, fetchProductsByCategory } from "../lib/api";
import SuccessPopup from "./SuccessPopup";

const IMAGE_BASE_URL =
  "https://orange-wolf-342633.hostingersite.com/uploads/products/";
const PRODUCTS_PER_PAGE = 5;

export default function AllCategories() {
  const { addToCart } = useContext(CartContext);
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);


   
  // Build nested category tree
  const buildCategoryTree = (flatCategories) => {
    const map = {};
    const tree = [];

    flatCategories.forEach((cat) => {
      map[cat.id] = { ...cat, subcategories: [] };
    });

    flatCategories.forEach((cat) => {
      if (!cat.parent_id || cat.parent_id === "0") {
        tree.push(map[cat.id]);
      } else if (map[cat.parent_id]) {
        map[cat.parent_id].subcategories.push(map[cat.id]);
      }
    });

    return tree;
  };

  // Get unique random products
  const getRandomProducts = (products, count, excludeIds = []) => {
    const filtered = products.filter((p) => !excludeIds.includes(p.product_id));
    return filtered.sort(() => 0.5 - Math.random()).slice(0, count);
  };

  const loadProductsForCategory = async (catId, currentProducts = []) => {
    try {
      const data = await fetchProductsByCategory(catId);
      const allProducts = data.products || [];
      const currentIds = currentProducts.map((p) => p.product_id);
      const newProducts = getRandomProducts(
        allProducts,
        PRODUCTS_PER_PAGE,
        currentIds
      );

      setProductsByCategory((prev) => ({
        ...prev,
        [catId]: [...(prev[catId] || []), ...newProducts],
      }));
    } catch (err) {
      console.error(`Error loading products for category ${catId}:`, err);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1, {});
    setSelectedProduct(product);
    setShowPopup(true);
  };

  const handleLoadMore = (catId) => {
    loadProductsForCategory(catId, productsByCategory[catId] || []);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const catData = await fetchCategories();
        const nested = buildCategoryTree(catData.categories || []);
        setCategories(nested);

        const promises = [];
        nested.forEach((cat) => {
          promises.push(loadProductsForCategory(cat.id));
          cat.subcategories.forEach((sub) => {
            promises.push(loadProductsForCategory(sub.id));
          });
        });

        await Promise.all(promises);
      } catch (err) {
        console.error("Error loading categories:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="gen_preloader1"></div>
        <div className="gen_preloader1"></div>
      </div>
    );
  }

  return (
    <div>
      <div
        className="main index text-center"
        style={{ padding: "3rem 1rem 1rem" }}
      >
        <h1>Nos catégories de plats</h1>
        <p className="long600">
          Découvrez vos catégories préférées et laissez-vous tenter par les
          saveurs authentiques de la cuisine indienne.
        </p>
      </div>

      <div className="insiderx p-[1rem]">
        {categories.length === 0 && <p>No categories found.</p>}

        {categories.map((cat) => (
          <div key={cat.id} className="cat_prod_card">
            <CategoryBlock
              category={cat}
              products={productsByCategory[cat.id] || []}
              onLoadMore={handleLoadMore}
              onAddToCart={handleAddToCart}
              subProducts={productsByCategory}
            />
          </div>
        ))}
      </div>

      {showPopup && selectedProduct && (
        <SuccessPopup
          product={selectedProduct}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

function CategoryBlock({
  category,
  products,
  onLoadMore,
  onAddToCart,
  subProducts,
}) {
 const renderProduct = (product) => (
  <div
    key={product.product_id}
    className="prod_single_card mb-4 bg-gray-50 rounded-lg shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
  >
    <div className="prod_single_img">
      <Image
        src={`${IMAGE_BASE_URL}${product.image_web?.[0] || "missing.png"}`}
        alt={product.product_name}
        width={50}
        height={50}
        className="w-full h-32 object-cover rounded-md"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `${IMAGE_BASE_URL}missing.png`;
        }}
      />
    </div>
    <div className="prod_single_info flex-1">
      <h5 className="text-base font-medium mb-2">
        <Link
          href={`/product/${product.product_id}`}
          className="text-gray-800 no-underline hover:text-blue-600 transition-colors"
        >
          {product.product_name}
        </Link>
      </h5>
      <p className="text-sm text-gray-600 mb-2">
        {product.description || "No description available"}
      </p>
      <p className="text-sm font-bold text-gray-900">
        €{parseFloat(product.price).toFixed(2)}
      </p>
    </div>
    {(!product.choices || product.choices.length === 0) && (
      <button
        className="prod_single_add bg-blue-500 text-white font-bold text-lg w-10 h-10 rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center"
        onClick={() => onAddToCart(product)}
        aria-label={`Add ${product.product_name} to cart`}
      >
        +
      </button>
    )}
  </div>
);

  return (
    <>
     <Link href={`/category/${category.id}`} className="group relative block overflow-hidden rounded-lg shadow-lg">
      <div className="relative w-full h-48">
        <Image
          src={`${IMAGE_BASE_URL}${category.image_web}`}
          alt={category.title}
          fill
          className="object-cover transition-opacity group-hover:opacity-90"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-4">
          <h3 className="text-white text-center text-lg font-semibold tracking-tight">
            {category.title}
          </h3>
        </div>
      </div>
    </Link>

      <div className="products mt-3" style={{ padding: "0 0.75rem 0.75rem" }}>
        <div className="md:grid sm:gap-4 md:grid-cols-4">
          {products.map(renderProduct)}
        </div>
        <button
            className="btnStyle3 p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => onLoadMore(category.id)}
            aria-label="Load more"
        >
          <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:rotate-180 transition-transform duration-500"
          >
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M8 16H3v5" />
            <path d="M21 8h-5V3" />
          </svg>
        </button>
      </div>

      {category.subcategories?.length > 0 && (
        <div className="subcategories" style={{ padding: "0 0.75rem 0.75rem" }}>
          <h4 style={{ fontSize: "1.1em", margin: "10px 0" }}>Subcategories</h4>
          {category.subcategories.map((subcat) => (
            <div
              key={subcat.id}
              className="cat_prod_inSec"
              style={{ background: "#f7f7f7" }}
            >
              <Link href={`/category/${subcat.id}`} className="catx">
                <div
                  className="cat_imgHolder"
                  style={{ transform: "scale(0.7)", marginBottom: "-1rem" }}
                >
                  <Image
                    src={`${IMAGE_BASE_URL}${
                      subcat.image_web || "missing.png"
                    }`}
                    alt={subcat.title}
                    width={150}
                    height={150}
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="cat_product-details">
                  <h5 style={{ fontSize: "1em", margin: "5px 0" }}>
                    {subcat.title}
                  </h5>
                  {subcat.texts && (
                    <p style={{ fontSize: "0.9em", color: "#666" }}>
                      {subcat.texts}
                    </p>
                  )}
                </div>
              </Link>

              <div
                className="products"
                style={{ padding: "0 0.75rem 0.75rem" }}
              >
                <div style={{ display: "grid", gap: "10px" }}>
                  {(subProducts[subcat.id] || []).map(renderProduct)}
                </div>
                <button
                  className="btnStyle3"
                  onClick={() => onLoadMore(subcat.id)}
                >
                  Load More
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
