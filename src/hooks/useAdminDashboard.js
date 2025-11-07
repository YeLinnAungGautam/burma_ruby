// hooks/useAdminDashboard.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAdminDashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/dashboard");

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        setStats(data.stats || {});
      } else if (response.status === 401) {
        router.push("/admin/login");
      } else {
        throw new Error(`Failed to fetch stats: ${response.status}`);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchDashboardStats();
  };

  return {
    stats,
    loading,
    error,
    refetch,
  };
}
