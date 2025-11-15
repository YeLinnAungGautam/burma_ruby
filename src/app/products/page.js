"use client";

import { useState, useEffect, useRef } from "react";
import FooterBar from "@/components/Layout/FooterBar";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

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
    if (isTransitioning || products.length === 0) return;
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
    if (isTransitioning || products.length === 0) return;
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
  }, [currentIndex, isTransitioning]);

  if (loading) {
    return (
      <div className="min-h-[85vh] bg-white flex flex-col">
        <div className="flex-1 flex items-center justify-center">
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
      <div className="min-h-[85vh] bg-white flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">No products available</p>
        </div>
        <FooterBar />
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center pt-2">
        <p className=" text-xl font-semibold">Discover Rare Gems</p>
      </div>
      {/* Main Carousel Container */}
      <div className="flex-1 relative py-4 md:py-8 lg:py-12 overflow-hidden flex items-center">
        <div
          ref={containerRef}
          className="relative w-full flex items-center justify-center px-4 sm:px-6 md:px-8"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Product Card */}
          <div
            className={`w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl transition-all duration-500 ${
              isTransitioning ? "scale-95 opacity-50" : "scale-100 opacity-100"
            }`}
          >
            <ProductCarouselCard product={currentProduct} />
          </div>

          {/* Navigation Buttons - Desktop */}
          <button
            onClick={goToPrevious}
            disabled={isTransitioning}
            className="flex absolute left-2 lg:left-8 top-1/3 -translate-y-1/3 w-8 h-8 md:w-14 md:h-14 bg-white/80 backdrop-blur-lg rounded-full items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 text-gray-900" />
          </button>

          <button
            onClick={goToNext}
            disabled={isTransitioning}
            className="flex absolute right-2 lg:right-8 top-1/3 -translate-y-1/3 w-8 h-8 md:w-14 md:h-14 bg-white/80 backdrop-blur-lg rounded-full items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-gray-900" />
          </button>
        </div>
      </div>

      <FooterBar />
    </div>
  );
}

// Product Carousel Card Component - Fully responsive
function ProductCarouselCard({ product }) {
  const [liked, setLiked] = useState(false);
  const mainImage = product.images?.[0]?.url || "/placeholder.jpg";

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden h-full max-h-[85vh] flex flex-col">
      {/* Image Section - Responsive height */}
      <div className="relative h-[30vh] xs:h-[35vh] sm:h-[40vh] md:h-[45vh] min-h-[200px] max-h-[500px] bg-gray-100 shrink-0">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, 40vw"
        />
        <div className=" absolute bottom-2 right-2">
          <span className="text-xs text-white bg-red-600 px-2 py-1 rounded-full whitespace-nowrap shrink-0 ml-2">
            {product.treatment?.heated ? "Heated" : "Natural"}
          </span>
        </div>

        {/* Floating Action Buttons */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-col gap-2">
          <button
            onClick={() => setLiked(!liked)}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                liked ? "fill-red-600 text-red-600" : "text-gray-700"
              }`}
            />
          </button>
        </div>

        {/* Status */}
        {product.status === "sold" && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-white text-gray-900 px-6 py-2 sm:px-8 sm:py-3 rounded-full text-base sm:text-lg font-bold">
              SOLD
            </span>
          </div>
        )}
      </div>

      {/* Content Section - Scrollable if needed */}
      <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 overflow-y-auto grow">
        {/* Title & SKU */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 line-clamp-2 flex-1 min-w-0">
              {product.name}
            </h2>
          </div>
          {product.color?.grade && (
            <p className="text-xs sm:text-sm font-medium text-red-600 uppercase tracking-wide">
              {product.color.grade.replace("-", " ")}
            </p>
          )}
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-3">
            <p className="text-xs text-gray-500 mb-1">Weight</p>
            <p className="text-sm sm:text-base font-semibold text-gray-900">
              {product.carat} ct
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-3">
            <p className="text-xs text-gray-500 mb-1">Shape</p>
            <p className="text-sm sm:text-base font-semibold text-gray-900 capitalize">
              {product.shape}
            </p>
          </div>
        </div>

        {/* Origin */}
        {product.origin?.country && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-3">
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
        <div className="flex items-center justify-center pt-3 sm:pt-4 border-t border-gray-100">
          <Link href={`/products/${product.sku}`} className="w-full max-w-xs">
            <button className="w-full px-6 py-3 sm:px-10 sm:py-3 bg-linear-to-br from-red-600 to-pink-600 text-white text-sm sm:text-base rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all active:scale-95">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
