"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Layout/Header";
import Link from "next/link";
import { ChevronLeft, FileCheckCorner, MessageCircle } from "lucide-react";

function Page() {
  const params = useParams();
  const router = useRouter();
  const { sku } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedMediaType, setSelectedMediaType] = useState("image");
  const videoRef = useRef(null); // Add this line

  useEffect(() => {
    if (sku) {
      fetchProduct();
    }
  }, [sku]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${sku}`);
      const data = await response.json();
      console.log("====================================");
      console.log(data);
      console.log("====================================");

      if (data.success) {
        setProduct(data.data);
        // Set first image as default
        if (data.data.images && data.data.images.length > 0) {
          setSelectedMedia(data.data.images[0]);
          setSelectedMediaType("image");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const allMedia = product
    ? [
        ...(product?.images || []).map((img) => ({ ...img, type: "image" })),
        ...(product?.videos || []).map((vid) => ({ ...vid, type: "video" })),
        ...(product?.certification?.hasCertificate &&
        product?.certification?.certificateImages?.length > 0
          ? product?.certification.certificateImages.map((certImg, index) => ({
              ...certImg,
              type: "certificate",
              certificateData: product?.certification,
              index: index,
            }))
          : []),
      ]
    : [];

  useEffect(() => {
    if (selectedMediaType === "video" && videoRef.current) {
      // Request fullscreen
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen(); // Safari
      } else if (videoRef.current.mozRequestFullScreen) {
        videoRef.current.mozRequestFullScreen(); // Firefox
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen(); // IE/Edge
      }
    }
  }, [selectedMediaType, selectedMedia]);

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600">SKU: {sku}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* header */}
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8 ">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <span>→</span>
          <Link
            href="/products"
            className="hover:text-gray-900 transition-colors"
          >
            Products
          </Link>
          <span>→</span>
          <span className="text-gray-900 font-medium">{sku}</span>
        </nav>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 lg:pb-16 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Thumbnail Navigation */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {allMedia.map((media, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedMedia(media);
                    setSelectedMediaType(media.type);
                  }}
                  className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedMedia === media
                      ? "border-gray-800 shadow-md"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {media.type === "image" && (
                    <Image
                      src={media.url}
                      alt={media.alt || "Product thumbnail"}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {media.type === "video" && (
                    <div className="w-full h-full bg-gray-50 border border-gray-100 flex items-center justify-center relative">
                      <svg
                        className="w-6 h-6 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  )}
                  {media.type === "certificate" && (
                    <div className="w-full h-full bg-blue-50 flex items-center justify-center relative">
                      <Image
                        src={media.url}
                        alt={`Certificate ${media.index + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-blue-100 bg-opacity-20 flex items-center justify-center">
                        <FileCheckCorner className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Center: Main Media Display */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="sticky top-8">
              <div className="bg-gray-50 rounded-3xl overflow-hidden aspect-square">
                {selectedMediaType === "image" && selectedMedia?.url && (
                  <Image
                    src={selectedMedia.url}
                    alt={selectedMedia.alt || product?.name}
                    width={800}
                    height={800}
                    className="w-full h-full object-contain p-8"
                  />
                )}
                {selectedMediaType === "video" && selectedMedia?.url && (
                  <video
                    ref={videoRef}
                    src={selectedMedia.url}
                    controls
                    className="w-full h-full object-contain"
                    autoPlay
                    loop
                    muted
                  />
                )}
                {selectedMediaType === "certificate" && selectedMedia?.url && (
                  <div className="w-full h-full ">
                    {/* Certificate Image */}
                    {selectedMedia?.url ? (
                      <div className="bg-white rounded-2xl shadow-lg h-full flex justify-center mb-6 max-w-2xl w-full">
                        <Image
                          src={selectedMedia.url}
                          alt={`Certificate ${selectedMedia.index + 1}`}
                          width={600}
                          height={800}
                          className="w-auto h-full object-contain rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
                        <div className="text-center mb-6">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                              className="w-8 h-8 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                            Certified Gemstone
                          </h3>
                          <p className="text-gray-600">
                            {selectedMedia.certificateData.lab}
                          </p>
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">
                              Certificate No.
                            </span>
                            <span className="font-medium text-gray-900">
                              {selectedMedia.certificateData.certificateNumber}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Issue Date</span>
                            <span className="font-medium text-gray-900">
                              {new Date(
                                selectedMedia.certificateData.certificateDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-gray-600">Image</span>
                            <span className="font-medium text-gray-900">
                              {selectedMedia.index + 1} of{" "}
                              {
                                selectedMedia.certificateData.certificateImages
                                  .length
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Product Information */}
          <div className="lg:col-span-5 order-3">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <p className="text-sm font-medium text-red-600 mb-2">
                  {product?.categoryName}
                </p>
                <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 mb-3 tracking-tight">
                  {product?.name}
                </h1>
                <p className="text-gray-600 text-lg">
                  {product?.description?.short}
                </p>
              </div>

              {/* Price */}
              {/* <div className="py-6 border-y border-gray-200">
                <div className="flex items-baseline gap-3">
                  {product?.price?.compareAtPrice && (
                    <span className="text-lg text-gray-400 line-clamp-1 line-through">
                      {formatPrice(product?.price?.compareAtPrice)}{" "}
                      {product?.price?.currency}
                    </span>
                  )}
                  <span className="text-4xl font-semibold text-gray-900">
                    {formatPrice(product?.price?.amount)}
                  </span>
                  <span className="text-xl text-gray-600">
                    {product?.price?.currency}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {formatPrice(product?.price?.pricePerCarat)}{" "}
                  {product?.price?.currency} per carat
                </p>
              </div> */}

              {/* SKU */}
              <p className="text-sm text-gray-500 text-center">
                SKU: {product?.sku}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Specifications - Table Format */}
      <div className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-12 text-center">
            Technical Specifications
          </h2>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Desktop Table */}
            <table className="hidden md:table w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Property
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Physical Properties */}
                <tr className="hover:bg-gray-50">
                  <td
                    className="px-6 py-4 text-sm font-medium text-gray-900"
                    rowSpan="4"
                  >
                    Physical Properties
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    Carat Weight
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {product?.carat} ct
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">Shape</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">
                    {product?.shape}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    Dimensions
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {product?.dimensions.length} × {product?.dimensions.width} ×{" "}
                    {product?.dimensions.depth} mm
                  </td>
                </tr>
                {product?.phenomenonType && (
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      Phenomenon
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">
                      {product?.phenomenonType.replace(/-/g, " ")}
                    </td>
                  </tr>
                )}

                {/* Color Grading */}
                <tr className="hover:bg-gray-50">
                  <td
                    className="px-6 py-4 text-sm font-medium text-gray-900"
                    rowSpan="4"
                  >
                    Color Grading
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">Grade</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">
                    {product?.color.grade.replace(/-/g, " ")}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    Saturation
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">
                    {product?.color.saturation}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">Tone</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">
                    {product?.color.tone.replace(/-/g, " ")}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    Description
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {product?.color.description}
                  </td>
                </tr>

                {/* Clarity */}
                <tr className="hover:bg-gray-50">
                  <td
                    className="px-6 py-4 text-sm font-medium text-gray-900"
                    rowSpan="3"
                  >
                    Clarity
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">Grade</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {product?.clarity.grade}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">Eye Clean</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {product?.clarity.eyeClean ? "Yes" : "No"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    Description
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {product?.clarity.description}
                  </td>
                </tr>

                {/* Cut Quality */}
                <tr className="hover:bg-gray-50">
                  <td
                    className="px-6 py-4 text-sm font-medium text-gray-900"
                    rowSpan="3"
                  >
                    Cut Quality
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">Grade</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">
                    {product?.cut.grade.replace(/-/g, " ")}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">Polish</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {product?.cut.polish}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">Symmetry</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {product?.cut.symmetry}
                  </td>
                </tr>

                {/* Origin */}
                <tr className="hover:bg-gray-50">
                  <td
                    className="px-6 py-4 text-sm font-medium text-gray-900"
                    rowSpan={product?.origin.mine ? "3" : "2"}
                  >
                    Origin
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">Country</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {product?.origin.country}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">Region</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {product?.origin.region}
                  </td>
                </tr>
                {product?.origin.mine && (
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">Mine</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {product?.origin.mine}
                    </td>
                  </tr>
                )}

                {/* Treatment */}
                <tr className="hover:bg-gray-50">
                  <td
                    className="px-6 py-4 text-sm font-medium text-gray-900"
                    rowSpan="3"
                  >
                    Treatment
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">Heated</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">
                    {product?.treatment.heated ? "Yes" : "No"}
                  </td>
                </tr>
                {/* <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">Heated</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {product?.treatment.heated ? "Yes" : "No"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">Details</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {product?.treatment.description}
                  </td>
                </tr> */}
              </tbody>
            </table>

            {/* Mobile View */}
            <div className="md:hidden divide-y divide-gray-200">
              {/* Physical Properties */}
              <div className="p-4">
                <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b-2 border-gray-900">
                  Physical Properties
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Carat Weight</span>
                    <span className="text-sm font-medium text-gray-900">
                      {product?.carat} ct
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Shape</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {product?.shape}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Dimensions</span>
                    <span className="text-sm font-medium text-gray-900">
                      {product?.dimensions.length} × {product?.dimensions.width}{" "}
                      × {product?.dimensions.depth} mm
                    </span>
                  </div>
                  {product?.phenomenonType && (
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-gray-600">Phenomenon</span>
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {product?.phenomenonType.replace(/-/g, " ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Color Grading */}
              <div className="p-4">
                <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b-2 border-gray-900">
                  Color Grading
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Grade</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {product?.color.grade.replace(/-/g, " ")}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Saturation</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {product?.color.saturation}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Tone</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {product?.color.tone.replace(/-/g, " ")}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Description</span>
                    <span className="text-sm font-medium text-gray-900">
                      {product?.color.description}
                    </span>
                  </div>
                </div>
              </div>

              {/* Clarity */}
              <div className="p-4">
                <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b-2 border-gray-900">
                  Clarity
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Grade</span>
                    <span className="text-sm font-medium text-gray-900">
                      {product?.clarity.grade}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Eye Clean</span>
                    <span className="text-sm font-medium text-gray-900">
                      {product?.clarity.eyeClean ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Description</span>
                    <span className="text-sm font-medium text-gray-900">
                      {product?.clarity.description}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cut Quality */}
              <div className="p-4">
                <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b-2 border-gray-900">
                  Cut Quality
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Grade</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {product?.cut.grade.replace(/-/g, " ")}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Polish</span>
                    <span className="text-sm font-medium text-gray-900">
                      {product?.cut.polish}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Symmetry</span>
                    <span className="text-sm font-medium text-gray-900">
                      {product?.cut.symmetry}
                    </span>
                  </div>
                </div>
              </div>

              {/* Origin */}
              <div className="p-4">
                <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b-2 border-gray-900">
                  Origin
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Country</span>
                    <span className="text-sm font-medium text-gray-900">
                      {product?.origin.country}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Region</span>
                    <span className="text-sm font-medium text-gray-900">
                      {product?.origin.region}
                    </span>
                  </div>
                  {product?.origin.mine && (
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-gray-600">Mine</span>
                      <span className="text-sm font-medium text-gray-900">
                        {product?.origin.mine}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Treatment */}
              <div className="p-4">
                <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b-2 border-gray-900">
                  Treatment
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Heated</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {product?.treatment.heated ? "Yes" : "No"}
                    </span>
                  </div>
                  {/* <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Heated</span>
                    <span className="text-sm font-medium text-gray-900">
                      {product?.treatment.heated ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Details</span>
                    <span className="text-sm font-medium text-gray-900">
                      {product?.treatment.description}
                    </span>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Description */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-16 lg:py-24">
        <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-8 text-center">
          About This Gemstone
        </h2>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 text-lg leading-relaxed">
            {product?.description?.full}
          </p>
        </div>

        {/* Tags */}
        {product?.tags && product?.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2 justify-center">
            {product?.tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className=" fixed bottom-6  left-0 right-0 z-40 px-4">
        <div className="w-full md:w-2xl mx-auto flex justify-between items-center">
          <div
            onClick={() => router.back()}
            className=" p-4 bg-white/50 backdrop-blur-lg rounded-full shadow-lg border border-black/20 flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6 text-black" />
          </div>

          <button
            onClick={() => router.push("/messages")}
            className="bg-linear-to-br from-red-600 to-pink-800 text-white/80 backdrop-blur-lg  font-semibold rounded-full shadow-lg border border-black/20 flex items-center justify-center gap-2 py-4 w-2xl"
          >
            <MessageCircle className="w-6 h-6" />
            <span>Connect with Owner</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
