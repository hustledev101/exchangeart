"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaTrash } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Artwork {
  id: number;
  title: string;
  description: string;
  price: string;
  category: string;
  image: string;
  uploadedAt: string;
  userId: string;
  sold?: boolean;
  uploadedToMarketplace?: boolean;
}

interface Auction {
  id: number;
  title: string;
  artist: string;
  image: string;
  reserve: string;
  category: string;
  description: string;
}

const GalleryPage: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [currencyRates, setCurrencyRates] = useState({
    ETH: 3000.0,
    SOL: 150.0,
    BTC: 45000.0,
    USDT: 1.0,
    TRX: 0.1,
  });

  useEffect(() => {
    // Get current user name from signup data
    const userSession = localStorage.getItem("user_session");
    const userId = userSession
      ? JSON.parse(userSession).username ||
        JSON.parse(userSession).email ||
        "guest"
      : "guest";

    setCurrentUserId(userId);

    // Load user-specific artworks
    const loadUserArtworks = () => {
      const allArtworks = localStorage.getItem("allUserArtworks");
      if (allArtworks) {
        const artworksData = JSON.parse(allArtworks);
        const userArtworks = artworksData.filter(
          (artwork: Artwork) => artwork.userId === userId
        );
        setArtworks(userArtworks);
      }
    };

    loadUserArtworks();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadUserArtworks();
    };

    // Listen for gallery updates
    const handleGalleryUpdate = () => {
      loadUserArtworks();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("galleryUpdated", handleGalleryUpdate);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("galleryUpdated", handleGalleryUpdate);
    };
  }, []);

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

  const parsePrice = (priceStr: string) => {
    const parts = priceStr.split(" ");
    if (parts.length !== 2) return null;
    const amount = parseFloat(parts[0]);
    const currency = parts[1];
    if (isNaN(amount)) return null;
    return { amount, currency };
  };

  const getUSDPrice = (priceStr: string) => {
    const parsed = parsePrice(priceStr);
    if (!parsed) return null;
    const { amount, currency } = parsed;
    const rate = currencyRates[currency as keyof typeof currencyRates];
    if (!rate) return null;
    return amount * rate;
  };

  const handleDelete = (id: number) => {
    const allArtworks = localStorage.getItem("allUserArtworks");
    if (allArtworks) {
      const artworksData = JSON.parse(allArtworks);
      const updatedArtworks = artworksData.filter(
        (artwork: Artwork) => artwork.id !== id
      );
      localStorage.setItem("allUserArtworks", JSON.stringify(updatedArtworks));

      const userArtworks = updatedArtworks.filter(
        (artwork: Artwork) => artwork.userId === currentUserId
      );
      setArtworks(userArtworks);
    }
  };

  const handleUploadToMarketplace = (artwork: Artwork) => {
    if (artwork.uploadedToMarketplace) {
      toast.info("This artwork is already uploaded to the marketplace");
      return;
    }

    const newAuction: Auction = {
      id: artwork.id, // Use artwork.id to avoid duplicates
      title: artwork.title,
      artist: artwork.userId,
      image: artwork.image,
      reserve: artwork.price,
      category: artwork.category,
      description: artwork.description,
    };

    const marketplaceArtworks = localStorage.getItem("marketplaceArtworks");
    let marketplaceItems: Auction[] = [];
    if (marketplaceArtworks) {
      try {
        marketplaceItems = JSON.parse(marketplaceArtworks);
      } catch (error) {
        console.error(
          "Failed to parse marketplace artworks from localStorage",
          error
        );
      }
    }

    // Check if already exists
    const exists = marketplaceItems.some((item) => item.id === artwork.id);
    if (!exists) {
      marketplaceItems.push(newAuction);
      localStorage.setItem(
        "marketplaceArtworks",
        JSON.stringify(marketplaceItems)
      );
    }

    // Update the artwork in allUserArtworks with uploaded flag
    const allArtworks = localStorage.getItem("allUserArtworks");
    if (allArtworks) {
      const artworksData = JSON.parse(allArtworks);
      const updatedArtworks = artworksData.map((a: Artwork) =>
        a.id === artwork.id ? { ...a, uploadedToMarketplace: true } : a
      );
      localStorage.setItem("allUserArtworks", JSON.stringify(updatedArtworks));

      // Update local state
      const userArtworks = updatedArtworks.filter(
        (a: Artwork) => a.userId === currentUserId
      );
      setArtworks(userArtworks);
    }

    toast.success("Your artwork is now available on the marketplace");
    // Dispatch event to notify other components of update
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("galleryUpdated"));
  };

  return (
    <div className="min-h-screen p-6 ">
      <div className="max-w-7xl mx-auto border rounded-2xl p-10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 ">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            My Collections
          </h1>
          <p className="text-slate-50">Manage your digital artworks</p>
        </div>

        <div className="mb-6 text-sm text-slate-300 bg-slate-800/50 rounded-lg p-3 inline-block">
          User: <span className="font-medium text-white">{currentUserId}</span>
        </div>

        {artworks.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-700 to-slate-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                No artworks yet
              </h2>
              <p className="text-slate-50 mb-8">
                Start your collection by uploading your first artwork
              </p>
              <a
                href="/user/mint"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Upload Your First Artwork
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {artworks.map((artwork) => (
              <div
                key={artwork.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-700/50 group"
              >
                <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-slate-700 to-slate-600">
                  <Image
                    src={artwork.image}
                    alt={artwork.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {artwork.sold && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white text-xl font-bold bg-red-600 px-4 py-2 rounded-full">
                        SOLD
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                    {artwork.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                    {artwork.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded-full">
                      {artwork.category}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-green-400">
                      {artwork.price}
                    </span>
                    {getUSDPrice(artwork.price) && (
                      <span className="text-xs text-slate-400">
                        ≈ ${getUSDPrice(artwork.price)?.toFixed(2)} USD
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    {new Date(artwork.uploadedAt).toLocaleDateString()}
                  </p>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleDelete(artwork.id)}
                      className="flex items-center justify-center w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={artwork.sold}
                    >
                      <FaTrash className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                    {!artwork.sold && !artwork.uploadedToMarketplace && (
                      <button
                        onClick={() => handleUploadToMarketplace(artwork)}
                        className="flex items-center justify-center w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-[#6172F3] hover:from-indigo-700 hover:to-[#6172F3] text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105"
                      >
                        Upload
                      </button>
                    )}
                    {artwork.uploadedToMarketplace && (
                      <div className="flex items-center justify-center w-full py-2 px-4 bg-green-600/20 text-green-400 font-semibold rounded-xl border border-green-600/30">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        On Marketplace
                      </div>
                    )}
                    {artwork.sold && (
                      <div className="flex items-center justify-center w-full py-2 px-4 bg-green-600/20 text-green-400 font-semibold rounded-xl border border-green-600/30">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Sold
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer
        position="bottom-right"
        theme="dark"
        toastClassName="bg-slate-800 border border-slate-700"
      />
    </div>
  );
};

export default GalleryPage;
