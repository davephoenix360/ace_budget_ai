import { createExpense } from "@/firebase/helpers/createExpense";
import { getExpensesByUserAndReceipt } from "@/firebase/helpers/getExpenses";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get("clerkId");
    const receiptId = searchParams.get("receiptId");

    if (!clerkId) {
      return NextResponse.json(
        { error: "clerkId query parameter is required" },
        { status: 400 }
      );
    }

    if (!receiptId) {
      return NextResponse.json(
        { error: "receiptId query parameter is required" },
        { status: 400 }
      );
    }

    const expenses = await getExpensesByUserAndReceipt(clerkId, receiptId);
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
    const body = await request.json();

    if (!body.clerkId) {
      return NextResponse.json(
        { error: "clerkId is required", status: 400 }
      );
    }

  const expenseData = {
      userId: body.clerkId,
      amount: parseFloat(body.amount),
      description: body.description.trim(),
      category: body.category,
      date: new Date(body.date),
      receiptId: body.receiptId || "test",
      receiptUrl: body.receiptUrl || "",
    };

    const newExpense = await createExpense(expenseData);
    return NextResponse.json(newExpense, { status: 201 });
  } catch (error: any) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create expense" },
      { status: 500 }
    );
  }
}