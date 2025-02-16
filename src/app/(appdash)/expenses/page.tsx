"use client";
import React, { useEffect, useState } from "react";
import ExpenseListTable from "./components/ExpenseListTable";
import { useUser } from "@clerk/nextjs";
import { IExpense } from "@/mongodb/models/expense";
import AddExpense from "./components/AddExpense";

// Uncomment the following imports if you enable backend functionality
// import { db } from "@/utils/dbConfig";
// import { Budgets, Expenses } from "@/utils/schema";
// import { desc, eq } from "drizzle-orm";

function ExpensesScreen() {
  const [expensesList, setExpensesList] = useState<IExpense[]>([]);
  const { user } = useUser();

  /*
    THis is how the IExpense interface looks like:
    export interface IExpense extends Document {
        userId: mongoose.Types.ObjectId; 
        amount: number;
        description: string;
        category: string;
        date: Date;
        receiptUrl?: string;
        createdAt: Date;
        updatedAt: Date;
    }
    */

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

    // Front-end only simulation: sample data
    const simulatedResult: IExpense[] = [
      {
        _id: 1,
        userId: "user1",
        amount: 50,
        description: "Groceries",
        category: "Food",
        date: new Date("2023-02-14"),
        createdAt: new Date("2023-02-14"),
        updatedAt: new Date("2023-02-14"),
      },
      {
        _id: 2,
        userId: "user2",
        amount: 25,
        description: "Internet",
        category: "Utilities",
        date: new Date("2023-02-15"),
        createdAt: new Date("2023-02-15"),
        updatedAt: new Date("2023-02-15"),
      },
    ];
    setExpensesList(simulatedResult);
  };

  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl">My Expenses</h2>
      <ExpenseListTable
        refreshData={getAllExpenses}
        expensesList={expensesList}
      />
      <AddExpense />
    </div>
  );
}

export default ExpensesScreen;
