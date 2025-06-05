// components/ProfileClient.js
"use client"; // This component uses useState, so it must be a Client Component

import React, { useState } from "react";
// Assuming these are also Client Components and their paths are correct
import OrderHistory from "./OrderHistory";
import MyFavProducts from "./MyFavProducts";
// import your API functions if you need to update user profile
// import { updateUserProfile } from "../lib/api"; // You'll need to create this API call in api.js

export default function ProfileClient({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [address, setAddress] = useState(user?.address || "");

  // In a real application, you'd want to handle loading and error states for the save operation
  const handleSave = async () => {
    // Basic validation
    if (!email || !address) {
      alert("Email and Address cannot be empty.");
      return;
    }

    // Simulate API call to update user profile
    const updatedUser = { ...user, email, address };
    console.log("Saving updated user:", updatedUser);

    // In a real app, make an API call like:
    /*
    try {
      const response = await updateUserProfile(updatedUser); // Assuming updateUserProfile exists in api.js
      if (response.success) {
        // Update user data in session storage and any global state
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('user', JSON.stringify(updatedUser));
        }
        // If you have a global auth context, update it here:
        // authContext.updateUser(updatedUser);
        alert("Profile updated successfully!");
        setIsEditing(false); // Exit editing mode
      } else {
        alert(response.error || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while saving your profile.");
    }
    */
    // For now, just simulate success:
    if (typeof window !== "undefined") {
      sessionStorage.setItem("user", JSON.stringify(updatedUser)); // Update sessionStorage
    }
    setIsEditing(false); // Exit editing mode
    alert("Profile updated successfully! (Simulated)"); // Remove in production
  };

  return (
    <div
      className="profile-container"
      style={{
        maxWidth: "400px",
        margin: "auto",
        textAlign: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>Profile</h2>
      <p>
        <strong>User ID:</strong> {user?.user_id || "Not provided"}
      </p>
      <p>
        <strong>Username:</strong> {user?.username || "Not provided"}
      </p>
      {isEditing ? (
        <>
          <div>
            <label>
              <strong>Email:</strong>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginLeft: "10px", padding: "5px", width: "200px" }}
              />
            </label>
          </div>
          <div>
            <label>
              <strong>Address:</strong>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ marginLeft: "10px", padding: "5px", width: "200px" }}
              />
            </label>
          </div>
          <button
            onClick={handleSave}
            style={{ margin: "10px", padding: "8px 16px", cursor: "pointer" }}
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            style={{ margin: "10px", padding: "8px 16px", cursor: "pointer" }}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <p>
            <strong>Email:</strong> {user?.email || "Not provided"}
          </p>
          <p>
            <strong>Address:</strong> {user?.address || "Not provided"}
          </p>
          <p>
            <strong>User Level:</strong> {user?.user_level || "Not provided"}
          </p>
          <p>
            <strong>User Points:</strong> {user?.user_points || "0"}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            style={{ margin: "10px", padding: "8px 16px", cursor: "pointer" }}
          >
            Edit Profile
          </button>
        </>
      )}
      {/* Order History Section */}
      {user?.user_id ? (
        <div style={{ marginTop: "20px" }}>
          <h3>Order History</h3>
          <OrderHistory userId={user.user_id} />
        </div>
      ) : (
        <p style={{ marginTop: "20px", color: "red" }}>
          No user ID available to fetch order history.
        </p>
      )}

      {/* My Fav Products Section (assuming it takes user ID or no props) */}
      <div style={{ marginTop: "20px" }}>
        <h3>My Favorite Products</h3>
        <MyFavProducts userId={user?.user_id} /> {/* Pass userId if needed */}
      </div>
    </div>
  );
}
