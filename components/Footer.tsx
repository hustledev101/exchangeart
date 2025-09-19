"use client";

import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaDiscord, FaYoutube, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className=" px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 border-b border-gray-700 pb-10">
        {/* Brand Section */}
        <div className="space-y-4 col-span-1">
          <div className="flex items-center space-x-3">
            <Image src="/assets/logo.png" alt="Logo" width={40} height={40} />
            <span className="font-semibold text-xl">
              exchange<span className="font-bold">art</span>
            </span>
          </div>
          <p className="text-sm">Collect & sell digital fine art</p>
        </div>

        {/* Marketplace */}
        <div>
          <h4 className="font-semibold mb-3">Marketplace</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#">Artworks</Link>
            </li>
            <li>
              <Link href="#">Editions</Link>
            </li>
            <li>
              <Link href="#">Series</Link>
            </li>
            <li>
              <Link href="#">Profiles</Link>
            </li>
            <li>
              <Link href="#">Leaderboards</Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-semibold mb-3">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#">ArtDrop</Link>
            </li>
            <li>
              <Link href="#">Blog</Link>
            </li>
            <li>
              <Link href="#">Helpdesk</Link>
            </li>
            <li>
              <Link href="#">Suggest a feature</Link>
            </li>
            <li>
              <Link href="#">Branding</Link>
            </li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <h4 className="font-semibold mb-3">Account</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#">Sign up</Link>
            </li>
            <li>
              <Link href="#">Sign in</Link>
            </li>
          </ul>
        </div>

        {/* Community */}
        <div>
          <h4 className=" font-semibold mb-3">Community</h4>
          <div className="flex items-center space-x-4 mt-2">
            <Link href="#">
              <FaTwitter className="w-8 h-8 bg-gray-800 rounded-full p-2" />
            </Link>
            <Link href="#">
              <FaDiscord className="w-8 h-8 bg-gray-800 rounded-full p-2" />
            </Link>
            <Link href="#">
              <FaYoutube className="w-8 h-8 bg-gray-800 rounded-full p-2" />
            </Link>
            <Link href="#">
              <FaInstagram className="w-8 h-8 bg-gray-800 rounded-full p-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-6 text-sm text-gray-500">
        <p>Copyright © 2025 EXCHANGE.ART, All rights reserved</p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <Link href="#" className="hover:text-white">
            Terms of service
          </Link>
          <Link href="#" className="hover:text-white">
            Privacy policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
