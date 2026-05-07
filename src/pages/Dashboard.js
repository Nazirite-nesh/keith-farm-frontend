import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const API = "https://keith-farm-backend.onrender.com";

function Dashboard() {
  const [stats, setStats] = useState({ income: 0, expense: 0, animals: 0, eggs: 0 });
  const [chartData, setChartData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomeRes = await axios.get(`${API}/api/income`);
        const expenseRes = await axios.get(`${API}/api/expense`);
        const animalsRes = await axios.get(`${API}/api/animals`);
        const eggsRes = await axios.get(`${API}/api/eggs`);
        const feedRes = await axios.get(`${API}/api/feed`);
        const healthRes = await axios.get(`${API}/api/health`);

        const totalIncome = incomeRes.data.reduce((a, b) => a + b.total, 0);
        const totalExpense = expenseRes.data.reduce((a, b) => a + b.amount, 0);
        const totalEggs = eggsRes.data.reduce((a, b) => a + b.net, 0);
        const activeAnimals = animalsRes.data.filter(a => a.status === "Active").length;

        setStats({
          income: totalIncome,
          expense: totalExpense,
          animals: activeAnimals,
          eggs: totalEggs
        });

        // Monthly chart data
        const monthly = {};
        incomeRes.data.forEach(item => {
          const month = new Date(item.date).toLocaleString("default", { month: "short" });
          if (!monthly[month]) monthly[month] = { month, income: 0, expense: 0 };
          monthly[month].income += item.total;
        });
        expenseRes.data.forEach(item => {
          const month = new Date(item.date).toLocaleString("default", { month: "short" });
          if (!monthly[month]) monthly[month] = { month, income: 0, expense: 0 };
          monthly[month].expense += item.amount;
        });
        setChartData(Object.values(monthly));

        // Alerts
        const alertList = [];
        feedRes.data.forEach(f => {
          if (f.quantity <= f.reorderLevel) {
            alertList.push(`🌽 Low feed: ${f.name} (${f.quantity} ${f.unit} left)`);
          }
        });
        healthRes.data.forEach(r => {
          if (!r.nextDueDate) return;
          const diff = (new Date(r.nextDueDate) - new Date()) / (1000 * 60 * 60 * 24);
          if (diff <= 7 && diff >= 0) {
            alertList.push(`💉 Treatment due: ${r.animalId?.tag} - ${r.type}`);
          }
        });
        setAlerts(alertList);

      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.welcome}>Welcome, {user?.user?.name}</p>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div style={styles.alertBox}>
            {alerts.map((a, i) => <div key={i}>⚠️ {a}</div>)}
          </div>
        )}

        {/* KPI Cards */}
        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>💰 Revenue</h3>
            <p>KES {stats.income.toLocaleString()}</p>
          </div>
          <div style={styles.card}>
            <h3>💸 Expenses</h3>
            <p>KES {stats.expense.toLocaleString()}</p>
          </div>
          <div style={{...styles.card, background: stats.income - stats.expense >= 0 ? "#e8f5e9" : "#ffebee"}}>
            <h3>📈 Profit</h3>
            <p>KES {(stats.income - stats.expense).toLocaleString()}</p>
          </div>
          <div style={styles.card}>
            <h3>🐖 Animals</h3>
            <p>{stats.animals}</p>
          </div>
          <div style={styles.card}>
            <h3>🥚 Eggs</h3>
            <p>{stats.eggs}</p>
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div style={styles.chartBox}>
            <h3>Income vs Expenses</h3>
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
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: 20, background: "rgba(255,255,255,0.88)", minHeight: "100vh" },
  title: { color: "#2e7d32" },
  welcome: { color: "#555" },
  alertBox: { background: "#fff3e0", border: "1px solid #f57c00",
    padding: 12, borderRadius: 8, marginBottom: 20, color: "#e65100" },
  cards: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 15, marginBottom: 20 },
  card: { background: "white", padding: 20, borderRadius: 10,
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)", textAlign: "center" },
  chartBox: { background: "white", padding: 20, borderRadius: 10,
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)", marginBottom: 20 }
};

export default Dashboard;