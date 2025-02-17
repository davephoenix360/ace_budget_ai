// /budget/_components/BudgetList.tsx
"use client";
import React from "react";
import CreateBudget from "./CreateBudget";
import BudgetItem from "./BudgetItem";

interface Budget {
  id: string;
  icon: React.ReactNode;
  name: string;
  totalItem: number;
  amount: number;
  totalSpend: number;
}

interface BudgetListProps {
  budgets: Budget[];
}

function BudgetList({ budgets }: BudgetListProps) {
  return (
    <div className="mt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CreateBudget refreshData={() => {}} />
        {budgets && budgets.length > 0 ? (
          budgets.map((budget) => (
            <BudgetItem budget={budget} key={budget.id} />
          ))
        ) : (
          <div className="w-full bg-slate-200 rounded-lg h-[150px] animate-pulse" />
        )}
      </div>
    </div>
  );
}

export default BudgetList;