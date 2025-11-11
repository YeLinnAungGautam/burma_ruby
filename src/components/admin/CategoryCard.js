// components/admin/CategoryTable.jsx
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function CategoryTable({ categories, onEdit, onDelete }) {
  const { isSuperAdmin } = useAuth();

  return (
    <div className=" backdrop-blur-md mt-6  overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                Parent
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-800 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-black/10">
            {categories.map((category, index) => (
              <tr
                key={category._id}
                className="hover:bg-black/5 transition-colors duration-200"
                style={{
                  animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
                }}
              >
                {/* Image */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {category.image?.url ? (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                      <Image
                        src={category.image.url}
                        alt={category.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </td>

                {/* Name */}
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold ">{category.name}</div>
                </td>

                {/* Slug */}
                <td className="px-6 py-4">
                  <div className="text-xs text-gray-500 font-mono">
                    {category.slug}
                  </div>
                </td>

                {/* Parent */}
                <td className="px-6 py-4">
                  {category.parent ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-800">
                      {category.parent.name}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-800">Top Level</span>
                  )}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      category.isActive
                        ? "bg-green-500/20 text-green-800"
                        : "bg-red-500/20 text-red-800"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        category.isActive ? "bg-green-400" : "bg-red-400"
                      }`}
                    />
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* Description */}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-700 max-w-xs truncate">
                    {category.description || (
                      <span className="text-gray-500 italic">
                        No description
                      </span>
                    )}
                  </div>
                </td>

                {/* Actions */}
                {isSuperAdmin ? (
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(category)}
                        className="p-2 rounded-lg bg-blue-600 hover:bg-blue-600/40 text-white transition-all duration-200 transform hover:scale-110"
                        title="Edit"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(category._id)}
                        className="p-2 rounded-lg bg-red-600 hover:bg-red-600/40 text-white transition-all duration-200 transform hover:scale-110"
                        title="Delete"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                ) : (
                  <td className="px-2 py-4">
                    <div className="text-xs text-gray-500 font-mono">
                      no permissions
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
