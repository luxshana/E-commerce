"use client"; // Client component for dynamic navigation and state

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MyFavProducts from "../../components/MyFavProducts";

export default function FavouriteProductsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Ensure this runs only on the client side
    if (typeof window !== "undefined") {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // If no user found in sessionStorage, redirect to login page
        router.push("/login");
      }
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="loading">
        <div className="gen_preloader1"></div>
      </div>
    );
  }

  // If user is null after loading (meaning not logged in and redirected)
  if (!user) {
    return null; // Or a message like "Redirecting to login..."
  }

  return (
    <div
      className="favourite-products-page-container"
      style={{
        maxWidth: "600px",
        margin: "auto",
        textAlign: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>My Favourite Products</h2>
      {user?.user_id ? (
        <MyFavProducts userId={user.user_id} />
      ) : (
        <div>
          <div
            style={{
              marginTop: "20px",
              fontSize: "18px",
              color: "rgb(51, 51, 51)",
              padding: "20px",
              border: "1px solid rgb(221, 221, 221)",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            Please login to view special products for you
            <div className="secondary-buttons">
              <Link href="/login">login</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
