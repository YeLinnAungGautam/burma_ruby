// hooks/useProducts.js
import { useState, useEffect, useCallback } from "react";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  // Fetch products
  const fetchProducts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();

      // Add all params dynamically
      Object.entries(params).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          queryParams.append(key, value);
        }
      });

      // Default page and limit if not provided
      if (!params.page) queryParams.append("page", pagination.page);
      if (!params.limit) queryParams.append("limit", pagination.limit);

      const response = await fetch(`/api/admin/products?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        // API returns data.data (not data.products)
        setProducts(data.data || []);
        setPagination(
          data.pagination || {
            page: 1,
            limit: 20,
            total: 0,
            pages: 0,
          }
        );
        return { success: true, data: data.data };
      } else {
        throw new Error(data.error || "Failed to fetch products");
      }
    } catch (err) {
      console.error("Fetch Products Error:", err);
      setError(err.message);
      setProducts([]); // Set empty array on error
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Create product
  const createProduct = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        await fetchProducts(); // Refresh list
        return { success: true, data: result.data };
      } else {
        throw new Error(result.error || "Failed to create product");
      }
    } catch (err) {
      console.error("Create Product Error:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update product
  const updateProduct = async (id, formData) => {
    try {
      setLoading(true);
      setError(null);

      formData.append("id", id);

      const response = await fetch("/api/admin/products", {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        await fetchProducts(); // Refresh list
        return { success: true, data: result.data };
      } else {
        throw new Error(result.error || "Failed to update product");
      }
    } catch (err) {
      console.error("Update Product Error:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        await fetchProducts(); // Refresh list
        return { success: true };
      } else {
        throw new Error(result.error || "Failed to delete product");
      }
    } catch (err) {
      console.error("Delete Product Error:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (productId, fileUrl, fileType) => {
    try {
      const response = await fetch(`/api/admin/products/file`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          fileUrl,
          fileType, // 'image', 'video', or 'certificate'
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to delete file");
      }

      return { success: true };
    } catch (err) {
      console.error("Delete File Error:", err);
      return { success: false, error: err.message };
    }
  };

  // Approve/Reject product (for superadmin)
  const approveProduct = async (productId, action, rejectionReason = null) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/products/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          action,
          rejectionReason,
        }),
      });

      const result = await response.json();

      if (result.success) {
        await fetchProducts(); // Refresh list
        return { success: true, data: result.data };
      } else {
        throw new Error(result.error || "Failed to update product status");
      }
    } catch (err) {
      console.error("Approve Product Error:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteFile,
    approveProduct,
  };
}
