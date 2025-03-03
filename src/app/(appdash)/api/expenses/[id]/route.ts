// app/api/expenses/[id]/route.ts
import { firestoredb } from "@/firebase/config";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Unwrap the Promise

    // Find Firebase document by ID
    const docRef = doc(firestoredb, "expenses", id);
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
    return NextResponse.json({ message: "Expense updated successfully" });
  } catch (error) {
    console.error("Error updating expense:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update expense";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Unwrap the Promise

    // Find Firebase document by ID
    const docRef = doc(firestoredb, "expenses", id);
    // Check if document exists
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    // Delete document
    await deleteDoc(docRef);

    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete expense";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
