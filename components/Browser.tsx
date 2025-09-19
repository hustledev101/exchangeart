import React from "react";
import Image from "next/image";
import Link from "next/link";

const Browse: React.FC = () => {
  const browseItems = [
    {
      id: 1,
      title: "Trending auctions",
      image: "/assets/browse/EA_Icons_Trending_Auctions.svg",
    },
    {
      id: 2,
      title: "Fixed price",
      image: "/assets/browse/EA_Icons_Fixed_Price.svg",
    },
    {
      id: 3,
      title: "Reserved price",
      image: "/assets/browse/EA_Icons_Reserved_Price.svg",
    },
    {
      id: 4,
      title: "Editions",
      image: "/assets/browse/EA_Icons_Editions.svg",
    },
    {
      id: 5,
      title: "Under $100",
      image: "/assets/browse/EA_Icons_Under_100.svg",
    },
    {
      id: 6,
      title: "Curated series",
      image: "/assets/browse/EA_Icons_Curated.svg",
    },
  ];

  return (
    <section className="py-12 px-6">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-medium text-center mb-10">Browse</h2>
        {/**Browse items list */}
        <div className="grid grid-cols-3 grid-rows-3 gap-4 lg:grid-cols-6 lg:grid-rows-1">
          {browseItems.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col items-center justify-center p-4 border rounded-2xl 
              shadow-[0_4px_20px_rgba(0,0,0,0.25)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.6)] 
              backdrop-blur-sm dark:bg-[rgba(255,255,255,0.05)] dark:border-[rgba(255,255,255,0.05)]
              hover:dark:bg-[rgba(255,255,255,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]
              cursor-pointer transition-all duration-300 text-center"
            >
              <Link href="/collections">
                <Image
                  src={item.image}
                  alt={`${item.title} icon`}
                  width={200}
                  height={200}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <Link href="/collections">
                <span className="text-m font-medium">{item.title}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Browse;
