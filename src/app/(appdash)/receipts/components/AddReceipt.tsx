import { createBlankReceipt } from "@/firebase/helpers/createReceipt";
import Link from "next/link";
import { NextResponse } from "next/server";
import React, { useState } from "react";

interface Props {
  userId: string;
}

export default function AddReceipt({ userId }: Props) {
  /*
    This is the interface for the IReceipt object:
    type IReceipt = {
  id: string;
  userId: string;
  total: number;
  expenses: string[];
  receiptImageURL: string;
  createdAt: { nanoseconds: number; seconds: number };
  updatedAt: { nanoseconds: number; seconds: number };
};
};

    */

  /**
   * "Add New Expense" handler.
   * backend or an API route.
   */

  const handleUploadReceipt = async () => {
    // Add your file upload logic here.
    // Example pseudo-code:
    //
    // const file = document.getElementById("fileInput").files[0];
    // const formData = new FormData();
    // formData.append("file", file);
    //
    // await fetch("/api/upload", {
    //   method: "POST",
    //   body: formData,
    // });
    setReceiptUrl(
      "https://www.wordtemplatesonline.net/wp-content/uploads/2019/12/Restaurant-Receipt-Format.jpg"
    );
  };

  return (
    <div className="border p-5 rounded-2xl">
      <h2 className="font-bold text-lg text-center">Add Receipt</h2>
      <div className="flex flex-col items-center space-y-4 mt-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Upload Receipt to Start
        </button>
        <div className="flex items-center space-x-2">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="text-gray-500">OR</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={async () => {
            const receiptId = (await createBlankReceipt(userId)).id;
            window.location.href = `/receipts/create-receipt/${receiptId}`;
          }}
        >
          Manually Create Receipt
        </button>
      </div>
    </div>
  );
}
