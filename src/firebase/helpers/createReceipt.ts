import { addDoc, collection } from "firebase/firestore";
import { firestoredb } from "../config";

export async function createReceipt(receiptData: any) {
  const { userId, total, expenses, receiptImageURL } = receiptData;
  const newReceipt = {
    userId,
    total,
    expenses,
    receiptImageURL,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Add the new receipt to the "receipts" collection.
  const docRef = await addDoc(collection(firestoredb, "receipts"), newReceipt);
  return { id: docRef.id, ...newReceipt };
}

export async function createBlankReceipt(userId: string) {
  const newReceipt = {
    userId: userId,
    total: 0,
    expenses: [],
    receiptImageURL: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const docRef = await addDoc(collection(firestoredb, "receipts"), newReceipt);
  return { id: docRef.id, ...newReceipt };
}
