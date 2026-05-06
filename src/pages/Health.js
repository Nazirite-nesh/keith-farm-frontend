import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const API = "https://keith-farm-backend.onrender.com";

function Health() {
  const [records, setRecords] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    animalId: "", type: "", description: "",
    medication: "", cost: "", nextDueDate: ""
  });
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.user?.role === "admin";

  const fetchData = async () => {
    const res = await axios.get(`${API}/api/health`);
    const animalRes = await axios.get(`${API}/api/animals`);
    setRecords(res.data);
    setAnimals(animalRes.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`${API}/api/health/${editId}`, form);
        setEditId(null);
      } else {
        await axios.post(`${API}/api/health`, form);
      }
      setForm({ animalId: "", type: "", description: "",
        medication: "", cost: "", nextDueDate: "" });
      fetchData();
    } catch (err) {
      alert("Error saving record.");
    }
  };

  const handleEdit = (record) => {
    setEditId(record._id);
    setForm({
      animalId: record.animalId?._id || "",
      type: record.type,
      description: record.description,
      medication: record.medication,
      cost: record.cost,
      nextDueDate: record.nextDueDate ?
        new Date(record.nextDueDate).toISOString().split("T")[0] : ""
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this record?")) {
      await axios.delete(`${API}/api/health/${id}`);
      fetchData();
    }
  };

  const upcoming = records.filter(r => {
    if (!r.nextDueDate) return false;
    const diff = (new Date(r.nextDueDate) - new Date()) / (1000 * 60 * 60 * 24);
    return diff <= 7 && diff >= 0;
  });

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>💉 Health & Vet Log</h2>

        {upcoming.length > 0 && (
          <div style={styles.alert}>
            ⚠️ {upcoming.length} treatment(s) due within 7 days!
          </div>
        )}

        <h3 style={styles.subtitle}>{editId ? "✏️ Edit Record" : "Add Record"}</h3>
        <div style={styles.form}>
          <select style={styles.input}
            value={form.animalId}
            onChange={(e) => setForm({...form, animalId: e.target.value})}>
            <option value="">Select Animal</option>
            {animals.map(a => (
              <option key={a._id} value={a._id}>{a.tag} - {a.type}</option>
            ))}
          </select>
          <input style={styles.input} placeholder="Type (Vaccination/Treatment)"
            value={form.type}
            onChange={(e) => setForm({...form, type: e.target.value})} />
          <input style={styles.input} placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})} />
          <input style={styles.input} placeholder="Medication"
            value={form.medication}
            onChange={(e) => setForm({...form, medication: e.target.value})} />
          <input style={styles.input} type="number" placeholder="Cost (KES)"
            value={form.cost}
            onChange={(e) => setForm({...form, cost: e.target.value})} />
          <label style={styles.label}>Next Due Date</label>
          <input style={styles.input} type="date"
            value={form.nextDueDate}
            onChange={(e) => setForm({...form, nextDueDate: e.target.value})} />
          <button style={styles.button} onClick={handleSubmit}>
            {editId ? "Update Record" : "Record"}
          </button>
          {editId && (
            <button style={styles.cancelBtn} onClick={() => {
              setEditId(null);
              setForm({ animalId: "", type: "", description: "",
                medication: "", cost: "", nextDueDate: "" });
            }}>Cancel</button>
          )}
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th>Animal</th>
                <th>Type</th>
                <th>Medication</th>
                <th>Cost</th>
                <th>Next Due</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r._id} style={styles.row}>
                  <td>{r.animalId?.tag || "N/A"}</td>
                  <td>{r.type}</td>
                  <td>{r.medication}</td>
                  <td>KES {r.cost}</td>
                  <td>{r.nextDueDate ?
                    new Date(r.nextDueDate).toLocaleDateString() : "-"}</td>
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
  container: { padding: 20, background: "#f4f6f8", minHeight: "100vh" },
  title: { color: "#2e7d32" },
  subtitle: { color: "#2e7d32" },
  alert: { background: "#fff3e0", border: "1px solid #f57c00",
    padding: 12, borderRadius: 8, marginBottom: 20, color: "#e65100" },
  form: { display: "flex", flexDirection: "column", gap: 10,
    maxWidth: 400, marginBottom: 20 },
  input: { padding: 10, borderRadius: 8, border: "1px solid #ccc", fontSize: 16 },
  label: { color: "#555", fontSize: 14 },
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

export default Health;