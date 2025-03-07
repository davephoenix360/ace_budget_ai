import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  userId?: string;
}

function AddExpense({ userId }: Props) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [receiptUrl, setReceiptUrl] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(userId);

  /**
   * "Add New Expense" handler.
   * backend or an API route.
   */
  const handleAddExpense = async () => {
    setLoading(true);

    try {
      // ==========================
      // ===== BACKEND STUB ======
      // Insert your backend logic here.
      // Example pseudo-code:
      //
      // await fetch("/api/expenses", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ name, amount }),
      // });
      //
      // ==========================

      // Fake a short delay to simulate an API call:
      await new Promise((res) => setTimeout(res, 1200));

      // Reset form after success:
      setAmount("");
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
          placeholder="e.g. 1000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
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
