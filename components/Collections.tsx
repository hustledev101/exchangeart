"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const staticAuctions: Auction[] = [
  {
    id: 1,
    title: "2003 UD LeBrono James",
    artist: "@Courtyard.io",
    image: "/assets/collectibles/lebronjames.gif",
    reserve: "0.26 SOL",
    category: "Collectibles",
    description:
      "A unique blockchain-inspired collectible. 2003 UD LeBron James Seanson #12 card",
  },
  {
    id: 2,
    title: "DrakoChain",
    artist: "@sartikadebora",
    image: "/assets/trendingauctions/darko.jpg",
    reserve: "0.26 SOL",
    category: "Collectibles",
    description: "A unique blockchain-inspired collectible artwork.",
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
    title: "cool_primate",
    artist: "@ritz.jsinan",
    image: "/assets/collectibles/cool_primate.jpg",
    reserve: "1 SOL",
    category: "Collectibles",
    description:
      "A rare collectible piece featuring unique digital craftsmanship.",
  },
  {
    id: 5,
    title: "bking",
    artist: "@ritz.jsinan",
    image: "/assets/collectibles/bking.png",
    reserve: "1 SOL",
    category: "Collectibles",
    description:
      "A rare collectible piece featuring unique digital craftsmanship.",
  },
  {
    id: 6,
    title: "newk3d",
    artist: "@ritz.jsinan",
    image: "/assets/collectibles/newk3d.png",
    reserve: "1 SOL",
    category: "Collectibles",
    description:
      "A rare collectible piece featuring unique digital craftsmanship.",
  },
  {
    id: 7,
    title: "ccsabathia",
    artist: "@courtyard",
    image: "/assets/collectibles/ccsabathia.webp",
    reserve: "1 SOL",
    category: "Collectibles",
    description: "Aaron Judge 1-of-1 Connected Collectible",
  },
  {
    id: 8,
    title: "NBA Top Shot Card",
    artist: "@Kay",
    image: "/assets/collectibles/basket.gif",
    reserve: "1 SOL",
    category: "Collectibles",
    description: "A vibrant digital artwork exploring abstract forms.",
  },
  {
    id: 9,
    title: "Bored Ape Gif",
    artist: "@YugaLabs",
    image: "/assets/hiddengems/boredapegiphy.webp",
    reserve: "50 ETH",
    category: "Digital Art",
    description:
      "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Future areas and perks can be unlocked by the community through roadmap activation. Visit www.BoredApeYachtClub.com for more details.",
  },
  {
    id: 10,
    title: "Exo",
    artist: "@MRSPACESHIP",
    image: "/assets/featured/exo.jpeg",
    reserve: "1 SOL",
    category: "Digital Art",
    description: "A futuristic digital artwork exploring cosmic themes.",
  },
  {
    id: 11,
    title: "Soul catharsis",
    artist: "@cleoncomic",
    image: "/assets/featured/soul.jpg",
    reserve: "1 SOL",
    category: "Digital Art",
    description: "A vibrant digital piece expressing emotional release.",
  },
  {
    id: 12,
    title: "Xeno_Headb4nd",
    artist: "@Xeno @p0ng",
    image: "/assets/hiddengems/xeno.jpeg",
    reserve: "0.8 SOL",
    category: "Digital Art",
    description:
      "Hybrid, Glass Sculpted skulls + Ai + digital process. Many report that the effects create a slight pressure around the crown of their head and feels as though they are wearing a headband.",
  },
  {
    id: 13,
    title: "DGTfren01",
    artist: "@1OZiNO",
    image: "/assets/hiddengems/dgtl.jpg",
    reserve: "4.44 SOL",
    category: "Digital Art",
    description:
      "1st abstract pfp under da DGTLfren series. half of sale proceeds goes towards collecting art under @Synth59",
  },
  {
    id: 14,
    title: "Secret Place",
    artist: "@Moondust",
    image: "/assets/hiddengems/secret.jpg",
    reserve: "0.25 SOL",
    category: "Digital Art",
    description: "Digital Painting",
  },
  {
    id: 15,
    title: "Forest Hunter Licence",
    artist: "@Moonfrost",
    image: "/assets/digital/foresthunterlicence.avif",
    reserve: "0.0058 ETH",
    category: "Digital Art",
    description: "A mesmerizing digital creation with fluid colors.",
  },
  {
    id: 16,
    title: "FlyFish",
    artist: "@Flyfish Club",
    image: "/assets/digital/flyfish.avif",
    reserve: "0.0048 ETH",
    category: "Digital Art",
    description: "Collectible for lifetime club mmembership.",
  },
  {
    id: 17,
    title: "Medusa",
    artist: "@Jay Voss",
    image: "/assets/drawing/medusa.jpg",
    reserve: "1.2 SOL",
    category: "Drawing",
    description: "A detailed hand-drawn sketch with intricate patterns.",
  },
  {
    id: 18,
    title: "my tears are glitching",
    artist: "@coralinesaidso",
    reserve: "0.3 SOL",
    image: "/assets/hero/my-tears-are-glitching.jpeg",
    category: "Drawing",
    description: "An emotive digital piece with glitch-inspired aesthetics.",
  },
  {
    id: 19,
    title: "Under the sea",
    artist: "@lily",
    image: "/assets/drawing/ocean.jpg",
    reserve: "1.2 SOL",
    category: "Drawing",
    description: "A detailed hand-drawn sketch with intricate patterns.",
  },
  {
    id: 20,
    title: "Stitch",
    artist: "@Jlily",
    image: "/assets/drawing/stitch.jpeg",
    reserve: "1.2 SOL",
    category: "Drawing",
    description: "A detailed hand-drawn sketch with intricate patterns.",
  },
  {
    id: 21,
    title: "Space Monkey",
    artist: "@Jay Voss",
    image: "/assets/drawing/boredapepencil.jpg",
    reserve: "1.2 SOL",
    category: "Drawing",
    description: "A detailed hand-drawn sketch with intricate patterns.",
  },
  {
    id: 22,
    title: "Man's Best Friend",
    artist: "@My pencil art studio",
    image: "/assets/drawing/bestfriends.avif",
    reserve: "1.2 SOL",
    category: "Drawing",
    description:
      "The best companion for a human is a dog. They stay with us forever loyally and be the best part of our family.",
  },
  {
    id: 23,
    title: "Love",
    artist: "@My pencil art studio",
    image: "/assets/drawing/love.avif",
    reserve: "1.2 SOL",
    category: "Drawing",
    description:
      "This beautiful couple engrossed in their little world romancing each other and feeling each other through their touch.",
  },
  {
    id: 24,
    title: "Wild Life",
    artist: "@My pencil art studio",
    image: "/assets/drawing/nature.avif",
    reserve: "1.2 SOL",
    category: "Drawing",
    description:
      "Two deers caught into a fight in the forest which is just a normal sight.",
  },
  {
    id: 25,
    title: "Pam",
    artist: "@Damian Scott",
    image: "/assets/trendingauctions/pam.jpg",
    reserve: "0.25 SOL",
    category: "Painting",
    description: "A detailed hand-drawn sketch with intricate patterns.",
  },
  {
    id: 26,
    title: "A Man from Paradise",
    artist: "@Anahiz",
    image: "/assets/trendingauctions/paradise.jpeg",
    reserve: "1 SOL",
    category: "Painting",
    description: "A colorful painting capturing a serene paradise scene.",
  },
  {
    id: 27,
    title: "Eyes in Between Petals",
    artist: "@Marismat",
    reserve: "0.7 SOL",
    image: "/assets/hero/eyes-in-between.jpg",
    category: "Painting",
    description:
      "A delicate digital artwork blending floral and surreal elements.",
  },
  {
    id: 28,
    title: "Elixir",
    artist: "@Anahiz",
    image: "/assets/paintings/elixir.jpg",
    reserve: "1 SOL",
    category: "Painting",
    description: "A colorful painting capturing a serene paradise scene.",
  },
  {
    id: 29,
    title: "Blue Sky",
    artist: "@Anahiz",
    image: "/assets/paintings/bluesky.jpg",
    reserve: "1 SOL",
    category: "Painting",
    description: "A colorful painting capturing blue sky.",
  },
  {
    id: 30,
    title: "Don't Go",
    artist: "@Anahiz",
    image: "/assets/paintings/dontgo.png",
    reserve: "1 SOL",
    category: "Painting",
    description: "A colorful painting capturing a serene paradise scene.",
  },
  {
    id: 31,
    title: "Abstract Painting",
    artist: "@Anahiz",
    image: "/assets/paintings/Figure.jpg",
    reserve: "1 SOL",
    category: "Painting",
    description: "A colorful painting capturing a serene paradise scene.",
  },
  {
    id: 32,
    title: "Midway Atlantis",
    artist: "@UtkuDedetas",
    reserve: "180 USDT",
    image: "/assets/hero/midway-atlantis.jpg",
    category: "Painting",
    description: "A vibrant painting depicting an underwater mythical city.",
  },
  {
    id: 33,
    title: "Wrath",
    artist: "@Jay Voss",
    image: "/assets/photography/wrath photography.jpg",
    reserve: "1.2 SOL",
    category: "Photography",
    description: "A striking photograph capturing light and shadow interplay.",
  },
  {
    id: 34,
    title: "The 49th State: Act V - Alaska Greens",
    artist: "AlexKittoe",
    image: "/assets/curated/49thstate.jpg",
    reserve: "2.5 ETH",
    category: "Photography",
    description:
      "A stunning photographic series capturing the raw beauty of Alaska's wilderness. This collection showcases the unique landscapes and natural wonders of the 49th state.",
  },
  {
    id: 35,
    title: "Don't Loose Shadows",
    artist: "@Hrant",
    image: "/assets/photography/Hrant.avif",
    reserve: "1.2 SOL",
    category: "Photography",
    description:
      "A striking photograph integrating AI into the artistic process",
  },
  {
    id: 36,
    title: "A Morning in Nyaung Shwe",
    artist: "@GM Photography",
    image: "/assets/photography/Nyaung.avif",
    reserve: "0.005 ETH",
    category: "Photography",
    description:
      "This collection is a look back at some of the most memorable moments, united by an interest in humanity and the ties that unite us all.",
  },
  {
    id: 37,
    title: "Autumn Colors in Colorado",
    artist: "@GM Photography",
    image: "/assets/photography/autumn.avif",
    reserve: "1.2 SOL",
    category: "Photography",
    description:
      "This collection is a look back at some of the most memorable moments, united by an interest in humanity and the ties that unite us all.",
  },
  {
    id: 38,
    title: "3D PARROT HD PHOTOGRAPHY ART PRINTS",
    artist: "@Photgraphy-",
    image: "/assets/photography/3dparrot.avif",
    reserve: "5 USDT",
    category: "Photography",
    description: "3D PHOTOGRAPHY ART PRINTS.",
  },
  {
    id: 39,
    title: "Georgia",
    artist: "@Jerad Armijo",
    image: "/assets/photography/georgia.avif",
    reserve: "1 SOL",
    category: "Photography",
    description:
      "I’m floating through unceasing seas of bittersweet iridescent moments. Drenched, I’m swimming through the edge to you. Your light has shone, glittered, and guided me with your subtle pigments of kindness. You’re my moon. Georgia, I love you",
  },
  {
    id: 40,
    title: "Shinigami Eye (死神の目)",
    artist: "@Jerad Armijo",
    image: "/assets/photography/shinigamieye.avif",
    reserve: "0.003 ETH",
    category: "Photography",
    description:
      "Shinigami are death gods in Japanese culture. They welcome people into the afterlife. A lot of my work has a Japanese aesthetic influence because I lived there for a decent amount of time when I was growing up. I love Japan.",
  },
];

