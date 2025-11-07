// components/admin/ProductTable.jsx
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  onApprove,
}) {
  const { isSuperAdmin } = useAuth();
  const formatPrice = (priceObj) => {
    if (!priceObj || !priceObj.amount) return "N/A";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: priceObj.currency || "USD",
    }).format(priceObj.amount);
  };

  const getStatusBadge = (status) => {
    const badges = {
      available: "bg-green-100 text-green-800",
      reserved: "bg-blue-100 text-blue-800",
      sold: "bg-purple-100 text-purple-800",
      "on-hold": "bg-orange-100 text-orange-800",
      pending: "bg-yellow-100 text-yellow-800",
      archived: "bg-gray-100 text-gray-800",
    };
    return badges[status] || badges.pending;
  };

  const getModerationBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      "needs-revision": "bg-orange-100 text-orange-800",
    };
    return badges[status] || badges.pending;
  };

  const getColorLabel = (colorGrade) => {
    const labels = {
      "pigeon-blood": "Pigeon Blood",
      "vivid-red": "Vivid Red",
      "deep-red": "Deep Red",
      "medium-red": "Medium Red",
      "pinkish-red": "Pinkish Red",
      "purplish-red": "Purplish Red",
      "orangish-red": "Orangish Red",
    };
    return labels[colorGrade] || colorGrade;
  };

  const getShapeLabel = (shape) => {
    return shape.charAt(0).toUpperCase() + shape.slice(1);
  };

  return (
    <div className="backdrop-blur-md mt-6 w-full  overflow-hidden">
      <div className="overflow-x-auto w-full">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                Ruby
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                Origin
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                Moderation
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-200">
            {products.map((product, index) => (
              <tr
                key={product._id}
                className="hover:bg-gray-50 transition-colors duration-150"
                style={{
                  animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
                }}
              >
                {/* Ruby Info */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {product.images?.[0]?.url ? (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 ring-2 ring-red-100">
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-linear-to-br from-red-100 to-pink-100 flex items-center justify-center shrink-0">
                        <svg
                          className="w-6 h-6 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                          />
                        </svg>
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">
                        {product.name}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-xs text-gray-500">
                          {getShapeLabel(product.shape)}
                        </span>
                        {product.featured && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            ⭐
                          </span>
                        )}
                        {product.features?.unheated && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Unheated
                          </span>
                        )}
                        {product.features?.certified && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            ✓ Cert
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* SKU */}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 font-mono">
                    {product.sku}
                  </div>
                </td>

                {/* Details */}
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900">
                      {product.carat} ct
                    </div>
                    <div className="text-xs text-gray-600">
                      {getColorLabel(product.color?.grade)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {product.clarity?.grade}
                    </div>
                  </div>
                </td>

                {/* Origin */}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {product.origin?.country?.replace(" (Burma)", "") || "N/A"}
                  </div>
                  {product.origin?.region && (
                    <div className="text-xs text-gray-500">
                      {product.origin.region}
                    </div>
                  )}
                </td>

                {/* Price */}
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatPrice(product.price)}
                  </div>
                  {product.price?.compareAtPrice && (
                    <div className="text-xs text-gray-500 line-through">
                      {formatPrice({
                        amount: product.price.compareAtPrice,
                        currency: product.price.currency,
                      })}
                    </div>
                  )}
                  {product.price?.pricePerCarat && (
                    <div className="text-xs text-gray-500">
                      {formatPrice({
                        amount: product.price.pricePerCarat,
                        currency: product.price.currency,
                      })}
                      /ct
                    </div>
                  )}
                </td>

                {/* Moderation Status */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getModerationBadge(
                      product.moderation?.status || "pending"
                    )}`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-1.5 ${
                        product.moderation?.status === "approved"
                          ? "bg-green-500"
                          : product.moderation?.status === "pending"
                          ? "bg-yellow-500 animate-pulse"
                          : product.moderation?.status === "rejected"
                          ? "bg-red-500"
                          : "bg-orange-500"
                      }`}
                    />
                    {product.moderation?.status
                      ? product.moderation.status
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")
                      : "Pending"}
                  </span>
                </td>

                {/* Availability Status */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                      product.status
                    )}`}
                  >
                    {product.status
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {product.moderation?.status === "pending" &&
                      isSuperAdmin &&
                      onApprove && (
                        <>
                          <button
                            onClick={() => onApprove(product._id, "approve")}
                            className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-all duration-200 transform hover:scale-110"
                            title="Approve"
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
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => onApprove(product._id, "reject")}
                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200 transform hover:scale-110"
                            title="Reject"
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </>
                      )}

                    {product.moderation?.status === "rejected" && (
                      <div className="px-2 py-1 text-xs text-red-600 bg-red-50 rounded">
                        {product.moderation?.rejectionReason
                          ? product.moderation.rejectionReason.substring(
                              0,
                              20
                            ) + "..."
                          : "Rejected"}
                      </div>
                    )}

                    <button
                      onClick={() => onEdit(product)}
                      className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all duration-200 transform hover:scale-110"
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
                      onClick={() => onDelete(product._id)}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200 transform hover:scale-110"
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

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500">No rubies found</p>
        </div>
      )}

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
