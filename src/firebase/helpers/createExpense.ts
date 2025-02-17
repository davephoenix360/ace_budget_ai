import { addDoc, collection } from "firebase/firestore";
import { firestoredb } from "../config";

export async function createExpense(expenseData: any) {
  const { userId, amount, description, category, date, receiptId } =
    expenseData;
  const newExpense = {
    userId: userId,
    amount: amount,
    description: description,
    category: category,
    date: date,
    receiptId: receiptId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Add the new expense to the "expenses" collection.
  const docRef = await addDoc(collection(firestoredb, "expenses"), newExpense);
  return { id: docRef.id, ...newExpense };
}
