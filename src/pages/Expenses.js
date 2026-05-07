import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const API = "https://keith-farm-backend.onrender.com";

function Expenses() {
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    category: "", amount: "", notes: ""
  });

  const fetchExpenses = async () => {
    const res = await axios.get(`${API}/api/expense`);
    setData(res.data);
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`${API}/api/expense/${editId}`, form);
        setEditId(null);
      } else {
        await axios.post(`${API}/api/expense`, form);
      }
      setForm({ category: "", amount: "", notes: "" });
      fetchExpenses();
    } catch (err) {
      alert("Error saving expense.");
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setForm({
      category: item.category,
      amount: item.amount,
      notes: item.notes
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this record?")) {
      await axios.delete(`${API}/api/expense/${id}`);
      fetchExpenses();
    }
  };

  const total = data.reduce((a, b) => a + b.amount, 0);

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>💸 Expenses</h2>
        <div style={styles.totalCard}>
          <h3>Total Expenses</h3>
          <p style={{color: "#c62828", fontSize: 22}}>KES {total.toLocaleString()}</p>
        </div>

        <h3 style={styles.subtitle}>{editId ? "✏️ Edit Expense" : "Add Expense"}</h3>
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
          <button style={styles.button} onClick={handleSubmit}>
            {editId ? "Update Expense" : "Add Expense"}
          </button>
          {editId && (
            <button style={styles.cancelBtn} onClick={() => {
              setEditId(null);
              setForm({ category: "", amount: "", notes: "" });
            }}>Cancel</button>
          )}
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item._id} style={styles.row}>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>{item.category}</td>
                  <td style={{color: "#c62828"}}>KES {item.amount}</td>
                  <td>{item.notes}</td>
                  <td>
                    <button style={styles.editBtn}
                      onClick={() => handleEdit(item)}>Edit</button>
                    <button style={styles.deleteBtn}
                      onClick={() => handleDelete(item._id)}>Delete</button>
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
  subtitle: { color: "#2e7d32" },
  totalCard: { background: "white", padding: 15, borderRadius: 10,
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)", marginBottom: 20,
    textAlign: "center", maxWidth: 200 },
  form: { display: "flex", flexDirection: "column", gap: 10,
    maxWidth: 400, marginBottom: 20 },
  input: { padding: 10, borderRadius: 8, border: "1px solid #ccc", fontSize: 16 },
  button: { padding: 12, background: "#2e7d32", color: "white",
    border: "none", borderRadius: 8, fontSize: 16, cursor: "pointer" },
  cancelBtn: { padding: 12, background: "#757575", color: "white",
    border: "none", borderRadius: 8, fontSize: 16, cursor: "pointer" },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", background: "white",
    borderRadius: 10, overflow: "hidden" },
  thead: { background: "#2e7d32", color: "white" },
  row: { borderBottom: "1px solid #eee", textAlign: "center" },
  editBtn: { background: "#1565c0", color: "white", border: "none",
    padding: "4px 8px", borderRadius: 6, cursor: "pointer", marginRight: 4 },
  deleteBtn: { background: "#c62828", color: "white", border: "none",
    padding: "4px 8px", borderRadius: 6, cursor: "pointer" }
};

export default Expenses;