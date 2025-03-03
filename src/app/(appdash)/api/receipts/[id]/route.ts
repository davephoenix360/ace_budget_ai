import { firestoredb } from "@/firebase/config";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Unwrap the Promise

    // Find the receipt by ID
    const docRef = doc(firestoredb, "receipts", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
    }

    const body = await request.json();

    // Update the receipt with the new data
    const receiptData = {
      userId: body.userId,
      total: body.total,
      expenses: body.expenses,
      receiptImageURL: body.receiptImageURL,
      createdAt: body.createdAt,
      updatedAt: new Date(),
    };

    // Save the updated receipt
    await updateDoc(docRef, receiptData);

    return NextResponse.json(receiptData);
  } catch (error) {
    console.error("Error updating receipt:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update receipt";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Unwrap the Promise

    // Find the receipt by ID
    const docRef = doc(firestoredb, "receipts", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
    }

    // Delete the receipt
    await deleteDoc(docRef);

    return NextResponse.json({ message: "Receipt deleted successfully" });
  } catch (error) {
    console.error("Error deleting receipt:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete receipt";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
