// components/admin/CategoryFormDrawer.jsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import CustomButton from "@/components/common/CustomButton";

export default function CategoryFormDrawer({
  isOpen,
  onClose,
  editingCategory,
  categories,
  onSubmit,
  loading,
}) {
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      parent: "",
      isActive: true,
      metaTitle: "",
      metaDescription: "",
    },
  });

  const imageFile = watch("image");

  // Handle image preview
  useEffect(() => {
    if (imageFile && imageFile[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(imageFile[0]);
    } else if (!imageFile) {
      setImagePreview(editingCategory?.image?.url || null);
    }
  }, [imageFile, editingCategory]);

  // Update form when editing category changes
  useEffect(() => {
    if (editingCategory) {
      reset({
        name: editingCategory.name,
        description: editingCategory.description || "",
        parent: editingCategory.parent?._id || "",
        isActive: editingCategory.isActive,
        metaTitle: editingCategory.metaTitle || "",
        metaDescription: editingCategory.metaDescription || "",
      });
      setImagePreview(editingCategory.image?.url || null);
    } else {
      reset({
        name: "",
        description: "",
        parent: "",
        isActive: true,
        metaTitle: "",
        metaDescription: "",
      });
      setImagePreview(null);
    }
  }, [editingCategory, reset, isOpen]);

  const handleFormSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("parent", data.parent || "");
    formData.append("isActive", data.isActive.toString());
    formData.append("metaTitle", data.metaTitle || "");
    formData.append("metaDescription", data.metaDescription || "");

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    await onSubmit(formData, editingCategory?._id);
  };

  const parentCategories = categories.filter((cat) => !cat.parent);

  return (
    <>
      {/* Backdrop with blur */}
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
              {editingCategory ? "Edit Category" : "Create Category"}
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
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="input-field-default"
                placeholder="Enter category name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition resize-none"
                placeholder="Enter category description"
              />
            </div>

            {/* Parent Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Parent Category
              </label>
              <select {...register("parent")} className="input-field-default">
                <option value="">None (Top Level)</option>
                {parentCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category Image
              </label>

              {/* Custom File Input */}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  {...register("image")}
                  className="hidden"
                  id="category-image"
                />
                <label
                  htmlFor="category-image"
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
                  {imageFile && imageFile[0]
                    ? imageFile[0].name
                    : "Choose an image"}
                </label>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-3 flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 shadow-sm">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {imageFile && imageFile[0]
                        ? imageFile[0].name
                        : "Current image"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {imageFile && imageFile[0]
                        ? `${(imageFile[0].size / 1024).toFixed(2)} KB`
                        : "Uploaded"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      document.getElementById("category-image").value = "";
                    }}
                    className="shrink-0 text-red-500 hover:text-red-700 transition-colors"
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center p-4 bg-white border border-gray-200 rounded-xl">
              <input
                type="checkbox"
                {...register("isActive")}
                id="isActive"
                className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2 cursor-pointer"
              />
              <label
                htmlFor="isActive"
                className="ml-3 text-sm font-medium text-gray-700 cursor-pointer select-none"
              >
                Active Category
              </label>
            </div>

            {/* SEO Fields */}
            <div className="border-t-2 border-gray-200 pt-6 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="text-lg font-bold text-gray-900">
                  SEO Settings
                </h3>
              </div>

              <div className="space-y-5">
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
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: 50-60 characters
                  </p>
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
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: 150-160 characters
                  </p>
                </div>
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
              title={editingCategory ? "Update Category" : "Create Category"}
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
