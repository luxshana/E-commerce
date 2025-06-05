// components/CategoryMenu.js
"use client"; // Mark as a Client Component

import React, { useEffect, useState } from "react";
import { fetchAllCategories } from "../lib/api"; // Adjust path to your api.js
import { useRouter } from "next/navigation"; // Import useRouter for Next.js navigation
import "../styles/catstyle.css"; // Adjust path to your CSS file

export default function CategoryMenu() {
  const [categoryTree, setCategoryTree] = useState([]);
  const [currentPath, setCurrentPath] = useState([]); // stack of selected categories
  const router = useRouter(); // Initialize Next.js router for programmatic navigation

  useEffect(() => {
    fetchAllCategories()
      .then((data) => {
        // Ensure data.categories exists and is an array
        const tree = buildCategoryTree(data.categories || []);
        setCategoryTree(tree);
      })
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  function buildCategoryTree(categories) {
    const map = {};
    const roots = [];

    categories.forEach((cat) => {
      map[cat.id] = { ...cat, children: [] };
    });

    categories.forEach((cat) => {
      if (cat.parent_id && map[cat.parent_id]) {
        map[cat.parent_id].children.push(map[cat.id]);
      } else {
        roots.push(map[cat.id]);
      }
    });

    return roots;
  }

  const getCurrentCategories = () => {
    if (currentPath.length === 0) return categoryTree;

    // Traverse the tree based on the currentPath
    let node = categoryTree.find((cat) => cat.id === currentPath[0].id);
    for (let i = 1; i < currentPath.length; i++) {
      if (!node || !node.children) {
        // Add safety check
        node = null;
        break;
      }
      node = node.children.find((child) => child.id === currentPath[i].id);
    }
    return node?.children || []; // Return children of the current node, or empty array
  };

  const handleCategoryClick = (cat) => {
    if (cat.children.length > 0) {
      setCurrentPath([...currentPath, cat]);
    } else {
      // Use router.push for Next.js navigation
      router.push(`/category/${cat.id}`);
    }
  };

  const handleBack = () => {
    setCurrentPath(currentPath.slice(0, -1));
  };

  const currentCategories = getCurrentCategories();

  return (
    <div className="cat_menu_list_holder">
      <h2 className="">Catégories</h2>

      {currentPath.length > 0 && (
        <button onClick={handleBack} className="btn-bk">
          ← Retour
        </button>
      )}

      <ul className="cat_menu_list">
        {currentCategories.length > 0 ? ( // Added a check for empty categories
          currentCategories.map((cat) => (
            <li
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              className="cat_menu_item"
            >
              <span>{cat.title}</span>
              {cat.children &&
                cat.children.length > 0 && ( // Safety check for children existence
                  <span className="text-gray-400">›</span>
                )}
            </li>
          ))
        ) : (
          <p>No categories found or loading...</p> // Message if no categories
        )}
      </ul>
    </div>
  );
}
