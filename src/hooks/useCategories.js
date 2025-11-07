// hooks/useCategories.js
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories
  const fetchCategories = async (includeInactive = true) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/admin/category?includeInactive=${includeInactive}`
      );
      const data = await response.json();

      if (data.success) {
        setCategories(data.categories);
        return { success: true, data: data.categories };
      } else {
        throw new Error(data.error || "Failed to fetch categories");
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Create category
  const createCategory = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/category", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        await fetchCategories();
        return { success: true, data: result.category };
      } else {
        throw new Error(result.error || "Failed to create category");
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update category
  const updateCategory = async (id, formData) => {
    try {
      setLoading(true);
      setError(null);

      formData.append("id", id);

      const response = await fetch("/api/admin/category", {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        await fetchCategories();
        return { success: true, data: result.category };
      } else {
        throw new Error(result.error || "Failed to update category");
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/category?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        await fetchCategories();
        return { success: true };
      } else {
        throw new Error(result.error || "Failed to delete category");
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
