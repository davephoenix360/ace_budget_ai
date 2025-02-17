//view particular expense details.
"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from 'next/image';

interface Expense {
    id: string;
    name: string;
    amount: number;
    description: string;
    category: string;
    date: string;
    receiptUrl?: string;
}

interface ExpenseDetailProps {
    params: {
        expenseId: string;
    };
}

export default function ExpenseDetailPage({ params }: ExpenseDetailProps) {
    const { user } = useUser();
    const router = useRouter();
    const [expense, setExpense] = useState<Expense | null>(null);

    useEffect(() => {
        if (user) {
            fetchExpenseDetails();
        }
    }, [user]);

    /**
     * Fetch expense details.
     * The backend call is commented out for front-end simulation.
     */
    const fetchExpenseDetails = async () => {
        /*
        // Uncomment for backend integration:
        const response = await fetch(`/api/expenses/${params.expenseId}`);
        const data: Expense = await response.json();
        setExpense(data);
        */

        // Front-end simulation:
        const simulatedExpense: Expense = {
            id: params.expenseId,
            name: "Simulated Expense",
            amount: 150,
            description: "Grocery Shopping",
            category: "Food",
            date: new Date("2023-03-05").toISOString(),
            receiptUrl: "https://via.placeholder.com/500", // Example image URL
        };
        setExpense(simulatedExpense);
    };

    return (
        <div className="p-10 space-y-5">
            <Button onClick={() => router.back()} className="flex gap-2 items-center">
                <ArrowLeft className="w-4" /> Back
            </Button>
            <h2 className="font-bold text-3xl">Expense Details</h2>
            {expense ? (
                <div className="p-5 border rounded-2xl shadow-sm">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl font-bold">{expense.name}</h3>
                        <p>
                            <span className="font-medium">Amount:</span> ${expense.amount}
                        </p>
                        <p>
                            <span className="font-medium">Category:</span> {expense.category}
                        </p>
                        <p>
                            <span className="font-medium">Date:</span> {new Date(expense.date).toDateString()}
                        </p>
                        <p>
                            <span className="font-medium">Description:</span> {expense.description}
                        </p>
                        <Image
                            src={expense.receiptUrl || '/path/to/default/image.jpg'}
                            alt="Receipt"
                            width={500}
                            height={500}
                            className="w-full max-w-md rounded-lg shadow-md"
                        />
                    </div>
                </div>
            ) : (
                <div>Loading expense details...</div>
            )}
        </div>
    );
}
