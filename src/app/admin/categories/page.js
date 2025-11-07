// app/admin/categories/page.js
"use client";

import React, { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import CategoryCard from "@/components/admin/CategoryCard";
import CategoryFormDrawer from "@/components/admin/CategoryFormDrawer";
import SearchBar from "@/components/admin/SearchBar";
import CustomButton from "@/components/common/CustomButton";

export default function CategoriesPage() {
  const {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Open drawer for create
  const openCreateDrawer = () => {
    setEditingCategory(null);
    setIsDrawerOpen(true);
  };

  // Open drawer for edit
  const openEditDrawer = (category) => {
    setEditingCategory(category);
    setIsDrawerOpen(true);
  };

  // Close drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingCategory(null);
  };

  // Handle form submit
  const handleSubmit = async (formData, categoryId) => {
    const result = categoryId
      ? await updateCategory(categoryId, formData)
      : await createCategory(formData);

    if (result.success) {
      closeDrawer();
      alert(categoryId ? "Category updated!" : "Category created!");
    } else {
      alert(result.error || "Operation failed");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    const result = await deleteCategory(id);
    if (result.success) {
      alert("Category deleted!");
    } else {
      alert(result.error || "Delete failed");
    }
  };

  // Filter categories
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-start">
          <div className="">
            <h1 className="text-base font-bold text-black mb-2">
              Category Management
            </h1>
            <p className="text-gray-400 text-xs">
              Manage your product categories and subcategories
            </p>
          </div>
          <CustomButton
            icon="https://cdn-icons-png.flaticon.com/128/9312/9312231.png"
            variant="gradient"
            size="small"
            title="Create Category"
            onClick={openCreateDrawer}
          />
        </div>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onCreateClick={openCreateDrawer}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-2xl mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && !isDrawerOpen ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : filteredCategories.length === 0 ? (
          /* Empty State */
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 py-20">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-white">
                No categories found
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                Get started by creating a new category.
              </p>
              <div className="mt-6">
                <CustomButton
                  icon="https://cdn-icons-png.flaticon.com/128/9312/9312231.png"
                  onClick={openCreateDrawer}
                  variant="gradient"
                  size="small"
                  title="Create Category"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Table */
          <CategoryCard
            categories={filteredCategories}
            onEdit={openEditDrawer}
            onDelete={handleDelete}
          />
        )}

        {filteredCategories.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No categories found</p>
          </div>
        )}
      </div>

      {/* Form Drawer */}
      <CategoryFormDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        editingCategory={editingCategory}
        categories={categories}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
