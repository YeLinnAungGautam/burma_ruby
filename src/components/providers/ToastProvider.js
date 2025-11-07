// components/providers/ToastProvider.jsx
"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Default options
        duration: 4000,
        style: {
          background: "#fff",
          color: "#363636",
          padding: "16px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          maxWidth: "500px",
        },
        // Success toast style
        success: {
          duration: 3000,
          iconTheme: {
            primary: "#10b981",
            secondary: "#fff",
          },
          style: {
            background: "#f0fdf4",
            color: "#166534",
            border: "1px solid #86efac",
          },
        },
        // Error toast style
        error: {
          duration: 4000,
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
          style: {
            background: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fca5a5",
          },
        },
        // Loading toast style
        loading: {
          style: {
            background: "#eff6ff",
            color: "#1e40af",
            border: "1px solid #93c5fd",
          },
        },
      }}
    />
  );
}
