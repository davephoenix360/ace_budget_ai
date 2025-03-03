"use client";
import React, { use, useEffect, useState, useCallback } from "react";
import ExpenseListTable from "../../../expenses/components/ExpenseListTable";
import { getExpensesByIds } from "@/firebase/helpers/getExpenses";
import AddExpense from "../../../expenses/components/AddExpense";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { firestoredb } from "@/firebase/config";
import { Button } from "@/components/ui/button";

function NewReceiptPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  // Get the receiptId from the search params
  const params = use(paramsPromise); // Unwrap the Promise
  const { id } = params;
  const receiptId = id;
  const [expensesListIds, setExpensesListIds] = useState<string[]>([]);
  const [expensesList, setExpensesList] = useState<any[]>([]);

  const addExpenseCallback = (expenseIdAdded: string) => {
    updateExpensesListIdsInStore([...expensesListIds, expenseIdAdded]);
    setExpensesListIds([...expensesListIds, expenseIdAdded]);
    getAllExpenses();
  };

  const getAllExpenses = useCallback(async () => {
    console.log("Fetching all expenses");
    const expensesByIds = await getExpensesByIds(expensesListIds);
    console.log("Fetched expenses by ids: ", expensesByIds);
    setExpensesList(expensesByIds);
  }, [expensesListIds]);

  const fetchExpensesListIds = useCallback(async () => {
    const receiptDocRef = doc(collection(firestoredb, "receipts"), receiptId);
    const receiptDoc = await getDoc(receiptDocRef);

    if (receiptDoc.exists()) {
      const receiptData = receiptDoc.data();
      const expensesList = receiptData.expenses;

      if (expensesList) {
        setExpensesListIds(expensesList);
      }

      console.log("Fetched expenses list from receipt, ", expensesList);
    }
  }, [receiptId]);

  const updateExpensesListIdsInStore = async (listIds: string[]) => {
    const receiptDocRef = doc(collection(firestoredb, "receipts"), receiptId);

    await updateDoc(receiptDocRef, {
      expenses: listIds,
    });

    console.log("Updated expenses list in receipt");
  };

  const updateReceiptTotal = useCallback(async () => {
    const getTotalAmount = () => {
      console.log("Calculating total amount");

      let totalAmount = 0;
      expensesList.forEach((expense) => {
        totalAmount += expense.amount;
      });
      return totalAmount;
    };

    const receiptDocRef = doc(collection(firestoredb, "receipts"), receiptId);

    await updateDoc(receiptDocRef, {
      total: getTotalAmount(),
    });

    console.log("Updated total amount in receipt");
  }, [receiptId, expensesList]);

  useEffect(() => {
    fetchExpensesListIds();
  }, [fetchExpensesListIds]);

  useEffect(() => {
    getAllExpenses();
    updateReceiptTotal();
  }, [expensesListIds, getAllExpenses, updateReceiptTotal]);

  return (
    <div className="p-10 space-y-5">
      <ExpenseListTable
        expensesListIds={expensesListIds}
        expensesList={expensesList}
        refreshData={getAllExpenses}
      />
      <div>
        <Button
          onClick={() => {
            updateReceiptTotal();
            window.history.back();
          }}
        >
          Back to Receipts
        </Button>
      </div>
      <AddExpense
        receiptId={receiptId}
        addExpenseCallback={addExpenseCallback}
      />
    </div>
  );
}

export default NewReceiptPage;
