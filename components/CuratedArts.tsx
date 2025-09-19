"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CuratedItem {
  id: string;
  title: string;
  imageUrl: string;
  author: string;
  hashtag: string;
  description: string;
  category: string;
  price: string;
}

const Curated: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<CuratedItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const curatedItems: CuratedItem[] = [
    {
      id: "1",
      title: "The 49th State: Act V - Alaska Greens",
      imageUrl: "/assets/curated/49thstate.jpg",
      author: "AlexKittoe",
      hashtag: "#Photography",
      description:
        "A stunning photographic series capturing the raw beauty of Alaska's wilderness. This collection showcases the unique landscapes and natural wonders of the 49th state.",
      category: "Photography",
      price: "2.5 ETH",
    },
    {
      id: "2",
      title: "Photographic Abstractions",
      imageUrl: "/assets/curated/photographicabstraction.jpg",
      author: "Sir Wayne Nooten",
      hashtag: "#Abstract",
      description:
        "An experimental series that explores the boundaries between photography and abstract art. Each piece transforms familiar subjects into mesmerizing visual experiences.",
      category: "Abstract Art",
      price: "1.8 ETH",
    },
    {
      id: "3",
      title: "Fragments",
      imageUrl: "/assets/curated/fragments.png",
      author: "Peanug",
      hashtag: "#Illustration",
      description:
        "A digital illustration series that pieces together fragments of memories and emotions. Each artwork tells a story through carefully composed visual elements.",
      category: "Digital Illustration",
      price: "0.9 ETH",
    },
  ];

  const handleImageClick = (item: CuratedItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedItem(null);
  };

  const handleBuyClick = () => {
    router.push("/auth/login");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center mb-6">Curated Series</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4 hide-scrollbar md:grid md:grid-cols-3 md:gap-4 md:overflow-hidden">
        {curatedItems.map((item) => (
          <div
            key={item.id}
            className="curated-item p-2 flex-shrink-0 w-100 md:w-full bg-gray-100 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition duration-200"
            onClick={() => handleImageClick(item)}
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              width={100}
              height={100}
              className="w-full h-100 rounded-2xl object-cover"
            />
            <div className="p-4">
              <span className="block text-gray-600 text-sm">{item.author}</span>
              <h3 className="text-lg font-semibold mt-1">{item.title}</h3>
              <span className="text-gray-500 text-xs">{item.hashtag}</span>
            </div>
          </div>
        ))}
      </div>
      {/* View all Link */}
      <div className="text-center mt-8">
        <a
          href="/collections"
          className="text-indigo-600 font-medium hover:underline"
        >
          View all &rarr;
        </a>
      </div>

      {/* Artwork Detail Dialog */}
      {isDialogOpen && selectedItem && (
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
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  fill
                  className="object-contain rounded-t-2xl"
                />
              </div>
            </div>

            <div className="p-6">
              {/* Artwork Details */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">
                  {selectedItem.title}
                </h2>
                <p className="text-gray-300">by {selectedItem.author}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Price:</span>
                    <p className="text-white font-medium">
                      {selectedItem.price}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Category:</span>
                    <p className="text-white font-medium">
                      {selectedItem.category}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400">Description:</span>
                  <p className="text-white mt-1">{selectedItem.description}</p>
                </div>

                <div>
                  <span className="text-gray-400">Tags:</span>
                  <p className="text-white font-medium">
                    {selectedItem.hashtag}
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
                  View Collection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Curated;
