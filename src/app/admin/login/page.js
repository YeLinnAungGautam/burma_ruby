// components/admin/AdminLogin-enhanced.js
"use client";
import Link from "next/link";
import { useAdminLogin } from "@/hooks/useAdminLogin";
import CSSDiamondBackground from "@/components/3D/CSSDiamondBackground";
import Image from "next/image";
import CustomButton from "@/components/common/CustomButton";

export default function AdminLogin() {
  const {
    formData,
    loading,
    error,
    validationErrors,
    handleInputChange,
    handleSubmit,
  } = useAdminLogin();

  return (
    <div className="min-h-screen flex">
      {/* Background Section - Always visible but different sizes */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative">
        <CSSDiamondBackground />
      </div>

      {/* Login Form Section */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-4 sm:p-6 lg:p-8 backdrop-blur-sm bg-black/10">
        <div className="absolute   md:hidden -z-10  inset-0 ">
          {/* Overlay to enhance readability */}

          <div className="absolute inset-0 backdrop-blur-sm " />

          <CSSDiamondBackground />
        </div>
        <div className="w-full max-w-sm lg:max-w-md space-y-6 sm:space-y-8">
          <div className="w-[100px] mx-auto h-[100px] rounded-lg mb-10 overflow-hidden relative">
            <Image
              src="/logo.png"
              alt="Admin Login"
              fill
              className="object-center"
              sizes="100px"
            />
          </div>
          <div className="text-center">
            <h2 className="text-xl sm:text-3xl font-bold text-white">Login</h2>
            <p className="mt-2 text-sm  text-gray-300">Access your dashboard</p>
          </div>

          {/* Rest of the form remains the same as above */}

          <form className="mt-8 space-y-6 " onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm pb-2 text-gray-200"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`input-field mt-1  ${
                    validationErrors.email ? "border-red-500" : ""
                  }`}
                  placeholder="Enter your email"
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm pb-2 text-gray-200"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={`input-field mt-1 ${
                    validationErrors.password ? "border-red-500" : ""
                  }`}
                  placeholder="Enter your password"
                />
                {validationErrors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.password}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <CustomButton
                type="submit"
                variant="glass"
                disabled={loading}
                title={loading ? "Signing in..." : "Sign in"}
              />
            </div>

            <div className="text-center">
              <Link href="/" className="text-white hover:text-white/20 text-sm">
                ← Back to Homepage
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
