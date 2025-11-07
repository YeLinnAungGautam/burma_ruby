import CustomButton from "../common/CustomButton";

// components/admin/QuickActions.js
export default function QuickActions({ router }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-200 mb-6">
      <div className=" flex justify-between items-center">
        <h2 className="text-base font-semibold text-gray-900">Quick Confirm</h2>
        <div className="flex ">
          <CustomButton
            icon="https://cdn-icons-png.flaticon.com/128/7794/7794550.png"
            title="New Product"
            variant="gradient"
            size="small"
            onClick={() => router.push("/admin/products/new")}
          />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-700">
          Click the button to create a new product.
        </p>
      </div>
    </div>
  );
}
