// components/3D/CSSDiamondBackground.js
"use client";
import { useEffect, useRef } from "react";

export default function CSSDiamondBackground() {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Array of ruby images - you can add your own image paths
    const rubyImages = [
      "https://shubharatnagems.com/wp-content/uploads/2022/09/ruby.png",
      "https://static.vecteezy.com/system/resources/thumbnails/024/851/101/small_2x/red-dazzling-diamonds-on-transparent-background-png.png",
      "https://static.vecteezy.com/system/resources/thumbnails/031/738/572/small_2x/rubi-no-background-png.png",
    ];

    // Create floating rubies
    for (let i = 0; i < 20; i++) {
      const ruby = document.createElement("div");
      ruby.className = "absolute ruby-float";

      // Randomly select a ruby image
      const randomImage =
        rubyImages[Math.floor(Math.random() * rubyImages.length)];

      const size = Math.random() * 80 + 40; // Size between 40px and 120px
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const duration = 15 + Math.random() * 25; // Duration between 15-40s
      const delay = Math.random() * 15;
      const opacity = Math.random() * 0.4 + 0.1; // Opacity between 0.1-0.5

      ruby.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        top: ${top}%;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        opacity: ${opacity};
        background-image: url('${randomImage}');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        filter: drop-shadow(0 0 10px rgba(255, 0, 102, 0.5));
        transform: rotate(${Math.random() * 360}deg) scale(${
        0.8 + Math.random() * 0.4
      });
      `;

      container.appendChild(ruby);
    }

    return () => {
      // Cleanup
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden bg-linear-to-br from-red-900 via-pink-900 to-purple-900"
    />
  );
}
