"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronDownIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import ProductCard from "./ProductCard";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductHome() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  const router = useRouter();

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedCarat, setSelectedCarat] = useState("");
  const [selectedShape, setSelectedShape] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const bottomSheetRef = useRef(null);

  // Filter options
  const colorOptions = [
    { value: "pigeon-blood", label: "Pigeon Blood" },
    { value: "vivid-red", label: "Vivid Red" },
    { value: "deep-red", label: "Deep Red" },
    { value: "medium-red", label: "Medium Red" },
    { value: "pink-red", label: "Pink Red" },
  ];

  const caratOptions = [
    { value: "0-1", label: "Under 1ct" },
    { value: "1-2", label: "1-2ct" },
    { value: "2-3", label: "2-3ct" },
    { value: "3-5", label: "3-5ct" },
    { value: "5+", label: "5ct+" },
  ];

  const shapeOptions = [
    { value: "oval", label: "Oval" },
    { value: "round", label: "Round" },
    { value: "cushion", label: "Cushion" },
    { value: "emerald", label: "Emerald" },
    { value: "pear", label: "Pear" },
  ];

  const originOptions = [
    { value: "Myanmar", label: "Myanmar" },
    { value: "Mozambique", label: "Mozambique" },
    { value: "Thailand", label: "Thailand" },
    { value: "Sri Lanka", label: "Sri Lanka" },
    { value: "Madagascar", label: "Madagascar" },
  ];

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, [
    selectedCategory,
    selectedColor,
    selectedCarat,
    selectedShape,
    selectedOrigin,
    priceRange,
    searchQuery,
  ]);

  // Handle body scroll when bottom sheet is open
  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showFilters]);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
      });

      if (selectedCategory) params.append("category", selectedCategory);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (data.success) {
        // Apply client-side filters
        let filteredProducts = data.data;

        if (selectedColor) {
          filteredProducts = filteredProducts.filter(
            (p) => p.color?.grade === selectedColor
          );
        }

        if (selectedShape) {
          filteredProducts = filteredProducts.filter(
            (p) => p.shape?.toLowerCase() === selectedShape
          );
        }

        if (selectedOrigin) {
          filteredProducts = filteredProducts.filter(
            (p) => p.origin?.country === selectedOrigin
          );
        }

        if (selectedCarat) {
          filteredProducts = filteredProducts.filter((p) => {
            const carat = p.carat;
            if (selectedCarat === "0-1") return carat < 1;
            if (selectedCarat === "1-2") return carat >= 1 && carat < 2;
            if (selectedCarat === "2-3") return carat >= 2 && carat < 3;
            if (selectedCarat === "3-5") return carat >= 3 && carat < 5;
            if (selectedCarat === "5+") return carat >= 5;
            return true;
          });
        }

        if (priceRange.min || priceRange.max) {
          filteredProducts = filteredProducts.filter((p) => {
            const price = p.price?.amount;
            if (priceRange.min && price < parseFloat(priceRange.min))
              return false;
            if (priceRange.max && price > parseFloat(priceRange.max))
              return false;
            return true;
          });
        }

        setProducts(filteredProducts);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedColor("");
    setSelectedCarat("");
    setSelectedShape("");
    setSelectedOrigin("");
    setPriceRange({ min: "", max: "" });
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedCategory ||
    selectedColor ||
    selectedCarat ||
    selectedShape ||
    selectedOrigin ||
    priceRange.min ||
    priceRange.max ||
    searchQuery;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-linear-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-3 pb-10">
          <div className="text-center block md:hidden">
            <h1 className="text-5xl md:text-7xl lg:text-8xl max-w-2xl mx-auto font-semibold tracking-tight leading-[1.1] mb-4">
              Burma Rubies
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-gray-500 px-3 max-w-2xl mx-auto">
              Discover our curated selection of premium natural rubies. Each
              stone is certified and verified for authenticity.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Filter Button - Mobile */}
      <div className="lg:hidden sticky top-16 z-40">
        <div className="max-w-2xl mx-auto px-4 ">
          <button
            onClick={() => setShowFilters(true)}
            className="w-full bg-white/60 backdrop-blur-lg rounded-full shadow-lg border border-gray-200 flex items-center justify-center gap-2 py-4 hover:shadow-xl transition-all active:scale-95"
          >
            <AdjustmentsHorizontalIcon className="w-6 h-6 text-gray-700" />
            <span className="font-medium text-gray-900">Filters</span>
            {hasActiveFilters && (
              <span className="bg-red-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                {
                  [
                    selectedCategory,
                    selectedColor,
                    selectedCarat,
                    selectedShape,
                    selectedOrigin,
                    priceRange.min,
                    priceRange.max,
                    searchQuery,
                  ].filter(Boolean).length
                }
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block lg:w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full text-sm text-red-600 hover:text-red-700 font-medium flex items-center justify-center gap-2 py-2"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Clear all filters
                </button>
              )}

              <FilterSections
                colorOptions={colorOptions}
                caratOptions={caratOptions}
                shapeOptions={shapeOptions}
                originOptions={originOptions}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedCarat={selectedCarat}
                setSelectedCarat={setSelectedCarat}
                selectedShape={selectedShape}
                setSelectedShape={setSelectedShape}
                selectedOrigin={selectedOrigin}
                setSelectedOrigin={setSelectedOrigin}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-gray-600">
                {loading ? (
                  "Loading..."
                ) : (
                  <>
                    <span className="font-semibold text-gray-900">
                      {products.length}
                    </span>{" "}
                    {products.length === 1 ? "ruby" : "rubies"} found
                  </>
                )}
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-100 rounded-3xl animate-pulse"
                  />
                ))}
              </div>
            )}

            {/* Products Grid */}
            {!loading && products.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && products.length === 0 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No rubies found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search query
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {!loading && products.length > 0 && pagination.pages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => fetchProducts(i + 1)}
                    className={`w-10 h-10 rounded-full font-medium transition-colors ${
                      pagination.page === i + 1
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Bottom Sheet Filter - Mobile */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setShowFilters(false)}
          />

          {/* Bottom Sheet */}
          <div
            ref={bottomSheetRef}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col animate-slide-up"
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <AdjustmentsHorizontalIcon className="w-6 h-6 text-gray-900" />
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Filter Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full text-sm text-red-600 hover:text-red-700 font-medium flex items-center justify-center gap-2 py-3 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Clear all filters
                </button>
              )}

              <FilterSections
                colorOptions={colorOptions}
                caratOptions={caratOptions}
                shapeOptions={shapeOptions}
                originOptions={originOptions}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedCarat={selectedCarat}
                setSelectedCarat={setSelectedCarat}
                selectedShape={selectedShape}
                setSelectedShape={setSelectedShape}
                selectedOrigin={selectedOrigin}
                setSelectedOrigin={setSelectedOrigin}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
              />
            </div>

            {/* Bottom Actions */}
            <div className="px-6 py-4 border-t border-gray-200 bg-white">
              <div className="flex gap-3">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 px-6 py-4 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors shadow-lg"
                >
                  Show {products.length} Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Filter Sections Component (Reusable for both desktop and mobile)
function FilterSections({
  colorOptions,
  caratOptions,
  shapeOptions,
  originOptions,
  selectedColor,
  setSelectedColor,
  selectedCarat,
  setSelectedCarat,
  selectedShape,
  setSelectedShape,
  selectedOrigin,
  setSelectedOrigin,
  priceRange,
  setPriceRange,
}) {
  return (
    <>
      {/* Color Filter */}
      <FilterSection title="Color">
        <div className="space-y-2">
          {colorOptions.map((option) => (
            <FilterOption
              key={option.value}
              label={option.label}
              checked={selectedColor === option.value}
              onChange={() =>
                setSelectedColor(
                  selectedColor === option.value ? "" : option.value
                )
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Carat Weight Filter */}
      <FilterSection title="Carat Weight">
        <div className="space-y-2">
          {caratOptions.map((option) => (
            <FilterOption
              key={option.value}
              label={option.label}
              checked={selectedCarat === option.value}
              onChange={() =>
                setSelectedCarat(
                  selectedCarat === option.value ? "" : option.value
                )
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Shape Filter */}
      <FilterSection title="Shape">
        <div className="space-y-2">
          {shapeOptions.map((option) => (
            <FilterOption
              key={option.value}
              label={option.label}
              checked={selectedShape === option.value}
              onChange={() =>
                setSelectedShape(
                  selectedShape === option.value ? "" : option.value
                )
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Origin Filter */}
      <FilterSection title="Origin">
        <div className="space-y-2">
          {originOptions.map((option) => (
            <FilterOption
              key={option.value}
              label={option.label}
              checked={selectedOrigin === option.value}
              onChange={() =>
                setSelectedOrigin(
                  selectedOrigin === option.value ? "" : option.value
                )
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Price Range Filter */}
      <FilterSection title="Price Range">
        <div className="space-y-3">
          <input
            type="number"
            placeholder="Min price"
            value={priceRange.min}
            onChange={(e) =>
              setPriceRange({ ...priceRange, min: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-base"
          />
          <input
            type="number"
            placeholder="Max price"
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange({ ...priceRange, max: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-base"
          />
        </div>
      </FilterSection>
    </>
  );
}

// Filter Section Component
function FilterSection({ title, children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-gray-200 pb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mb-4 group"
      >
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
          {title}
        </h3>
        <ChevronDownIcon
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}

// Filter Option Component
function FilterOption({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 rounded border-2 transition-all ${
            checked
              ? "bg-red-600 border-red-600"
              : "bg-white border-gray-300 group-hover:border-gray-400"
          }`}
        >
          {checked && (
            <svg
              className="w-full h-full text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
      <span className="text-sm text-gray-700 group-hover:text-gray-900">
        {label}
      </span>
    </label>
  );
}
