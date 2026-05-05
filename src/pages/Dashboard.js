import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [stats, setStats] = useState({ income: 0, expense: 0 });
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const income = await axios.get("https://keith-farm-backend.onrender.com/api/income");
        const expense = await axios.get("https://keith-farm-backend.onrender.com");
        const totalIncome = income.data.reduce((a, b) => a + b.total, 0);
        const totalExpense = expense.data.reduce((a, b) => a + b.amount, 0);
        setStats({ income: totalIncome, expense: totalExpense });
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
        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>💰 Revenue</h3>
            <p>KES {stats.income}</p>
          </div>
          <div style={styles.card}>
            <h3>💸 Expenses</h3>
            <p>KES {stats.expense}</p>
          </div>
          <div style={{...styles.card, background: stats.income - stats.expense >= 0 ? "#e8f5e9" : "#ffebee"}}>
            <h3>📈 Profit</h3>
            <p>KES {stats.income - stats.expense}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: 20, background: "#f4f6f8", minHeight: "100vh" },
  title: { color: "#2e7d32" },
  welcome: { color: "#555" },
  cards: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 15 },
  card: { background: "white", padding: 20, borderRadius: 10,
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)", textAlign: "center" }
};

export default Dashboard;