import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const API = "https://keith-farm-backend.onrender.com";

function Eggs() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    zone: "", collected: "", broken: "", notes: ""
  });

  const fetchData = async () => {
    const res = await axios.get(`${API}/api/eggs`);
    setRecords(res.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    try {
      await axios.post(`${API}/api/eggs`, form);
      setForm({ zone: "", collected: "", broken: "", notes: "" });
      fetchData();
    } catch (err) {
      alert("Error adding record.");
    }
  };

  const totalEggs = records.reduce((a, b) => a + b.net, 0);
  const totalBroken = records.reduce((a, b) => a + b.broken, 0);

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>🥚 Egg Production</h2>

        {/* Summary Cards */}
        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>Total Eggs</h3>
            <p>{totalEggs}</p>
          </div>
          <div style={styles.card}>
            <h3>Total Broken</h3>
            <p style={{color: "#c62828"}}>{totalBroken}</p>
          </div>
        </div>

        {/* Form */}
        <div style={styles.form}>
          <input style={styles.input} placeholder="Zone (Laying Zone A)"
            value={form.zone}
            onChange={(e) => setForm({...form, zone: e.target.value})} />
          <input style={styles.input} type="number" placeholder="Collected"
            value={form.collected}
            onChange={(e) => setForm({...form, collected: e.target.value})} />
          <input style={styles.input} type="number" placeholder="Broken"
            value={form.broken}
            onChange={(e) => setForm({...form, broken: e.target.value})} />
          <input style={styles.input} placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({...form, notes: e.target.value})} />
          <button style={styles.button} onClick={handleSubmit}>
            Record Eggs
          </button>
        </div>

        {/* Table */}
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th>Date</th>
                <th>Zone</th>
                <th>Collected</th>
                <th>Broken</th>
                <th>Net</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r._id} style={styles.row}>
                  <td>{new Date(r.date).toLocaleDateString()}</td>
                  <td>{r.zone}</td>
                  <td>{r.collected}</td>
                  <td style={{color: "#c62828"}}>{r.broken}</td>
                  <td style={{color: "#2e7d32", fontWeight: "bold"}}>{r.net}</td>
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
  container: { padding: 20, background: "#f4f6f8", minHeight: "100vh" },
  title: { color: "#2e7d32" },
  cards: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 15, marginBottom: 20 },
  card: { background: "white", padding: 20, borderRadius: 10,
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: 10,
    maxWidth: 400, marginBottom: 20 },
  input: { padding: 10, borderRadius: 8, border: "1px solid #ccc", fontSize: 16 },
  button: { padding: 12, background: "#2e7d32", color: "white",
    border: "none", borderRadius: 8, fontSize: 16, cursor: "pointer" },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", background: "white",
    borderRadius: 10, overflow: "hidden" },
  thead: { background: "#2e7d32", color: "white" },
  row: { borderBottom: "1px solid #eee", textAlign: "center" }
};

export default Eggs;