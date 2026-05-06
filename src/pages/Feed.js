import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const API = "https://keith-farm-backend.onrender.com";

function Feed() {
  const [items, setItems] = useState([]);
  const [newFeed, setNewFeed] = useState({ name: "", unit: "", reorderLevel: "" });
  const [selected, setSelected] = useState("");
  const [action, setAction] = useState("IN");
  const [qty, setQty] = useState("");
  const [editId, setEditId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.user?.role || user?.role;
const isAdmin = role === "admin";

  const fetchData = async () => {
    const res = await axios.get(`${API}/api/feed`);
    setItems(res.data);
  };

  useEffect(() => { fetchData(); }, []);

  const addFeed = async () => {
    if (editId) {
      await axios.put(`${API}/api/feed/${editId}`, newFeed);
      setEditId(null);
    } else {
      await axios.post(`${API}/api/feed`, newFeed);
    }
    setNewFeed({ name: "", unit: "", reorderLevel: "" });
    fetchData();
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setNewFeed({
      name: item.name,
      unit: item.unit,
      reorderLevel: item.reorderLevel
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this feed?")) {
      await axios.delete(`${API}/api/feed/${id}`);
      fetchData();
    }
  };

  const updateStock = async () => {
    if (!selected || !qty) return alert("Select feed and enter quantity");
    await axios.post(`${API}/api/feed/update`, {
      feedId: selected,
      type: action,
      quantity: Number(qty)
    });
    setQty("");
    fetchData();
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>🌽 Feed Inventory</h2>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th>Feed</th>
                <th>Stock</th>
                <th>Unit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(i => (
                <tr key={i._id} style={styles.row}>
                  <td>{i.name}</td>
                  <td>{i.quantity}</td>
                  <td>{i.unit}</td>
                  <td>
                    {i.quantity === 0 ? "🔴 Out" :
                      i.quantity <= i.reorderLevel ? "🟡 Low" :
                      "🟢 OK"}
                  </td>
                  <td>
                    <button style={styles.editBtn}
                      onClick={() => handleEdit(i)}>Edit</button>
                    {isAdmin && (
                      <button style={styles.deleteBtn}
                        onClick={() => handleDelete(i._id)}>Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 style={styles.subtitle}>{editId ? "✏️ Edit Feed Type" : "Add New Feed Type"}</h3>
        <div style={styles.form}>
          <input style={styles.input} placeholder="Feed Name (Layers Mash)"
            value={newFeed.name}
            onChange={(e) => setNewFeed({...newFeed, name: e.target.value})} />
          <input style={styles.input} placeholder="Unit (bags/kg)"
            value={newFeed.unit}
            onChange={(e) => setNewFeed({...newFeed, unit: e.target.value})} />
          <input style={styles.input} type="number" placeholder="Reorder Level"
            value={newFeed.reorderLevel}
            onChange={(e) => setNewFeed({...newFeed, reorderLevel: e.target.value})} />
          <button style={styles.button} onClick={addFeed}>
            {editId ? "Update Feed" : "Add Feed Type"}
          </button>
          {editId && (
            <button style={styles.cancelBtn} onClick={() => {
              setEditId(null);
              setNewFeed({ name: "", unit: "", reorderLevel: "" });
            }}>Cancel</button>
          )}
        </div>

        <h3 style={styles.subtitle}>Update Stock</h3>
        <div style={styles.form}>
          <select style={styles.input}
            onChange={(e) => setSelected(e.target.value)}>
            <option value="">Select Feed</option>
            {items.map(i => (
              <option key={i._id} value={i._id}>{i.name}</option>
            ))}
          </select>
          <select style={styles.input}
            onChange={(e) => setAction(e.target.value)}>
            <option value="IN">Stock IN</option>
            <option value="OUT">Stock OUT</option>
            <option value="ADJUST">Adjust</option>
          </select>
          <input style={styles.input} type="number" placeholder="Quantity"
            value={qty}
            onChange={(e) => setQty(e.target.value)} />
          <button style={styles.button} onClick={updateStock}>Update Stock</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: 20, background: "#f4f6f8", minHeight: "100vh" },
  title: { color: "#2e7d32" },
  subtitle: { color: "#2e7d32", marginTop: 20 },
  tableWrap: { overflowX: "auto", marginBottom: 20 },
  table: { width: "100%", borderCollapse: "collapse", background: "white",
    borderRadius: 10, overflow: "hidden" },
  thead: { background: "#2e7d32", color: "white" },
  row: { borderBottom: "1px solid #eee", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: 10, maxWidth: 400 },
  input: { padding: 10, borderRadius: 8, border: "1px solid #ccc", fontSize: 16 },
  button: { padding: 12, background: "#2e7d32", color: "white",
    border: "none", borderRadius: 8, fontSize: 16, cursor: "pointer" },
  cancelBtn: { padding: 12, background: "#757575", color: "white",
    border: "none", borderRadius: 8, fontSize: 16, cursor: "pointer" },
  editBtn: { background: "#1565c0", color: "white", border: "none",
    padding: "4px 8px", borderRadius: 6, cursor: "pointer", marginRight: 4 },
  deleteBtn: { background: "#c62828", color: "white", border: "none",
    padding: "4px 8px", borderRadius: 6, cursor: "pointer" }
};

export default Feed;