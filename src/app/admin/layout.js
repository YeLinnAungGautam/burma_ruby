"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <div className="min-h-screen ">
      {!isLoginPage && <AdminHeader />}
      <div className="flex">
        {!isLoginPage && <AdminSidebar />}
        <main
          className={`flex-1 ${
            isLoginPage ? "w-full" : "w-[calc(100%-256px)]"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
