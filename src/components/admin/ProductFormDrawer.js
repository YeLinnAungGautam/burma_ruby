// components/admin/ProductFormDrawer.jsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import CustomButton from "@/components/common/CustomButton";
import { useProducts } from "@/hooks/useProducts";
import toast from "react-hot-toast";

export default function ProductFormDrawer({
  isOpen,
  onClose,
  editingProduct,
  onSubmit,
  loading,
}) {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [certPreviews, setCertPreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const { deleteFile } = useProducts();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      category: "",
      shape: "",
      carat: "",
      // Color
      colorGrade: "",
      colorSaturation: "",
      colorTone: "",
      colorDescription: "",
      // Clarity
      clarityGrade: "",
      clarityEyeClean: false,
      clarityDescription: "",
      // Cut
      cutGrade: "",
      cutPolish: "",
      cutSymmetry: "",
      cutDescription: "",
      // Dimensions
      dimensionLength: "",
      dimensionWidth: "",
      dimensionDepth: "",
      // Origin
      originCountry: "",
      originRegion: "",
      originMine: "",
      // Treatment
      treatmentHeated: true,
      treatmentType: "heated",
      treatmentDescription: "",
      // Certification
      hasCertificate: false,
      certLab: "",
      certNumber: "",
      certDate: "",
      // Pricing
      priceAmount: "",
      priceCurrency: "USD",
      priceCompareAt: "",
      buyingRate: "",
      // Others
      phenomenonType: "none",
      featured: false,
      tags: "",
      descriptionShort: "",
      descriptionFull: "",
      metaTitle: "",
      metaDescription: "",
    },
  });

  const imageFiles = watch("images");
  const videoFiles = watch("videos");
  const certFiles = watch("certificateImages");
  const hasCertificate = watch("hasCertificate");
  const treatmentHeated = watch("treatmentHeated");

  const handleDeleteImage = async (index) => {
    const imageToDelete = imagePreviews[index];

    // If editing existing product and image is from server
    if (
      editingProduct &&
      editingProduct.images &&
      editingProduct.images[index]
    ) {
      const result = await deleteFile(
        editingProduct._id,
        editingProduct.images[index].url,
        "image"
      );

      if (result.success) {
        // Remove from previews
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
        // You may want to refetch the product or update local state
      } else {
        // alert("Failed to delete image: " + result.error);
        toast.error("Failed to delete image: " + result.error);
      }
    } else {
      // If it's a newly selected file (not yet uploaded)
      const currentFiles = watch("images");
      const newFileList = Array.from(currentFiles).filter(
        (_, i) => i !== index
      );

      // Create a new FileList-like object
      const dataTransfer = new DataTransfer();
      newFileList.forEach((file) => dataTransfer.items.add(file));

      setValue("images", dataTransfer.files);
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleDeleteVideo = async (index) => {
    const videoToDelete = videoPreviews[index];

    if (
      editingProduct &&
      editingProduct.videos &&
      editingProduct.videos[index]
    ) {
      const result = await deleteFile(
        editingProduct._id,
        editingProduct.videos[index].url,
        "video"
      );

      if (result.success) {
        setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
      } else {
        // alert("Failed to delete video: " + result.error);
        toast.error("Failed to delete video: " + result.error);
      }
    } else {
      const currentFiles = watch("videos");
      const newFileList = Array.from(currentFiles).filter(
        (_, i) => i !== index
      );
      const dataTransfer = new DataTransfer();
      newFileList.forEach((file) => dataTransfer.items.add(file));
      setValue("videos", dataTransfer.files);
      setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleDeleteCertificate = async (index) => {
    if (
      editingProduct &&
      editingProduct.certification?.certificateImages?.[index]
    ) {
      const result = await deleteFile(
        editingProduct._id,
        editingProduct.certification.certificateImages[index].url,
        "certificate"
      );

      if (result.success) {
        setCertPreviews((prev) => prev.filter((_, i) => i !== index));
      } else {
        // alert("Failed to delete certificate: " + result.error);
        toast.error("Failed to delete certificate: " + result.error);
      }
    } else {
      const currentFiles = watch("certificateImages");
      const newFileList = Array.from(currentFiles).filter(
        (_, i) => i !== index
      );
      const dataTransfer = new DataTransfer();
      newFileList.forEach((file) => dataTransfer.items.add(file));
      setValue("certificateImages", dataTransfer.files);
      setCertPreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        console.log(data.categories, "this is category");

        if (data.categories && data.categories.length > 0) {
          // Filter only active categories
          const activeCategories = data.categories.filter(
            (cat) => cat.isActive
          );
          setCategories(activeCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // Handle previews
  useEffect(() => {
    if (imageFiles && imageFiles.length > 0) {
      const previews = [];
      Array.from(imageFiles).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result);
          if (previews.length === imageFiles.length) {
            setImagePreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    } else if (editingProduct?.images) {
      setImagePreviews(editingProduct.images.map((img) => img.url));
    } else {
      setImagePreviews([]);
    }
  }, [imageFiles, editingProduct]);

  useEffect(() => {
    if (videoFiles && videoFiles.length > 0) {
      setVideoPreviews(Array.from(videoFiles).map((f) => f.name));
    } else if (editingProduct?.videos) {
      setVideoPreviews(editingProduct.videos.map((v) => v.url));
    } else {
      setVideoPreviews([]);
    }
  }, [videoFiles, editingProduct]);

  useEffect(() => {
    if (certFiles && certFiles.length > 0) {
      const previews = [];
      Array.from(certFiles).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result);
          if (previews.length === certFiles.length) {
            setCertPreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    } else if (editingProduct?.certification?.certificateImages) {
      setCertPreviews(
        editingProduct.certification.certificateImages.map((img) => img.url)
      );
    } else {
      setCertPreviews([]);
    }
  }, [certFiles, editingProduct]);

  // Update form when editing
  useEffect(() => {
    if (editingProduct) {
      reset({
        name: editingProduct.name || "",
        category: editingProduct.category?._id || editingProduct.category || "",
        shape: editingProduct.shape || "",
        carat: editingProduct.carat || "",
        // Color
        colorGrade: editingProduct.color?.grade || "",
        colorSaturation: editingProduct.color?.saturation || "",
        colorTone: editingProduct.color?.tone || "",
        colorDescription: editingProduct.color?.description || "",
        // Clarity
        clarityGrade: editingProduct.clarity?.grade || "",
        clarityEyeClean: editingProduct.clarity?.eyeClean || false,
        clarityDescription: editingProduct.clarity?.description || "",
        // Cut
        cutGrade: editingProduct.cut?.grade || "",
        cutPolish: editingProduct.cut?.polish || "",
        cutSymmetry: editingProduct.cut?.symmetry || "",
        cutDescription: editingProduct.cut?.description || "",
        // Dimensions
        dimensionLength: editingProduct.dimensions?.length || "",
        dimensionWidth: editingProduct.dimensions?.width || "",
        dimensionDepth: editingProduct.dimensions?.depth || "",
        // Origin
        originCountry: editingProduct.origin?.country || "",
        originRegion: editingProduct.origin?.region || "",
        originMine: editingProduct.origin?.mine || "",
        // Treatment
        treatmentHeated: editingProduct.treatment?.heated !== false,
        treatmentType: editingProduct.treatment?.treatmentType || "heated",
        treatmentDescription: editingProduct.treatment?.description || "",
        // Certification
        hasCertificate: editingProduct.certification?.hasCertificate || false,
        certLab: editingProduct.certification?.lab || "",
        certNumber: editingProduct.certification?.certificateNumber || "",
        certDate: editingProduct.certification?.certificateDate
          ? new Date(editingProduct.certification.certificateDate)
              .toISOString()
              .split("T")[0]
          : "",
        // Pricing
        priceAmount: editingProduct.price?.amount || "",
        priceCurrency: editingProduct.price?.currency || "USD",
        priceCompareAt: editingProduct.price?.compareAtPrice || "",
        buyingRate: editingProduct.buyingCurrencyRateToMMK || "",
        // Others
        phenomenonType: editingProduct.phenomenonType || "none",
        featured: editingProduct.featured || false,
        tags: editingProduct.tags?.join(", ") || "",
        descriptionShort: editingProduct.description?.short || "",
        descriptionFull: editingProduct.description?.full || "",
        metaTitle: editingProduct.metaTitle || "",
        metaDescription: editingProduct.metaDescription || "",
      });
    } else {
      reset();
      setImagePreviews([]);
      setVideoPreviews([]);
      setCertPreviews([]);
    }
  }, [editingProduct, reset, isOpen]);

  const handleFormSubmit = async (data) => {
    const formData = new FormData();

    // Basic info
    formData.append("name", data.name);
    formData.append("category", data.category);
    formData.append("shape", data.shape);
    formData.append("carat", data.carat);
    formData.append("phenomenonType", data.phenomenonType);
    formData.append("featured", data.featured.toString());
    formData.append("tags", data.tags || "");
    formData.append("metaTitle", data.metaTitle || "");
    formData.append("metaDescription", data.metaDescription || "");
    if (data.buyingRate)
      formData.append("buyingCurrencyRateToMMK", data.buyingRate);

    // Color object
    formData.append(
      "color",
      JSON.stringify({
        grade: data.colorGrade,
        saturation: data.colorSaturation || undefined,
        tone: data.colorTone || undefined,
        description: data.colorDescription || undefined,
      })
    );

    // Clarity object
    formData.append(
      "clarity",
      JSON.stringify({
        grade: data.clarityGrade,
        eyeClean: data.clarityEyeClean,
        description: data.clarityDescription || undefined,
      })
    );

    // Cut object
    formData.append(
      "cut",
      JSON.stringify({
        grade: data.cutGrade,
        polish: data.cutPolish || undefined,
        symmetry: data.cutSymmetry || undefined,
        description: data.cutDescription || undefined,
      })
    );

    // Dimensions object
    formData.append(
      "dimensions",
      JSON.stringify({
        length: parseFloat(data.dimensionLength),
        width: parseFloat(data.dimensionWidth),
        depth: parseFloat(data.dimensionDepth),
      })
    );

    // Origin object
    formData.append(
      "origin",
      JSON.stringify({
        country: data.originCountry,
        region: data.originRegion || undefined,
        mine: data.originMine || undefined,
      })
    );

    // Treatment object
    formData.append(
      "treatment",
      JSON.stringify({
        heated: data.treatmentHeated,
        treatmentType: data.treatmentType,
        description: data.treatmentDescription || undefined,
      })
    );

    // Certification object
    formData.append(
      "certification",
      JSON.stringify({
        hasCertificate: data.hasCertificate,
        lab: data.certLab || undefined,
        certificateNumber: data.certNumber || undefined,
        certificateDate: data.certDate || undefined,
      })
    );

    // Price object
    formData.append(
      "price",
      JSON.stringify({
        amount: parseFloat(data.priceAmount),
        currency: data.priceCurrency,
        compareAtPrice: data.priceCompareAt
          ? parseFloat(data.priceCompareAt)
          : undefined,
      })
    );

    // Description object
    formData.append(
      "description",
      JSON.stringify({
        short: data.descriptionShort || undefined,
        full: data.descriptionFull || undefined,
      })
    );

    // Files
    if (data.images && data.images.length > 0) {
      Array.from(data.images).forEach((file) => {
        formData.append(editingProduct ? "newImages" : "images", file);
      });
    }

    if (data.videos && data.videos.length > 0) {
      Array.from(data.videos).forEach((file) => {
        formData.append(editingProduct ? "newVideos" : "videos", file);
      });
    }

    if (data.certificateImages && data.certificateImages.length > 0) {
      Array.from(data.certificateImages).forEach((file) => {
        formData.append(
          editingProduct ? "newCertificateImages" : "certificateImages",
          file
        );
      });
    }

    if (editingProduct) {
      formData.append("id", editingProduct._id);
    }

    await onSubmit(formData, editingProduct?._id);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-1/3 bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-linear-to-r from-red-600 to-pink-600 px-6 py-2 flex justify-between items-center shrink-0 shadow-lg">
            <h2 className="text-sm font-bold text-white">
              {editingProduct ? "Edit Ruby" : "Create Ruby"}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-1 hover:bg-white/20 rounded-full"
            >
              <svg
                className="w-6 h-6"
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
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="flex-1 overflow-y-auto p-6 space-y-5 bg-gray-50"
          >
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900">
                Basic Information
              </h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="input-field-default"
                  placeholder="e.g., Natural Burmese Ruby"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                {loadingCategories ? (
                  <div className="input-field-default text-gray-400">
                    Loading categories...
                  </div>
                ) : (
                  <select
                    {...register("category", {
                      required: "Category is required",
                    })}
                    className="input-field-default"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Shape <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("shape", { required: "Shape is required" })}
                    className="input-field-default"
                  >
                    <option value="">Select Shape</option>
                    <option value="round">Round</option>
                    <option value="oval">Oval</option>
                    <option value="cushion">Cushion</option>
                    <option value="emerald">Emerald</option>
                    <option value="pear">Pear</option>
                    <option value="marquise">Marquise</option>
                    <option value="heart">Heart</option>
                    <option value="princess">Princess</option>
                    <option value="cabochon">Cabochon</option>
                  </select>
                  {errors.shape && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.shape.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Carat Weight <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("carat", { required: "Carat is required" })}
                    className="input-field-default"
                    placeholder="0.00"
                  />
                  {errors.carat && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.carat.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phenomenon Type
                </label>
                <select
                  {...register("phenomenonType")}
                  className="input-field-default"
                >
                  <option value="none">None</option>
                  <option value="star-6-ray">Star (6-ray)</option>
                  <option value="star-12-ray">Star (12-ray)</option>
                  <option value="cats-eye">Cats Eye</option>
                </select>
              </div>
            </div>

            {/* Color */}
            <div className="border-t-2 border-gray-200 pt-4 space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Color</h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Color Grade <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("colorGrade", {
                    required: "Color grade is required",
                  })}
                  className="input-field-default"
                >
                  <option value="">Select Color</option>
                  <option value="pigeon-blood">Pigeon Blood</option>
                  <option value="vivid-red">Vivid Red</option>
                  <option value="deep-red">Deep Red</option>
                  <option value="medium-red">Medium Red</option>
                  <option value="pinkish-red">Pinkish Red</option>
                  <option value="purplish-red">Purplish Red</option>
                  <option value="orangish-red">Orangish Red</option>
                </select>
                {errors.colorGrade && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.colorGrade.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Saturation
                  </label>
                  <select
                    {...register("colorSaturation")}
                    className="input-field-default"
                  >
                    <option value="">Select</option>
                    <option value="vivid">Vivid</option>
                    <option value="strong">Strong</option>
                    <option value="medium">Medium</option>
                    <option value="weak">Weak</option>
                    <option value="pale">Pale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tone
                  </label>
                  <select
                    {...register("colorTone")}
                    className="input-field-default"
                  >
                    <option value="">Select</option>
                    <option value="light">Light</option>
                    <option value="medium-light">Medium Light</option>
                    <option value="medium">Medium</option>
                    <option value="medium-dark">Medium Dark</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Color Description
                </label>
                <input
                  type="text"
                  {...register("colorDescription")}
                  className="input-field-default"
                  placeholder="e.g., Deep red with slight purple"
                />
              </div>
            </div>

            {/* Clarity */}
            <div className="border-t-2 border-gray-200 pt-4 space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Clarity</h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Clarity Grade <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("clarityGrade", {
                    required: "Clarity grade is required",
                  })}
                  className="input-field-default"
                >
                  <option value="">Select Clarity</option>
                  <option value="IF">IF - Internally Flawless</option>
                  <option value="VVS1">VVS1</option>
                  <option value="VVS2">VVS2</option>
                  <option value="VS1">VS1</option>
                  <option value="VS2">VS2</option>
                  <option value="SI1">SI1</option>
                  <option value="SI2">SI2</option>
                  <option value="I1">I1</option>
                  <option value="I2">I2</option>
                  <option value="I3">I3</option>
                </select>
                {errors.clarityGrade && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.clarityGrade.message}
                  </p>
                )}
              </div>

              <div className="flex items-center p-4 bg-white border border-gray-200 rounded-xl">
                <input
                  type="checkbox"
                  {...register("clarityEyeClean")}
                  id="clarityEyeClean"
                  className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2 cursor-pointer"
                />
                <label
                  htmlFor="clarityEyeClean"
                  className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Eye Clean
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Clarity Description
                </label>
                <input
                  type="text"
                  {...register("clarityDescription")}
                  className="input-field-default"
                  placeholder="e.g., Minor inclusions visible under 10x"
                />
              </div>
            </div>

            {/* Cut */}
            <div className="border-t-2 border-gray-200 pt-4 space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Cut Quality</h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cut Grade <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("cutGrade", {
                    required: "Cut grade is required",
                  })}
                  className="input-field-default"
                >
                  <option value="">Select Cut</option>
                  <option value="excellent">Excellent</option>
                  <option value="very-good">Very Good</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
                {errors.cutGrade && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.cutGrade.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Polish
                  </label>
                  <input
                    type="text"
                    {...register("cutPolish")}
                    className="input-field-default"
                    placeholder="e.g., Excellent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Symmetry
                  </label>
                  <input
                    type="text"
                    {...register("cutSymmetry")}
                    className="input-field-default"
                    placeholder="e.g., Very Good"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cut Description
                </label>
                <input
                  type="text"
                  {...register("cutDescription")}
                  className="input-field-default"
                  placeholder="Additional cut details"
                />
              </div>
            </div>

            {/* Dimensions */}
            <div className="border-t-2 border-gray-200 pt-4 space-y-4">
              <h3 className="text-sm font-bold text-gray-900">
                Dimensions (mm)
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Length <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("dimensionLength", {
                      required: "Length is required",
                    })}
                    className="input-field-default"
                    placeholder="0.00"
                  />
                  {errors.dimensionLength && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.dimensionLength.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Width <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("dimensionWidth", {
                      required: "Width is required",
                    })}
                    className="input-field-default"
                    placeholder="0.00"
                  />
                  {errors.dimensionWidth && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.dimensionWidth.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Depth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("dimensionDepth", {
                      required: "Depth is required",
                    })}
                    className="input-field-default"
                    placeholder="0.00"
                  />
                  {errors.dimensionDepth && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.dimensionDepth.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Origin */}
            <div className="border-t-2 border-gray-200 pt-4 space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Origin</h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("originCountry", {
                    required: "Country is required",
                  })}
                  className="input-field-default"
                >
                  <option value="">Select Country</option>
                  <option value="Myanmar (Burma)">Myanmar (Burma)</option>
                  <option value="Mozambique">Mozambique</option>
                  <option value="Thailand">Thailand</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="Madagascar">Madagascar</option>
                  <option value="Tanzania">Tanzania</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="Afghanistan">Afghanistan</option>
                  <option value="Other">Other</option>
                </select>
                {errors.originCountry && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.originCountry.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Region
                  </label>
                  <input
                    type="text"
                    {...register("originRegion")}
                    className="input-field-default"
                    placeholder="e.g., Mogok"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mine
                  </label>
                  <input
                    type="text"
                    {...register("originMine")}
                    className="input-field-default"
                    placeholder="Mine name"
                  />
                </div>
              </div>
            </div>

            {/* Treatment */}
            <div className="border-t-2 border-gray-200 pt-4 space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Treatment</h3>

              <div className="flex items-center p-4 bg-white border border-gray-200 rounded-xl">
                <input
                  type="checkbox"
                  {...register("treatmentHeated")}
                  id="treatmentHeated"
                  className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2 cursor-pointer"
                />
                <label
                  htmlFor="treatmentHeated"
                  className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Heated
                </label>
              </div>

              {treatmentHeated && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Treatment Type
                  </label>
                  <select
                    {...register("treatmentType")}
                    className="input-field-default"
                  >
                    <option value="heated">Heated</option>
                    <option value="heated-with-flux">Heated with Flux</option>
                    <option value="glass-filled">Glass Filled</option>
                    <option value="diffused">Diffused</option>
                    <option value="dyed">Dyed</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Treatment Description
                </label>
                <input
                  type="text"
                  {...register("treatmentDescription")}
                  className="input-field-default"
                  placeholder="Additional treatment details"
                />
              </div>
            </div>

            {/* Certification */}
            <div className="border-t-2 border-gray-200 pt-4 space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Certification</h3>

              <div className="flex items-center p-4 bg-white border border-gray-200 rounded-xl">
                <input
                  type="checkbox"
                  {...register("hasCertificate")}
                  id="hasCertificate"
                  className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2 cursor-pointer"
                />
                <label
                  htmlFor="hasCertificate"
                  className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Has Certificate
                </label>
              </div>

              {hasCertificate && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Laboratory
                    </label>
                    <select
                      {...register("certLab")}
                      className="input-field-default"
                    >
                      <option value="">Select Lab</option>
                      <option value="GRS">GRS</option>
                      <option value="GIA">GIA</option>
                      <option value="Gubelin">Gubelin</option>
                      <option value="AGL">AGL</option>
                      <option value="SSEF">SSEF</option>
                      <option value="Lotus">Lotus</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Certificate Number
                      </label>
                      <input
                        type="text"
                        {...register("certNumber")}
                        className="input-field-default"
                        placeholder="Certificate #"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Certificate Date
                      </label>
                      <input
                        type="date"
                        {...register("certDate")}
                        className="input-field-default"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Certificate Images
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      {...register("certificateImages")}
                      className="hidden"
                      id="cert-images"
                    />
                    <label
                      htmlFor="cert-images"
                      className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-full text-sm text-gray-600 hover:border-red-500 hover:text-red-500 cursor-pointer transition-all duration-200"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Choose Certificate Images
                    </label>

                    {certPreviews.length > 0 && (
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {certPreviews.map((preview, index) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-lg "
                          >
                            <button
                              onClick={() => handleDeleteCertificate(index)}
                              className="absolute top-0 -right-2 bg-red-500 border border-red-500 text-white px-1 py-1 rounded-full z-10"
                            >
                              <svg
                                className="w-3 h-3 text-white"
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
                            <Image
                              src={preview}
                              alt={`Certificate ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Pricing */}
            <div className="border-t-2 border-gray-200 pt-4 space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Pricing</h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("priceAmount", {
                      required: "Price is required",
                    })}
                    className="input-field-default"
                    placeholder="0.00"
                  />
                  {errors.priceAmount && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.priceAmount.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    {...register("priceCurrency")}
                    className="input-field-default"
                  >
                    <option value="USD">USD</option>
                    <option value="MMK">MMK</option>
                    <option value="THB">THB</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Compare At Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("priceCompareAt")}
                    className="input-field-default"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Buying Rate (MMK)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("buyingRate")}
                    className="input-field-default"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="border-t-2 border-gray-200 pt-4 space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Media</h3>

              {/* Product Images */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  {...register("images")}
                  className="hidden"
                  id="product-images"
                />
                <label
                  htmlFor="product-images"
                  className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-full text-sm text-gray-600 hover:border-red-500 hover:text-red-500 cursor-pointer transition-all duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Choose Images
                </label>

                {imagePreviews.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg"
                      >
                        <button
                          onClick={() => handleDeleteImage(index)}
                          className="absolute top-0 -right-2 bg-red-500 border border-red-500 text-white px-1 py-1 rounded-full z-10"
                        >
                          <svg
                            className="w-3 h-3 text-white"
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
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Videos */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Videos
                </label>
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  {...register("videos")}
                  className="hidden"
                  id="product-videos"
                />
                <label
                  htmlFor="product-videos"
                  className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-full text-sm text-gray-600 hover:border-red-500 hover:text-red-500 cursor-pointer transition-all duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Choose Videos
                </label>

                {videoPreviews.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {videoPreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="text-xs text-gray-600 relative bg-gray-100 rounded px-3 py-2"
                      >
                        <button
                          type="button"
                          onClick={() => handleDeleteVideo(index)}
                          className="absolute top-0 -right-2 hover:text-red-700 bg-red-500 border border-red-500 text-white px-1 py-1 rounded-full z-10"
                        >
                          <svg
                            className="w-3 h-3"
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
                        Video {index + 1}:{" "}
                        {typeof preview === "string"
                          ? preview.split("/").pop()
                          : preview}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="border-t-2 border-gray-200 pt-4 space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Description</h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Short Description
                </label>
                <textarea
                  {...register("descriptionShort")}
                  rows={2}
                  maxLength={200}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition resize-none"
                  placeholder="Brief description (max 200 characters)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Description
                </label>
                <textarea
                  {...register("descriptionFull")}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition resize-none"
                  placeholder="Detailed product description"
                />
              </div>
            </div>

            {/* Other Settings */}
            <div className="border-t-2 border-gray-200 pt-4 space-y-4">
              <h3 className="text-sm font-bold text-gray-900">
                Other Settings
              </h3>

              <div className="flex items-center p-4 bg-white border border-gray-200 rounded-xl">
                <input
                  type="checkbox"
                  {...register("featured")}
                  id="featured"
                  className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2 cursor-pointer"
                />
                <label
                  htmlFor="featured"
                  className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Featured Product
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  {...register("tags")}
                  className="input-field-default"
                  placeholder="natural, unheated, mogok (comma separated)"
                />
              </div>
            </div>

            {/* SEO */}
            <div className="border-t-2 border-gray-200 pt-4 space-y-4">
              <h3 className="text-sm font-bold text-gray-900">SEO Settings</h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  {...register("metaTitle")}
                  className="input-field-default"
                  placeholder="SEO meta title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  {...register("metaDescription")}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition resize-none"
                  placeholder="SEO meta description"
                />
              </div>
            </div>
          </form>

          {/* Footer Actions */}
          <div className="flex gap-3 p-6 border-t border-gray-200 bg-white">
            <CustomButton
              title="Cancel"
              variant="outline"
              size="small"
              onClick={onClose}
              type="button"
              className="flex-1"
            />
            <CustomButton
              title={editingProduct ? "Update Ruby" : "Create Ruby"}
              variant="gradient"
              size="small"
              type="submit"
              loading={loading}
              className="flex-1"
              onClick={handleSubmit(handleFormSubmit)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
