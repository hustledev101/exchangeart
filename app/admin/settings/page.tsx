"use client";

import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Helper functions to interact with localStorage
const getAdminSession = () => {
  const admin = localStorage.getItem("admin");
  if (admin) {
    return JSON.parse(admin);
  }
  return null;
};

const getAdminCredentials = () => {
  const admin = localStorage.getItem("admin");
  if (admin) {
    const parsed = JSON.parse(admin);
    return [
      {
        email: parsed.email,
        password: parsed.password,
        role: "admin",
        createdAt: parsed.createdAt || new Date().toISOString(),
        lastLogin: parsed.lastLogin || new Date().toISOString(),
      },
    ];
  }
  return [];
};

interface AdminCredentials {
  email: string;
  password: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
}

export default function AdminSettings() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [adminData, setAdminData] = useState<AdminCredentials | null>(null);

  // Load current admin data from localStorage on mount
  useEffect(() => {
    const loadAdminData = () => {
      try {
        const session = getAdminSession();
        if (!session || !session.email) {
          toast.error("No admin session found");
          return;
        }
        const admins = getAdminCredentials();
        const currentAdmin = admins.find(
          (admin) => admin.email === session.email
        );
        if (currentAdmin) {
          setAdminData(currentAdmin);
          setEmail(currentAdmin.email);
          setPassword(currentAdmin.password);
        } else {
          toast.error("Admin data not found");
        }
      } catch (error) {
        console.error("Error loading admin data:", error);
        toast.error("Failed to load admin data");
      }
    };
    loadAdminData();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    try {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Please enter a valid email");
      }
      if (password && password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }
      if (!adminData) {
        throw new Error("No admin data to update");
      }

      // Update admin credentials in localStorage
      const admins = getAdminCredentials();
      const updatedAdmins = admins.map((admin) =>
        admin.email === adminData.email
          ? {
              ...admin,
              email,
              password,
              lastLogin: admin.lastLogin,
              role: admin.role,
              createdAt: admin.createdAt,
            }
          : admin
      );
      localStorage.setItem("admin", JSON.stringify(updatedAdmins[0]));
      setAdminData({ ...adminData, email, password });
      toast.success("Changes saved successfully");
    } catch (error) {
      console.error("Error saving admin settings:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save changes"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="text-gray-50 space-y-6 m-5 border rounded-2xl p-10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 ">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>

      {/* Admin Info */}
      {adminData ? (
        <div className="flex items-center gap-6 mb-10 flex-col sm:flex-row">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold capitalize">Admin</h2>
            <p className="text-gray-50 tracking-widest">{email}</p>
            <p className="text-gray-50 tracking-widest text-sm">
              Role: {adminData.role}
            </p>
            <p className="text-gray-50 tracking-widest text-sm">
              Created At: {new Date(adminData.createdAt).toLocaleString()}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-gray-50 tracking-widest">
                {showPassword ? password : "********"}
              </p>
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-gray-50 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-red-500">No admin data available</p>
      )}

      {/* Editable Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Email Input */}
        <div className="hover:dark:bg-[rgba(255,255,255,0.05)] p-6 border rounded-lg">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 p-4 rounded-full">
              <Mail className="text-red-500 text-2xl" />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-gray-50 font-semibold mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-b border-gray-500 focus:outline-none font-bold py-1"
              />
            </div>
          </div>
        </div>

        {/* Password Input */}
        <div className="hover:dark:bg-[rgba(255,255,255,0.05)] p-6 border rounded-lg">
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 p-4 rounded-full">
              <Lock className="text-green-500 text-2xl" />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-gray-50 font-semibold mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent border-b border-gray-500 focus:outline-none font-bold py-1"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSaveChanges}
        className="bg-[#4A3AFF] hover:bg-[#372aff] text-white font-bold py-3 px-6 rounded w-full sm:w-auto transition-colors"
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
