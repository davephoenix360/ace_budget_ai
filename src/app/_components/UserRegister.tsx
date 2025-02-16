// components/UserRegister.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function UserRegister() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      // Call the API route to register the user in MongoDB.
      fetch("/api/clerk/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            console.error("Failed to register user");
          }
        })
        .catch((err) => {
          console.error("Error registering user:", err);
        });
    }
  }, [user]);

  return null; // This component doesn't render anything visible.
}
