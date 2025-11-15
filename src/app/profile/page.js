import FooterBar from "@/components/Layout/FooterBar";
import Header from "@/components/Layout/Header";
import React from "react";

function page() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 ">
      <Header />
      <div className="max-w-4xl pb-20 px-4 pt-8 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Sidebar - Profile Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-16">
              {/* Profile Image */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-linear-to-r from-red-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl font-light">JD</span>
                  </div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  John Doe
                </h2>
                <p className="text-gray-600 mb-2">User </p>
                <p className="text-sm text-gray-500">San Francisco, CA</p>
              </div>

              {/* Action Button */}
              <button className="w-full mt-6 bg-linear-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Personal Information Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <div className="text-gray-900 bg-gray-50 rounded-lg px-4 py-3">
                      John
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <div className="text-gray-900 bg-gray-50 rounded-lg px-4 py-3">
                      Doe
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="text-gray-900 bg-gray-50 rounded-lg px-4 py-3">
                    john.doe@example.com
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <div className="text-gray-900 bg-gray-50 rounded-lg px-4 py-3">
                    +1 (555) 123-4567
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  Preferences
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Push Notifications
                      </h4>
                      <p className="text-sm text-gray-600">
                        Receive push notifications
                      </p>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-red-500">
                      <input
                        type="checkbox"
                        className="opacity-0 w-0 h-0"
                        defaultChecked
                      />
                      <span className="absolute top-1 right-1 bg-white w-4 h-4 rounded-full transition-transform"></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Email Updates
                      </h4>
                      <p className="text-sm text-gray-600">
                        Receive weekly email updates
                      </p>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-gray-300">
                      <input type="checkbox" className="opacity-0 w-0 h-0" />
                      <span className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform"></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium text-gray-900">Dark Mode</h4>
                      <p className="text-sm text-gray-600">Use dark theme</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-gray-300">
                      <input type="checkbox" className="opacity-0 w-0 h-0" />
                      <span className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-gray-900">
                        Updated profile information
                      </p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-gray-900">Changed password</p>
                      <p className="text-sm text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-gray-900">Connected social account</p>
                      <p className="text-sm text-gray-500">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterBar />
    </div>
  );
}

export default page;
