import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const API = "https://keith-farm-backend.onrender.com";

function ProfitLoss() {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const incomeRes = await axios.get(`${API}/api/income`);
      const expenseRes = await axios.get(`${API}/api/expense`);
      setIncome(incomeRes.data);
      setExpenses(expenseRes.data);
    };
    fetchData();
  }, []);

  const totalIncome = income.reduce((a, b) => a + b.total, 0);
  const totalExpense = expenses.reduce((a, b) => a + b.amount, 0);
  const profit = totalIncome - totalExpense;

  // Monthly aggregation
  const monthly = {};
  income.forEach(item => {
    const month = new Date(item.date).toLocaleString("default", { month: "short", year: "2-digit" });
    if (!monthly[month]) monthly[month] = { month, income: 0, expense: 0 };
    monthly[month].income += item.total;
  });
  expenses.forEach(item => {
    const month = new Date(item.date).toLocaleString("default", { month: "short", year: "2-digit" });
    if (!monthly[month]) monthly[month] = { month, income: 0, expense: 0 };
    monthly[month].expense += item.amount;
  });

  const chartData = Object.values(monthly);

  // Category breakdown
  const expenseByCategory = {};
  expenses.forEach(e => {
    if (!expenseByCategory[e.category]) expenseByCategory[e.category] = 0;
    expenseByCategory[e.category] += e.amount;
  });

  const incomeBySource = {};
  income.forEach(i => {
    if (!incomeBySource[i.source]) incomeBySource[i.source] = 0;
    incomeBySource[i.source] += i.total;
  });

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>📊 Profit & Loss Report</h2>

        {/* Summary Cards */}
        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>💰 Total Income</h3>
            <p style={{color: "#2e7d32", fontSize: 22}}>KES {totalIncome.toLocaleString()}</p>
          </div>
          <div style={styles.card}>
            <h3>💸 Total Expenses</h3>
            <p style={{color: "#c62828", fontSize: 22}}>KES {totalExpense.toLocaleString()}</p>
          </div>
          <div style={{...styles.card, background: profit >= 0 ? "#e8f5e9" : "#ffebee"}}>
            <h3>📈 Net Profit</h3>
            <p style={{color: profit >= 0 ? "#2e7d32" : "#c62828", fontSize: 22}}>
              KES {profit.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div style={styles.chartBox}>
          <h3>Monthly Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#2e7d32" name="Income" />
              <Bar dataKey="expense" fill="#c62828" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Income Breakdown */}
        <div style={styles.breakdown}>
          <h3>Income by Source</h3>
          {Object.entries(incomeBySource).map(([source, total]) => (
            <div key={source} style={styles.breakdownRow}>
              <span>{source}</span>
              <span style={{color: "#2e7d32"}}>KES {total.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Expense Breakdown */}
        <div style={styles.breakdown}>
          <h3>Expenses by Category</h3>
          {Object.entries(expenseByCategory).map(([cat, total]) => (
            <div key={cat} style={styles.breakdownRow}>
              <span>{cat}</span>
              <span style={{color: "#c62828"}}>KES {total.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: 20, background: "rgba(255,255,255,0.88)", minHeight: "100vh" },
  title: { color: "#2e7d32" },
  cards: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 15, marginBottom: 20 },
  card: { background: "white", padding: 20, borderRadius: 10,
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)", textAlign: "center" },
  chartBox: { background: "white", padding: 20, borderRadius: 10,
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)", marginBottom: 20 },
  breakdown: { background: "white", padding: 20, borderRadius: 10,
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)", marginBottom: 15 },
  breakdownRow: { display: "flex", justifyContent: "space-between",
    padding: "8px 0", borderBottom: "1px solid #eee" }
};

export default ProfitLoss;