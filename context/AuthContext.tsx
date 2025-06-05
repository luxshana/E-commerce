"use client"; // Mark as Client Component

import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  user: any; // Replace 'any' with a specific type, e.g., { name: string; id: string }
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null); // Replace 'any' with your user type

  const logout = () => {
    setUser(null); // Clear user data; add real logout logic (e.g., clear tokens)
    console.log("User logged out");
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
