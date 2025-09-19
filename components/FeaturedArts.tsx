"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface Artwork {
  id: number;
  title: string;
  artist: string;
  image: string;
  reserve: string;
  category: string;
  description: string;
}

const artworks: Artwork[] = [
  {
    id: 1,
    title: "Exo",
    artist: "@MRSPACESHIP",
    image: "/assets/featured/exo.jpeg",
    reserve: "1 SOL",
    category: "Digital Art",
    description: "A futuristic digital artwork exploring cosmic themes.",
  },
  {
    id: 2,
    title: '"Wrapped Up in You"',
    artist: "@Outsid3rs",
    image: "/assets/featured/wrapped.jpeg",
    reserve: "0.5 SOL",
    category: "Painting",
    description: "An emotional painting capturing the essence of connection.",
  },
  {
    id: 3,
    title: "Nebel #S11",
    artist: "@AnikaVondel",
    image: "/assets/featured/nebel.jpg",
    reserve: "1 SOL",
    category: "Photography",
    description: "A misty photograph evoking mystery and depth.",
  },
  {
    id: 4,
    title: "Soul catharsis",
    artist: "@cleoncomic",
    image: "/assets/featured/soul.jpg",
    reserve: "1 SOL",
    category: "Digital Art",
    description: "A vibrant digital piece expressing emotional release.",
  },
  {
    id: 5,
    title: "La source de vie",
    artist: "@Cepearano",
    image: "/assets/featured/source.jpg",
    reserve: "5 SOL",
    category: "Painting",
    description: "A vivid depiction of life’s origins in bold colors.",
  },
  {
    id: 6,
    title: "iii",
    artist: "@vicka",
    image: "/assets/featured/iii.jpeg",
    reserve: "2 SOL",
    category: "Collectibles",
    description: "A unique collectible piece with abstract elements.",
  },
];

export default function FeaturedArt() {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleImageClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedArtwork(null);
  };

  const handleBuyClick = () => {
    router.push("/auth/login");
  };

  return (
    <section className="py-10 px-6">
      <h2
        className="font-lovechild text-[64px] mb-10 md:text-[120px] lg:text-[164px] leading-[100%] text-center 
        bg-clip-text text-transparent bg-gradient-to-b from-[#6172F3] to-[rgba(55,64,218,0.6)]
        dark:from-[#6d74ed] dark:to-[rgba(107,112,216,0.6)]"
      >
        Featured
        <br />
        Artwork
      </h2>

      {/* Mobile horizontal scroll */}
      <div className="md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4">
        <div className="flex space-x-6 w-max">
          {artworks.map((art) => (
            <div
              key={art.id}
              className="rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.25)] 
              dark:shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-sm
              dark:bg-[rgba(255,255,255,0.05)] dark:border-[rgba(255,255,255,0.05)]
              hover:dark:bg-[rgba(255,255,255,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]
              cursor-pointer transition-all duration-300 w-80 flex-shrink-0 snap-start border"
            >
              <div className="h-90 w-full relative bg-gradient-to-br from-transparent to-transparent">
                <Image
                  src={art.image}
                  alt={art.title}
                  fill
                  className="object-contain justify-center rounded-t-2xl p-5 cursor-pointer"
                  loading="lazy"
                  onClick={() => handleImageClick(art)}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white">
                  {art.title}
                </h3>
                <p className="text-sm text-gray-400">{art.artist}</p>
                <div className="border-t border-gray-600 dark:border-[rgba(255,255,255,0.1)] mt-3 pt-3 text-sm">
                  <p className="text-gray-300">
                    <span className="text-gray-400">Price:</span> {art.reserve}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {artworks.map((art) => (
          <div
            key={art.id}
            className="rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.25)] 
            dark:shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-sm
            dark:bg-[rgba(255,255,255,0.05)] dark:border-[rgba(255,255,255,0.05)]
            hover:dark:bg-[rgba(255,255,255,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]
            cursor-pointer transition-all duration-300 border group"
          >
            <div className="h-90 w-full relative bg-gradient-to-br from-transparent to-transparent">
              <Image
                src={art.image}
                alt={art.title}
                fill
                className="object-contain justify-center rounded-t-2xl p-5 group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                loading="lazy"
                onClick={() => handleImageClick(art)}
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white">{art.title}</h3>
              <p className="text-sm text-gray-400">{art.artist}</p>
              <div className="border-t border-gray-600 dark:border-[rgba(255,255,255,0.1)] mt-3 pt-3 text-sm">
                <p className="text-gray-300">
                  <span className="text-gray-400">Price:</span> {art.reserve}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Artwork Detail Dialog */}
      {isDialogOpen && selectedArtwork && (
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

              {/* Artwork Image */}
              <div className="relative h-80 sm:h-96">
                <Image
                  src={selectedArtwork.image}
                  alt={selectedArtwork.title}
                  fill
                  className="object-contain rounded-t-2xl"
                />
              </div>
            </div>

            <div className="p-6">
              {/* Artwork Details */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">
                  {selectedArtwork.title}
                </h2>
                <p className="text-gray-300">by {selectedArtwork.artist}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Reserve Price:</span>
                    <p className="text-white font-medium">
                      {selectedArtwork.reserve}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Category:</span>
                    <p className="text-white font-medium">
                      {selectedArtwork.category}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400">Description:</span>
                  <p className="text-white mt-1">
                    {selectedArtwork.description}
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
    </section>
  );
}
