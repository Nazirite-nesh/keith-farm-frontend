import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const API = "https://keith-farm-backend.onrender.com";

function Animals() {
  const [animals, setAnimals] = useState([]);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({ tag: "", type: "", breed: "", weight: "", pen: "", sex: "" });
  const [editId, setEditId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.user?.role || user?.role;
  const isAdmin = role === "admin";
  const userName = user?.user?.name || user?.name;

  const fetchAnimals = async () => {
    const res = await axios.get(`${API}/api/animals`);
    setAnimals(res.data);
  };

  useEffect(() => { fetchAnimals(); }, []);

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`${API}/api/animals/${editId}`, form);
        setEditId(null);
      } else {
        await axios.post(`${API}/api/animals`, {...form, createdBy: userName});
      }
      setForm({ tag: "", type: "", breed: "", weight: "", pen: "", sex: "" });
      fetchAnimals();
    } catch (err) {
      alert("Error saving animal.");
    }
  };

  const handleEdit = (animal) => {
    setEditId(animal._id);
    setForm({ tag: animal.tag, type: animal.type, breed: animal.breed, weight: animal.weight, pen: animal.pen, sex: animal.sex });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this animal?")) {
      await axios.delete(`${API}/api/animals/${id}`);
      fetchAnimals();
    }
  };

  const handleStatus = async (id, status) => {
    await axios.put(`${API}/api/animals/${id}`, { status });
    fetchAnimals();
  };

  const filtered = animals.filter(a => filter === "All" ? true : a.status === filter);

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>🐖 Animal Records</h2>
        <select style={styles.select} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>Active</option>
          <option>Sick</option>
          <option>Sold</option>
          <option>Deceased</option>
        </select>
        <h3 style={styles.subtitle}>{editId ? "✏️ Edit Animal" : "Add Animal"}</h3>
        <div style={styles.form}>
          <input style={styles.input} placeholder="Tag (PIG-001)" value={form.tag} onChange={(e) => setForm({...form, tag: e.target.value})} />
          <input style={styles.input} placeholder="Type (Pig/Layer/Broiler)" value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} />
          <input style={styles.input} placeholder="Breed" value={form.breed} onChange={(e) => setForm({...form, breed: e.target.value})} />
          <input style={styles.input} type="number" placeholder="Weight (kg)" value={form.weight} onChange={(e) => setForm({...form, weight: e.target.value})} />
          <input style={styles.input} placeholder="Pen" value={form.pen} onChange={(e) => setForm({...form, pen: e.target.value})} />
          <input style={styles.input} placeholder="Sex (Male/Female)" value={form.sex} onChange={(e) => setForm({...form, sex: e.target.value})} />
          <button style={styles.button} onClick={handleSubmit}>{editId ? "Update Animal" : "Add Animal"}</button>
          {editId && <button style={styles.cancelBtn} onClick={() => { setEditId(null); setForm({ tag: "", type: "", breed: "", weight: "", pen: "", sex: "" }); }}>Cancel</button>}
        </div>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th>Tag</th><th>Type</th><th>Breed</th><th>Weight</th><th>Pen</th><th>Status</th><th>By</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a._id} style={styles.row}>
                  <td>{a.tag}</td>
                  <td>{a.type}</td>
                  <td>{a.breed}</td>
                  <td>{a.weight}kg</td>
                  <td>{a.pen}</td>
                  <td>
                    <span style={{...styles.badge, background: a.status==="Active"?"#2e7d32":a.status==="Sick"?"#f57c00":a.status==="Sold"?"#1565c0":"#c62828"}}>
                      {a.status}
                    </span>
                  </td>
                  <td style={{fontSize:12,color:"#555"}}>{a.createdBy || "-"}</td>
                  <td>
                    <button style={styles.editBtn} onClick={() => handleEdit(a)}>Edit</button>
                    {isAdmin && <button style={styles.deleteBtn} onClick={() => handleDelete(a._id)}>Delete</button>}
                    <select style={styles.smallSelect} onChange={(e) => handleStatus(a._id, e.target.value)} defaultValue={a.status}>
                      <option>Active</option>
                      <option>Sick</option>
                      <option>Sold</option>
                      <option>Deceased</option>
                    </select>
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
  container:{padding:20,background:"rgba(255,255,255,0.88)",minHeight:"100vh"},
  title:{color:"#2e7d32"},
  subtitle:{color:"#2e7d32"},
  select:{padding:8,borderRadius:8,border:"1px solid #ccc",marginBottom:15,fontSize:14},
  form:{display:"flex",flexDirection:"column",gap:10,maxWidth:400,marginBottom:20},
  input:{padding:10,borderRadius:8,border:"1px solid #ccc",fontSize:16},
  button:{padding:12,background:"#2e7d32",color:"white",border:"none",borderRadius:8,fontSize:16,cursor:"pointer"},
  cancelBtn:{padding:12,background:"#757575",color:"white",border:"none",borderRadius:8,fontSize:16,cursor:"pointer"},
  tableWrap:{overflowX:"auto"},
  table:{width:"100%",borderCollapse:"collapse",background:"white",borderRadius:10,overflow:"hidden"},
  thead:{background:"#2e7d32",color:"white"},
  row:{borderBottom:"1px solid #eee",textAlign:"center"},
  badge:{color:"white",padding:"4px 8px",borderRadius:12,fontSize:12},
  editBtn:{background:"#1565c0",color:"white",border:"none",padding:"4px 8px",borderRadius:6,cursor:"pointer",marginRight:4},
  deleteBtn:{background:"#c62828",color:"white",border:"none",padding:"4px 8px",borderRadius:6,cursor:"pointer",marginRight:4},
  smallSelect:{padding:4,borderRadius:6,fontSize:12}
};

export default Animals;
