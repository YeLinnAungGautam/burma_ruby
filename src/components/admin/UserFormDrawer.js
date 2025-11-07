"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import CustomButton from "@/components/common/CustomButton";

export default function UserFormDrawer({
  isOpen,
  onClose,
  editingUser,
  onSubmit,
  loading,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
      isActive: true,
      info: {
        address: "",
        phone: "",
        offical_email: "",
        facebook: "",
      },
    },
  });

  // Update form when editing user changes
  useEffect(() => {
    if (editingUser) {
      reset({
        name: editingUser.name,
        email: editingUser.email,
        password: "", // Don't populate password for security
        role: editingUser.role || "user",
        isActive: editingUser.isActive,
        info: {
          address: editingUser.info?.address || "",
          phone: editingUser.info?.phone || "",
          offical_email: editingUser.info?.offical_email || "",
          facebook: editingUser.info?.facebook || "",
        },
      });
    } else {
      reset({
        name: "",
        email: "",
        password: "",
        role: "user",
        isActive: true,
        info: {
          address: "",
          phone: "",
          offical_email: "",
          facebook: "",
        },
      });
    }
  }, [editingUser, reset, isOpen]);

  const handleFormSubmit = async (data) => {
    // Remove password field if empty (for updates)
    const submitData = { ...data };
    if (editingUser && !submitData.password) {
      delete submitData.password;
    }

    await onSubmit(submitData, editingUser?._id);
  };

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className={`fixed inset-0 bg-black/20  z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-1/2 lg:w-1/3 bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-linear-to-r from-red-600 to-pink-600 px-6 py-2 flex justify-between items-center shrink-0 shadow-lg">
            <h2 className="text-sm font-bold text-white">
              {editingUser ? "Edit User" : "Create New User"}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-1 hover:bg-white/20 rounded-full"
            >
              <svg
                className="w-6 h-6"
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
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="flex-1 overflow-y-auto p-6 space-y-5 bg-gray-50"
          >
            {/* Basic Information Section */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <h3 className="text-lg font-bold text-gray-900">
                  Basic Information
                </h3>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    className="input-field-default"
                    placeholder="Enter full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="input-field-default"
                    placeholder="user@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password{" "}
                    {!editingUser && <span className="text-red-500">*</span>}
                    {editingUser && (
                      <span className="text-gray-500 text-xs font-normal">
                        (Leave blank to keep current)
                      </span>
                    )}
                  </label>
                  <input
                    type="password"
                    {...register("password", {
                      required: editingUser ? false : "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    className="input-field-default"
                    placeholder="Enter password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("role", { required: "Role is required" })}
                    className="input-field-default"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.role.message}
                    </p>
                  )}
                </div>

                {/* Active Status */}
                <div className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <input
                    type="checkbox"
                    {...register("isActive")}
                    id="isActive"
                    className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2 cursor-pointer"
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-3 text-sm font-medium text-gray-700 cursor-pointer select-none"
                  >
                    Active User
                  </label>
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            {editingUser && (
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-bold text-gray-900">
                    Additional Information
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Address */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      {...register("info.address")}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition resize-none"
                      placeholder="Enter address"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      {...register("info.phone")}
                      className="input-field-default"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  {/* Official Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Official Email
                    </label>
                    <input
                      type="email"
                      {...register("info.offical_email")}
                      className="input-field-default"
                      placeholder="official@company.com"
                    />
                  </div>

                  {/* Facebook */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Facebook Profile
                    </label>
                    <input
                      type="url"
                      {...register("info.facebook")}
                      className="input-field-default"
                      placeholder="https://facebook.com/username"
                    />
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Footer Actions */}
          <div className="flex gap-3 p-6 border-t border-gray-200 bg-white">
            <CustomButton
              title="Cancel"
              variant="outline"
              size="small"
              onClick={onClose}
              type="button"
              className="flex-1"
            />
            <CustomButton
              title={editingUser ? "Update User" : "Create User"}
              variant="gradient"
              size="small"
              type="submit"
              loading={loading}
              className="flex-1"
              onClick={handleSubmit(handleFormSubmit)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
