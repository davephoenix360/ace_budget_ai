"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

function Header() {
  const { user, isSignedIn } = useUser();

  return (
    <div className="p-5 flex justify-between items-center border shadow-sm">
      <div className="flex flex-row items-center">
        {/* Increase dimensions here */}
        <Image
          src="/the file.png"
          alt="logo"
          width={120} // Raised from 40 to 120
          height={80} // Raised from 25 to 80
        />
      </div>
      {isSignedIn ? (
        <div className="flex gap-3 items-center">
          <Link href="/dashboard">
            <Button variant="outline" className="rounded-full">
              Dashboard
            </Button>
          </Link>
          <UserButton />
        </div>
      ) : (
        <div className="flex gap-3 items-center">
          <SignInButton>
            <Button className="rounded-full">Get Started</Button>
          </SignInButton>
        </div>
      )}
    </div>
  );
}

export default Header;
