// app/api/clerk/register/route.ts
import { NextResponse } from "next/server";
import dbConnect from "../../../../../mongodb/connection";
import User from "../../../../../mongodb/models/user";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { clerkId, email, name } = await request.json();

    // Check if a user with the given clerkId already exists.
    let user = await User.findOne({ clerkId });
    if (!user) {
      // Create a new user if not found.
      user = await User.create({
        clerkId,
        email,
        name,
        preferences: { theme: "light", language: "en" },
      });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Error registering user", details: error.message },
      { status: 500 }
    );
  }
}
