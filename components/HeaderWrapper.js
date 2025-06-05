"use client";

import React from "react";
import { useAuth } from "../context/AuthContext";
import Header from "./Header";

export default function HeaderWrapper() {
  const { user, logout } = useAuth();
  return <Header loggedInUser={user} onLogout={logout} />;
}
