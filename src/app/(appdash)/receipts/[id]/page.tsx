"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import ExpenseListTable from "../../expenses/components/ExpenseListTable";
import { Button } from "@/components/ui/button";
import { getExpensesByIds } from "@/firebase/helpers/getExpenses";
import { collection, doc, getDoc } from "firebase/firestore";
import { firestoredb } from "@/firebase/config";

export default function ReceiptExpensesPage() {
  // 1. Retrieve dynamic route param `id`
  const { id } = useParams() as { id: string };
  const { user } = useUser();
  const [expensesListIds, setExpensesListIds] = useState<string[]>([]);
  const [expensesList, setExpensesList] = useState<any[]>([]);

  const getAllExpenses = async (_expensesListIds: string[]) => {
    console.log("Fetching all expenses");
    const expensesByIds = await getExpensesByIds(_expensesListIds);
    console.log("Fetched expenses by ids: ", expensesByIds);
    setExpensesList(expensesByIds);

    return expensesByIds;
  };

  const fetchExpensesListIds = async () => {
    const receiptDocRef = doc(collection(firestoredb, "receipts"), id);
    const receiptDoc = await getDoc(receiptDocRef);

    if (receiptDoc.exists()) {
      const receiptData = receiptDoc.data();
      const expensesList = receiptData.expenses;

      if (expensesList) {
        setExpensesListIds(expensesList);
      }

      console.log("Fetched expenses list from receipt, ", expensesList);

      return expensesList;
    }
  };

  const callOnceAsync = async () => {
    if (user && id) {
      const _expensesListIds = await fetchExpensesListIds();
      const _expensesById = await getAllExpenses(_expensesListIds);
    }
  };

  // 3. Simulate fetching expenses for the given `id`
  useEffect(() => {
    callOnceAsync();
  }, []);

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-3xl font-bold">
        Detailed expenses from Receipt {id}
      </h1>
      <ExpenseListTable
        expensesListIds={expensesListIds}
        expensesList={expensesList}
        refreshData={getAllExpenses}
      />
      <div>
        <Button
          onClick={() => {
            window.history.back();
          }}
        >
          Back to Receipts
        </Button>
      </div>
    </div>
  );
}
