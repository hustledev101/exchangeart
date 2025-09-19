"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Auction {
  id: number;
  title: string;
  artist: string;
  image: string;
  reserve: string;
  category: string;
  description: string;
}

const auctions: Auction[] = [
  {
    id: 1,
    title: "Cuckfella I",
    artist: "@ritz.jsinan",
    image: "/assets/trendingauctions/Cuckfella.jpg",
    reserve: "1 SOL",
    category: "Digital Art",
    description:
      "A rare collectible piece featuring unique digital craftsmanship.",
  },
  {
    id: 2,
    title: "try",
    artist: "@TolgaMeric",
    image: "/assets/trendingauctions/try.jpg",
    reserve: "1 SOL",
    category: "Digital Art",
    description: "A vibrant digital artwork exploring abstract forms.",
  },
  {
    id: 3,
    title: "Pam",
    artist: "@Damian Scott",
    image: "/assets/trendingauctions/pam.jpg",
    reserve: "0.25 SOL",
    category: "Painting",
    description: "A detailed hand-drawn sketch with intricate patterns.",
  },
  {
    id: 4,
    title: "A Man from Paradise",
    artist: "@Anahiz",
    image: "/assets/trendingauctions/paradise.jpeg",
    reserve: "1 SOL",
    category: "Painting",
    description: "A colorful painting capturing a serene paradise scene.",
  },
  {
    id: 5,
    title: "Elixir",
    artist: "@Pigment",
    image: "/assets/trendingauctions/elixir.jpg",
    reserve: "0.8 SOL",
    category: "Digital Art",
    description: "A mesmerizing digital creation with fluid colors.",
  },
  {
    id: 6,
    title: "The Embrace of Shadows",
    artist: "@Jay Voss",
    image: "/assets/trendingauctions/shawdow.jpg",
    reserve: "1.2 SOL",
    category: "Photography",
    description: "A striking photograph capturing light and shadow interplay.",
  },
  {
    id: 7,
    title: "DrakoChain",
    artist: "@sartikadebora",
    image: "/assets/trendingauctions/darko.jpg",
    reserve: "0.26 SOL",
    category: "Collectibles",
    description: "A unique blockchain-inspired collectible artwork.",
  },
  {
    id: 8,
    title: "blue sky",
    artist: "@kunstbube",
    image: "/assets/trendingauctions/bluesky.jpg",
    reserve: "2 SOL",
    category: "Painting",
    description: "A calming painting of an expansive blue sky.",
  },
];

export default function TrendingAuctions() {
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleImageClick = (auction: Auction) => {
    setSelectedAuction(auction);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedAuction(null);
  };

  const handleBuyClick = () => {
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen p-6 py-12 px-5">
      <h2 className="text-4xl font-medium text-center mb-10">
        Trending Auctions
      </h2>

      {/* Mobile view: horizontal scrolling */}
      <div className="sm:hidden overflow-x-auto whitespace-nowrap pb-4 -mx-2 px-2">
        {auctions.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.25)] 
            dark:shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-sm
            dark:bg-[rgba(255,255,255,0.05)] dark:border-[rgba(255,255,255,0.05)]
            hover:dark:bg-[rgba(255,255,255,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]
            cursor-pointer transition-all duration-300 inline-block w-64 mr-4 border"
          >
            <div className="h-90 w-full relative bg-gradient-to-br from-transparent to-transparent">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-contain justify-center rounded-t-2xl p-5 cursor-pointer"
                loading="lazy"
                onClick={() => handleImageClick(item)}
              />
            </div>
            <div className="p-4  bg-gray-950">
              <h4 className="text-lg font-semibold truncate text-white">
                {item.title}
              </h4>
              <p className="text-sm text-gray-400 mb-2 truncate">
                {item.artist}
              </p>
              <div className="border-t border-gray-600 dark:border-[rgba(255,255,255,0.1)] pt-3 flex flex-col gap-1 text-sm">
                <p className="text-gray-300">
                  <span className="text-gray-400">Price:</span> {item.reserve}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop view: grid layout */}
      <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {auctions.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.25)] 
            dark:shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-sm
            dark:bg-[rgba(255,255,255,0.05)] dark:border-[rgba(255,255,255,0.05)]
            hover:dark:bg-[rgba(255,255,255,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]
            cursor-pointer transition-all duration-300 border group"
          >
            <div className="h-80 w-full relative bg-gradient-to-br from-transparent to-transparent">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-contain justify-center rounded-t-2xl p-5 group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                loading="lazy"
                onClick={() => handleImageClick(item)}
              />
            </div>
            <div className="p-4 bg-gray-950">
              <h4 className="text-lg font-semibold truncate text-white">
                {item.title}
              </h4>
              <p className="text-sm text-gray-400 mb-2 truncate">
                {item.artist}
              </p>
              <div className="border-t  border-gray-600 dark:border-[rgba(255,255,255,0.1)] pt-3 flex flex-col gap-1 text-sm">
                <p className="text-gray-300">
                  <span className="text-gray-400">Price:</span> {item.reserve}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center"></div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/collections"
          className="flex space-x-2 text-white
             hover:text-gray-300 text-sm sm:text-base bg-gradient-to-b bg-[#6172F3] 
             focus:bg-indigo-700 font-semibold gap-1.5 group h-[50px] 
             hover:bg-indigo-500 items-center justify-center px-5 py-4 relative rounded-[15px]  
               shadow-buttonShadow text-body-md text-center to-transparent"
        >
          View all ongoing auctions
        </Link>
      </div>

      {/* Auction Detail Dialog */}
      {isDialogOpen && selectedAuction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
          <div className="bg-[#1A1C2B] border border-gray-700 rounded-2xl p-10 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Close button */}
              <button
                onClick={handleCloseDialog}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Auction Image */}
              <div className="relative h-80 sm:h-96">
                <Image
                  src={selectedAuction.image}
                  alt={selectedAuction.title}
                  fill
                  className="object-contain rounded-t-2xl"
                />
              </div>
            </div>

            <div className="p-6">
              {/* Auction Details */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">
                  {selectedAuction.title}
                </h2>
                <p className="text-gray-300">by {selectedAuction.artist}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Reserve Price:</span>
                    <p className="text-white font-medium">
                      {selectedAuction.reserve}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Category:</span>
                    <p className="text-white font-medium">
                      {selectedAuction.category}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400">Description:</span>
                  <p className="text-white mt-1">
                    {selectedAuction.description}
                  </p>
                </div>
              </div>

              {/* Buy Button */}
              <div className="mt-6">
                <button
                  onClick={handleBuyClick}
                  className="w-full bg-gradient-to-b from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 
                           text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
