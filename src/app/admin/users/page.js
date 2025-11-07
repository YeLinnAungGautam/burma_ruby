"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUsers } from "@/hooks/useUsers";
import UserFormDrawer from "@/components/admin/UserFormDrawer";
import CustomButton from "@/components/common/CustomButton";
import UserTable from "@/components/admin/UserTable";

export default function Page() {
  const { user: currentUser } = useAuth();
  const { users, loading, fetchUsers, createUser, updateUser, deleteUser } =
    useUsers();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSubmit = async (userData, userId) => {
    if (userId) {
      const success = await updateUser(userId, userData);
      if (success) {
        setIsDrawerOpen(false);
        setEditingUser(null);
      }
    } else {
      const success = await createUser(userData);
      if (success) {
        setIsDrawerOpen(false);
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(userId);
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingUser(null);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div className="mb-6 flex justify-between items-start">
          <div className="">
            <h1 className="text-base font-bold text-black mb-2">
              User Management
            </h1>
            <p className="text-gray-400 text-xs">
              Manage your users and their permissions
            </p>
          </div>
          <CustomButton
            icon="https://cdn-icons-png.flaticon.com/128/9312/9312231.png"
            variant="gradient"
            size="small"
            title="Create User"
            onClick={() => setIsDrawerOpen(true)}
          />
        </div>

        {/* Search Bar */}
        <div className="w-1/3 mb-6">
          <div className="relative">
            <svg
              className="absolute right-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full pl-4 pr-4 py-3 border border-gray-300 focus:outline-none rounded-full focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-sm"
            />
          </div>
        </div>

        {/* Users Table */}
        <UserTable
          users={filteredUsers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* User Form Drawer */}
      <UserFormDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        editingUser={editingUser}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
