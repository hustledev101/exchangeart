"use client";

import { useState, useEffect } from "react";
import { User, Mail, Lock, Eye, EyeOff, Wallet } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserCredentials, getUserSession } from "@/lib/localStorageUtils";

export default function AccountPage() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showWalletPhrases, setShowWalletPhrases] = useState(false);
  const [walletPhrases, setWalletPhrases] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load user data from local storage
  useEffect(() => {
    const loadUserData = () => {
      try {
        // Get current user session
        const userSession = getUserSession();
        if (!userSession) {
          console.error("No active user session found");
          return;
        }

        const currentEmail = userSession.email;

        // Get user credentials
        const userCredentials = getUserCredentials();
        const currentUser = userCredentials.find(
          (user) => user.email === currentEmail
        );

        if (currentUser) {
          setUserName(currentUser.username || "User");
          setEmail(currentUser.email || "");
          setWalletPhrases(currentUser.walletPhrases || "");
          // Load password from storage for display
          setNewPassword(currentUser.password || "");
        } else {
          console.error("Current user not found in credentials");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load user data");
      }
    };

    loadUserData();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user_credentials" || e.key === "user_session") {
        loadUserData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleWalletPhrasesVisibility = () => {
    setShowWalletPhrases(!showWalletPhrases);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // Validate inputs
      if (!userName.trim()) throw new Error("Username is required");
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Please enter a valid email");
      }

      // Get current user session
      const userSession = localStorage.getItem("user_session");
      if (!userSession) {
        throw new Error("No active user session");
      }

      const session = JSON.parse(userSession);
      const currentEmail = session.email;

      // Get user credentials
      const userCredentials = localStorage.getItem("user_credentials");
      if (!userCredentials) {
        throw new Error("No user credentials found");
      }

      const users = JSON.parse(userCredentials) as Array<{
        email: string;
        username: string;
        password: string;
        walletPhrases?: string;
      }>;

      // Find and update the current user
      const userIndex = users.findIndex((user) => user.email === currentEmail);
      if (userIndex === -1) {
        throw new Error("Current user not found");
      }

      // Update user data
      users[userIndex] = {
        ...users[userIndex],
        username: userName.trim(),
        email: email.trim(),
        password: newPassword || users[userIndex].password,
        walletPhrases: walletPhrases || undefined,
      };

      // Save updated credentials
      localStorage.setItem("user_credentials", JSON.stringify(users));

      // Update session if username changed
      if (userName.trim() !== session.username) {
        const updatedSession = {
          ...session,
          username: userName.trim(),
          email: email.trim(),
        };
        localStorage.setItem("user_session", JSON.stringify(updatedSession));
      }

      toast.success("Changes saved successfully");
    } catch (error: unknown) {
      console.error("Error saving user settings:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save changes";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-w-auto justify-center p-5 min-h-screen  text-[#ffffff] ">
      <div className="max-w-4xl mx-auto m-10 p-6 border rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 ">
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
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

        {/* Avatar + Info */}
        <div className="flex items-center gap-6 mb-10 flex-col sm:flex-row">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-600">
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl font-bold uppercase text-black">
              {userName.slice(0, 2)}
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold capitalize">{userName}</h2>
            <p className="text-gray-200 tracking-widest">{email}</p>

            {/* Password Toggle in Avatar + Info */}
            <div className="flex items-center gap-2 mt-3">
              <Lock className="text-red-500 h-4 w-4" />
              <div className="flex-1">
                <label className="text-gray-200 font-semibold text-sm">
                  Password
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-transparent border-b border-gray-500 focus:outline-none text-white font-bold py-1 text-sm w-32"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="text-gray-200 hover:text-white"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Wallet Phrases in Rows and Columns */}
            {walletPhrases && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="text-green-500 h-4 w-4" />
                  <label className="text-gray-200 font-semibold text-sm">
                    Wallet Phrases
                  </label>
                  <button
                    type="button"
                    onClick={toggleWalletPhrasesVisibility}
                    className="text-gray-200 hover:text-white"
                  >
                    {showWalletPhrases ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </button>
                </div>
                {showWalletPhrases ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-w-md">
                    {walletPhrases.split(" ").map((word, index) => (
                      <div
                        key={index}
                        className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-center"
                      >
                        {word}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-w-md">
                    {Array.from({
                      length: Math.min(12, walletPhrases.split(" ").length),
                    }).map((_, index) => (
                      <div
                        key={index}
                        className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-center"
                      >
                        ••••
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Editable Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Username Input */}
          <div className="hover:dark:bg-[rgba(255,255,255,0.05)] p-6 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 p-4 rounded-full">
                <User className="text-blue-500 text-2xl" />
              </div>
              <div className="flex flex-col w-full">
                <label className="text-gray-200 font-semibold mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="bg-transparent border-b border-gray-200 focus:outline-none text-white font-bold py-1"
                  placeholder="Enter username"
                />
              </div>
            </div>
          </div>

          {/* Email Input */}
          <div className="hover:dark:bg-[rgba(255,255,255,0.05)] p-6 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-4 rounded-full">
                <Mail className="text-red-500 text-2xl" />
              </div>
              <div className="flex flex-col w-full">
                <label className="text-gray-200 font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-b border-gray-200 focus:outline-none text-white font-bold py-1"
                  placeholder="Enter email"
                />
              </div>
            </div>
          </div>

          {/* New Password */}
          <div className="hover:dark:bg-[rgba(255,255,255,0.05)] p-6 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-4 rounded-full">
                <Lock className="text-red-500 text-2xl" />
              </div>
              <div className="flex flex-col w-full">
                <label className="text-gray-200 font-semibold mb-1">
                  New Password
                </label>
                <div className="flex items-center">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-transparent border-b border-gray-500 focus:outline-none text-white font-bold py-1 flex-1"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="text-gray-200 hover:text-white ml-2"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Phrases Input */}
          <div className="hover:dark:bg-[rgba(255,255,255,0.05)] p-6 border rounded-lg md:col-span-2">
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 p-4 rounded-full">
                <Wallet className="text-green-500 text-2xl" />
              </div>
              <div className="flex flex-col w-full">
                <label className="text-gray-200 font-semibold mb-1">
                  Wallet Phrases
                </label>
                <textarea
                  value={walletPhrases}
                  onChange={(e) => setWalletPhrases(e.target.value)}
                  className="bg-transparent border-b border-gray-500 focus:outline-none text-white font-bold py-1 resize-none"
                  placeholder="Enter wallet phrases (optional)"
                  rows={2}
                />
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
    </div>
  );
}
