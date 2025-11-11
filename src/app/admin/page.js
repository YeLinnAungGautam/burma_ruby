// components/admin/AdminDashboard.js
"use client";
import { useRouter } from "next/navigation";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import DashboardStats from "../../components/admin/DashboardStats";
import QuickActions from "../../components/admin/QuickActions";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboard() {
  const { stats, loading, error } = useAdminDashboard();
  const router = useRouter();
  const { isSuperAdmin } = useAuth();

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-base font-bold text-black mb-2">
          Admin Management
        </h1>
        <p className="text-gray-400 text-xs">
          Manage your product categories and subcategories
        </p>
      </div>

      {isSuperAdmin && <DashboardStats stats={stats} />}
      <QuickActions router={router} />
    </div>
  );
}
