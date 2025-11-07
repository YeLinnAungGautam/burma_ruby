import Image from "next/image";

// components/admin/DashboardStats.js
export default function DashboardStats({ stats }) {
  const statCards = [
    {
      key: "totalProducts",
      label: "Total Products",
      value: stats.totalProducts || 0,
      icon: "https://cdn-icons-png.flaticon.com/128/14678/14678004.png",
      bgColor: "bg-blue-100",
    },
    {
      key: "approvedProducts",
      label: "Approved Products",
      value: stats.approvedProducts || 0,
      icon: "https://cdn-icons-png.flaticon.com/128/9355/9355475.png",
      bgColor: "bg-green-100",
    },
    {
      key: "pendingProducts",
      label: "Pending Products",
      value: stats.pendingProducts || 0,
      icon: "https://cdn-icons-png.flaticon.com/128/14629/14629834.png",
      bgColor: "bg-yellow-100",
    },
    {
      key: "totalCategories",
      label: "Categories",
      value: stats.totalCategories || 0,
      icon: "https://cdn-icons-png.flaticon.com/128/16994/16994960.png",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      {statCards.map((card) => (
        <div
          key={card.key}
          className="bg-white p-2 rounded-2xl shadow-xs border border-gray-200"
        >
          <div className="flex items-center">
            <div className={`p-2 ${card.bgColor} rounded-xl`}>
              {/* <span className="text-2xl">{card.icon}</span> */}
              <Image
                src={card.icon}
                alt={card.label}
                width={24}
                height={24}
                className="w-10 h-10"
              />
            </div>
            <div className="ml-4">
              <p className="text-xs text-gray-600">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
