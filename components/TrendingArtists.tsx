"use client";

import { useState } from "react";
import Image from "next/image";

const timeframes = ["24h", "7d", "30d", "All time"];

const artistsData = {
  "24h": [
    {
      rank: 1,
      name: "BOOGLE",
      volume: "$189,798.78",
      image: "/assets/trendingartist/boogle.jpeg",
    },
    {
      rank: 2,
      name: "Crypto Creator",
      volume: "$142,622.89",
      image: "/assets/trendingartist/user.png",
    },
    {
      rank: 3,
      name: "Degen Poet",
      volume: "$90,059.38",
      image: "/assets/trendingartist/degen.jpeg",
    },
    {
      rank: 4,
      name: "SCUM",
      volume: "$71,488.26",
      image: "/assets/trendingartist/scum.png",
    },
    {
      rank: 5,
      name: "BONK Galleries",
      volume: "$62,449.81",
      image: "/assets/trendingartist/bonk.png",
    },
  ],
  "7d": [
    {
      rank: 1,
      name: "Digital Dreamer",
      volume: "$849,798.78",
      image: "/assets/trendingartist/user.png",
    },
    {
      rank: 2,
      name: "BOOGLE",
      volume: "$725,622.89",
      image: "/assets/trendingartist/boogle.jpeg",
    },
    {
      rank: 3,
      name: "Pixel Pioneer",
      volume: "$590,059.38",
      image: "/assets/trendingartist/degen.jpeg",
    },
    {
      rank: 4,
      name: "SCUM",
      volume: "$417,488.26",
      image: "/assets/trendingartist/scum.png",
    },
    {
      rank: 5,
      name: "NFT Ninja",
      volume: "$321,449.81",
      image: "/assets/trendingartist/bonk.png",
    },
  ],
  "30d": [
    {
      rank: 1,
      name: "BOOGLE",
      volume: "$1,849,798.78",
      image: "/assets/trendingartist/boogle.jpeg",
    },
    {
      rank: 2,
      name: "John Le Studio",
      volume: "$1,425,622.89",
      image: "/assets/trendingartist/user.png",
    },
    {
      rank: 3,
      name: "Degen Poet",
      volume: "$790,059.38",
      image: "/assets/trendingartist/degen.jpeg",
    },
    {
      rank: 4,
      name: "SCUM",
      volume: "$717,488.26",
      image: "/assets/trendingartist/scum.png",
    },
    {
      rank: 5,
      name: "BONK Galleries",
      volume: "$621,449.81",
      image: "/assets/trendingartist/bonk.png",
    },
  ],
  "All time": [
    {
      rank: 1,
      name: "BOOGLE",
      volume: "$5,849,798.78",
      image: "/assets/trendingartist/boogle.jpeg",
    },
    {
      rank: 2,
      name: "Crypto King",
      volume: "$4,125,622.89",
      image: "/assets/trendingartist/user.png",
    },
    {
      rank: 3,
      name: "Digital Master",
      volume: "$3,790,059.38",
      image: "/assets/trendingartist/degen.jpeg",
    },
    {
      rank: 4,
      name: "SCUM",
      volume: "$2,917,488.26",
      image: "/assets/trendingartist/scum.png",
    },
    {
      rank: 5,
      name: "BONK Galleries",
      volume: "$2,621,449.81",
      image: "/assets/trendingartist/bonk.png",
    },
  ],
};

export default function TrendingArtists() {
  const [activeTab, setActiveTab] = useState("All time");
  const currentArtists = artistsData[activeTab as keyof typeof artistsData];

  return (
    <div className="dark:bg-gray-950 bg-white ">
      <div className="w-full px-4 py-10 max-w-7xl mx-auto ">
        <h2 className="text-4xl font-medium text-center mb-10">
          Trending Artist
        </h2>
        {/* Timeframe Tabs */}
        <div className="flex justify-center mb-10 space-x-2">
          {timeframes.map((tf) => (
            <button
              key={tf}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTab === tf
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab(tf)}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Large Screen Layout */}
        <div className="hidden lg:flex justify-between gap-4">
          {currentArtists.map((artist) => (
            <div
              key={`${activeTab}-${artist.rank}`}
              className="flex flex-col items-center p-6 border bg-[#F9FAFA] dark:bg-[#181A20] rounded-xl shadow-sm w-1/5"
            >
              <div className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded mb-3">
                #{artist.rank}
              </div>
              <div className="w-16 h-16 mb-4">
                <Image
                  src={artist.image}
                  alt={artist.name}
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg mb-1">{artist.name}</h3>
              <p className="text-gray-500 text-sm mb-3">Vol. {artist.volume}</p>
            </div>
          ))}
        </div>

        {/* Small & Medium Screen Layout */}
        <div className="lg:hidden space-y-3">
          {currentArtists.map((artist) => (
            <div
              key={`${activeTab}-${artist.rank}`}
              className="flex items-center justify-between bg-[#F9FAFA] dark:bg-[#181A20] p-4 rounded-xl shadow-sm"
            >
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  #{artist.rank}
                </div>
                <div className="w-10 h-10">
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold">{artist.name}</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm">{artist.volume}</p>
            </div>
          ))}
        </div>

        {/* View Leaderboard Link */}
        <div className="text-center mt-8">
          <a href="#" className="text-indigo-600 font-medium hover:underline">
            View Leaderboards &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