interface Auction {
  id: number;
  title: string;
  artist: string;
  image: string;
  reserve: string;
  category: string;
  description: string;
  sold?: boolean;
}

const categories = [
  "Collectibles",
  "Digital Art",
  "Drawing",
  "Painting",
  "Photography",
];

export default function Collections() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadArtworks = () => {
      // Load marketplace artworks from localStorage
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

      // Merge static auctions and marketplace items, apply sold status
      const soldArtworks = JSON.parse(
        localStorage.getItem("soldArtworks") || "[]"
      );
      const allAuctions = [...staticAuctions, ...marketplaceItems].map(
        (item) => ({
          ...item,
          sold: item.sold || soldArtworks.includes(item.id),
        })
      );
      setAuctions(allAuctions);
    };

    loadArtworks();

    // Listen for gallery updates to reload artworks
    const handleGalleryUpdate = () => {
      loadArtworks();
    };

    window.addEventListener("galleryUpdated", handleGalleryUpdate);
    return () => {
      window.removeEventListener("galleryUpdated", handleGalleryUpdate);
    };
  }, []);

  const handleImageClick = (auction: Auction) => {
    setSelectedAuction(auction);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedAuction(null);
  };

  const handleBuyClick = () => {
    router.push("/auth/user/login");
  };

  return (
    <div className="min-h-screen p-6 py-10 px-6 font-mono">
      <h2 className=" text-3xl text-center font-medium mb-10">
        Top collections
      </h2>

      {categories.map((category) => {
        const categoryItems = auctions.filter(
          (item) => item.category === category
        );
        if (categoryItems.length === 0) return null;

        return (
          <div key={category} className="mb-12">
            <h3 className="text-2xl font-semibold mb-6">{category}</h3>

            {/* Mobile view: horizontal scrolling */}
            <div className="sm:hidden overflow-x-auto whitespace-nowrap pb-4 -mx-2 px-2">
              {categoryItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#2A2C3D] rounded-lg overflow-hidden shadow hover:shadow-lg hover:dark:bg-[rgba(255,255,255,0.1)]
                  cursor-pointer transition duration-200 inline-block w-64 mr-4 relative"
                >
                  <div className="h-90 w-full relative ">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain justify-center rounded-t-2xl p-5 cursor-pointer"
                      loading="lazy"
                      onClick={() => handleImageClick(item)}
                    />
                    {item.sold && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-lg font-bold">
                          SOLD
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-semibold truncate">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-400 mb-2 truncate">
                      {item.artist}
                    </p>
                    <div className="border-t border-gray-600 pt-3 flex flex-col gap-1 text-sm">
                      <p className="text-gray-300">
                        <span className="text-gray-400">Price:</span>{" "}
                        {item.reserve}
                      </p>
                      {item.sold && (
                        <p className="text-green-400 font-semibold">Sold</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop view: grid layout */}
            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categoryItems.map((item) => (
                <div
                  key={item.id}
                  className=" rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-md
                   hover:bg-gray-300 transition-colors duration-300 cursor-pointer group relative"
                >
                  <div className="h-80 w-full relative">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain justify-center rounded-t-2xl p-5 cursor-pointer group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onClick={() => handleImageClick(item)}
                    />
                    {item.sold && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-lg font-bold">
                          SOLD
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4  bg-gray-800">
                    <h4 className="text-lg font-semibold truncate">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-400 mb-2 truncate">
                      {item.artist}
                    </p>
                    <div className="border-t border-gray-600 pt-3 flex flex-col gap-1 text-sm">
                      <p className="text-gray-300">
                        <span className="text-gray-400">Price:</span>{" "}
                        {item.reserve}
                      </p>
                      {item.sold && (
                        <p className="text-green-400 font-semibold">Sold</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

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
                {selectedAuction.sold ? (
                  <button
                    disabled
                    className="w-full bg-gray-600 text-gray-400 font-medium py-3 px-6 rounded-xl cursor-not-allowed"
                  >
                    Sold
                  </button>
                ) : (
                  <button
                    onClick={handleBuyClick}
                    className="w-full bg-gradient-to-b from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600
                             text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200"
                  >
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
