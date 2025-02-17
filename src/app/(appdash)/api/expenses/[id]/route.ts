// app/api/expenses/[id]/route.ts
import { firestoredb } from "@/firebase/config";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

/* export async function PUT(
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
} */

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Find Firebase document by ID
    const docRef = await doc(firestoredb, "expenses", params.id);
    // Check if document exists
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    // Update document with new data
    const body = await request.json();

    const expenseData = {
      amount: parseFloat(body.amount),
      description: body.description.trim(),
      category: body.category,
      date: new Date(body.date),
      receiptUrl: body.receiptUrl || undefined,
      createdAt: docSnap.data().createdAt,
      updatedAt: new Date(),
    };

    await updateDoc(docRef, expenseData);
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
    // Find Firebase document by ID
    const docRef = await doc(firestoredb, "expenses", params.id);
    // Check if document exists
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    // Delete document
    await deleteDoc(docRef);

    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete expense" },
      { status: 500 }
    );
  }
}
