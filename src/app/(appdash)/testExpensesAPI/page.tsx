"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { ExpenseCategory } from "@/mongodb/models/expense";

interface ExpenseForm {
  amount: string;
  description: string;
  category: ExpenseCategory | "";
  date: string;
  receiptUrl?: string;
}

export default function ExpensesPage() {
  const { user } = useUser();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [form, setForm] = useState<ExpenseForm>({
    amount: "",
    description: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    receiptUrl: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchExpenses = async () => {
    try {
      const res = await fetch(`/api/expenses?clerkId=${user?.id}`);
      if (!res.ok) throw new Error("Failed to fetch expenses");
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch expenses");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/expenses/${editingId}` : "/api/expenses";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user?.id,
          ...form,
          amount: parseFloat(form.amount),
        }),
      });

      if (!res.ok) throw new Error(await res.json().then((data) => data.error));

      const result = await res.json();
      setExpenses((prev) =>
        editingId
          ? prev.map((e) => (e._id === editingId ? result : e))
          : [...prev, result]
      );
      setForm({
        amount: "",
        description: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
      });
      setEditingId(null);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to save expense");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete expense");
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete expense");
    }
  };

  useEffect(() => {
    if (user?.id) fetchExpenses();
  }, [user?.id]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Expense Management</h1>

      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Expense" : "Add New Expense"}
        </h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2">Category</label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value as ExpenseCategory,
                })
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Category</option>
              {Object.values(ExpenseCategory).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Saving..." : editingId ? "Update Expense" : "Add Expense"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({
                amount: "",
                description: "",
                category: "",
                date: new Date().toISOString().split("T")[0],
              });
            }}
            className="mt-4 ml-4 bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Cancel Edit
          </button>
        )}
      </form>

      <section>
        <h2 className="text-xl font-semibold mb-4">Expense History</h2>
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div
              key={expense._id}
              className="p-4 border rounded-lg bg-white shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">${expense.amount.toFixed(2)}</p>
                  <p className="text-gray-600">{expense.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                    {expense.category}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    setEditingId(expense._id);
                    setForm({
                      amount: expense.amount.toString(),
                      description: expense.description,
                      category: expense.category,
                      date: new Date(expense.date).toISOString().split("T")[0],
                      receiptUrl: expense.receiptUrl,
                    });
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(expense._id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
