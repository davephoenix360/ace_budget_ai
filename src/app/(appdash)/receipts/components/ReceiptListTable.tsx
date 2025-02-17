"use client";
import React from "react";
import { toast } from "sonner";
import Link from "next/link";

type IReceipt = {
  id: string;
  userId: string;
  total: number;
  expenses: string[];
  receiptImageURL: string;
  createdAt: { nanoseconds: number; seconds: number };
  updatedAt: { nanoseconds: number; seconds: number };
};

type Props = {
  receiptList: IReceipt[];
  refreshData?: () => void;
};

export default function ReceiptListTable({ receiptList, refreshData }: Props) {
  /**
   * Front-end placeholder for "delete" operation.
   */
  const deleteReceipt = async (receipt: IReceipt) => {
    console.log(`Deleting expense: ${receipt.id}`);

    // DELETE /api/receipts/[id]
    await fetch(`/api/receipts/${receipt.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    toast("Expense Deleted (front-end only)!");
    refreshData?.();
  };

  return (
    <div className="mt-3">
      <h2 className="font-bold text-lg">Latest Receipts</h2>
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
            {receiptList.map((receipt, index) => (
              <tr
                key={receipt.id || index}
                className="bg-slate-50 even:bg-slate-100"
              >
                <td className="p-2">{receipt.id}</td>
                <td className="p-2">${receipt.total}</td>
                <td className="p-2">
                  {new Date(
                    receipt.createdAt.seconds * 1000
                  ).toLocaleDateString()}
                </td>
                <td className="p-2">
                  {/* Link uses both parentId and the expense's _id */}
                  <Link
                    href={`/receipts/${receipt.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View Receipt
                  </Link>
                </td>
                <td className="p-2">
                  <div>
                    <button
                      className="p-2 text-red-500 cursor-pointer hover:text-red-700 border"
                      onClick={() => deleteReceipt(receipt)}
                    >
                      Delete
                    </button>
                    <button
                      className="p-2 text-blue-500 cursor-pointer hover:text-blue-700 border ml-2"
                      onClick={() =>
                        console.log(`Updating expense: ${receipt.id}`)
                      }
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
