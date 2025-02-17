// ExpenseListTable.tsx
"use client";
import { IExpense } from "@/mongodb/models/expense";
import React from "react";
import { toast } from "sonner";
import Link from "next/link";

type Props = {
  expensesList: IExpense[];
  parentId: string; // Parent receipt or budget ID
  refreshData?: () => void;
};

export default function ExpenseListTable({ expensesList, parentId, refreshData }: Props) {
  /**
   * Front-end placeholder for "delete" operation.
   */
  const deleteExpense = async (expense: IExpense) => {
    console.log(`Deleting expense: ${expense._id}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast("Expense Deleted (front-end only)!");
    refreshData?.();
  };

  return (
    <div className="mt-3">
      <h2 className="font-bold text-lg">Latest Reciepts</h2>
      <div className="rounded-xl overflow-hidden mt-3">
        <table className="w-full">
          {/* Table header */}
          <thead>
            <tr className="bg-slate-200">
              <th className="p-2 font-bold text-left">Receipt ID</th>
              <th className="p-2 font-bold text-left">Total Amount</th>
              <th className="p-2 font-bold text-left">Date</th>
              <th className="p-2 font-bold text-left">Receipt</th>
              <th className="p-2 font-bold text-left">Actions</th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody>
            {expensesList.map((expense, index) => (
              <tr
                key={expense._id || index}
                className="bg-slate-50 even:bg-slate-100"
              >
                <td className="p-2">{index + 1}</td>
                <td className="p-2">${expense.amount}</td>
                <td className="p-2">{expense.date.toDateString()}</td>
                <td className="p-2">
                  {/* Link uses both parentId and the expense's _id */}
                  <Link
                    href={`/receipts/${expense._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View Receipt
                  </Link>
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
