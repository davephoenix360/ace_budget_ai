// app/expenses/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export default function ExpensesPage() {
  const { user } = useUser();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [newExpense, setNewExpense] = useState({
    userId: user?.id, // Replace with actual authenticated user ID
    amount: 0,
    description: "",
    category: "",
    date: new Date().toISOString(),
    receiptUrl: "",
  });
  const [editing, setEditing] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState("");
  const [updatedExpense, setUpdatedExpense] = useState({
    userId: user?.id, // Replace with actual authenticated user ID
    amount: 0,
    description: "",
    category: "",
    date: new Date().toISOString(),
    receiptUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch expenses from the API
  const fetchExpenses = async () => {
    try {
      // INclude the clerkId in the query string
      const res = await fetch("/api/expenses?clerkId=" + user?.id);
      const data = await res.json();
      setExpenses(data);
      console.log("Expenses fetched:", data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("Failed to fetch expenses");
    }
  };

  // Add a new expense
  const addExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExpense),
      });
      if (!res.ok) throw new Error("Failed to create expense");
      const createdExpense = await res.json();
      setExpenses((prev) => [...prev, createdExpense]);
      setNewExpense({
        userId: newExpense.userId,
        amount: 0,
        description: "",
        category: "",
        date: new Date().toISOString(),
        receiptUrl: "",
      });
    } catch (err) {
      console.error(err);
      setError("Error creating expense");
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (id: string) => {
    setLoading(true);
    setError("");
    fetch(`/api/expenses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedExpense),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Updated expense:", data);
        setExpenses((prev) =>
          prev.map((expense) =>
            expense._id === id ? { ...expense, ...updatedExpense } : expense
          )
        );
      })
      .catch((err) => {
        console.error("Error updating expense:", err);
        setError("Failed to update expense");
      })
      .finally(() => {
        setLoading(false);
        setEditing(false);
        setUpdatedExpense({
          userId: user?.id,
          amount: 0,
          description: "",
          category: "",
          date: new Date().toISOString(),
          receiptUrl: "",
        });
      });
  };

  const deleteExpense = async (id: string) => {
    fetch(`/api/expenses/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Deleted expense:", data);
        setExpenses((prev) => prev.filter((expense) => expense._id !== id));
      })
      .catch((err) => {
        console.error("Error deleting expense:", err);
        setError("Failed to delete expense");
      });
  };

  useEffect(() => {
    if (!user) return;
    fetchExpenses();
    console.log("Expenses fetched for user:", user?.id);
    setNewExpense({ ...newExpense, userId: user?.id });
  }, [user]);

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Expenses</h1>
      {error && <p className="text-red-500">{error}</p>}
      {editing ? (
        <form
          onSubmit={() => updateExpense(selectedExpenseId)}
          className="mb-4"
        >
          <div>
            <label>Amount:</label>
            <input
              type="number"
              value={updatedExpense?.amount}
              onChange={(e) =>
                setUpdatedExpense({
                  ...updatedExpense,
                  amount: parseFloat(e.target.value),
                })
              }
              required
              className="border p-2"
            />
          </div>
          <div>
            <label>Description:</label>
            <input
              type="text"
              value={updatedExpense.description}
              onChange={(e) =>
                setUpdatedExpense({
                  ...updatedExpense,
                  description: e.target.value,
                })
              }
              required
              className="border p-2"
            />
          </div>
          <div>
            <label>Category:</label>
            <input
              type="text"
              value={updatedExpense.category}
              onChange={(e) =>
                setUpdatedExpense({ ...updatedExpense, category: e.target.value })
              }
              required
              className="border p-2"
            />
          </div>
          <div>
            <label>Date:</label>
            <input
              type="date"
              value={updatedExpense.date.slice(0, 10)}
              onChange={(e) =>
                setUpdatedExpense({
                  ...updatedExpense,
                  date: new Date(e.target.value).toISOString(),
                })
              }
              required
              className="border p-2"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Expense"}
          </button>
        </form>
      ) : (
        <form onSubmit={addExpense} className="mb-4">
          <div>
            <label>Amount:</label>
            <input
              type="number"
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense({
                  ...newExpense,
                  amount: parseFloat(e.target.value),
                })
              }
              required
              className="border p-2"
            />
          </div>
          <div>
            <label>Description:</label>
            <input
              type="text"
              value={newExpense.description}
              onChange={(e) =>
                setNewExpense({ ...newExpense, description: e.target.value })
              }
              required
              className="border p-2"
            />
          </div>
          <div>
            <label>Category:</label>
            <input
              type="text"
              value={newExpense.category}
              onChange={(e) =>
                setNewExpense({ ...newExpense, category: e.target.value })
              }
              required
              className="border p-2"
            />
          </div>
          <div>
            <label>Date:</label>
            <input
              type="date"
              value={newExpense.date.slice(0, 10)}
              onChange={(e) =>
                setNewExpense({
                  ...newExpense,
                  date: new Date(e.target.value).toISOString(),
                })
              }
              required
              className="border p-2"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Expense"}
          </button>
        </form>
      )}

      <h2 className="text-xl mt-8">Expense List</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense._id} className="border p-2 my-2">
            <p>
              <strong>Amount:</strong> {expense.amount}
            </p>
            <p>
              <strong>Description:</strong> {expense.description}
            </p>
            <p>
              <strong>Category:</strong> {expense.category}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(expense.date).toLocaleDateString()}
            </p>
            <div>
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded mt-2 mr-2"
                onClick={() => {
                  setEditing(true);
                  setSelectedExpenseId(expense._id);
                  setUpdatedExpense(expense);
                }}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded mt-2"
                onClick={() => deleteExpense(expense._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
