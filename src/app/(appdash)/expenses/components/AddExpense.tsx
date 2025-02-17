import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";

interface Props {
  receiptId?: string;
  addExpenseCallback?: (expenseIdAdded : string) => void;
}

function AddExpense({
  receiptId,
  addExpenseCallback,
}: Props) {
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [receiptUrl, setReceiptUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  /*
    This is the IExpense Interface:
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

  /**
   * "Add New Expense" handler.
   * backend or an API route.
   */
  const handleAddExpense = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user?.id,
          receiptId: receiptId || "",
          amount: amount,
          description: description,
          category: category,
          date: date,
        }),
      });

      const expenseIdAdded = await response.json();
      console.log("Expense added: ", expenseIdAdded);
      addExpenseCallback?.(expenseIdAdded.id);

      // Reset form after success:
      setAmount(0);
      setDescription("");
      setCategory("");
      setDate(new Date());
      setReceiptUrl("");

      // You could show a toast or alert here:
      alert("New Expense Added! (front-end only placeholder)");
    } catch (error) {
      // Handle the error (e.g., show toast):
      console.error("Failed to add expense:", error);
    } finally {
      setLoading(false);
    }
  };

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
      <h2 className="font-bold text-lg">Add Expense</h2>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Amount</h2>
        <Input
          type="number"
          placeholder="e.g. 1000"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Description</h2>
        <Input
          placeholder="e.g. Groceries"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Category</h2>
        <Input
          placeholder="e.g. Food"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Date</h2>
        <Input
          type="date"
          value={date.toISOString().split("T")[0]}
          onChange={(e) => setDate(new Date(e.target.value))}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Receipt URL</h2>
        {receiptUrl ? (
          <>
            <Image src={receiptUrl} alt="Receipt" width={128} height={128} />
            <Button className="mt-2" onClick={() => setReceiptUrl("")}>
              Remove Receipt
            </Button>
          </>
        ) : (
          <Button onClick={handleUploadReceipt}>Upload Receipt</Button>
        )}
        {/* An input field so they can upload a file */}
      </div>
      <Button
        disabled={
          !(amount && description && category && date && receiptUrl) || loading
        }
        onClick={handleAddExpense}
        className="mt-3 w-full rounded-full"
      >
        {loading ? "Loading..." : "Add New Expense"}
      </Button>
    </div>
  );
}

export default AddExpense;
