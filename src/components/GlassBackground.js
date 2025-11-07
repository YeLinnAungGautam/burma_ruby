// components/GlassBackground.js
"use client";
export default function GlassBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base linear background */}
      <div className="absolute inset-0 bg-linear-to-br from-gray-50 via-blue-50 to-purple-50" />

      {/* Animated glass morphism elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-linear-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-linear-to-r from-pink-200/15 to-red-200/15 rounded-full blur-3xl animate-float-medium" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-linear-to-r from-green-200/10 to-blue-200/10 rounded-full blur-3xl animate-float-fast" />
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-linear-to-r from-yellow-200/10 to-orange-200/10 rounded-full blur-3xl animate-float-slow" />

      {/* Glass overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl" />

      {/* Subtle noise texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9Ii4wNSIvPjwvc3ZnPg==')] opacity-20" />
    </div>
  );
}
