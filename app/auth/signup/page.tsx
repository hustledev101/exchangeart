"use client";
import { useState } from "react";
import {
  Mail,
  Lock,
  AlertCircle,
  User,
  Wallet,
  Eye,
  EyeOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getUserCredentials,
  saveUserCredentials,
  createUserSession,
} from "@/lib/localStorageUtils";

export default function UserSignup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [walletphrases, setWalletphrases] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Validate inputs
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Please enter a valid email");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }
      if (!username) {
        throw new Error("Username is required");
      }

      // Check for duplicate email
      const existingUsers = getUserCredentials();
      if (existingUsers.some((user) => user.email === email)) {
        throw new Error("An account with this email already exists");
      }

      // Check for duplicate username
      if (existingUsers.some((user) => user.username === username)) {
        throw new Error("This username is already taken");
      }

      // Create user credentials object
      const userCredentials = {
        username,
        email,
        password,
        walletPhrases: walletphrases || undefined,
        role: "user" as const,
        createdAt: new Date().toISOString(),
      };

      // Save user credentials to local storage
      saveUserCredentials(userCredentials);

      // Create user session
      createUserSession(email, username);

      // Show success message
      toast.success("Account created successfully!");

      console.log("User Signup Data saved to local storage:", userCredentials);

      // Redirect to signin page after delay
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create account";
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
        <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>
        <form onSubmit={handleSignup} className="space-y-6">
          {/* Username Input */}
          <div>
            <label className="flex items-center gap-2 text-gray-400 font-semibold mb-2">
              <User className="h-5 w-5 text-blue-500" />
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border-b border-gray-500 focus:outline-none text-white py-2 placeholder-gray-600"
              placeholder="Choose a unique username"
              required
            />
          </div>

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
              placeholder="example@mail.com"
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

          {/* Wallet Phrase Input */}
          <div>
            <label className="flex items-center gap-2 text-gray-400 font-semibold mb-2">
              <Wallet className="h-5 w-5 text-green-500" />
              Connect Wallet (Optional)
            </label>
            <input
              type="text"
              value={walletphrases}
              onChange={(e) => setWalletphrases(e.target.value)}
              className="w-full bg-transparent border-b border-gray-500 focus:outline-none text-white py-2 placeholder-gray-600"
              placeholder="Enter your wallet 12 or 24 phrases"
            />
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
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <p className="justify-center text-center text-gray-400 text-sm mt-4">
          Already have an account?{" "}
          <a href="/auth/login" className="text-[#4A3AFF] hover:underline">
            Log in
          </a>
        </p>
        {/* Terms */}
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking Sign up, you agree to our{" "}
          <a href="/terms">Terms of Service</a> and{" "}
          <a href="/privacy">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}
