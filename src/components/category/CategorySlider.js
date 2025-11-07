"use client";

import { useState } from "react";
import Image from "next/image";

export default function CategorySlider({ categories }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleCategoryClick = (index) => {
    setActiveIndex(index);
  };

  if (!categories.length) {
    return null;
  }

  const activeCategory = categories[activeIndex];

  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Active Category Display - Apple Style */}
      <div className="text-center mb-10 px-4">
        <h2 className="text-3xl md:text-4xl lg:text-6xl capitalize font-semibold tracking-tight text-white mb-2 md:mb-4 lg:mb-6 transition-all duration-500">
          {activeCategory?.name}
        </h2>
        <p className="text-base md:text-base lg:text-lg font-light text-white/90 max-w-3xl mx-auto mb-5 md:mb-6 lg:mb-8 leading-relaxed transition-all duration-500">
          Explore our {activeCategory?.name} collection
        </p>
        <a
          href={`/products?category=${activeCategory?.slug}`}
          className="inline-flex items-center gap-2  font-medium text-white bg-white/5 hover:bg-white/20 backdrop-blur-sm px-8 py-4 text-sm md:text-base lg:text-lg rounded-full transition-all duration-300 border border-white/20"
        >
          Shop {activeCategory?.name}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>

      {/* Category Cards - Minimalist Grid */}
      <div className="max-w-7xl px-4 md:px-6 mx-auto ">
        <div className="flex justify-start px-4 w-full overflow-x-scroll overflow-container py-4 items-center gap-4 md:gap-6">
          {categories.map((category, index) => (
            <button
              key={category._id}
              onClick={() => handleCategoryClick(index)}
              className={`group relative aspect-square min-w-[150px] rounded-3xl overflow-hidden transition-all duration-500 ${
                activeIndex === index
                  ? "ring-2 ring-white/60 shadow-xl scale-[1.02]"
                  : "hover:scale-[1.02] hover:shadow-xl"
              }`}
            >
              {/* Image */}
              <div className="absolute inset-0">
                {category.image?.url ? (
                  <Image
                    src={category.image.url}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-6xl">💎</span>
                  </div>
                )}
              </div>

              {/* Overlay */}
              <div
                className={`absolute inset-0 transition-all duration-500 ${
                  activeIndex === index
                    ? "bg-linear-to-t from-black/60 via-black/20 to-transparent"
                    : "bg-linear-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/70"
                }`}
              />

              {/* Active Indicator - Minimal Dot */}
              {activeIndex === index && (
                <div className="absolute top-2 right-4 w-3 h-3 bg-white rounded-full shadow-lg animate-pulse" />
              )}

              {/* Category Name */}
              <div className="absolute inset-x-0 bottom-0 p-2">
                <h3
                  className={`font-medium text-white transition-all duration-500 ${
                    activeIndex === index ? "text-base " : "text-sm"
                  }`}
                >
                  {category.name}
                </h3>
              </div>
            </button>
          ))}
        </div>

        {/* Navigation Dots - Minimal */}
        <div className="flex justify-center gap-3 mt-4">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => handleCategoryClick(index)}
              className={`transition-all duration-300 rounded-full ${
                activeIndex === index
                  ? "w-8 h-2 bg-white"
                  : "w-2 h-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`View ${categories[index]?.name}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
