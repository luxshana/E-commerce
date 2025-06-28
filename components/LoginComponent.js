// components/LoginComponent.js
"use client"; // REQUIRED for client-side hooks and browser APIs

import React, { useState, useEffect } from "react"; // Include useEffect as it might be needed for props
import { useRouter } from "next/navigation"; // Next.js equivalent of useNavigate
import Link from "next/link"; // Next.js equivalent of Link from react-router-dom
import { login } from "../lib/api"; // Adjust path to your api.js

export default function LoginComponent({
  onLoginSuccess, // Callback from parent (LoginPage) when login is successful
  onLogout, // Callback from parent for logout
}) {
  const [phone_number, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null); // Local state for user

  const router = useRouter(); // Initialize Next.js router

  // On component mount, check sessionStorage for a logged-in user
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ensure sessionStorage is only accessed on client
      const user = sessionStorage.getItem("user");
      if (user) {
        setLoggedInUser(JSON.parse(user));
      }
    }
  }, []); // Run once on mount

  // This useEffect watches for changes in loggedInUser local state
  // and calls the parent's onLoginSuccess if a user is found
  useEffect(() => {
    if (loggedInUser && onLoginSuccess) {
      onLoginSuccess(loggedInUser); // Propagate user up to parent (if any)
    }
  }, [loggedInUser, onLoginSuccess]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      // Ensure sessionStorage is only accessed on client
      sessionStorage.removeItem("user");
    }
    setLoggedInUser(null); // Clear local user state
    onLogout?.(); // Call parent logout handler
    router.push("/login"); // Redirect to login page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login({ phone_number, password });
      if (data.success) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("user", JSON.stringify(data.user));
        }
        setLoggedInUser(data.user); // Update local state
        // onLoginSuccess?.(data.user); // This will be called by the useEffect above
        router.push("/profile"); // Redirect to profile after successful login
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Unexpected error during login.");
    } finally {
      setLoading(false);
    }
  };

  if (loggedInUser) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome!</h2>
        <div className="mb-6 p-4 bg-gray-100 rounded-md">
          <p className="text-gray-700">
            You are logged in as{" "}
            <strong className="text-blue-600">{loggedInUser.username}</strong>.
          </p>
        </div>
        <p className="text-gray-600 mb-4">
          <strong>User ID:</strong> {loggedInUser.user_id}
        </p>
        <div className="flex justify-center gap-4">
          {/* Use Next.js Link component */}
          <Link
            href="/profile"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            My Profile
          </Link>
          <Link
            href="/shopcard"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            My Card
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container align-left text-left">
      <h2 className="text-left">SE CONNECTER</h2>
      {error && <p className="error-message">{error}</p>}{" "}
      {/* Display error message */}
      <form onSubmit={handleSubmit}>
        <label>N° DE TÉLÉPHONE</label>
        <input
          type="text"
          value={phone_number}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />

        <label>MOT DE PASSE:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
      <div className="secondary-buttons">
        {/* Use Next.js Link component */}
        <Link href="/register">ou Créer un compte rapide</Link>
        <br />
        
      </div>
    </div>
  );
}
