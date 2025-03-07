"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import ReceiptListTable from "./components/ReceiptListTable";
import AddReceipt from "./components/AddReceipt";

// Uncomment the following imports if you enable backend functionality
// import { db } from "@/utils/dbConfig";
// import { Budgets, Expenses } from "@/utils/schema";
// import { desc, eq } from "drizzle-orm";
type IReceipt = {
  id: string;
  userId: string;
  total: number;
  expenses: string[];
  receiptImageURL: string;
  createdAt: { nanoseconds: number; seconds: number };
  updatedAt: { nanoseconds: number; seconds: number };
};

export default function ReceiptsScreen() {
  const [receiptList, setReceiptsList] = useState<IReceipt[]>([]);
  const { user } = useUser();

  /**
   * Used to get all expenses that belong to the user.
   * Backend code is commented out for front-end-only testing.
   */
  const getAllReceipts = React.useCallback(async () => {
    /*
            // Uncomment and adjust this code when enabling backend integration
            backend;
            */
    // GET /api/receipts
    await fetch(`/api/receipts?clerkId=${user?.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setReceiptsList(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // Front-end only simulation: sample data
  }, [user?.id]);
  useEffect(() => {
    if (user) {
      getAllReceipts();
    }
  }, [user, getAllReceipts]);

  return (
    <div className="p-10 space-y-5">
      <h2 className="font-bold text-3xl">My Reciepts</h2>
      <ReceiptListTable
        refreshData={getAllReceipts}
        receiptList={receiptList}
      />
      <AddReceipt userId={user?.id || "test"} callback={getAllReceipts} />
    </div>
  );
}
