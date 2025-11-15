"use client";
import React, { useEffect, useState } from "react";
import { MessageCircle, User, Gem, Search } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

function FooterBar() {
  const [activeTab, setActiveTab] = useState("home");
  const router = useRouter();
  const pathname = usePathname(); // Use usePathname hook instead of router.pathname

  const tabs = [
    { id: "home", icon: Gem, path: "/" },
    { id: "product", icon: Search, path: "/products" },
    { id: "message", icon: MessageCircle, path: "/messages" },
    { id: "profile", icon: User, path: "/profile" },
  ];

  const handleTabClick = (tabId) => {
    const tab = tabs.find((tab) => tab.id === tabId);
    if (tab) {
      router.push(tab.path);
      setActiveTab(tabId);
    }
  };

  // Update active tab based on current pathname
  useEffect(() => {
    const activeTab = tabs.find((tab) => tab.path === pathname);
    if (activeTab) {
      setActiveTab(activeTab.id);
    }
  }, [pathname]); // Only depend on pathname

  return (
    <div className="fixed w-full z-40 bottom-3">
      <div className="max-w-sm mx-auto px-6">
        <div className="bg-white/50 backdrop-blur-lg rounded-full shadow-lg border border-black/20">
          <div className="flex items-center justify-around p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.path;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "bg-linear-to-br from-red-600 to-pink-800 text-white -translate-y-4 shadow-lg"
                      : "bg-transparent hover:bg-black/5"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isActive ? "text-white" : "text-gray-600"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FooterBar;
