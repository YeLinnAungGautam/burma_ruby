import { Suspense } from "react";

import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import FooterBar from "@/components/Layout/FooterBar";
import ProductHome from "@/components/product/ProductHome";

export default function Home() {
  return (
    <div className="relative min-h-screen ">
      <Header />

      <FooterBar />

      {/* <CSSDiamondBackground /> */}

      {/* Hero Section - Apple Style */}
      <section className="relative min-h-[50vh] hidden md:flex flex-col items-center justify-center text-black overflow-hidden pt-20">
        <div className="absolute inset-0"></div>

        {/* Main Hero Content */}
        <div className="relative container mx-auto py-8 md:py-10 lg:py-14 text-center max-w-6xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight mb-2 leading-[1.1]">
            Burma Rubies
          </h1>
          <p className="text-sm md:text-base text-gray-500 px-3 max-w-2xl mx-auto">
            Discover our curated selection of premium natural rubies. Each stone
            is certified and verified for authenticity.
          </p>
        </div>

        {/* Category Section */}
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
