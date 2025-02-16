"use client";
import React, { useEffect, useState } from "react";
import ExpenseListTable from "./components/ExpenseListTable";
import { useUser } from "@clerk/nextjs";

// Uncomment the following imports if you enable backend functionality
// import { db } from "@/utils/dbConfig";
// import { Budgets, Expenses } from "@/utils/schema";
// import { desc, eq } from "drizzle-orm";

function ExpensesScreen() {
    const [expensesList, setExpensesList] = useState<{ id: string; name: string; amount: number; createdAt: string }[]>([]);
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

        // Front-end only simulation: sample data
        const simulatedResult = [
            { id: "1", name: "Groceries", amount: 50, createdAt: "2023-02-14" },
            { id: "2", name: "Internet", amount: 25, createdAt: "2023-02-15" },
        ];
        setExpensesList(simulatedResult);
    };

    return (
        <div className="p-10">
            <h2 className="font-bold text-3xl">My Expenses</h2>
            <ExpenseListTable refreshData={getAllExpenses} expensesList={expensesList} />
        </div>
    );
}

export default ExpensesScreen;
