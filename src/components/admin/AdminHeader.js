"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CustomButton from "../common/CustomButton";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function AdminHeader() {
  // const [user, setUser] = useState(null);
  const { clearUser, user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/admin/me");

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        setUser(data.user);
      } else {
        // If not authenticated, redirect to login
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      clearUser();
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/admin/login");
    }
  };

  if (loading) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-base font-semibold text-gray-900">
              Loading ...
            </h1>
            <div className="animate-pulse bg-gray-300 h-8 w-32 rounded-full"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-3">
        <div className="flex justify-between items-center">
          <div className=" flex justify-start items-center gap-x-3">
            <div className="w-10 mx-auto h-10  overflow-hidden relative">
              <Image
                src="https://cdn-icons-png.flaticon.com/128/18407/18407415.png"
                alt="Admin Login"
                fill
                className="object-center"
                sizes="100px"
              />
            </div>
            <h1 className="text-base font-semibold text-gray-900">
              Ruby Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            {user && (
              <span className=" text-gray-700 bg-gray-200 rounded-full px-3 py-2 text-xs">
                Welcome, {user?.name} ({user?.role})
              </span>
            )}
            {user && (
              <CustomButton
                onClick={handleLogout}
                icon="https://cdn-icons-png.flaticon.com/128/17867/17867688.png"
                variant="gradient"
                size="small"
                title="Logout"
              />
            )}
            <CustomButton
              onClick={() => router.push("/")}
              icon="https://cdn-icons-png.flaticon.com/128/9190/9190709.png"
              variant="gradient"
              size="small"
              title="Home"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
