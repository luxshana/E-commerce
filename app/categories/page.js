/* app/categories/page.js */
"use client"; // Mark as Client Component for useState and useEffect
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCategories } from "../../lib/api"; // Adjust path as needed

const IMAGE_BASE_URL =
  "https://orange-wolf-342633.hostingersite.com/uploads/products/";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  // Transform flat categories into a nested structure
  const buildCategoryTree = (flatCategories) => {
    const categoryMap = {};
    const tree = [];

    // Create a map of categories by id
    flatCategories.forEach((cat) => {
      categoryMap[cat.id] = { ...cat, subcategories: [] };
    });

    // Build the tree by assigning subcategories to their parents
    flatCategories.forEach((cat) => {
      if (cat.parent_id === null || cat.parent_id === "0") {
        tree.push(categoryMap[cat.id]);
      } else {
        if (categoryMap[cat.parent_id]) {
          categoryMap[cat.parent_id].subcategories.push(categoryMap[cat.id]);
        }
      }
    });

    return tree;
  };

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        const nestedCategories = buildCategoryTree(data.categories || []);
        setCategories(nestedCategories);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  return (
    <div className="">
      <div className="main index text-center">
        <h1>Nos catégories</h1>
        <p className="long600">
          Découvrez vos catégories préférées et laissez-vous tenter par les
          saveurs authentiques de la cuisine indienne.
        </p>
      </div>
      <div className="insiderx">
        {categories.length === 0 && <p>No categories found.</p>}
        {categories.map((cat) => (
          <div key={cat.id} className="cat_prod_card">
            <div className="cat_prod_inSec">
              <Link href={`/category/${cat.id}`} className="catx">
                <div className="cat_imgHolder">
                  <img
                    src={`${IMAGE_BASE_URL}${cat.image_web || "missing.png"}`}
                    alt={cat.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `${IMAGE_BASE_URL}missing.png`;
                    }}
                  />
                </div>
                <div className="cat_product-details">
                  <h3>{cat.title}</h3>
                  {cat.texts && <p>{cat.texts}</p>}
                </div>
              </Link>
              {cat.subcategories?.length > 0 && (
                <div
                  className="subcategories"
                  style={{ padding: "0 0.75rem 0.75rem" }}
                >
                  <h4 style={{ fontSize: "1.1em", margin: "10px 0" }}>
                    Subcategories
                  </h4>
                  <div style={{ display: "grid", gap: "10px" }}>
                    {cat.subcategories.map((subcat) => (
                      <div
                        key={subcat.id}
                        className="cat_prod_inSec"
                        style={{ background: "#f7f7f7" }}
                      >
                        <Link href={`/category/${subcat.id}`} className="catx">
                          <div
                            className="cat_imgHolder"
                            style={{
                              transform: "scale(0.7)",
                              marginBottom: "-1rem",
                            }}
                          >
                            <img
                              src={`${IMAGE_BASE_URL}${
                                subcat.image_web || "missing.png"
                              }`}
                              alt={subcat.title}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `${IMAGE_BASE_URL}missing.png`;
                              }}
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
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
