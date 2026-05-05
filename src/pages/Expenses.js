import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Expenses() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    category: "", amount: "", notes: ""
  });

  const fetchExpenses = async () => {
    const res = await axios.get("https://keith-farm-backend.onrender.com/api/expense");
    setData(res.data);
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleSubmit = async () => {
    await axios.post("https://keith-farm-backend.onrender.com/api/expense", form);
    setForm({ category: "", amount: "", notes: "" });
    fetchExpenses();
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>💸 Expenses</h2>
        <div style={styles.form}>
          <input style={styles.input} placeholder="Category (Feed)"
            value={form.category}
            onChange={(e) => setForm({...form, category: e.target.value})} />
          <input style={styles.input} type="number" placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({...form, amount: e.target.value})} />
          <input style={styles.input} placeholder="Notes"
            value={form.notes}
            onChange={(e) => setForm({...form, notes: e.target.value})} />
          <button style={styles.button} onClick={handleSubmit}>Add Expense</button>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i}>
                <td>{item.category}</td>
                <td>KES {item.amount}</td>
                <td>{item.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: 20, background: "#f4f6f8", minHeight: "100vh" },
  title: { color: "#2e7d32" },
  form: { display: "flex", flexDirection: "column", gap: 10,
    maxWidth: 400, marginBottom: 20 },
  input: { padding: 10, borderRadius: 8, border: "1px solid #ccc", fontSize: 16 },
  button: { padding: 12, background: "#2e7d32", color: "white",
    border: "none", borderRadius: 8, fontSize: 16, cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse", background: "white",
    borderRadius: 10, overflow: "hidden" }
};

export default Expenses;