"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";

// Types for your data and AI-driven results
type ExpenseData = {
  date: string;
  amount: number;
  category: string;
};

type ForecastInfo = {
  nextMonthExpense: number;
  budgetLimit: number;
  message: string;
};

type Recommendation = {
  id: number;
  text: string;
};

type TimeRange = "weekly" | "monthly" | "quarterly" | "yearly";

// Helper function to simulate delay
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function AnalysisPage() {
  const { user } = useUser();

  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [forecast, setForecast] = useState<ForecastInfo | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const [barData, setBarData] = useState<ExpenseData[]>([]);
  const [lineData, setLineData] = useState<ExpenseData[]>([]);
  const [pieData, setPieData] = useState<{ category: string; value: number }[]>(
    []
  );
  const [visibleChart, setVisibleChart] = useState<
    "none" | "bar" | "line" | "pie"
  >("none");
  const [timeRange, setTimeRange] = useState<TimeRange>("monthly");
  const [loading, setLoading] = useState(false);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#7A4FFF",
    "#FF4F81",
  ];

  useEffect(() => {
    if (user) {
      fetchAnalysisData(timeRange);
    }
  }, [user, timeRange]);

  const generateSimulatedExpenses = (range: TimeRange): ExpenseData[] => {
    const data: ExpenseData[] = [];
    const now = new Date();

    switch (range) {
      case "weekly":
        for (let i = 0; i < 7; i++) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          data.push({
            date: date.toISOString().split("T")[0],
            amount: Math.floor(Math.random() * 100 + 50),
            category: [
              "Food & Dining",
              "Transportation",
              "Utilities & Bills",
              "Entertainment",
            ][Math.floor(Math.random() * 4)],
          });
        }
        break;
      case "monthly":
        for (let i = 0; i < 30; i++) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          data.push({
            date: date.toISOString().split("T")[0],
            amount: Math.floor(Math.random() * 100 + 50),
            category: [
              "Food & Dining",
              "Transportation",
              "Utilities & Bills",
              "Rent",
            ][Math.floor(Math.random() * 4)],
          });
        }
        break;
      case "quarterly":
        for (let i = 0; i < 90; i++) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          data.push({
            date: date.toISOString().split("T")[0],
            amount: Math.floor(Math.random() * 100 + 50),
            category: [
              "Food & Dining",
              "Transportation",
              "Utilities & Bills",
              "Rent",
            ][Math.floor(Math.random() * 4)],
          });
        }
        break;
      case "yearly":
        for (let i = 0; i < 12; i++) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          date.setDate(1);
          data.push({
            date: date.toISOString().split("T")[0],
            amount: Math.floor(Math.random() * 500 + 500),
            category: ["Rent", "Utilities & Bills", "Insurance", "Savings"][
              Math.floor(Math.random() * 4)
            ],
          });
        }
        break;
    }
    return data;
  };

  async function fetchAnalysisData(range: TimeRange) {
    setLoading(true);
    // Simulate a delay (e.g., 2000ms or 2 seconds)
    await delay(2000);

    const simulatedExpenses = generateSimulatedExpenses(range);
    setExpenses(simulatedExpenses);

    const catTotals: Record<string, number> = {};
    simulatedExpenses.forEach((exp) => {
      catTotals[exp.category] = (catTotals[exp.category] || 0) + exp.amount;
    });
    const sortedCategories = Object.entries(catTotals).sort(
      (a, b) => b[1] - a[1]
    );
    const topCategory = sortedCategories[0]?.[0] || "your spending";

    const totalExpenses = simulatedExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );
    let monthlyAverage = 0;

    switch (range) {
      case "weekly":
        monthlyAverage = totalExpenses * 4;
        break;
      case "monthly":
        monthlyAverage = totalExpenses;
        break;
      case "quarterly":
        monthlyAverage = totalExpenses / 3;
        break;
      case "yearly":
        monthlyAverage = totalExpenses / 12;
        break;
    }

    const nextMonthExpense = monthlyAverage * 1.1;
    const budgetLimit = monthlyAverage * 0.9;
    const difference = nextMonthExpense - budgetLimit;

    setForecast({
      nextMonthExpense: Math.round(nextMonthExpense),
      budgetLimit: Math.round(budgetLimit),
      message: `Based on your ${range} data, you may exceed your budget by $${difference.toFixed(
        2
      )} next month.`,
    });

    const recommendations: Recommendation[] = [];
    recommendations.push({
      id: 1,
      text: `Based on your ${range} data, focus on reducing ${topCategory} expenses.`,
    });

    if (range === "weekly") {
      recommendations.push({
        id: 2,
        text: "Track daily spending to stay within your weekly budget.",
      });
    } else if (range === "monthly") {
      recommendations.push({
        id: 3,
        text: "Review monthly subscriptions for potential savings.",
      });
    } else if (range === "quarterly") {
      recommendations.push({
        id: 4,
        text: "Plan for upcoming quarterly expenses to avoid overspending.",
      });
    } else if (range === "yearly") {
      recommendations.push({
        id: 5,
        text: "Consider annual contract reviews for better rates.",
      });
    }

    setRecommendations(recommendations);
    setLoading(false);
  }

  useEffect(() => {
    if (expenses.length === 0) return;

    setBarData(expenses);
    setLineData(expenses);

    const catTotals: Record<string, number> = {};
    expenses.forEach((exp) => {
      catTotals[exp.category] = (catTotals[exp.category] || 0) + exp.amount;
    });
    const grouped = Object.entries(catTotals).map(([category, value]) => ({
      category,
      value,
    }));
    setPieData(grouped);
  }, [expenses]);

  function handleTimeRangeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setTimeRange(e.target.value as TimeRange);
  }

  const showBarChart = () => setVisibleChart("bar");
  const showLineChart = () => setVisibleChart("line");
  const showPieChart = () => setVisibleChart("pie");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Analysis & Insights</h1>

      {/* Time Range Selector */}
      <div className="flex items-center gap-2">
        <label className="font-medium text-sm">Time Range:</label>
        <select
          className="border rounded px-2 py-1"
          value={timeRange}
          onChange={handleTimeRangeChange}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center text-gray-600">
          Loading data, please wait...
        </div>
      )}

      {/* Budget Forecast Card */}
      {forecast && !loading && (
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-xl font-semibold mb-2">Budget Forecast</h2>
          <p>
            <span className="font-medium">Next Month's Expense:</span> $
            {forecast.nextMonthExpense}
          </p>
          <p>
            <span className="font-medium">Budget Limit:</span> $
            {forecast.budgetLimit}
          </p>
          <p className="mt-2 text-red-500">{forecast.message}</p>
          <p className="text-sm text-gray-600 mt-1">
            Powered by AI-driven predictions
          </p>
        </div>
      )}

      {/* Personalized Recommendations */}
      {recommendations.length > 0 && !loading && (
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-xl font-semibold mb-2">
            Personalized Recommendations
          </h2>
          <ul className="list-disc list-inside space-y-1">
            {recommendations.map((rec) => (
              <li key={rec.id}>{rec.text}</li>
            ))}
          </ul>
          <p className="text-sm text-gray-600 mt-1">
            Insights generated from your data
          </p>
        </div>
      )}

      {/* Chart Toggle Buttons */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={showBarChart}>
          Show Bar Chart
        </Button>
        <Button variant="outline" onClick={showLineChart}>
          Show Line Chart
        </Button>
        <Button variant="outline" onClick={showPieChart}>
          Show Pie Chart
        </Button>
      </div>

      {/* Render Charts Conditionally */}
      {visibleChart === "bar" && !loading && (
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-xl font-semibold mb-2">
            Bar Chart: Spending Over Time
          </h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" name="Amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {visibleChart === "line" && !loading && (
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-xl font-semibold mb-2">
            Line Chart: Spending Trend
          </h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#82ca9d"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {visibleChart === "pie" && !loading && (
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-xl font-semibold mb-2">
            Pie Chart: Category Breakdown
          </h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={COLORS[idx % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
