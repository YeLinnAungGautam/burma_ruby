import { Suspense } from "react";
import FeaturedProducts from "@/components/product/FeaturedProducts";
import CategoryGrid from "@/components/category/CategoryGrid";
import CSSDiamondBackground from "@/components/3D/CSSDiamondBackground";
import Header from "@/components/Layout/Header";
import OptionCard from "@/components/Layout/OptionCard";
import Footer from "@/components/Layout/Footer";
import CustomButton from "@/components/common/CustomButton";
import Link from "next/link";
import FooterBar from "@/components/Layout/FooterBar";
import ProductHome from "@/components/product/ProductHome";

export default function Home() {
  return (
    <div className="relative min-h-screen ">
      <Header />

      <FooterBar />

      <CSSDiamondBackground />

      {/* Hero Section - Apple Style */}
      <section className="relative min-h-[50vh] hidden md:flex flex-col items-center justify-center text-white overflow-hidden pt-20">
        <div className="absolute inset-0"></div>

        {/* Main Hero Content */}
        <div className="relative container mx-auto pt-8 md:pt-10 lg:pt-14 text-center max-w-6xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight mb-2 leading-[1.1]">
            Burma Rubies
          </h1>
        </div>

        {/* Category Section */}
        <div className="relative w-full container mx-auto pb-8 md:pb-10 lg:pb-14">
          <Suspense fallback={<CategorySliderSkeleton />}>
            <CategoryGrid />
            {/* <CategorySliderSkeleton /> */}
          </Suspense>
        </div>
      </section>

      {/* Featured Products - Clean Section */}
      <section className="relative  bg-white">
        <div className="container mx-auto px-6 ">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductHome />
            {/* <ProductGridSkeleton /> */}
          </Suspense>
        </div>
      </section>

      {/* Trust Signals - Minimal Cards */}
      {/* <OptionCard /> */}

      <Footer />
    </div>
  );
}

function CategorySliderSkeleton() {
  return (
    <div className="animate-pulse pt-5 w-full">
      <div className="text-center mb-16 space-y-6">
        <div className="h-16 bg-white/10 backdrop-blur-sm rounded-2xl w-96 mx-auto"></div>
        <div className="h-14 bg-white/10 backdrop-blur-sm rounded-full w-64 mx-auto"></div>
      </div>
      <div className="max-w-7xl mx-auto pb-14 px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-white/10 backdrop-blur-sm rounded-3xl"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse space-y-4">
          <div className="bg-gray-200 aspect-square rounded-3xl"></div>
          <div className="h-6 bg-gray-200 rounded-xl w-3/4"></div>
          <div className="h-5 bg-gray-200 rounded-xl w-1/2"></div>
          <div className="h-8 bg-gray-200 rounded-xl w-1/3"></div>
        </div>
      ))}
    </div>
  );
}
