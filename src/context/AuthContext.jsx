"use client";

import { createContext, useContext, useState } from "react";

// Context ဖန်တီးတာ
const AuthContext = createContext(undefined);

// Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Computed values
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const isSuperAdmin = user?.role === "superadmin";

  // Clear user
  const clearUser = () => {
    setUser(null);
  };

  const value = {
    // State
    user,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,

    // Actions
    setUser,
    clearUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom Hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
