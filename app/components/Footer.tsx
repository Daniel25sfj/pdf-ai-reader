"use client";
import { SignedOut } from "@clerk/nextjs";

export default function Footer() {
  return (
    <SignedOut>
      <footer className="border-t border-white/10 bg-black/50 text-white">
        <div className="mx-auto flex min-h-[80px] max-w-6xl flex-col items-center justify-center gap-3 px-4 py-6 text-center sm:flex-row sm:justify-between">
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} PDF AI Assistant. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>Secure by design</span>
            <span className="hidden sm:inline">•</span>
            <span>Built for fast answers</span>
          </div>
        </div>
      </footer>
    </SignedOut>
  );
}
