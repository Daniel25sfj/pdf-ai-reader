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
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-linear-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-lg" />
            <Link
              href="/"
              className="text-lg md:text-xl font-semibold text-white hover:text-gray-200 transition"
            >
              PDF AI Assistant
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-full bg-white/5 p-1 ring-1 ring-white/10">
            <Link
              href="/"
              className={`text-sm font-medium transition px-4 py-2 rounded-full ${
                isActive("/")
                  ? "text-white bg-white/15 shadow-sm"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition px-4 py-2 rounded-full ${
                isActive("/about")
                  ? "text-white bg-white/15 shadow-sm"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium transition px-4 py-2 rounded-full ${
                isActive("/contact")
                  ? "text-white bg-white/15 shadow-sm"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Contact
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <SignedOut>
              <SignInButton>
                <button className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="rounded-full bg-linear-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-blue-400 hover:to-purple-400">
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
