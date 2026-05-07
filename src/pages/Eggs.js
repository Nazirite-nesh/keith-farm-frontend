import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const API = "https://keith-farm-backend.onrender.com";

function Eggs() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    zone: "", collected: "", broken: "", notes: ""
  });
  const [editId, setEditId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.user?.role || user?.role;
const isAdmin = role === "admin";

  const fetchData = async () => {
    const res = await axios.get(`${API}/api/eggs`);
    setRecords(res.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    try {
      const net = form.collected - form.broken;
      if (editId) {
        await axios.put(`${API}/api/eggs/${editId}`, {...form, net});
        setEditId(null);
      } else {
        const userName = JSON.parse(localStorage.getItem("user"))?.user?.name || JSON.parse(localStorage.getItem("user"))?.name;
        await axios.post(`${API}/api/eggs`, {...form, createdBy: userName});
      }
      setForm({ zone: "", collected: "", broken: "", notes: "" });
      fetchData();
    } catch (err) {
      alert("Error saving record.");
    }
  };

  const handleEdit = (record) => {
    setEditId(record._id);
    setForm({
      zone: record.zone,
      collected: record.collected,
      broken: record.broken,
      notes: record.notes || ""
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this record?")) {
      await axios.delete(`${API}/api/eggs/${id}`);
      fetchData();
    }
  };

  const totalEggs = records.reduce((a, b) => a + b.net, 0);
  const totalBroken = records.reduce((a, b) => a + b.broken, 0);

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>🥚 Egg Production</h2>

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

        <h3 style={styles.subtitle}>{editId ? "✏️ Edit Record" : "Add Record"}</h3>
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
            {editId ? "Update Record" : "Record Eggs"}
          </button>
          {editId && (
            <button style={styles.cancelBtn} onClick={() => {
              setEditId(null);
              setForm({ zone: "", collected: "", broken: "", notes: "" });
            }}>Cancel</button>
          )}
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th>Date</th>
                <th>Zone</th>
                <th>Collected</th>
                <th>Broken</th>
                <th>Net</th>
                <th>Actions</th>
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
                  <td>
                    <button style={styles.editBtn}
                      onClick={() => handleEdit(r)}>Edit</button>
                    {isAdmin && (
                      <button style={styles.deleteBtn}
                        onClick={() => handleDelete(r._id)}>Delete</button>
                    )}
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
  cards: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 15, marginBottom: 20 },
  card: { background: "white", padding: 20, borderRadius: 10,
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)", textAlign: "center" },
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

export default Eggs;