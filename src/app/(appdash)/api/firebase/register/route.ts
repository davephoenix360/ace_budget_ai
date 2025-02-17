// app/api/clerk/register/route.ts
import { NextResponse } from "next/server";
import { firestoredb } from "../../../../../firebase/config"; // Import the Firestore database client
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const { clerkId, email, name } = await request.json();

    // Create a new user in the Firestore database users collection
    const user = {
      clerkId,
      email,
      name,
      preferences: {
        theme: "light",
        language: "en",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Check if the user already exists in the database
    // If the user exists, update the user document
    const userDocRef = doc(firestoredb, "users", clerkId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      console.log("User already exists. Updating user document.");
      await updateDoc(userDocRef, {
        updatedAt: new Date().toISOString(),
      });
    } else {
      console.log("User does not exist. Creating new user document.");
      await setDoc(userDocRef, user);
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Error registering user", details: error },
      { status: 500 }
    );
  }
}
