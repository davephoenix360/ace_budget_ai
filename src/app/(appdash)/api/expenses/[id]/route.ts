// app/api/expenses/[id]/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../mongodb/connection";
import ExpenseModel from "../../../../../mongodb/models/expense";
import User from "@/mongodb/models/user";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const updatedExpense = await Expense.findByIdAndUpdate(
      params.id,
      {
        ...body,
        userId: user._id,
        amount: parseFloat(body.amount),
        date: new Date(body.date),
      },
      { new: true }
    );

    if (!updatedExpense)
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });

    return NextResponse.json(updatedExpense);
  } catch (error: any) {
    console.error("Error updating expense:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update expense" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const deletedExpense = await Expense.findByIdAndDelete(params.id);
    if (!deletedExpense)
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });

    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete expense" },
      { status: 500 }
    );
  }
}