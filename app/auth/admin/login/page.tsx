"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      const { email: storedEmail, password: storedPassword } =
        JSON.parse(storedAdmin);
      if (email === storedEmail && password === storedPassword) {
        toast.success("Login successful!");
        router.push("/admin/overview");
      } else {
        toast.error("Invalid credentials.");
      }
    } else {
      toast.error("No admin account found. Please sign up first.");
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1B25] text-[#ffffff] font-mono flex items-center justify-center p-6">
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
      <div className="bg-[#2A2B35] p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-600">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Login</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <label className="flex items-center gap-2 text-gray-400 font-semibold mb-2">
              <Mail className="h-5 w-5 text-red-500" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-gray-500 focus:outline-none text-white py-2 placeholder-gray-600"
              placeholder="admin@example.com"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="flex items-center gap-2 text-gray-400 font-semibold mb-2">
              <Lock className="h-5 w-5 text-green-500" />
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-gray-500 focus:outline-none text-white py-2 placeholder-gray-600 pr-10"
              placeholder="Enter password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#4A3AFF] hover:bg-[#372aff] text-white font-bold py-3 rounded transition-colors"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
