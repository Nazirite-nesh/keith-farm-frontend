import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
  LineChart, Line, CartesianGrid
} from "recharts";

const API = "https://keith-farm-backend.onrender.com";
const COLORS = ["#2e7d32","#c62828","#1565c0","#f57c00","#6a1b9a","#00838f"];

function Dashboard() {
  const [stats, setStats] = useState({ income: 0, expense: 0, animals: 0, eggs: 0 });
  const [monthlyData, setMonthlyData] = useState([]);
  const [incomeBySource, setIncomeBySource] = useState([]);
  const [expenseByCategory, setExpenseByCategory] = useState([]);
  const [revenueByMonth, setRevenueByMonth] = useState([]);
  const [feedData, setFeedData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incomeRes, expenseRes, animalsRes, eggsRes, feedRes, healthRes, incubatorRes] = await Promise.all([
          axios.get(`${API}/api/income`),
          axios.get(`${API}/api/expense`),
          axios.get(`${API}/api/animals`),
          axios.get(`${API}/api/eggs`),
          axios.get(`${API}/api/incubator`).catch(() => ({data:[]})),
          axios.get(`${API}/api/feed`),
          axios.get(`${API}/api/health`)
        ]);

        const totalIncome = incomeRes.data.reduce((a, b) => a + b.total, 0);
        const totalExpense = expenseRes.data.reduce((a, b) => a + b.amount, 0);
        const totalEggs = eggsRes.data.reduce((a, b) => a + b.net, 0);
        const totalIncubator = incubatorRes.data.reduce((a, b) => a + Number(b.eggs), 0);
        const availableEggs = totalEggs - totalIncubator;
        const activeAnimals = animalsRes.data.filter(a => a.status === "Active").length;

        setStats({ income: totalIncome, expense: totalExpense, animals: activeAnimals, eggs: totalEggs });

        // Monthly data
        const monthly = {};
        incomeRes.data.forEach(item => {
          const month = new Date(item.date).toLocaleString("default", { month: "short" });
          if (!monthly[month]) monthly[month] = { month, income: 0, expense: 0, profit: 0 };
          monthly[month].income += item.total;
        });
        expenseRes.data.forEach(item => {
          const month = new Date(item.date).toLocaleString("default", { month: "short" });
          if (!monthly[month]) monthly[month] = { month, income: 0, expense: 0, profit: 0 };
          monthly[month].expense += item.amount;
        });
        Object.values(monthly).forEach(m => m.profit = m.income - m.expense);
        setMonthlyData(Object.values(monthly));

        // Revenue trend (line chart)
        setRevenueByMonth(Object.values(monthly).map(m => ({ month: m.month, revenue: m.income })));

        // Income by source (pie chart)
        const incSrc = {};
        incomeRes.data.forEach(i => {
          if (!incSrc[i.source]) incSrc[i.source] = 0;
          incSrc[i.source] += i.total;
        });
        setIncomeBySource(Object.entries(incSrc).map(([name, value]) => ({ name, value })));

        // Expense by category (pie chart)
        const expCat = {};
        expenseRes.data.forEach(e => {
          if (!expCat[e.category]) expCat[e.category] = 0;
          expCat[e.category] += e.amount;
        });
        setExpenseByCategory(Object.entries(expCat).map(([name, value]) => ({ name, value })));

        // Feed consumption chart
        setFeedData(feedRes.data.map(f => ({ name: f.name, stock: f.quantity, reorder: f.reorderLevel })));

        // Recent transactions
        const allTrans = [
          ...incomeRes.data.slice(0, 5).map(i => ({ type: "Income", desc: i.source, amount: i.total, date: i.date })),
          ...expenseRes.data.slice(0, 5).map(e => ({ type: "Expense", desc: e.category, amount: e.amount, date: e.date }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);
        setRecentTransactions(allTrans);

        // Alerts
        const alertList = [];
        feedRes.data.forEach(f => {
          if (f.quantity === 0) alertList.push({ type: "danger", msg: `🔴 ${f.name} is OUT OF STOCK!` });
          else if (f.quantity <= f.reorderLevel) alertList.push({ type: "warning", msg: `🟡 Low feed: ${f.name} (${f.quantity} ${f.unit} left)` });
        });
        healthRes.data.forEach(r => {
          if (!r.nextDueDate) return;
          const diff = (new Date(r.nextDueDate) - new Date()) / (1000 * 60 * 60 * 24);
          if (diff < 0) alertList.push({ type: "danger", msg: `🔴 Overdue treatment: ${r.animalId?.tag} - ${r.type}` });
          else if (diff <= 7) alertList.push({ type: "warning", msg: `🟡 Treatment due in ${Math.ceil(diff)} days: ${r.animalId?.tag} - ${r.type}` });
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
        <p style={styles.welcome}>Welcome, {user?.user?.name || user?.name}</p>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div style={styles.alertBox}>
            <h3>⚠️ Alerts</h3>
            {alerts.map((a, i) => (
              <div key={i} style={{...styles.alertItem, background: a.type === "danger" ? "#ffebee" : "#fff3e0", borderLeft: `4px solid ${a.type === "danger" ? "#c62828" : "#f57c00"}`}}>
                {a.msg}
              </div>
            ))}
          </div>
        )}

        {/* KPI Cards */}
        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>💰 Revenue</h3>
            <p style={{color:"#2e7d32",fontSize:20}}>KES {stats.income.toLocaleString()}</p>
          </div>
          <div style={styles.card}>
            <h3>💸 Expenses</h3>
            <p style={{color:"#c62828",fontSize:20}}>KES {stats.expense.toLocaleString()}</p>
          </div>
          <div style={{...styles.card, background: stats.income - stats.expense >= 0 ? "#e8f5e9" : "#ffebee"}}>
            <h3>📈 Profit</h3>
            <p style={{color: stats.income - stats.expense >= 0 ? "#2e7d32" : "#c62828", fontSize:20}}>KES {(stats.income - stats.expense).toLocaleString()}</p>
          </div>
          <div style={styles.card}>
            <h3>🐖 Animals</h3>
            <p style={{fontSize:20}}>{stats.animals}</p>
          </div>
          <div style={styles.card}>
            <h3>🥚 Eggs</h3>
            <p style={{fontSize:20}}>{stats.eggs}</p>
          </div>
        </div>

        {/* Monthly Overview */}
        <div style={styles.chartBox}>
          <h3>📅 Monthly Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#2e7d32" name="Income" />
              <Bar dataKey="expense" fill="#c62828" name="Expenses" />
              <Bar dataKey="profit" fill="#1565c0" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend Line Chart */}
        <div style={styles.chartBox}>
          <h3>📈 Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#2e7d32" strokeWidth={3} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Charts */}
        <div style={styles.pieRow}>
          <div style={styles.chartBox}>
            <h3>💰 Income by Source</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={incomeBySource} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({name, percent}) => `${name} ${(percent*100).toFixed(0)}%`}>
                  {incomeBySource.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={styles.chartBox}>
            <h3>💸 Expenses by Category</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({name, percent}) => `${name} ${(percent*100).toFixed(0)}%`}>
                  {expenseByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feed Consumption Chart */}
        <div style={styles.chartBox}>
          <h3>🌽 Feed Stock Levels</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={feedData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stock" fill="#2e7d32" name="Current Stock" />
              <Bar dataKey="reorder" fill="#f57c00" name="Reorder Level" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Transactions */}
        <div style={styles.chartBox}>
          <h3>🕐 Recent Transactions</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
<th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((t, i) => (
                <tr key={i} style={styles.row}>
                  <td>{new Date(t.date).toLocaleDateString()}</td>
                  <td>
                    <span style={{...styles.badge, background: t.type === "Income" ? "#2e7d32" : "#c62828"}}>
                      {t.type}
                    </span>
                  </td>
                  <td>{t.desc}</td>
                  <td style={{color: t.type === "Income" ? "#2e7d32" : "#c62828"}}>
                    KES {t.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: { padding: 20, background: "rgba(255,255,255,0.88)", minHeight: "100vh" },
  title: { color: "#2e7d32" },
  welcome: { color: "#555", marginBottom: 15 },
  alertBox: { background: "white", padding: 15, borderRadius: 10, marginBottom: 20, boxShadow: "0 2px 5px rgba(0,0,0,0.1)" },
  alertItem: { padding: "8px 12px", borderRadius: 6, marginTop: 8, fontSize: 14 },
  cards: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 15, marginBottom: 20 },
  card: { background: "white", padding: 20, borderRadius: 10, boxShadow: "0 2px 5px rgba(0,0,0,0.1)", textAlign: "center" },
  chartBox: { background: "white", padding: 20, borderRadius: 10, boxShadow: "0 2px 5px rgba(0,0,0,0.1)", marginBottom: 20 },
  pieRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 15, marginBottom: 0 },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#2e7d32", color: "white" },
  row: { borderBottom: "1px solid #eee", textAlign: "center" },
  badge: { color: "white", padding: "3px 8px", borderRadius: 10, fontSize: 12 }
};

export default Dashboard;
