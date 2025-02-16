"use client";
import React from "react";
import { toast } from "sonner";

type Expense = {
    id: string;
    name: string;
    amount: number;
    createdAt: string;
};

type Props = {
    expensesList: Expense[];
    refreshData?: () => void; // Optional callback to refresh parent data
};

export default function ExpenseListTable({ expensesList, refreshData }: Props) {
    /**
     * Front-end placeholder for "delete" operation.
     * Replace this with your real backend or API call.
     */
    const deleteExpense = async (expense: Expense) => {
        console.log(`Deleting expense: ${expense.name} (${expense.id})`);

        // Simulate a short delay (e.g., API call)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Show a toast to confirm deletion
        toast("Expense Deleted (front-end only)!");

        // Optionally call the parent’s refresh function, if any
        refreshData?.();
    };

    return (
        <div className="mt-3">
            <h2 className="font-bold text-lg">Latest Expenses</h2>

            {/* Table header */}
            <div className="grid grid-cols-4 rounded-tl-xl rounded-tr-xl bg-slate-200 p-2 mt-3">
                <h2 className="font-bold">Name</h2>
                <h2 className="font-bold">Amount</h2>
                <h2 className="font-bold">Date</h2>
                <h2 className="font-bold">Action</h2>
            </div>

            {/* Expenses rows */}
            {expensesList.map((expense, index) => (
                <div
                    key={expense.id || index}
                    className="grid grid-cols-4 bg-slate-50 rounded-bl-xl rounded-br-xl p-2"
                >
                    <h2>{expense.name}</h2>
                    <h2>{expense.amount}</h2>
                    <h2>{expense.createdAt}</h2>

                    {/* Delete button */}
                    <h2
                        onClick={() => deleteExpense(expense)}
                        className="text-red-500 cursor-pointer"
                    >
                        Delete
                    </h2>

                </div>
            ))}
        </div>
    );
}
