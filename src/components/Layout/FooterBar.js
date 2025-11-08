"use client";
import React, { useState } from "react";
import { Home, MessageCircle, User, Gem } from "lucide-react";
import { useRouter } from "next/navigation";

function FooterBar() {
  const [activeTab, setActiveTab] = useState("home");
  const router = useRouter();

  const tabs = [
    { id: "home", icon: Home, path: "/" },
    { id: "product", icon: Gem, path: "/products" },
    { id: "message", icon: MessageCircle, path: "/messages" },
    { id: "profile", icon: User, path: "/profile" },
  ];

  const handleTabClick = (tabId) => {
    router.push(tabs.find((tab) => tab.id === tabId).path);
    setActiveTab(tabId);
  };

  return (
    <div className="fixed  w-full z-40 bottom-3">
      <div className="max-w-sm mx-auto px-6">
        <div className="bg-white/50 backdrop-blur-lg rounded-full shadow-lg border border-black/20">
          <div className="flex items-center justify-around p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "bg-linear-to-br from-red-600 to-pink-800 text-white -translate-y-4 shadow-lg"
                      : "bg-black-100 hover:bg-black-200"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isActive ? "text-white" : "text-black-600"
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
