import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { firestoredb } from "../config";

export async function getReceiptsByUser(userId: string) {
  // Reference the "receipts" collection.
  const receiptsRef = collection(firestoredb, "receipts");

  // Create a query that filters by userId.
  const q = query(receiptsRef, where("userId", "==", userId));

  // Execute the query.
  const querySnapshot = await getDocs(q);

  // Map over the returned documents to build an array of receipts.
  const receipts = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return receipts;
}

export async function getReceiptById(receiptId: string) {
  // Reference the "receipts" collection.
  const receiptsRef = collection(firestoredb, "receipts");

  // Create a query that filters by receiptId.
  const receiptDoc = doc(receiptsRef, receiptId);
  const docSnap = await getDoc(receiptDoc);

  if (!docSnap.exists()) {
    return null;
  }

  const receipt = docSnap.data();

  return receipt;
}
