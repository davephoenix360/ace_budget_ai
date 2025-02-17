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
    date: string;       // e.g. "2023-01-05"
    amount: number;     // total spent on that date (or aggregated weekly, monthly, etc.)
    category: string;   // e.g. "Food", "Rent"
};

type ForecastInfo = {
    nextMonthExpense: number;  // e.g. 800
    budgetLimit: number;       // e.g. 750
    message: string;           // e.g. "You may exceed your budget by $50 next month."
};

type Recommendation = {
    id: number;
    text: string;              // e.g. "Cut back on dining expenses."
};

type TimeRange = "weekly" | "monthly" | "quarterly" | "yearly";

export default function AnalysisPage() {
    const { user } = useUser();

    // States for raw data and derived info
    const [expenses, setExpenses] = useState<ExpenseData[]>([]);
    const [forecast, setForecast] = useState<ForecastInfo | null>(null);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

    // Chart data transformations
    const [barData, setBarData] = useState<ExpenseData[]>([]);
    const [lineData, setLineData] = useState<ExpenseData[]>([]);
    const [pieData, setPieData] = useState<{ category: string; value: number }[]>([]);

    // UI states: which chart is visible, and selected time range
    const [visibleChart, setVisibleChart] = useState<"none" | "bar" | "line" | "pie">("none");
    const [timeRange, setTimeRange] = useState<TimeRange>("monthly");

    // Colors for the pie chart
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#7A4FFF", "#FF4F81"];

    // Fetch data on mount or when user/timeRange changes
    useEffect(() => {
        if (user) {
            fetchAnalysisData(timeRange);
        }
    }, [user, timeRange]);

    /**
     * 1. Fetch or simulate analysis data (expenses, forecast, recommendations).
     * Replace with real backend calls or AI services as needed.
     */
    async function fetchAnalysisData(range: TimeRange) {
        /*
          // Example real call:
          // const res = await fetch(`/api/analysis?range=${range}`);
          // const data = await res.json();
          // setExpenses(data.expenses);
          // setForecast(data.forecast);
          // setRecommendations(data.recommendations);
        */

        // --- Simulated data for demonstration ---
        // We pretend that timeRange affects the data we fetch
        const simulatedExpenses: ExpenseData[] = [
            { date: "2023-01-01", amount: 150, category: "Food" },
            { date: "2023-01-05", amount: 80, category: "Transport" },
            { date: "2023-01-10", amount: 220, category: "Bills" },
            { date: "2023-02-02", amount: 150, category: "Food" },
            { date: "2023-02-15", amount: 90, category: "Entertainment" },
            { date: "2023-03-01", amount: 300, category: "Rent" },
        ];

        // In a real app, you might group or filter these based on `range`.
        // For instance, if range === 'weekly', you'd group by weeks, etc.
        // Here, we just return them as-is.

        setExpenses(simulatedExpenses);

        const simulatedForecast: ForecastInfo = {
            nextMonthExpense: 800,
            budgetLimit: 750,
            message: `Because you're looking at ${range} data, you may exceed your budget by $50 next month.`,
        };
        setForecast(simulatedForecast);

        const simulatedRecs: Recommendation[] = [
            { id: 1, text: `Based on ${range} data, consider meal prepping to cut dining costs.` },
            { id: 2, text: `Switch to a cheaper internet provider to save monthly expenses.` },
        ];
        setRecommendations(simulatedRecs);
    }

    /**
     * 2. Transform raw expenses into barData, lineData, and pieData
     */
    useEffect(() => {
        if (!expenses || expenses.length === 0) return;

        // For bar & line charts, we can just reuse the raw array:
        setBarData(expenses);
        setLineData(expenses);

        // For pie chart, group by category
        const catTotals: Record<string, number> = {};
        expenses.forEach((exp) => {
            if (!catTotals[exp.category]) catTotals[exp.category] = 0;
            catTotals[exp.category] += exp.amount;
        });
        const grouped = Object.entries(catTotals).map(([cat, val]) => ({
            category: cat,
            value: val,
        }));
        setPieData(grouped);

    }, [expenses]);

    /**
     * 3. Handler for time range select
     */
    function handleTimeRangeChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setTimeRange(e.target.value as TimeRange);
    }

    /**
     * 4. Handlers to toggle chart visibility
     */
    const showBarChart = () => setVisibleChart("bar");
    const showLineChart = () => setVisibleChart("line");
    const showPieChart = () => setVisibleChart("pie");

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Analysis & Insights</h1>

            {/* Time Range Selector */}
            <div className="flex items-center gap-2">
                <label className="font-medium text-sm">Time Range:</label>
                <select className="border rounded px-2 py-1" value={timeRange} onChange={handleTimeRangeChange}>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>

            {/* Budget Forecast Card */}
            {forecast && (
                <div className="bg-white rounded-lg p-4 shadow">
                    <h2 className="text-xl font-semibold mb-2">Budget Forecast</h2>
                    <p>
                        <span className="font-medium">Next Month's Expense:</span> ${forecast.nextMonthExpense}
                    </p>
                    <p>
                        <span className="font-medium">Budget Limit:</span> ${forecast.budgetLimit}
                    </p>
                    <p className="mt-2 text-red-500">{forecast.message}</p>
                    <p className="text-sm text-gray-600 mt-1">
                        {/* Indicate AI integration or backend logic here */}
                        Powered by AI-driven predictions
                    </p>
                </div>
            )}

            {/* Personalized Recommendations */}
            {recommendations.length > 0 && (
                <div className="bg-white rounded-lg p-4 shadow">
                    <h2 className="text-xl font-semibold mb-2">Personalized Recommendations</h2>
                    <ul className="list-disc list-inside space-y-1">
                        {recommendations.map((rec) => (
                            <li key={rec.id}>{rec.text}</li>
                        ))}
                    </ul>
                    <p className="text-sm text-gray-600 mt-1">
                        {/* Indicate your AI or ML pipeline here */}
                        Insights generated by your Python-based analysis
                    </p>
                </div>
            )}

            {/* Buttons to toggle each chart */}
            <div className="flex gap-4">
                <Button variant="outline" onClick={showBarChart}>Show Bar Chart</Button>
                <Button variant="outline" onClick={showLineChart}>Show Line Chart</Button>
                <Button variant="outline" onClick={showPieChart}>Show Pie Chart</Button>
            </div>

            {/* Conditionally render each chart */}
            {visibleChart === "bar" && (
                <div className="bg-white rounded-lg p-4 shadow">
                    <h2 className="text-xl font-semibold mb-2">Bar Chart: Spending Over Time</h2>
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

            {visibleChart === "line" && (
                <div className="bg-white rounded-lg p-4 shadow">
                    <h2 className="text-xl font-semibold mb-2">Line Chart: Spending Trend</h2>
                    <div style={{ width: "100%", height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={lineData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="amount" stroke="#82ca9d" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {visibleChart === "pie" && (
                <div className="bg-white rounded-lg p-4 shadow">
                    <h2 className="text-xl font-semibold mb-2">Pie Chart: Category Breakdown</h2>
                    <div style={{ width: "100%", height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={pieData} dataKey="value" nameKey="category" cx="50%" cy="50%" outerRadius={100} label>
                                    {pieData.map((entry, idx) => (
                                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
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
