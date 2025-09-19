"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface WalletData {
  eth: { address: string; image: string | null };
  btc: { address: string; image: string | null };
  usdt: { address: string; image: string | null };
  sol: { address: string; image: string | null };
  trx: { address: string; image: string | null };
}

const initialWallets: WalletData = {
  eth: { address: "", image: null },
  btc: { address: "", image: null },
  usdt: { address: "", image: null },
  sol: { address: "", image: null },
  trx: { address: "", image: null },
};

const AdminWalletPage: React.FC = () => {
  const [wallets, setWallets] = useState<WalletData>(initialWallets);
  const [loading, setLoading] = useState(false);

  // Fetch existing wallet data from localStorage on mount
  useEffect(() => {
    const fetchDefaultWallets = () => {
      try {
        const storedWallets = localStorage.getItem("adminWallets");
        if (storedWallets) {
          const parsedWallets = JSON.parse(storedWallets);
          setWallets(parsedWallets);
        }
      } catch (error) {
        console.error(
          "Error fetching default wallets from localStorage:",
          error
        );
        toast.error("Failed to load wallet information");
      }
    };

    fetchDefaultWallets();
  }, []);

  const handleAddressChange =
    (currency: keyof WalletData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setWallets((prev) => ({
        ...prev,
        [currency]: { ...prev[currency], address: e.target.value },
      }));
    };

  const handleImageUpload =
    (currency: keyof WalletData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Image size must be under 5MB");
          return;
        }
        if (!["image/png", "image/jpeg"].includes(file.type)) {
          toast.error("Only PNG or JPEG images are allowed");
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setWallets((prev) => ({
            ...prev,
            [currency]: { ...prev[currency], image: reader.result as string },
          }));
        };
        reader.readAsDataURL(file);
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save wallet data to localStorage
      localStorage.setItem("adminWallets", JSON.stringify(wallets));
      toast.success("Default wallets updated successfully!");
    } catch (error) {
      console.error("Error saving default wallets to localStorage:", error);
      toast.error("Failed to save wallet information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-gray-50 space-y-6 m-5 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 border p-6 rounded-2xl">
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
      <h1 className="text-2xl font-bold mb-4">Admin Wallet Management</h1>
      <p className="mb-4">
        Set default wallet addresses and barcode images for ETH, BTC, USDT, SOL,
        and TRX. These will apply to all users.
      </p>
      <form onSubmit={handleSubmit}>
        {Object.keys(wallets).map((currency) => (
          <div key={currency} className="mb-6 border-b pb-4">
            <h2 className="text-xl font-semibold mb-2">
              {currency.toUpperCase()} Wallet
            </h2>
            <div className="mb-2">
              <label
                htmlFor={`${currency}-address`}
                className="block text-sm font-medium"
              >
                Address
              </label>
              <input
                type="text"
                id={`${currency}-address`}
                value={wallets[currency as keyof WalletData].address}
                onChange={handleAddressChange(currency as keyof WalletData)}
                className="mt-1 block w-full border border-gray-600 rounded-md p-2"
                placeholder={`Enter ${currency.toUpperCase()} address`}
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor={`${currency}-image`}
                className="block text-sm font-medium"
              >
                Upload Barcode Image
              </label>
              <input
                type="file"
                id={`${currency}-image`}
                accept="image/png,image/jpeg"
                onChange={handleImageUpload(currency as keyof WalletData)}
                className="mt-1 block w-full"
              />
              {wallets[currency as keyof WalletData].image && (
                <Image
                  height={100}
                  width={100}
                  src={wallets[currency as keyof WalletData].image!}
                  alt={`${currency.toUpperCase()} barcode`}
                  className="mt-2 object-contain"
                />
              )}
            </div>
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600"
        >
          {loading ? "Saving..." : "Save Defaults"}
        </button>
      </form>
    </div>
  );
};

export default AdminWalletPage;
