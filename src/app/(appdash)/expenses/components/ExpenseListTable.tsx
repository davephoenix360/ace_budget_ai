"use client";
import { IExpense } from "@/mongodb/models/expense";
import React from "react";
import { toast } from "sonner";

type Props = {
  expensesList: IExpense[];
  refreshData?: () => void; // Optional callback to refresh parent data
};

export default function ExpenseListTable({ expensesList, refreshData }: Props) {
  /**
   * Front-end placeholder for "delete" operation.
   * Replace this with your real backend or API call.
   */
  const deleteExpense = async (expense: IExpense) => {
    console.log(`Deleting expense: ${expense._id}`);

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

      <div className="rounded-xl overflow-hidden mt-3">
        <table className="w-full">
          {/* Table header */}
          <thead>
            <tr className="bg-slate-200">
              <th className="p-2 font-bold text-left">Amount</th>
              <th className="p-2 font-bold text-left">Description</th>
              <th className="p-2 font-bold text-left">Category</th>
              <th className="p-2 font-bold text-left">Date</th>
              <th className="p-2 font-bold text-left">Receipt</th>
              <th className="p-2 font-bold text-left">Actions</th>
            </tr>
          </thead>

          {/* Table body */}
          <tbody>
            {expensesList.map((expense, index) => (
              <tr
                key={expense.id || index}
                className="bg-slate-50 even:bg-slate-100"
              >
                <td className="p-2">{expense.amount}</td>
                <td className="p-2">{expense.description}</td>
                <td className="p-2">{expense.category}</td>
                <td className="p-2">{expense.date.toDateString()}</td>
                <td className="p-2">
                  <a
                    href={expense.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Receipt
                  </a>
                </td>
                <td className="p-2">
                  <div>
                    <button
                      className="p-2 text-red-500 cursor-pointer hover:text-red-700 border"
                      onClick={() => deleteExpense(expense)}
                    >
                      Delete
                    </button>
                    <button
                        className="p-2 text-blue-500 cursor-pointer hover:text-blue-700 border ml-2"
                        onClick={() => console.log(`Updating expense: ${expense._id}`)}
                    >
                        Update
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
