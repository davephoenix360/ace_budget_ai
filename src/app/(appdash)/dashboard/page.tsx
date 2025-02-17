'use client'
import React, { useState, useEffect } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import CardInfo from './_components/CardInfo';
import BarChartDashboard from './_components/BarChartDashboard';
export default function DashboardPage() {
  const { user } = useUser();
  return (
    <div className="p-8 bg-">
      <h2 className="font-bold text-4xl">Hi, {user?.fullName} 👋</h2>
      <p className="text-gray-500">
        Here's what happenning with your money, Lets Manage your expense
      </p>

      <CardInfo />
      <div className="grid grid-cols-1 lg:grid-cols-3 mt-6 gap-5">
        <div className="lg:col-span-2">
          <BarChartDashboard />

          {/* <ExpenseListTable
            expensesList={expensesList}
            refreshData={() => getBudgetList()}
          /> */}
        </div>
        <div className="grid gap-5">
          <h2 className="font-bold text-lg">Latest Budgets</h2>
          {/* {{budgetList?.length > 0
            ? budgetList.map((budget, index) => (
                <BudgetItem budget={budget} key={index} />
              ))
            : [1, 2, 3, 4].map((item, index) => ( */}
          <div
            className="h-[180xp] w-full
                 bg-slate-200 rounded-lg animate-pulse"
          ></div>
          {/*  ))}  */}
        </div>
      </div>
    </div>
  );
}