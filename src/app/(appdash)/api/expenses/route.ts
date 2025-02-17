import { NextResponse } from "next/server";
import { dbConnect } from "../../../../mongodb/connection";
import ExpenseModel from "../../../../mongodb/models/expense";
import User from "@/mongodb/models/user";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get("clerkId");

    if (!clerkId) {
      return NextResponse.json(
        { error: "clerkId query parameter is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ clerkId }).lean();
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const expenses = await Expense.find({ userId: user._id })
      .sort({ date: -1 })
      .lean();

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
  try {
    await dbConnect();
    const body = await request.json();

    if (!body.clerkId) {
      return NextResponse.json(
        { error: "clerkId is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ clerkId: body.clerkId });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const expenseData = {
      userId: user._id,
      amount: parseFloat(body.amount),
      description: body.description.trim(),
      category: body.category,
      date: new Date(body.date),
      receiptUrl: body.receiptUrl || undefined,
    };

    const newExpense = await Expense.create(expenseData);
    return NextResponse.json(newExpense, { status: 201 });
  } catch (error: any) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create expense" },
      { status: 500 }
    );
  }
}
