"use client";

import Link from "next/link";
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";

export default function Header() {
  const { isSignedIn, user } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-[#2a2a4a]">
      <Link href="/" className="font-pixel text-sm text-[#00e5ff] glow-cyan hover:opacity-80 transition-opacity">
        WANDERQUEST
      </Link>
      <div className="flex items-center gap-4">
        {isSignedIn ? (
          <>
            <span className="text-xs text-gray-400 hidden sm:inline">
              {user.firstName || user.emailAddresses[0]?.emailAddress}
            </span>
            <SignOutButton>
              <button className="font-pixel text-[8px] px-3 py-2 border border-[#ff6ec7] text-[#ff6ec7] rounded hover:bg-[#ff6ec7]/10 transition-colors">
                LOG OUT
              </button>
            </SignOutButton>
          </>
        ) : (
          <SignInButton>
            <button className="font-pixel text-[8px] px-3 py-2 border border-[#00e5ff] text-[#00e5ff] rounded hover:bg-[#00e5ff]/10 transition-colors">
              LOG IN
            </button>
          </SignInButton>
        )}
      </div>
    </header>
  );
}
