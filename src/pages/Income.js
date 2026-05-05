import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Income() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    source: "", category: "", quantity: "", unitPrice: ""
  });

  const fetchIncome = async () => {
    const res = await axios.get("https://keith-farm-backend.onrender.com/api/income");
    setData(res.data);
  };

  useEffect(() => { fetchIncome(); }, []);

  const handleSubmit = async () => {
    const total = form.quantity * form.unitPrice;
    await axios.post("https://keith-farm-backend.onrender.com/api/income", { ...form, total });
    setForm({ source: "", category: "", quantity: "", unitPrice: "" });
    fetchIncome();
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>💰 Income</h2>
        <div style={styles.form}>
          <input style={styles.input} placeholder="Source (Egg Sale)"
            value={form.source}
            onChange={(e) => setForm({...form, source: e.target.value})} />
          <input style={styles.input} placeholder="Category (Poultry)"
            value={form.category}
            onChange={(e) => setForm({...form, category: e.target.value})} />
          <input style={styles.input} type="number" placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => setForm({...form, quantity: e.target.value})} />
          <input style={styles.input} type="number" placeholder="Unit Price"
            value={form.unitPrice}
            onChange={(e) => setForm({...form, unitPrice: e.target.value})} />
          <button style={styles.button} onClick={handleSubmit}>Add Income</button>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Source</th>
              <th>Category</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i}>
                <td>{item.source}</td>
                <td>{item.category}</td>
                <td>KES {item.total}</td>
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

export default Income;