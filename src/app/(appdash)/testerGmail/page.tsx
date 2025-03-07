// app/dashboard/page.tsx
"use client";

import { useState } from "react";

export default function DashboardPage() {
  const [messages, setMessages] = useState<{
    snippet: string;
    body: string;
  }[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch Gmail messages from the API route
  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/gmail/read");
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Gmail Integration Demo</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={fetchMessages}
      >
        Fetch Gmail Messages
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {messages && (
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(messages, null, 2)}
        </pre>
      )}
      <p className="mt-4">
        To authenticate with Gmail, navigate to{" "}
        <a href="/api/gmail/auth" className="text-blue-600 underline">
          /api/gmail/auth
        </a>{" "}
        in your browser.
      </p>
    </div>
  );
}
