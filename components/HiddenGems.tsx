"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Artwork {
  id: number;
  title: string;
  artist: string;
  image: string;
  reserve: string;
  category: string;
  description: string;
}

const auctions: Artwork[] = [
  {
    id: 1,
    title: "Bored Ape Gif",
    artist: "@YugaLabs",
    image: "/assets/hiddengems/boredapegiphy.webp",
    reserve: "50 ETH",
    category: "Digital Art",
    description:
      "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Future areas and perks can be unlocked by the community through roadmap activation. Visit www.BoredApeYachtClub.com for more details.",
  },
  {
    id: 2,
    title: "Secret Place",
    artist: "@Moondust",
    image: "/assets/hiddengems/secret.jpg",
    reserve: "0.25 SOL",
    category: "Digital Art",
    description: "Digital Painting",
  },
  {
    id: 3,
    title: "Bored Ape",
    artist: "@YugaLabs",
    image: "/assets/hiddengems/boredape1.avif",
    reserve: "888 ETH",
    category: "Collectibles",
    description:
      "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Future areas and perks can be unlocked by the community through roadmap activation. Visit www.BoredApeYachtClub.com for more details.",
  },
  {
    id: 4,
    title: "DGTfren01",
    artist: "@1OZiNO",
    image: "/assets/hiddengems/dgtl.jpg",
    reserve: "4.44 SOL",
    category: "Digital Art",
    description:
      "1st abstract pfp under da DGTLfren series. half of sale proceeds goes towards collecting art under @Synth59",
  },
  {
    id: 5,
    title: "Xeno_Headb4nd",
    artist: "@Xeno @p0ng",
    image: "/assets/hiddengems/xeno.jpeg",
    reserve: "0.8 SOL",
    category: "Digital Art",
    description:
      "Hybrid, Glass Sculpted skulls + Ai + digital process. Many report that the effects create a slight pressure around the crown of their head and feels as though they are wearing a headband.",
  },
  {
    id: 6,
    title: "Mono ",
    artist: "@Zena",
    image: "/assets/hiddengems/mono.jpeg",
    reserve: "0.05 SOL",
    category: "Digital Art",
    description: "synergies of movement",
  },
];

export default function HiddenGems() {
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
    <div className="min-h-screen p-6 py-12 px-6 font-mono">
      <h2 className="text-3xl font-bold text-center mb-6">Hidden Gems </h2>

      {/* Mobile view: horizontal scrolling */}
      <div className="sm:hidden overflow-x-auto whitespace-nowrap pb-4 -mx-2 px-2">
        {auctions.map((item) => (
          <div
            key={item.id}
            className=" rounded-lg overflow-hidden shadow hover:shadow-lg hover:dark:bg-[rgba(255,255,255,0.1)] 
            cursor-pointer transition duration-200 inline-block w-64 mr-4"
            onClick={() => handleImageClick(item)}
          >
            <div className="h-90 w-full relative ">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-contain justify-center rounded-t-2xl p-5"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <h4 className="text-lg font-semibold truncate">{item.title}</h4>
              <p className="text-sm text-gray-400 mb-2 truncate">
                {item.artist}
              </p>
              <div className="border-t border-gray-600 pt-3 flex flex-col gap-1 text-sm">
                <p className="text-gray-300">
                  <span className="text-gray-400">Price:</span> {item.reserve}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop view: grid layout */}
      <div className="hidden sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg overflow-hidden shadow-md
             hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
            onClick={() => handleImageClick(item)}
          >
            <div className="h-80 w-full relative">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-contain justify-center rounded-t-2xl p-5"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <h4 className="text-lg font-semibold truncate">{item.title}</h4>
              <p className="text-sm text-gray-400 mb-2 truncate">
                {item.artist}
              </p>
              <div className="border-t border-gray-600 pt-5 flex flex-col gap-1 text-sm">
                <p className="text-gray-300">
                  <span className="text-gray-400">Price:</span> {item.reserve}
                </p>
              </div>
            </div>
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
    </div>
  );
}
