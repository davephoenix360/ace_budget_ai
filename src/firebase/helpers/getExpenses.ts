import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { firestoredb } from "@/firebase/config"; // adjust the import path as needed
import { IExpense } from "@/firebase/schemas/expense"; // adjust the import path as needed

/**
 * Retrieves expenses for a given userId and receiptId.
 *
 * @param userId - The user ID (as stored in your expenses documents)
 * @param receiptId - The receipt ID associated with the expense
 * @returns A promise resolving to an array of expense objects
 */
export async function getExpensesByUserAndReceipt(
  userId: string,
  receiptId: string
) {
  // Reference the "expenses" collection.
  const expensesRef = collection(firestoredb, "expenses");

  // Create a query that filters by both userId and receiptId.
  const q = query(
    expensesRef,
    where("userId", "==", userId),
    where("receiptId", "==", receiptId)
  );

  // Execute the query.
  const querySnapshot = await getDocs(q);

  // Map over the returned documents to build an array of expenses.
  // const expenses = await getDoc(
  //   doc(firestoredb, "expenses", "xpUQg55FFXinZ4Nm4498")
  // );
  const expenses = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return expenses;
}

export async function getExpensesByIds(
  expenseIds: string[]
): Promise<IExpense[]> {
  if (expenseIds.length == 0) return [];

  const expenses = [];

  for (let i = 0; i < expenseIds.length; i++) {
    const expenseId = expenseIds[i];
    const expenseRef = doc(collection(firestoredb, "expenses"), expenseId);
    const expenseDoc = await getDoc(expenseRef);

    if (expenseDoc.exists()) {
      const data = expenseDoc.data();
      expenses.push({
        id: expenseDoc.id,
        userId: data.userId,
        receiptId: data.receiptId,
        amount: data.amount,
        description: data.description,
        category: data.category,
        date: data.date.toDate(),
        receiptUrl: data.receiptUrl,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      });
    }
  }

  return expenses;
}
