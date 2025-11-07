// components/admin/SearchBar.jsx
export default function SearchBar({ value, onChange }) {
  return (
    <div className=" mb-2">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="w-full md:w-96 relative">
          <input
            type="text"
            placeholder="Search categories..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="input-field-default bg-white/10 backdrop-blur-sm border-white/30 text-gray-600 placeholder-gray-400"
          />
          <svg
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
