// app/login/page.js
"use client"; // This page also needs to be a client component because it uses useState for loggedInUser

import React, { useState, useEffect } from "react";
import LoginComponent from "../../components/LoginComponent"; // Adjust path
import "../../styles/loginregister.css"; // Adjust path to your CSS

// You would likely have a global context for user authentication
// For now, we'll keep a simple useState for demonstration.
// In a real app, consider using React Context API or a state management library for global user state.

export default function LoginPage() {
  const [loggedInUser, setLoggedInUser] = useState(null); // Global user state for this page

  // On page load, try to load user from session storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        setLoggedInUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setLoggedInUser(user);
    // You might want to update a global context here if you have one
    // For example: authContext.login(user);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    // You might want to update a global context here if you have one
    // For example: authContext.logout();
  };

  return (
    <div style={{ padding: 20 }}>
      {/* You might want to include your Header and Footer here,
          or manage them in your root layout. */}
      {/* <Header /> */}
      <LoginComponent
        loggedInUser={loggedInUser} // Pass the global user state
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />
      {/* <Footer /> */}
    </div>
  );
}
