// components/Header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Prevent body scroll when overlays are open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isSearchOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <header className="bg-white/60 backdrop-blur-lg fixed w-full z-40 top-0 shadow">
        <div className="max-w-4xl flex justify-between items-center mx-auto py-2 px-4">
          <div className="flex justify-start items-center gap-x-2">
            <div className="w-6 mx-auto h-6 rounded-lg overflow-hidden relative">
              <Image
                src="/logo.png"
                alt="Admin Login"
                fill
                className="object-center"
                sizes="10px"
              />
            </div>
            <h1 className="text-lg font-bold text-gray-900">Burma Rubies</h1>
          </div>

          <div className="flex justify-end items-center gap-x-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-5 h-5 relative hover:opacity-70 transition-opacity"
              aria-label="Search"
            >
              <Image
                src="https://cdn-icons-png.flaticon.com/128/9177/9177086.png"
                alt="search"
                fill
                className="object-center"
                sizes="20px"
              />
            </button>

            <Link
              href="/admin"
              className="w-6 h-6 relative hover:opacity-70 transition-opacity cursor-pointer"
            >
              <Image
                src="https://cdn-icons-png.flaticon.com/128/9482/9482602.png"
                alt="login"
                fill
                className="object-center"
                sizes="24px"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Full Screen Search Overlay */}
      <div
        className={`fixed inset-0 bg-white z-50 transition-all duration-500 ease-in-out ${
          isSearchOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="relative max-w-4xl mx-auto px-4 pt-20">
          {/* Close Button */}
          <button
            onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery("");
            }}
            className="absolute top-6 right-6 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Close search"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Search Input */}
          <div
            className={`transition-all duration-700 delay-100 ${
              isSearchOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="relative flex justify-start items-center gap-4">
              <button
                className="w-5 h-5 relative hover:opacity-70 transition-opacity"
                aria-label="Search"
              >
                <Image
                  src="https://cdn-icons-png.flaticon.com/128/9177/9177086.png"
                  alt="search"
                  fill
                  className="object-center"
                  sizes="20px"
                />
              </button>
              <input
                type="text"
                placeholder="Search ruby.com"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full text-2xl font-light  focus:border-gray-900 outline-none  bg-transparent transition-colors"
              />
            </div>

            {/* Search Results/Suggestions */}
            {searchQuery && (
              <div
                className={`mt-12 transition-all duration-700 delay-200 ${
                  isSearchOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
              >
                <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-4">
                  Suggestion search
                </h3>
                <div className="gap-y-1">
                  <Link
                    href="#"
                    className="block text-sm text-gray-900 hover:text-gray-600 transition-colors py-2"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <button
                      className="w-3 h-3 mr-2 relative hover:opacity-70 transition-opacity"
                      aria-label="Search"
                    >
                      <Image
                        src="https://cdn-icons-png.flaticon.com/128/9177/9177086.png"
                        alt="search"
                        fill
                        className="object-center"
                        sizes="20px"
                      />
                    </button>
                    Products
                  </Link>
                  <Link
                    href="#"
                    className="block text-sm text-gray-900 hover:text-gray-600 transition-colors py-2"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <button
                      className="w-3 h-3 mr-2 relative hover:opacity-70 transition-opacity"
                      aria-label="Search"
                    >
                      <Image
                        src="https://cdn-icons-png.flaticon.com/128/9177/9177086.png"
                        alt="search"
                        fill
                        className="object-center"
                        sizes="20px"
                      />
                    </button>
                    Services
                  </Link>
                  <Link
                    href="#"
                    className="block text-sm text-gray-900 hover:text-gray-600 transition-colors py-2"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <button
                      className="w-3 h-3 mr-2 relative hover:opacity-70 transition-opacity"
                      aria-label="Search"
                    >
                      <Image
                        src="https://cdn-icons-png.flaticon.com/128/9177/9177086.png"
                        alt="search"
                        fill
                        className="object-center"
                        sizes="20px"
                      />
                    </button>
                    Support
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
