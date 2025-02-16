import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function AddExpense() {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

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
            setName("");
            setAmount("");

            // You could show a toast or alert here:
            alert("New Expense Added! (front-end only placeholder)");
        } catch (error) {
            // Handle the error (e.g., show toast):
            console.error("Failed to add expense:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border p-5 rounded-2xl">
            <h2 className="font-bold text-lg">Add Expense</h2>
            <div className="mt-2">
                <h2 className="text-black font-medium my-1">Expense Name</h2>
                <Input
                    placeholder="e.g. Bedroom Decor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="mt-2">
                <h2 className="text-black font-medium my-1">Expense Amount</h2>
                <Input
                    placeholder="e.g. 1000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>
            <Button
                disabled={!(name && amount) || loading}
                onClick={handleAddExpense}
                className="mt-3 w-full rounded-full"
            >
                {loading ? "Loading..." : "Add New Expense"}
            </Button>
        </div>
    );
}

export default AddExpense;
