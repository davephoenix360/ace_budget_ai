// app/api/expenses/route.ts
import { NextResponse } from "next/server";
import dbConnect from "../../../../mongodb/connection";
import Expense from "../../../../mongodb/models/expense";
import mongoose, { Schema } from "mongoose";
import user from "@/mongodb/models/user";

export async function GET(request: Request) {
  await dbConnect();

  try {
    // Extract clerkId from query parameters
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get("clerkId");
    if (!clerkId) {
      return NextResponse.json(
        { error: "clerkId query parameter is required" },
        { status: 400 }
      );
    }

    // Find the user by clerkId
    const mongouser = await user.findOne({ clerkId });
    if (!mongouser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find expenses that match the user's MongoDB _id
    const expenses = await Expense.find({ userId: mongouser._id });
    return NextResponse.json(expenses);
  } catch (error: any) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    // Assume body.userId is actually a Clerk ID string
    const clerkId = body.userId;

    // Look up the user in the User collection using the clerkId
    const userRecord = await user.findOne({ clerkId });
    if (!userRecord) {
      throw new Error("User not found for given clerkId");
    }

    // Replace the provided clerkId with the MongoDB ObjectId from the user record
    body.userId = userRecord._id;
    // Assuming you have clerkID in the body for the userId.
    const newExpense = new Expense({
      userId: body.userId,
      amount: body.amount,
      description: body.description,
      category: body.category,
      date: body.date,
      receiptUrl: body.receiptUrl,
    });
    const savedExpense = await newExpense.save();
    return NextResponse.json(savedExpense, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
