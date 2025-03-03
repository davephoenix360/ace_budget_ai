import { addDoc, collection } from "firebase/firestore";
import { firestoredb } from "../config";

export async function createExpense(expenseData: {
  userId: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  receiptId: string;
  receiptUrl: string;
}) {
  const { userId, amount, description, category, date, receiptId, receiptUrl } =
    expenseData;
  const newExpense = {
    userId: userId,
    amount: amount,
    description: description,
    category: category,
    date: date,
    receiptId: receiptId,
    receiptUrl: receiptUrl,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Add the new expense to the "expenses" collection.
  const docRef = await addDoc(collection(firestoredb, "expenses"), newExpense);
  return { id: docRef.id, ...newExpense };
}
