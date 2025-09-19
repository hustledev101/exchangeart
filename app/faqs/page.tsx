"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggle = (index: string) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      category: "General Questions",
      questions: [
        {
          question: "What is an NFT and how does it work?",
          answer:
            "An NFT (Non-Fungible Token) is a unique digital asset stored on a blockchain that proves ownership of digital content such as art, music, or collectibles.",
        },
        {
          question: "How do I get started on this NFT marketplace?",
          answer:
            "Create an account, connect a crypto wallet (like Trust wallet, MetaMask or Phantom), and start browsing, buying, or selling NFTs.",
        },
        {
          question: "What is a crypto wallet, and why do I need one?",
          answer:
            "A crypto wallet stores your digital assets and allows you to interact with blockchain applications. It’s required for transactions and holding your NFTs.",
        },
      ],
    },
    {
      category: "Buying & Selling NFTs",
      questions: [
        {
          question: "How do I buy an NFT on this platform?",
          answer:
            "Connect your wallet, find an NFT, and click “Buy Now” or place a bid. Confirm the transaction in your wallet.",
        },
        {
          question: "How can I sell my NFT/Art here?",
          answer:
            "Go to your profile, upload your NFT/Art for listing, set your price or and upload your NFT/Art for listing/auction.",
        },
        {
          question: "Are there fees when I buy or sell NFTs?",
          answer:
            "Yes, the platform may charge a Minting fee, transaction fee or service fee. Blockchain gas fees may also apply depending on the network.",
        },
      ],
    },
    {
      category: "Minting & Creating NFTs",
      questions: [
        {
          question: "Can I create my own NFT on this marketplace?",
          answer:
            'Yes! Use the "Create" feature to upload your digital file, enter details (name, description, price, upload), and mint it to the blockchain.',
        },
        {
          question: "What file types are supported for NFT creation?",
          answer:
            "Common formats like JPG, PNG, GIF, MP4, and WEBM are usually supported. File size limits may apply.",
        },
      ],
    },
    {
      category: "Security & Support",
      questions: [
        {
          question: "Is my data and wallet information secure?",
          answer:
            "We don’t store private keys. All transactions are handled through secure, encrypted wallet integrations.",
        },
        {
          question: "What should I do if my NFT is stolen or duplicated?",
          answer:
            "Contact our support team immediately. While blockchain is immutable, we can help flag fraudulent items and prevent further sales.",
        },
        {
          question: "Are there risks in trading NFTs?",
          answer:
            "Yes. Prices can fluctuate, and scams exist. Always verify the authenticity of NFTs and sellers before purchasing.",
        },
      ],
    },
    {
      category: "Other Features & Functionality",
      questions: [
        {
          question: "Which blockchains does this marketplace support?",
          answer: "We support Ethereum, Solana, Polygon and Bitcoin.",
        },
        {
          question: "Can I withdraw my balance to another wallet",
          answer:
            "Yes. Simply go to the withdrawal option on your account to send it to your Prefered wallet address.",
        },
      ],
    },
    {
      category: "Fees & Pricing",
      questions: [
        {
          question: "Are there any fees when using the platform?",
          answer: `Yes. Our platform charges fees:
          1. Minting Fee - A minting fee is the cost to create (or “mint”) a new NFT on a platform or marketplace. It may include platform service charges

2. Platform Fee - A small percentage is taken from each successful NFT sale. This helps us maintain the platform and support users.

3. Blockchain/Gas Fee - Required for minting, buying, or transferring NFTs.`,
        },
      ],
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="bg-[#181A20] min-h-screen text-white px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-10 text-center">
            Frequently Asked Questions
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {faqs.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className=" p-6 rounded-lg bg-[#2A2C3D] overflow-hidden hover:shadow-lg 
                hover:dark:bg-[rgba(255,255,255,0.1)] shadow-md hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
              >
                <h2 className="text-xl font-semibold text-indigo-400 mb-4">
                  🔹 {section.category}
                </h2>
                {section.questions.map((q, qIndex) => {
                  const indexKey = `${sectionIndex}-${qIndex}`;
                  return (
                    <div
                      key={indexKey}
                      className="mb-4 border-b border-gray-700 pb-2"
                    >
                      <button
                        onClick={() => toggle(indexKey)}
                        className="w-full text-left font-medium focus:outline-none"
                      >
                        {q.question}
                      </button>
                      {openIndex === indexKey && (
                        <p className="mt-2 text-sm text-gray-300 whitespace-pre-line">
                          {q.answer}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Faq;
