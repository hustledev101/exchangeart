"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaInfoCircle } from "react-icons/fa";

const MintPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [artist, setArtist] = useState("");
  const [category, setCategory] = useState("Digital Art");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [selectedCurrency, setSelectedCurrency] = useState<
    "ETH" | "SOL" | "BTC" | "USDT" | "TRX"
  >("ETH");
  const [balances, setBalances] = useState<Record<string, number>>({
    USDT: 0,
    ETH: 0,
    BTC: 0,
    SOL: 0,
    TRX: 0,
  });
  const [currencyRates, setCurrencyRates] = useState({
    ETH: 3000.0,
    SOL: 150.0,
    BTC: 45000.0,
    USDT: 1.0,
    TRX: 0.1,
  });

  const coinLogos = {
    ETH: "/assets/cryptologos/eth.png",
    BTC: "/assets/cryptologos/btc.png",
    SOL: "/assets/cryptologos/sol.png",
    USDT: "/assets/cryptologos/usdt.png",
    TRX: "/assets/cryptologos/trx.png",
  };

  // Fetch currency rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tether,tron&vs_currencies=usd"
        );
        const data = await response.json();

        setCurrencyRates({
          ETH: data.ethereum.usd,
          SOL: data.solana.usd,
          BTC: data.bitcoin.usd,
          USDT: data.tether.usd,
          TRX: data.tron.usd,
        });
      } catch (error) {
        console.error("Error fetching currency rates:", error);
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 30000);
    return () => clearInterval(interval);
  }, []);

  // Load balances from local storage with user email
  useEffect(() => {
    const loadBalances = () => {
      try {
        const userEmail = localStorage.getItem("user_session")
          ? JSON.parse(localStorage.getItem("user_session") || "{}").email
          : "default_user";

        const balanceKey = `userBalances_${userEmail}`;
        const storedBalances = localStorage.getItem(balanceKey);

        if (storedBalances) {
          const parsedBalances = JSON.parse(storedBalances);
          setBalances(parsedBalances);
        } else {
          // Initialize with empty balances if none exist
          const initialBalances = {
            USDT: 0,
            ETH: 0,
            BTC: 0,
            SOL: 0,
            TRX: 0,
          };
          setBalances(initialBalances);
          localStorage.setItem(balanceKey, JSON.stringify(initialBalances));
        }
      } catch (error) {
        console.error("Error loading balances from localStorage:", error);
        setBalances({
          USDT: 0,
          ETH: 0,
          BTC: 0,
          SOL: 0,
          TRX: 0,
        });
      }
    };

    loadBalances();

    // Listen for balance updates
    const handleStorageChange = () => {
      loadBalances();
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom balance update events
    const handleBalanceUpdate = () => {
      loadBalances();
    };

    window.addEventListener("balanceUpdated", handleBalanceUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("balanceUpdated", handleBalanceUpdate);
    };
  }, []);

  // Update userBalance when selectedCurrency or balances change
  useEffect(() => {
    setUserBalance(balances[selectedCurrency] || 0);
  }, [selectedCurrency, balances]);

  // Calculate gas fee in USD
  const getGasFee = () => {
    return price ? Number(price) * 0.1 : 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const deductGasFee = (gasFeeInSelectedCurrency: number) => {
    try {
      const userEmail = localStorage.getItem("user_session")
        ? JSON.parse(localStorage.getItem("user_session") || "{}").email
        : "default_user";

      const balanceKey = `userBalances_${userEmail}`;
      const storedBalances = localStorage.getItem(balanceKey);

      if (storedBalances) {
        const currentBalances = JSON.parse(storedBalances);
        const currentBalance = currentBalances[selectedCurrency] || 0;

        // Deduct the gas fee
        const newBalance = Math.max(
          0,
          currentBalance - gasFeeInSelectedCurrency
        );

        // Update the balance
        const updatedBalances = {
          ...currentBalances,
          [selectedCurrency]: newBalance,
        };

        // Save back to localStorage
        localStorage.setItem(balanceKey, JSON.stringify(updatedBalances));

        // Update local state
        setBalances(updatedBalances);

        // Trigger balance update event
        window.dispatchEvent(
          new CustomEvent("balanceUpdated", {
            detail: {
              userId: userEmail,
              currency: selectedCurrency,
              amount: -gasFeeInSelectedCurrency,
              transactionType: "gas_fee",
              timestamp: Date.now(),
            },
          })
        );

        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deducting gas fee:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    const gasFee = getGasFee();
    const gasFeeInSelectedCurrency = gasFee / currencyRates[selectedCurrency];

    if (userBalance < gasFeeInSelectedCurrency) {
      toast.error(`Insufficient ${selectedCurrency} for gas fee`);
      return;
    }

    try {
      // Get current user ID
      const userSession = localStorage.getItem("user_session");
      const userId = userSession
        ? JSON.parse(userSession).username ||
          JSON.parse(userSession).email ||
          "guest"
        : "guest";

      let toastDelay = 0;

      // Show loading state
      setTimeout(() => toast.info("Processing gas fee..."), toastDelay);
      toastDelay += 1000;

      // Deduct gas fee from user balance
      const deductionSuccess = deductGasFee(gasFeeInSelectedCurrency);

      if (!deductionSuccess) {
        toast.error("Failed to process gas fee. Please try again.");
        return;
      }

      setTimeout(
        () => toast.info("Minting Successful. Uploading artwork..."),
        toastDelay
      );
      toastDelay += 1000;

      // Convert file to base64 for localStorage
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Image = event.target?.result as string;

        // Calculate converted price in selected currency
        const convertedPrice =
          selectedCurrency === "USDT"
            ? Math.ceil(Number(price) / currencyRates[selectedCurrency])
            : Number(price) / currencyRates[selectedCurrency];

        // Create artwork object matching collections structure
        const newArtwork = {
          id: Date.now(), // Simple unique ID
          title,
          description,
          price: `${
            selectedCurrency === "USDT"
              ? convertedPrice.toFixed(0)
              : convertedPrice.toFixed(6)
          } ${selectedCurrency}`,
          originalPrice: `$${price}`,
          category,
          image: base64Image,
          uploadedAt: new Date().toISOString(),
          userId: userId,
          gasFee: {
            amount: gasFeeInSelectedCurrency,
            currency: selectedCurrency,
            usdValue: gasFee,
          },
          conversionRate: currencyRates[selectedCurrency],
        };

        // Get existing artworks from localStorage
        const existingArtworks = localStorage.getItem("allUserArtworks");
        const artworks = existingArtworks ? JSON.parse(existingArtworks) : [];

        // Add new artwork
        artworks.unshift(newArtwork); // Add to beginning for newest first

        // Save to localStorage
        localStorage.setItem("allUserArtworks", JSON.stringify(artworks));

        console.log("Artwork saved to localStorage:", newArtwork);
        setTimeout(
          () => toast.success("Artwork uploaded to Gallery."),
          toastDelay
        );

        // Reset form
        setTitle("");
        setDescription("");
        setArtist("");
        setPrice("");
        setCategory("Digital Art");
        setFile(null);
        setPreview(null);

        // Trigger storage event for collections page to update
        window.dispatchEvent(new Event("storage"));

        // Optional: Redirect to collections page after successful upload
        setTimeout(() => {
          window.location.href = "/user/gallery";
        }, 2000);
      };

      reader.onerror = () => {
        toast.error("Error reading file. Please try again.");
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error saving artwork:", error);
      toast.error("Failed to save artwork. Please try again.");
    }
  };

  return (
    <div className="text-gray-50 space-y-6 m-5 p-4 border rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
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

      <h1 className="text-3xl font-bold mb-6">Mint Arts to NFTs</h1>
      <div>
        {/* Balance Display - Same as deposit page */}
        <div className="mb-6 ">
          <h3 className="text-lg font-bold mb-4">Your Balances</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              {
                title: "USDT",
                amount: (balances.USDT || 0).toFixed(2),
                value: ((balances.USDT || 0) * currencyRates.USDT).toFixed(2),
                logo: coinLogos.USDT,
              },
              {
                title: "ETH",
                amount: (balances.ETH || 0).toFixed(4),
                value: ((balances.ETH || 0) * currencyRates.ETH).toFixed(2),
                logo: coinLogos.ETH,
              },
              {
                title: "BTC",
                amount: (balances.BTC || 0).toFixed(6),
                value: ((balances.BTC || 0) * currencyRates.BTC).toFixed(2),
                logo: coinLogos.BTC,
              },
              {
                title: "SOL",
                amount: (balances.SOL || 0).toFixed(2),
                value: ((balances.SOL || 0) * currencyRates.SOL).toFixed(2),
                logo: coinLogos.SOL,
              },
              {
                title: "TRX",
                amount: (balances.TRX || 0).toFixed(2),
                value: ((balances.TRX || 0) * currencyRates.TRX).toFixed(2),
                logo: coinLogos.TRX,
              },
            ].map((stat, index) => {
              const hoverColors = [
                {
                  shadow: "hover:shadow-blue-500/20",
                  border: "hover:border-blue-500/50",
                  text: "group-hover:text-blue-400",
                },
                {
                  shadow: "hover:shadow-green-500/20",
                  border: "hover:border-green-500/50",
                  text: "group-hover:text-green-400",
                },
                {
                  shadow: "hover:shadow-orange-500/20",
                  border: "hover:border-orange-500/50",
                  text: "group-hover:text-orange-400",
                },
                {
                  shadow: "hover:shadow-purple-500/20",
                  border: "hover:border-purple-500/50",
                  text: "group-hover:text-purple-400",
                },
              ];
              const color = hoverColors[index % hoverColors.length];
              return (
                <Card
                  key={index}
                  className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50
                     backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl ${color.shadow} ${color.border} group cursor-pointer`}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-100">
                      {stat.title}
                    </CardTitle>
                    <Image
                      src={stat.logo}
                      alt={stat.title}
                      width={16}
                      height={16}
                      className="h-4 w-4 rounded-full transition-transform duration-300 group-hover:scale-110"
                    />
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`text-lg font-bold text-white transition-colors duration-300 ${color.text}`}
                    >
                      {stat.amount}
                    </div>
                    <p className="text-xs text-slate-200 mt-2">
                      ≈ ${stat.value} USD
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <div className="gap-6 items-start">
        {/* Upload Form */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Upload Your Artwork</h2>
            {/* Category */}
            <div className="mb-4">
              <label className="block font-bold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border bg-[#2A2B35] text-white rounded"
              >
                <option value="Collectibles">Collectibles</option>
                <option value="Digital Art">Digital Art</option>
                <option value="Drawing">Drawing</option>
                <option value="Painting">Painting</option>
                <option value="Photography">Photography</option>
              </select>
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="block font-bold mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter artwork title"
                className="w-full px-4 py-2 border rounded bg-[#2A2B35] text-white"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block font-bold mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter artwork description"
                rows={4}
                className="w-full px-4 py-2 border rounded bg-[#2A2B35] text-white"
                required
              />
            </div>
            {/* Artist */}
            <div className="mb-4">
              <label className="block font-bold mb-1">Name of Artist</label>
              <textarea
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Enter you name"
                rows={4}
                className="w-full px-4 py-2 border rounded bg-[#2A2B35] text-white"
                required
              />
            </div>
            {/* Currency Selection */}
            <div className="mb-4">
              <label className="block font-bold mb-1">Currency</label>
              <select
                value={selectedCurrency}
                onChange={(e) =>
                  setSelectedCurrency(
                    e.target.value as "ETH" | "SOL" | "BTC" | "USDT" | "TRX"
                  )
                }
                className="w-full px-4 py-2 border bg-[#2A2B35] text-white rounded"
              >
                <option value="ETH">Ethereum (ETH)</option>
                <option value="SOL">Solana (SOL)</option>
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="USDT">Tether (USDT ERC20)</option>
                <option value="TRX">Tron (TRX)</option>
              </select>
            </div>

            {/* Price in USD */}
            <div className="mb-4">
              <label className="block font-bold mb-1">Price</label>

              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="$"
                className="w-full px-4 py-2 border rounded bg-[#2A2B35] text-white"
                required
              />
              <p className="text-sm mt-2">
                <span className="font-bold">Converted Sale Price:</span>{" "}
                <span className=" text-green-500 hover:underline">
                  {price && currencyRates[selectedCurrency]
                    ? selectedCurrency === "USDT"
                      ? Math.ceil(
                          Number(price) / currencyRates[selectedCurrency]
                        ).toFixed(0)
                      : (
                          Number(price) / currencyRates[selectedCurrency]
                        ).toFixed(6)
                    : "0"}{" "}
                  {selectedCurrency}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-bold">Network Fee(Gas Fee):</span>{" "}
                <span className="text-red-500 hover:underline">
                  {price && currencyRates[selectedCurrency]
                    ? selectedCurrency === "USDT"
                      ? Math.ceil(
                          getGasFee() / currencyRates[selectedCurrency]
                        ).toFixed(0)
                      : (getGasFee() / currencyRates[selectedCurrency]).toFixed(
                          6
                        )
                    : "0"}{" "}
                  {selectedCurrency}
                </span>
              </p>
              <div className="p-1 mt-2 flex text-sm bg-yellow-900 rounded">
                <FaInfoCircle size={20} className="text-yellow-500 mr-1" />
                <p>
                  This fee covers blockchain minting and decentralised storage.
                </p>
              </div>
            </div>
            {/* File Upload */}
            <div className="mb-4">
              <label className="block font-bold mb-1">Upload File</label>
              <input
                type="file"
                accept="image/*,video/*,audio/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border bg-[#2A2B35] text-white rounded"
                required
              />
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full font-bold py-3 rounded ${
                userBalance < getGasFee() / currencyRates[selectedCurrency]
                  ? "bg-gray-600 cursor-not-allowed text-gray-400"
                  : "bg-blue-900 hover:bg-blue-800 text-white"
              }`}
              disabled={
                userBalance < getGasFee() / currencyRates[selectedCurrency]
              }
            >
              {userBalance < getGasFee() / currencyRates[selectedCurrency]
                ? `Insufficient ${selectedCurrency} for gas fee. Make a deposit to your wallet`
                : "Upload Artwork"}
            </button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="bg-[#2A2B35] p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Preview</h2>
          {preview ? (
            <div>
              <h3 className="text-lg font-bold mb-2">{title || "Untitled"}</h3>
              <Image
                width={50}
                height={50}
                src={preview}
                alt="Preview"
                className="w-50 rounded mb-4"
              />
              <p className="text-sm">{description || "No description"}</p>
              <p className="text-lg font-bold mt-2">
                {price && currencyRates[selectedCurrency]
                  ? selectedCurrency === "USDT"
                    ? Math.ceil(
                        Number(price) / currencyRates[selectedCurrency]
                      ).toFixed(0)
                    : (Number(price) / currencyRates[selectedCurrency]).toFixed(
                        6
                      )
                  : "0"}{" "}
                {selectedCurrency}
              </p>
            </div>
          ) : (
            <p className="text-gray-400">Upload an artwork to see preview</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MintPage;
