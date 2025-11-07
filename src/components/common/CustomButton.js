import Image from "next/image";
import React from "react";

export default function CustomButton({
  title,
  variant = "primary", // primary, secondary, outline, ghost, gradient, glass
  size = "medium", // small, medium, large
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = "left", // left, right
  onClick,
  className = "",
  ...props
}) {
  // Base styles
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // Size variants
  const sizeStyles = {
    small: "text-xs px-4 py-2",
    medium: "text-sm px-6 py-3",
    large: "text-base px-8 py-4",
  };

  // Color variants
  const variantStyles = {
    // Ruby-themed primary
    primary:
      "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95",

    // Secondary
    secondary:
      "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95",

    // Outline
    outline:
      "border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white focus:ring-red-500 bg-transparent",

    // Ghost
    ghost: "text-red-600 hover:bg-red-50 focus:ring-red-500 bg-transparent",

    // Gradient
    gradient:
      "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white focus:ring-red-500 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95",

    // Glass morphism
    glass:
      "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 focus:ring-white/50 shadow-lg hover:shadow-xl",
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
      `}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}

      {/* Left icon */}
      {!loading && Icon && iconPosition === "left" && (
        <Image
          src={Icon}
          alt={title}
          width={24}
          height={24}
          className="w-3 h-3 mr-2"
        />
      )}

      {/* Button text */}
      {title}

      {/* Right icon */}
      {!loading && Icon && iconPosition === "right" && (
        <Image
          src={Icon}
          alt={title}
          width={24}
          height={24}
          className="w-3 h-3 ml-2"
        />
      )}
    </button>
  );
}
