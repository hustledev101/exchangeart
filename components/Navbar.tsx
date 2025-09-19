"use client";
import Image from "next/image";
import Link from "next/link";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./ui/mode-toggle";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 forced-theme:bg-alpha-dark-10 forced-theme:backdrop-blur-[86px] border-b border-gray-200 dark:border-gray-800 forced-theme:border-none forced-theme --tw-bg-opacity: 1; --tw-border-opacity: 1; --tw-backdrop-blur: blur(86px);">
      <nav>
        <div className="container mx-auto px-1 py-2 flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div>
                <Image
                  src="/assets/logo.png"
                  width={40}
                  height={40}
                  alt="Logo"
                  className="rounded-full"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex flex-1 justify-center space-x-6 items-center max-w-3xl">
            {/* Explore Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-400 transition focus:outline-none">
                <span>Explore</span>
                <FaAngleDown />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/collections">Collections</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/featured">Featured</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Resources Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-400 transition focus:outline-none">
                <span>Resources</span>
                <FaAngleDown />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/faqs">FAQ</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/contact">Get Help</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Search */}
            <div className="relative rounded-[10px] w-full max-w-md border">
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Exchange"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-0 rounded-md pl-3 pr-10 py-2 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="hidden md:flex ml-1 mr-1">
            <ModeToggle />
          </div>

          {/* Sign Up */}
          <div className="hidden md:flex flex-shrink-0">
            <Link
              href="/auth/signup"
              className="flex space-x-2 text-white
             hover:text-gray-300 text-sm sm:text-base bg-gradient-to-b bg-[#6172F3] 
             focus:bg-indigo-700 font-semibold gap-1.5 group h-[50px] 
             hover:bg-indigo-500 items-center justify-center px-5 py-4 relative rounded-[15px] 
              "
            >
              Sign Up
            </Link>
          </div>

          {/* Hamburger */}
          <div className="md:hidden">
            <button onClick={toggleMenu} aria-label="Toggle mobile menu">
              {menuOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden w-full h-screen absolute top-0 left-0 z-40 flex flex-col items-start justify-start pt-20 px-6 space-y-6 bg-white dark:bg-gray-900">
            {/* Top-left logo */}
            <Link
              href="/"
              onClick={toggleMenu}
              className="absolute top-4 left-4 z-50"
            >
              <Image
                src="/assets/logo.png"
                width={40}
                height={40}
                alt="Logo"
                className="rounded-full"
              />
            </Link>
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
              <ModeToggle />{" "}
            </div>

            {/* Close Button */}
            <button
              onClick={toggleMenu}
              className="absolute top-4 right-4 text-2xl z-50"
              aria-label="Close mobile menu"
            >
              <FaTimes />
            </button>

            {/* Sign Up */}
            <button
              onClick={() => router.push("/auth/signup")}
              className="flex w-full space-x-2 text-white
             hover:text-gray-300  text-xl bg-gradient-to-b bg-[#6172F3] 
             focus:bg-[#6172F3] font-medium gap-1.5 group h-[50px] 
             hover:bg-[#6172F3] items-center justify-center px-5 py-4 relative rounded-[15px] 
              text-center to-transparent"
            >
              Sign Up
            </button>

            {/* Mobile Links */}
            <Link
              href="/collections"
              className="text-xl w-full p-4 hover:bg-gray-400 rounded-lg"
              onClick={toggleMenu}
            >
              Collections
            </Link>
            <Link
              href="/featured"
              className=" text-xl w-full p-4 hover:bg-gray-400 rounded-lg"
              onClick={toggleMenu}
            >
              Featured
            </Link>
            <Link
              href="/faq"
              className=" text-xl w-full p-4 hover:bg-gray-400 rounded-lg"
              onClick={toggleMenu}
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className=" text-xl w-full p-4 hover:bg-gray-400 rounded-lg"
              onClick={toggleMenu}
            >
              Get Help
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
