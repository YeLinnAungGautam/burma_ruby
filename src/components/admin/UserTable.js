"use client";

export default function UserTable({ users, onEdit, onDelete }) {
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "superadmin":
        return "bg-purple-500/20 text-purple-800";
      case "admin":
        return "bg-blue-500/20 text-blue-800";
      default:
        return "bg-gray-500/20 text-gray-800";
    }
  };

  return (
    <div className="backdrop-blur-md mt-6 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                Avatar
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-800 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-black/10">
            {users.map((user, index) => (
              <tr
                key={user._id}
                className="hover:bg-black/5 transition-colors duration-200"
                style={{
                  animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
                }}
              >
                {/* Avatar */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-red-500 to-pink-500 flex items-center justify-center text-white font-semibold text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </td>

                {/* Name */}
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold">{user.name}</div>
                </td>

                {/* Email */}
                <td className="px-6 py-4">
                  <div className="text-xs text-gray-500 font-mono">
                    {user.email}
                  </div>
                </td>

                {/* Role */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      user.isActive
                        ? "bg-green-500/20 text-green-800"
                        : "bg-red-500/20 text-red-800"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        user.isActive ? "bg-green-400" : "bg-red-400"
                      }`}
                    />
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* Phone */}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-700">
                    {user.info?.phone || (
                      <span className="text-gray-500 italic">No phone</span>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(user)}
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
                      onClick={() => onDelete(user._id)}
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
