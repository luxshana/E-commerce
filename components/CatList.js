"use client"; // Client component for dynamic fetching and navigation

import React, { useEffect, useState } from "react";
import { fetchCategories } from "../lib/api"; // Adjusted path to your API call
import { useRouter } from "next/navigation"; // Use Next.js navigation hook

export default function CatList() {
  const [categoryTree, setCategoryTree] = useState([]);
  const [currentPath, setCurrentPath] = useState([]); // Stack of selected categories
  const router = useRouter(); // Hook for programmatic navigation

  useEffect(() => {
    fetchCategories()
      .then((data) => {
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

    let node = categoryTree.find((cat) => cat.id === currentPath[0].id);
    for (let i = 1; i < currentPath.length; i++) {
      node = node.children.find((child) => child.id === currentPath[i].id);
    }
    return node?.children || [];
  };

  const handleCategoryClick = (cat) => {
    if (cat.children.length > 0) {
      setCurrentPath([...currentPath, cat]);
    } else {
      // Navigate to category/{id} using Next.js router
      router.push(`/category/${cat.id}`);
    }
  };

  const handleBack = () => {
    setCurrentPath(currentPath.slice(0, -1));
  };

  const currentCategories = getCurrentCategories();

  return (
    <div className="cat_menu_list_holder">
      {currentPath.length > 0 && (
        <button onClick={handleBack} className="btn-bk">
          ← Retour
        </button>
      )}

      <ul className="cat_menu_list">
        {currentCategories.map((cat) => (
          <li
            key={cat.id}
            onClick={() => handleCategoryClick(cat)}
            className="cat_menu_item"
          >
            <span>{cat.title}</span>
            {cat.children.length > 0 && (
              <span className="text-gray-400">›</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
