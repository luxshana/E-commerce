"use client"; // Client component for dynamic fetching and Swiper functionality

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCategories } from "../lib/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const IMAGE_BASE_URL =
  "https://orange-wolf-342633.hostingersite.com/uploads/products/";
export default function CatSlider() {
  const [categories, setCategories] = useState([]);

  // Convert flat list to nested tree
  const buildCategoryTree = (flatCategories) => {
    const categoryMap = {};
    const tree = [];

    flatCategories.forEach((cat) => {
      categoryMap[cat.id] = { ...cat, subcategories: [] };
    });

    flatCategories.forEach((cat) => {
      if (cat.parent_id === null || cat.parent_id === "0") {
        tree.push(categoryMap[cat.id]);
      } else if (categoryMap[cat.parent_id]) {
        categoryMap[cat.parent_id].subcategories.push(categoryMap[cat.id]);
      }
    });

    return tree;
  };

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        const nested = buildCategoryTree(data.categories || []);
        setCategories(nested);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  return (
    <div className="cat-slider-wrapper bg-white sticky top-[70px] z-40">
      <Swiper
        modules={[Autoplay]}
        loop={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        slidesPerView={2}
        spaceBetween={15}
        breakpoints={{
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 5,
          },
        }}
      >
        {categories.map((cat) => (
          <SwiperSlide key={cat.id}>
            <Link href={`/category/${cat.id}`} className="cat-slide-link py-3 px-1">
            {/* <button>
              <img src={`${IMAGE_BASE_URL}${cat.image_web?.[0] || "missing.png"}`} />
            </button> */}
              <div className="cat-slide-box">
                <h4>{cat.title}</h4>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
