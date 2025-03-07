"use client";
import React, { useEffect, useState } from "react";
import ExpenseListTable from "./components/ExpenseListTable";
import { useUser } from "@clerk/nextjs";
import { IExpense } from "@/firebase/schemas/expense";

// Uncomment the following imports if you enable backend functionality
// import { db } from "@/utils/dbConfig";
// import { Budgets, Expenses } from "@/utils/schema";
// import { desc, eq } from "drizzle-orm";

function ExpensesScreen() {
  const [expensesList, setExpensesList] = useState<IExpense[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getAllExpenses();
    }
  }, [user]);

  /**
   * Used to get all expenses that belong to the user.
   * Backend code is commented out for front-end-only testing.
   */
  const getAllExpenses = async () => {
    /*
        // Uncomment and adjust this code when enabling backend integration
        backend;
        */
    // GET /api/expenses
    await fetch("/api/expenses", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setExpensesList(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

  };

  return (
    <div className="p-10 space-y-5">
      <h2 className="font-bold text-3xl">My Expenses</h2>
      <ExpenseListTable
        refreshData={getAllExpenses}
        expensesList={expensesList}
      />
      {/* <AddExpense /> */}
    </div>
  );
}

export default ExpensesScreen;
