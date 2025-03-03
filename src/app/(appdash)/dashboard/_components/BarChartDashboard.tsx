import React from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Jan", totalSpend: 400, amount: 600 },
  { name: "Feb", totalSpend: 300, amount: 500 },
  { name: "Mar", totalSpend: 500, amount: 700 },
  { name: "Apr", totalSpend: 450, amount: 650 },
  { name: "May", totalSpend: 600, amount: 800 },
  { name: "Jun", totalSpend: 700, amount: 900 },
];

function BarChartDashboard() {
  return (
    <div className="border rounded-2xl p-5">
      <h2 className="font-bold text-lg">Activity</h2>
      <ResponsiveContainer width={"80%"} height={300}>
        <BarChart data={data} margin={{ top: 7 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalSpend" stackId="a" fill="#4845d2" />
          <Bar dataKey="amount" stackId="a" fill="#C3C2FF" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartDashboard;
