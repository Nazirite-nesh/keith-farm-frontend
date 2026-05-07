import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const API = "https://keith-farm-backend.onrender.com";

function Workers() {
  const [workers, setWorkers] = useState([]);
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "worker"
  });
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.user?.role === "admin";

  const fetchWorkers = async () => {
    const res = await axios.get(`${API}/api/auth/users`);
    setWorkers(res.data);
  };

  useEffect(() => { fetchWorkers(); }, []);

  const handleSubmit = async () => {
    try {
      await axios.post(`${API}/api/auth/register`, form);
      setForm({ name: "", email: "", password: "", role: "worker" });
      fetchWorkers();
      alert("User created successfully!");
    } catch (err) {
      alert("Error creating user. Email may already exist.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this user?")) {
      await axios.delete(`${API}/api/auth/users/${id}`);
      fetchWorkers();
    }
  };

  if (!isAdmin) {
    return (
      <div>
        <Navbar />
        <div style={styles.container}>
          <h2 style={{color: "#c62828"}}>Access Denied</h2>
          <p>Only admins can manage workers.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>👷 Worker Accounts</h2>

        {/* Add Worker Form */}
        <div style={styles.form}>
          <input style={styles.input} placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})} />
          <input style={styles.input} placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})} />
          <input style={styles.input} placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})} />
          <select style={styles.input}
            value={form.role}
            onChange={(e) => setForm({...form, role: e.target.value})}>
            <option value="worker">Worker</option>
            <option value="admin">Admin</option>
          </select>
          <button style={styles.button} onClick={handleSubmit}>
            Create Account
          </button>
        </div>

        {/* Workers Table */}
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {workers.map(w => (
                <tr key={w._id} style={styles.row}>
                  <td>{w.name}</td>
                  <td>{w.email}</td>
                  <td>
                    <span style={{
                      ...styles.badge,
                      background: w.role === "admin" ? "#2e7d32" : "#1565c0"
                    }}>
                      {w.role}
                    </span>
                  </td>
                  <td>
                    {w.email !== user?.user?.email && (
                      <button style={styles.deleteBtn}
                        onClick={() => handleDelete(w._id)}>
                        Delete
                      </button>
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
  form: { display: "flex", flexDirection: "column", gap: 10,
    maxWidth: 400, marginBottom: 20 },
  input: { padding: 10, borderRadius: 8, border: "1px solid #ccc", fontSize: 16 },
  button: { padding: 12, background: "#2e7d32", color: "white",
    border: "none", borderRadius: 8, fontSize: 16, cursor: "pointer" },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", background: "white",
    borderRadius: 10, overflow: "hidden" },
  thead: { background: "#2e7d32", color: "white" },
  row: { borderBottom: "1px solid #eee", textAlign: "center" },
  badge: { color: "white", padding: "4px 8px", borderRadius: 12, fontSize: 12 },
  deleteBtn: { background: "#c62828", color: "white", border: "none",
    padding: "4px 10px", borderRadius: 6, cursor: "pointer" }
};

export default Workers;