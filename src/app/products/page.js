"use client";

import { useState, useEffect, useRef } from "react";
import FooterBar from "@/components/Layout/FooterBar";
import Header from "@/components/Layout/Header";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart, ShoppingCart } from "lucide-react";

export default function ProductsCarouselPage() {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "/api/products?limit=50&status=available&moderationStatus=approved"
      );
      const data = await response.json();

      if (data.success && data.data.length > 0) {
        // Shuffle products for random order
        const shuffled = [...data.data].sort(() => Math.random() - 0.5);
        // Duplicate products for infinite loop effect
        setProducts([...shuffled, ...shuffled, ...shuffled]);
        setCurrentIndex(shuffled.length); // Start in the middle set
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);

    // Reset to middle set when reaching end
    setTimeout(() => {
      if (currentIndex >= products.length - products.length / 3) {
        setCurrentIndex(products.length / 3);
        setIsTransitioning(false);
      } else {
        setIsTransitioning(false);
      }
    }, 500);
  };

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);

    // Reset to middle set when reaching start
    setTimeout(() => {
      if (currentIndex <= products.length / 3) {
        setCurrentIndex(products.length - products.length / 3 - 1);
        setIsTransitioning(false);
      } else {
        setIsTransitioning(false);
      }
    }, 500);
  };

  // Touch handlers for swipe gestures
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const difference = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (difference > threshold) {
      goToNext();
    } else if (difference < -threshold) {
      goToPrevious();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading collection...</p>
          </div>
        </div>
        <FooterBar />
      </div>
    );
  }

  const currentProduct = products[currentIndex];

  if (!currentProduct) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="h-screen flex items-center justify-center">
          <p className="text-gray-600">No products available</p>
        </div>
        <FooterBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      <Header />

      {/* Main Carousel Container */}
      <div className="relative h-screen pt-8 md:pt-20 pb-24 overflow-hidden">
        {/* Background Blur Effect */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src={currentProduct.images?.[0]?.url || "/placeholder.jpg"}
            alt="background"
            fill
            className="object-cover blur-3xl scale-110"
          />
        </div>

        {/* Carousel Wrapper */}
        <div
          ref={containerRef}
          className="relative h-full flex items-center justify-center px-4 md:px-8 "
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Product Card */}
          <div
            className={`w-full max-w-sm md:max-w-md transition-all duration-500 ${
              isTransitioning ? "scale-95 opacity-50" : "scale-100 opacity-100"
            }`}
          >
            <ProductCarouselCard product={currentProduct} />
          </div>

          {/* Navigation Buttons - Desktop */}
          <button
            onClick={goToPrevious}
            disabled={isTransitioning}
            className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/80 backdrop-blur-lg rounded-full items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>

          <button
            onClick={goToNext}
            disabled={isTransitioning}
            className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/80 backdrop-blur-lg rounded-full items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            <ChevronRight className="w-6 h-6 text-gray-900" />
          </button>
        </div>

        {/* Swipe Hint - Mobile */}
        <div className="md:hidden absolute bottom-32 left-0 right-0 text-center">
          <p className="text-sm text-gray-500 animate-pulse">
            ← Swipe to browse →
          </p>
        </div>
      </div>

      <FooterBar />
    </div>
  );
}

// Product Carousel Card Component
function ProductCarouselCard({ product }) {
  const [liked, setLiked] = useState(false);
  const mainImage = product.images?.[0]?.url || "/placeholder.jpg";

  const formatPrice = (price, currency) => {
    if (currency === "MMK") {
      return `${price.toLocaleString()} MMK`;
    }
    return `$${price.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Image Section */}
      <div className="relative h-[300px] bg-gray-100">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className="object-cover"
          priority
        />

        {/* Floating Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            onClick={() => setLiked(!liked)}
            className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-5 h-5 ${
                liked ? "fill-red-600 text-red-600" : "text-gray-700"
              }`}
            />
          </button>
          <button className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <ShoppingCart className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Status */}
        {product.status === "sold" && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-white text-gray-900 px-8 py-3 rounded-full text-lg font-bold">
              SOLD
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Title & SKU */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h2 className="text-xl font-bold text-gray-900 line-clamp-1">
              {product.name}
            </h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
              {product.sku}
            </span>
          </div>
          {product.color?.grade && (
            <p className="text-xs font-medium text-red-600 uppercase tracking-wide">
              {product.color.grade.replace("-", " ")}
            </p>
          )}
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 rounded-xl p-2.5">
            <p className="text-xs text-gray-500 mb-0.5">Weight</p>
            <p className="text-base font-semibold text-gray-900">
              {product.carat} ct
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5">
            <p className="text-xs text-gray-500 mb-0.5">Shape</p>
            <p className="text-base font-semibold text-gray-900 capitalize">
              {product.shape}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5">
            <p className="text-xs text-gray-500 mb-0.5">Clarity</p>
            <p className="text-base font-semibold text-gray-900">
              {product.clarity?.grade || "N/A"}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5">
            <p className="text-xs text-gray-500 mb-0.5">Cut</p>
            <p className="text-base font-semibold text-gray-900 capitalize">
              {product.cut?.grade || "N/A"}
            </p>
          </div>
        </div>

        {/* Origin */}
        {product.origin?.country && (
          <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-xl p-2.5">
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="line-clamp-1">
              {product.origin.region && `${product.origin.region}, `}
              {product.origin.country}
            </span>
          </div>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-center pt-2 border-t border-gray-100">
          <Link href={`/products/${product.sku}`}>
            <button className="px-10 py-2.5 bg-linear-to-br from-red-600 to-pink-600 text-white text-sm rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
