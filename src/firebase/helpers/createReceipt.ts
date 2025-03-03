import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { firestoredb } from "../config";
import { ExpenseCategory } from "@/mongodb/models/expense"; // Adjust path if needed

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

export async function createReceiptFromExtractedJSON(
  userId: string,
  receiptUrl: string,
  parsedReceiptData: {
    receipts: [
      {
        total: number;
        expenses: [
          {
            amount: number;
            description: string;
            category: ExpenseCategory;
            date: string;
          }
        ];
      }
    ];
  }
) {
  const { receipts } = parsedReceiptData;
  const receiptData = receipts[0];
  const { total, expenses } = receiptData;

  const blankReceipt = await createBlankReceipt(userId);
  const receiptId = blankReceipt.id;

  const expenseIds = await Promise.all(
    expenses.map(async (expense) => {
      const newExpense = {
        userId: userId,
        receiptId: receiptId,
        ...expense,
        date: new Date(expense.date) || new Date(),
        receiptUrl: receiptUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(
        collection(firestoredb, "expenses"),
        newExpense
      );
      return docRef.id;
    })
  );

  // Update the receipt with the expense IDs
  const receiptDocRef = doc(collection(firestoredb, "receipts"), receiptId);
  await updateDoc(receiptDocRef, {
    total: total,
    expenses: expenseIds,
    receiptImageURL: receiptUrl,
    updatedAt: new Date(),
  });

  console.log("Receipt created:", receiptId);
  return { id: receiptId, total, expenses, receiptImageURL: receiptUrl };
}
