// app/admin/products/page.js
"use client";

import React, { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import ProductTable from "@/components/admin/ProductTable";
import ProductFormDrawer from "@/components/admin/ProductFormDrawer";
import ProductSearchBar from "@/components/admin/ProductSearchBar";
import CustomButton from "@/components/common/CustomButton";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    approveProduct,
  } = useProducts();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    moderationStatus: "",
    shape: "",
    colorGrade: "",
    origin: "",
    unheated: "",
    featured: "",
  });

  // Fetch products when filters change
  // Fetch products when filters change with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts({
        search: searchQuery,
        ...filters,
      });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, filters, fetchProducts]); // ✅ Added fetchProducts

  const openCreateDrawer = () => {
    setEditingProduct(null);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (product) => {
    setEditingProduct(product);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (formData, productId) => {
    const result = productId
      ? await updateProduct(productId, formData)
      : await createProduct(formData);

    if (result.success) {
      closeDrawer();
      // alert(
      //   productId ? "Ruby updated successfully!" : "Ruby created successfully!"
      // );
      toast.success(
        productId ? "Ruby updated successfully!" : "Ruby created successfully!"
      );
    } else {
      // alert(result.error || "Operation failed");
      toast.error(result.error || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this ruby?")) return;

    const result = await deleteProduct(id);
    if (result.success) {
      // alert("Ruby deleted successfully!");
      toast.success("Ruby deleted successfully!");
    } else {
      // alert(result.error || "Delete failed");
      toast.error(result.error || "Delete failed");
    }
  };

  const handleApprove = async (id, action) => {
    const message = action === "approve" ? "approve" : "reject";

    let rejectionReason = null;
    if (action === "reject") {
      rejectionReason = prompt("Please provide a rejection reason:");
      if (!rejectionReason) return; // Cancel if no reason provided
    }

    if (!confirm(`Are you sure you want to ${message} this ruby?`)) return;

    const result = await approveProduct(id, action, rejectionReason);
    if (result.success) {
      // alert(`Ruby ${message}d successfully!`);
      toast.success(`Ruby ${message}d successfully!`);
    } else {
      // alert(result.error || `Failed to ${message} ruby`);
      toast.error(result.error || `Failed to ${message} ruby`);
    }
  };

  const handleFilterChange = (key, value) => {
    if (key === "clear") {
      setFilters({
        status: "",
        moderationStatus: "",
        shape: "",
        colorGrade: "",
        origin: "",
        unheated: "",
        featured: "",
      });
      setSearchQuery("");
    } else {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  // Safe check for products array
  const hasProducts = Array.isArray(products) && products.length > 0;

  return (
    <div className="h-full bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-start">
          <div className="">
            <h1 className="text-base font-bold text-black mb-2">
              Ruby Management
            </h1>
            <p className="text-gray-400 text-xs">
              Manage your ruby products and inventory
            </p>
          </div>
          <CustomButton
            icon="https://cdn-icons-png.flaticon.com/128/9312/9312231.png"
            variant="gradient"
            size="small"
            title="Create Ruby"
            onClick={openCreateDrawer}
          />
        </div>

        {/* Search & Filters */}
        <ProductSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && !isDrawerOpen ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : !hasProducts ? (
          /* Empty State */
          <div className="py-20">
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

              <p className="mt-1 text-xs text-gray-500">
                {searchQuery || Object.values(filters).some((v) => v)
                  ? "No rubies found matching your filters."
                  : "Get started by creating a new ruby product."}
              </p>
              <div className="mt-6">
                {searchQuery || Object.values(filters).some((v) => v) ? (
                  <CustomButton
                    title="Clear Filters"
                    variant="outline"
                    size="small"
                    onClick={() => handleFilterChange("clear", "")}
                  />
                ) : (
                  <CustomButton
                    icon="https://cdn-icons-png.flaticon.com/128/9312/9312231.png"
                    title="New Ruby"
                    variant="gradient"
                    size="small"
                    onClick={openCreateDrawer}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Table */
          <>
            <div className=" w-full">
              <ProductTable
                products={products}
                onEdit={openEditDrawer}
                onDelete={handleDelete}
                onApprove={handleApprove}
              />
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-6 flex items-center justify-between bg-white rounded-2xl p-4 border border-gray-200">
                <div className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.pages} (
                  {pagination.total} total rubies)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      fetchProducts({
                        page: pagination.page - 1,
                        search: searchQuery,
                        ...filters,
                      })
                    }
                    disabled={pagination.page === 1}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      fetchProducts({
                        page: pagination.page + 1,
                        search: searchQuery,
                        ...filters,
                      })
                    }
                    disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Form Drawer */}
      <ProductFormDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        editingProduct={editingProduct}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
