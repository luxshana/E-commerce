// app/profile/page.js
"use client"; // This page handles client-side state (user from sessionStorage) and navigation

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileClient from "../../components/ProfileClient"; // Adjust path
// Import your api functions if you need user specific data (e.g. fetchUserPoints, fetchUserOrders)
// from your api.js file.

export default function ProfilePage() {
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
  }, [router]); // Depend on router to ensure it's available

  if (loading) {
    // You can replace this with a proper loader component
    return (
      <div className="loading">
        <div className="gen_preloader1"></div>{" "}
        {/* Assuming you have this CSS class */}
      </div>
    );
  }

  // If user is null after loading (meaning not logged in and redirected)
  if (!user) {
    return null; // Or a message like "Redirecting to login..."
  }

  // Render the ProfileClient component with the loaded user data
  return (
    <div>
      {/* You can wrap with Header/Footer here, or in your root layout */}
      {/* <Header /> */}
      <ProfileClient user={user} />
      {/* <Footer /> */}
    </div>
  );
}
