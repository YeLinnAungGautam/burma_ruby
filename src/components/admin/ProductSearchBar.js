// components/admin/ProductSearchBar.jsx
export default function ProductSearchBar({
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
}) {
  return (
    <div className="mb-4">
      <div className="space-y-3">
        {/* Search Input */}
        <div className="w-full relative">
          <input
            type="text"
            placeholder="Search by name, SKU, description, tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field-default pr-10 w-full"
          />
          <svg
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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

        {/* Filters Row */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Status Filter */}
          <select
            value={filters.status || ""}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="input-field-default text-xs"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
            <option value="on-hold">On Hold</option>
            <option value="pending">Pending</option>
            <option value="archived">Archived</option>
          </select>

          {/* Moderation Status */}
          <select
            value={filters.moderationStatus || ""}
            onChange={(e) => onFilterChange("moderationStatus", e.target.value)}
            className="input-field-default text-xs"
          >
            <option value="">All Moderation</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="needs-revision">Needs Revision</option>
          </select>

          {/* Shape Filter */}
          <select
            value={filters.shape || ""}
            onChange={(e) => onFilterChange("shape", e.target.value)}
            className="input-field-default text-xs"
          >
            <option value="">All Shapes</option>
            <option value="round">Round</option>
            <option value="oval">Oval</option>
            <option value="cushion">Cushion</option>
            <option value="emerald">Emerald</option>
            <option value="pear">Pear</option>
            <option value="marquise">Marquise</option>
            <option value="heart">Heart</option>
            <option value="princess">Princess</option>
            <option value="cabochon">Cabochon</option>
          </select>

          {/* Color Grade Filter */}
          <select
            value={filters.colorGrade || ""}
            onChange={(e) => onFilterChange("colorGrade", e.target.value)}
            className="input-field-default text-xs"
          >
            <option value="">All Colors</option>
            <option value="pigeon-blood">Pigeon Blood</option>
            <option value="vivid-red">Vivid Red</option>
            <option value="deep-red">Deep Red</option>
            <option value="medium-red">Medium Red</option>
            <option value="pinkish-red">Pinkish Red</option>
            <option value="purplish-red">Purplish Red</option>
            <option value="orangish-red">Orangish Red</option>
          </select>

          {/* Origin Filter */}
          <select
            value={filters.origin || ""}
            onChange={(e) => onFilterChange("origin", e.target.value)}
            className="input-field-default text-xs"
          >
            <option value="">All Origins</option>
            <option value="Myanmar (Burma)">Myanmar (Burma)</option>
            <option value="Mozambique">Mozambique</option>
            <option value="Thailand">Thailand</option>
            <option value="Sri Lanka">Sri Lanka</option>
            <option value="Madagascar">Madagascar</option>
            <option value="Tanzania">Tanzania</option>
            <option value="Vietnam">Vietnam</option>
            <option value="Afghanistan">Afghanistan</option>
          </select>

          {/* Treatment Filter */}
          <select
            value={filters.unheated || ""}
            onChange={(e) => onFilterChange("unheated", e.target.value)}
            className="input-field-default text-xs"
          >
            <option value="">All Treatment</option>
            <option value="true">Unheated</option>
            <option value="false">Heated</option>
          </select>
        </div>

        {/* Additional Filters Row */}
        <div className="flex gap-3 items-center flex-wrap">
          {/* Featured Filter */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.featured === "true"}
              onChange={(e) =>
                onFilterChange("featured", e.target.checked ? "true" : "")
              }
              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
            />
            <span className="text-xs text-gray-700">Featured Only</span>
          </label>

          {/* Clear Filters */}
          {Object.values(filters).some((v) => v) && (
            <button
              onClick={() => onFilterChange("clear", "")}
              className="text-xs text-red-600 hover:text-red-700 font-medium"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
