// lib/toast.js
import toast from "react-hot-toast";

export const showToast = {
  success: (message, options = {}) => {
    toast.success(message, {
      ...options,
      icon: "✅",
    });
  },

  error: (message, options = {}) => {
    toast.error(message, {
      ...options,
      icon: "❌",
    });
  },

  loading: (message, options = {}) => {
    return toast.loading(message, {
      ...options,
      icon: "⏳",
    });
  },

  promise: (promise, messages) => {
    return toast.promise(promise, {
      loading: messages.loading || "Loading...",
      success: messages.success || "Success!",
      error: messages.error || "Error occurred",
    });
  },

  custom: (message, options = {}) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{message}</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      ),
      options
    );
  },

  info: (message, options = {}) => {
    toast(message, {
      ...options,
      icon: "ℹ️",
      style: {
        background: "#eff6ff",
        color: "#1e40af",
        border: "1px solid #93c5fd",
      },
    });
  },

  warning: (message, options = {}) => {
    toast(message, {
      ...options,
      icon: "⚠️",
      style: {
        background: "#fefce8",
        color: "#854d0e",
        border: "1px solid #fde047",
      },
    });
  },
};
