import { firestoredb } from "@/firebase/config";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Find the receipt by ID
    const docRef = doc(firestoredb, "receipts", params.id);
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
  } catch (error: any) {
    console.error("Error updating receipt:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update receipt" },
      { status: 500 }
    );
  }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
    ) {
    try {
        // Find the receipt by ID
        const docRef = doc(firestoredb, "receipts", params.id);
        const docSnap = await getDoc(docRef);
    
        if (!docSnap.exists()) {
        return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
        }
    
        // Delete the receipt
        await deleteDoc(docRef);
    
        return NextResponse.json({ message: "Receipt deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting receipt:", error);
        return NextResponse.json(
        { error: error.message || "Failed to delete receipt" },
        { status: 500 }
        );
    }
    }