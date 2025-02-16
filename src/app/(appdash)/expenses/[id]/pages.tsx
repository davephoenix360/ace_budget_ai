"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Trash } from "lucide-react";

import BudgetItem from "@/app/(appdash)/budget/BudgetItem";
import EditBudget from "../components/EditBudget";
import AddExpense from "../components/AddExpense";
import ExpenseListTable from "../components/ExpenseListTable";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Uncomment the following when enabling backend integration
// import { db } from "@/utils/dbConfig";
// import { Budgets, Expenses } from "@/utils/schema";
// import { desc, eq, getTableColumns, sql } from "drizzle-orm";

interface ExpensesScreenProps {
    params: {
        id: string; // The budget ID
    };
}

// (Optional) Define types for budget/expense data if desired
// interface BudgetInfo {
//   id: string;
//   name: string;
//   icon: string;
//   amount: number;
//   totalSpend: number;
//   totalItem: number;
// }

export default function ExpensesScreen({ params }: ExpensesScreenProps) {
    const { user } = useUser();
    interface BudgetInfo {
        id: string;
        name: string;
        icon: string;
        amount: number;
        totalSpend: number;
        totalItem: number;
    }

    const [budgetInfo, setBudgetInfo] = useState<BudgetInfo | null>(null);
    interface Expense {
        id: string;
        name: string;
        amount: number;
        createdAt: string;
    }

    const [expensesList, setExpensesList] = useState<Expense[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            getBudgetInfo();
        }
    }, [user]);

    /**
     * Fetch budget info (front-end simulation)
     */
    const getBudgetInfo = async () => {
        /*
        // Uncomment for backend integration:
        const result = await db
          .select({
            ...getTableColumns(Budgets),
            totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
            totalItem: sql`count(${Expenses.id})`.mapWith(Number),
          })
          .from(Budgets)
          .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
          .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
          .where(eq(Budgets.id, params.id))
          .groupBy(Budgets.id);
    
        setBudgetInfo(result[0]);
        getExpensesList();
        */

        // Front-end only simulation:
        const simulatedBudget = {
            id: params.id,
            name: "Simulated Budget",
            icon: "💰",
            amount: 1000,
            totalSpend: 500,
            totalItem: 3,
        };
        setBudgetInfo(simulatedBudget);
        getExpensesList();
    };

    /**
     * Fetch latest expenses (front-end simulation)
     */
    const getExpensesList = async () => {
        /*
        // Uncomment for backend integration:
        const result = await db
          .select()
          .from(Expenses)
          .where(eq(Expenses.budgetId, params.id))
          .orderBy(desc(Expenses.id));
        setExpensesList(result);
        console.log(result);
        */

        // Front-end only simulation:
        const simulatedExpenses = [
            { id: "1", name: "Expense 1", amount: 100, createdAt: "2023-03-01" },
            { id: "2", name: "Expense 2", amount: 200, createdAt: "2023-03-02" },
            { id: "3", name: "Expense 3", amount: 200, createdAt: "2023-03-03" },
        ];
        setExpensesList(simulatedExpenses);
        console.log("Simulated expenses:", simulatedExpenses);
    };

    /**
     * Delete budget (front-end simulation)
     */
    const deleteBudget = async () => {
        /*
        // Uncomment for backend integration:
        const deleteExpenseResult = await db
          .delete(Expenses)
          .where(eq(Expenses.budgetId, params.id))
          .returning();
    
        if (deleteExpenseResult) {
          const result = await db
            .delete(Budgets)
            .where(eq(Budgets.id, params.id))
            .returning();
        }
        */

        // Front-end only simulation:
        toast("Budget Deleted!");
        router.replace("/dashboard/budgets");
    };

    return (
        <div className="p-10">
            <h2 className="text-2xl font-bold gap-2 flex justify-between items-center">
                <span className="flex gap-2 items-center">
                    <ArrowLeft onClick={() => router.back()} className="cursor-pointer" />
                    My Expenses
                </span>
                <div className="flex gap-2 items-center">
                    {budgetInfo && <EditBudget budgetInfo={budgetInfo} refreshData={getBudgetInfo} />}

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="flex gap-2 rounded-full" variant="destructive">
                                <Trash className="w-4" /> Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    current budget along with expenses and remove your data from our
                                    servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={deleteBudget}>
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-5">
                {budgetInfo ? (
                    <BudgetItem budget={budgetInfo} />
                ) : (
                    <div className="h-[150px] w-full bg-slate-200 rounded-lg animate-pulse" />
                )}
                <AddExpense budgetId={params.id} user={user} refreshData={getBudgetInfo} />
            </div>

            <div className="mt-4">
                <ExpenseListTable expensesList={expensesList} refreshData={getBudgetInfo} />
            </div>
        </div>
    );
}
