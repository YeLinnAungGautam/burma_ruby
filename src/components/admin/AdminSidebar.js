"use client";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { isSuperAdmin } = useAuth();

  const menuItems = [
    {
      href: "/admin",
      label: "Dashboard",
      show: true,
      icon: "https://cdn-icons-png.flaticon.com/128/3388/3388614.png",
    },
    {
      href: "/admin/products",
      label: "Products",
      show: true,
      icon: "https://cdn-icons-png.flaticon.com/128/16300/16300439.png",
    },
    {
      href: "/admin/categories",
      label: "Categories",
      show: true,
      icon: "https://cdn-icons-png.flaticon.com/128/7102/7102597.png",
    },
    {
      href: "/admin/users",
      label: "Users",
      show: isSuperAdmin,
      icon: "https://cdn-icons-png.flaticon.com/128/681/681443.png",
    },
    {
      href: "/admin/profile",
      label: "Profile",
      show: true,
      icon: "https://cdn-icons-png.flaticon.com/128/1144/1144760.png",
    },
  ];

  return (
    <aside className=" w-40 bg-white shadow-sm border-r border-gray-200 min-h-[92vh]">
      <nav className="py-4 pl-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            if (!item.show) return null;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-s-full text-xs transition-colors ${
                  isActive
                    ? "bg-linear-to-r from-red-600 to-pink-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={24}
                  height={24}
                  className="w-3 h-3"
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
