"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import ExpenseListTable from "../components/ExpenseDetailPage"; // Adjust path if needed
import { IExpense } from "@/mongodb/models/expense";

export default function ReceiptExpensesPage() {
    // 1. Retrieve dynamic route param `id`
    const { id } = useParams() as { id: string };
    const { user } = useUser();

    // 2. Store expense data in state
    const [expenses, setExpenses] = useState<IExpense[]>([]);

    // 3. Simulate fetching expenses for the given `id`
    useEffect(() => {
        if (user && id) {
            // Replace this simulation with an actual API/DB call if needed
            const simulatedExpenses: IExpense[] = [
                {
                    _id: "101",
                    amount: 75,
                    description: "Groceries",
                    category: "Food",
                    date: new Date("2023-02-14"),
                    createdAt: new Date("2023-02-14"),
                    updatedAt: new Date("2023-02-14"),
                    userId: "user1",
                },
                {
                    _id: "102",
                    amount: 40,
                    description: "Gas",
                    category: "Transportation",
                    date: new Date("2023-03-01"),
                    createdAt: new Date("2023-03-01"),
                    updatedAt: new Date("2023-03-01"),
                    userId: "user2",
                },
            ];
            setExpenses(simulatedExpenses);
        }
    }, [user, id]);

    return (
        <div className="p-10 space-y-4">
            <h1 className="text-3xl font-bold">Detailed expenses from Receipt {id}</h1>
            {/* 4. Render your existing ExpenseListTable as-is */}
            <ExpenseListTable expensesList={expenses} />
        </div>
    );
}
