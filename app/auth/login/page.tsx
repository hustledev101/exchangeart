"use client";
import { useState } from "react";
import { Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getUserCredentials,
  validateUserCredentials,
  createUserSession,
} from "@/lib/localStorageUtils";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Validate inputs
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Please enter a valid email");
      }
      if (!password) {
        throw new Error("Password is required");
      }

      // Check if user exists and validate credentials
      const isValid = validateUserCredentials(email, password);

      if (!isValid) {
        throw new Error("Invalid email or password");
      }

      // Get user data to create session
      const users = getUserCredentials();
      const user = users.find((u) => u.email === email);

      if (!user) {
        throw new Error("User not found");
      }

      // Create user session
      createUserSession(email, user.username);

      // Show success message
      toast.success("Sign in successful!");

      console.log("User signed in successfully:", {
        email,
        username: user.username,
        loginTime: new Date().toISOString(),
      });

      // Redirect to user home after delay
      setTimeout(() => {
        router.push("/user/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Signin error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to sign in";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
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
        <h1 className="text-3xl font-bold mb-6 text-center">Log In</h1>
        <form onSubmit={handleLogin} className="space-y-6">
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
              placeholder="email@example.com"
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
              className="absolute right-2 top-[38px] text-gray-400 hover:text-gray-200"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#4A3AFF] hover:bg-[#372aff] text-white font-bold py-3 rounded transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Log In"}
          </button>
        </form>
        <p className="text-center text-gray-400 text-sm mt-4">
          Don&apos;t have an account?{" "}
          <a href="/auth/signup" className="text-[#4A3AFF] hover:underline">
            Create account
          </a>
        </p>
      </div>
    </div>
  );
}
