"use client";

import React, { useEffect, useState } from "react";
import BudgetList from "./_components/BudgetList";

export default function BudgetPage() {
  // Define a type for our budget items
  interface Budget {
    id: string;
    icon: React.ReactNode;
    name: string;
    totalItem: number;
    amount: number;
    totalSpend: number;
  }

  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    // Simulate fetching mock budgets data
    const mockBudgets: Budget[] = [
      {
        id: "1",
        icon: "💰",
        name: "Monthly Groceries",
        totalItem: 5,
        amount: 500,
        totalSpend: 350,
      },
      {
        id: "2",
        icon: "🏠",
        name: "Home Rent",
        totalItem: 1,
        amount: 1200,
        totalSpend: 1200,
      },
      {
        id: "3",
        icon: "🚗",
        name: "Car Maintenance",
        totalItem: 3,
        amount: 300,
        totalSpend: 100,
      },
    ];

    // Set the mock data after a slight delay to simulate an API call
    setTimeout(() => {
      setBudgets(mockBudgets);
    }, 500);
  }, []);

  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl">My Budgets</h2>
      <BudgetList budgets={budgets} />
    </div>
  );
}