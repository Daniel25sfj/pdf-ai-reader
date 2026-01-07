"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="border-b border-white/10 bg-black/40 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-semibold text-white hover:text-gray-300 transition"
            >
              PDF AI Assistant
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className={`text-sm font-medium transition px-3 py-2 rounded-md ${
                isActive("/")
                  ? "text-white bg-white/10"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition px-3 py-2 rounded-md ${
                isActive("/about")
                  ? "text-white bg-white/10"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium transition px-3 py-2 rounded-md ${
                isActive("/contact")
                  ? "text-white bg-white/10"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Contact
            </Link>
            <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm px-4 py-2 cursor-pointer hover:bg-[#5a3ae6] transition">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}
