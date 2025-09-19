"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Artwork {
  id: number;
  title: string;
  artist: string;
  reserve: string;
  image: string;
  category: string;
  description: string;
}

const artworks: Artwork[] = [
  {
    id: 1,
    title: "Eyes in Between Petals",
    artist: "@Marismat",
    reserve: "0.7 SOL",
    image: "/assets/hero/eyes-in-between.jpg",
    category: "Painting",
    description:
      "A delicate digital artwork blending floral and surreal elements.",
  },
  {
    id: 2,
    title: "my tears are glitching",
    artist: "@coralinesaidso",
    reserve: "0.3 SOL",
    image: "/assets/hero/my-tears-are-glitching.jpeg",
    category: "Drawing",
    description: "An emotive digital piece with glitch-inspired aesthetics.",
  },
  {
    id: 3,
    title: "Midway Atlantis",
    artist: "@UtkuDedetas",
    reserve: "180 USDT",
    image: "/assets/hero/midway-atlantis.jpg",
    category: "Painting",
    description: "A vibrant painting depicting an underwater mythical city.",
  },
  {
    id: 4,
    title: "Mirrors",
    artist: "@rivadeineira",
    reserve: "2.34 SOL",
    image: "/assets/hero/mirrors.jpeg",
    category: "Photography",
    description: "A reflective photograph exploring identity and symmetry.",
  },
  {
    id: 5,
    title: "The Awakening",
    artist: "@Juice Bruns",
    reserve: "16 SOL",
    image: "/assets/hero/awakening.jpeg",
    category: "Digital Art",
    description:
      "A bold digital creation symbolizing rebirth and transformation.",
  },
  {
    id: 6,
    title: "F( )rm.as/Fctn/4",
    artist: "@Strakts",
    reserve: "0.75 SOL",
    image: "/assets/hero/f-forms.jpg",
    category: "Collectibles",
    description: "An abstract collectible piece with geometric forms.",
  },
];

interface ArtworkCardProps {
  art: Artwork;
  handleImageClick: (artwork: Artwork) => void;
  isMobile: boolean;
  index?: number;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({
  art,
  handleImageClick,
  isMobile,
  index,
}) => {
  return (
    <div
      className={`bg-[rgba(255,255,255,0.05)] group shadow-[0_4px_20px_rgba(0,0,0,0.25)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.6)] flex flex-col h-full rounded-2xl
          cursor-pointer ${
            isMobile ? "flex-shrink-0 w-[280px] sm:w-[320px]" : ""
          } md:mt-1 ${!isMobile && index === 1 ? "lg:mt-10" : ""} ${
        !isMobile && index === 4 ? "lg:mt-15" : ""
      }`}
    >
      <div className="relative rounded-t-2xl bg-[rgba(255,255,255,0.05)] dark:bg-[rgba(255,255,255,0.05)]">
        <span className="flex items-center justify-center aspect-square m-4">
          <div className="relative w-full h-full">
            <Image
              src={art.image}
              alt={art.title}
              fill
              className="object-contain justify-center rounded-t-2xl cursor-pointer"
              loading="lazy"
              onClick={() => handleImageClick(art)}
            />
          </div>
        </span>
      </div>
      <hr className="border-gray-600 dark:border-[rgba(255,255,255,0.05)]" />
      <div className="flex flex-col justify-between h-full px-5 pt-4 pb-4">
        <div className="flex flex-col gap-2 text-white">
          <div className="flex justify-between items-center">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold truncate">
              {art.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span className="text-sm sm:text-base">{art.artist}</span>
          </div>
        </div>
        <div className="mt-4">
          <hr className="border-gray-600 dark:border-[rgba(255,255,255,0.05)]" />
          <div className="flex justify-between mt-3 text-xs sm:text-sm md:text-base">
            <span className="text-gray-300">Price</span>
            <span className="font-medium">{art.reserve}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Hero: React.FC = () => {
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
    <>
      <section className="relative bg-gray-900 to-black text-white">
        {/* Background Images */}
        <div className="bg-[url('/assets/backgrounds/rectangles-dark.png')] bg-top. bg-no-repeat h-full">
          <div
            className="bg-[url('/assets/backgrounds/spotlight-smoke.png')] bg-center bg-no-repeat
          md:pt-10 pb-6 md:pb-[50px]"
          >
            {/* Hero Text Content */}
            <div className="relative text-center px-4 sm:px-5 lg:px-2 mx-auto">
              <div
                className=" text-center container max-w-[500px] md:max-w-[750px] flex
          flex-col items-center justify-center gap-6 mx-auto p-4"
              >
                <h1
                  className="font-['lovechild'] text-center text-[clamp(2rem,2vw,3rem)]
            sm:text-[clamp(3rem,3vw,4rem)] 
            md:text-[clamp(4rem,3vw,4rem)] lg:text-[clamp(4rem,4vw,5rem)] 
            font-bold leading-tight"
                >
                  Collect, Create & Sell <br className="hidden md:block" />a
                  Piece of History
                </h1>
              </div>

              <div className="mt-5 flex sm:flex gap-4 justify-center">
                <Link
                  href="/collections"
                  className="flex space-x-2 text-white
             hover:text-gray-300 text-sm sm:text-base bg-gradient-to-b bg-[#6172F3] 
             focus:bg-indigo-700 font-semibold gap-1.5 group h-[50px] 
             hover:bg-indigo-500 items-center justify-center px-5 py-4 relative rounded-[10px] 
              "
                >
                  Explore artwork
                </Link>
              </div>
            </div>

            {/* Artwork Gallery */}
            <div className="w-full min-h-80 px-5 sm:px-6 lg:px-5 py-5 mb-10 relative z-10">
              {/* Mobile/Tablet: Horizontal scrolling */}
              <div className="flex overflow-x-auto space-x-5 pb-4 md:hidden">
                {artworks.map((art) => (
                  <ArtworkCard
                    key={art.id}
                    art={art}
                    handleImageClick={handleImageClick}
                    isMobile={true}
                  />
                ))}
              </div>
              {/* Desktop: Grid layout */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 pl-15 pr-15">
                {artworks.map((art, index) => (
                  <ArtworkCard
                    key={art.id}
                    art={art}
                    handleImageClick={handleImageClick}
                    isMobile={false}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  {selectedArtwork.title}
                </h2>
                <p className="text-gray-300 text-base sm:text-lg">
                  by {selectedArtwork.artist}
                </p>

                <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm md:text-base">
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
                  <span className="text-gray-400 text-sm sm:text-base">
                    Description:
                  </span>
                  <p className="text-white mt-1 text-sm sm:text-base">
                    {selectedArtwork.description}
                  </p>
                </div>
              </div>

              {/* Buy Button */}
              <div className="mt-6">
                <button
                  onClick={handleBuyClick}
                  className="w-full bg-gradient-to-b from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 
                           text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200 text-sm sm:text-base md:text-lg"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
