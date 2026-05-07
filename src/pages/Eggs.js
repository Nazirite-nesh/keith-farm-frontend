import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const API = "https://keith-farm-backend.onrender.com";
const COLORS = ["#2e7d32","#c62828","#1565c0","#f57c00"];

function Eggs() {
  const [records, setRecords] = useState([]);
  const [incubatorRecords, setIncubatorRecords] = useState([]);
  const [form, setForm] = useState({ zone: "", collected: "", broken: "", notes: "" });
  const [incubatorForm, setIncubatorForm] = useState({ eggs: "", notes: "" });
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState("collection");
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.user?.role === "admin" || user?.role === "admin";
  const userName = user?.user?.name || user?.name;

  const fetchData = async () => {
    const res = await axios.get(`${API}/api/eggs`);
    setRecords(res.data);
    try {
      const incRes = await axios.get(`${API}/api/incubator`);
      setIncubatorRecords(incRes.data);
    } catch (err) {}
  };

  useEffect(() => { fetchData(); }, []);

  const today = new Date().toDateString();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const todayEggs = records.filter(r => new Date(r.date).toDateString() === today).reduce((a, b) => a + b.net, 0);
  const weekEggs = records.filter(r => new Date(r.date) >= weekAgo).reduce((a, b) => a + b.net, 0);
  const monthEggs = records.filter(r => new Date(r.date) >= monthAgo).reduce((a, b) => a + b.net, 0);
  const totalEggs = records.reduce((a, b) => a + b.net, 0);
  const totalBroken = records.reduce((a, b) => a + b.broken, 0);
  const totalIncubator = incubatorRecords.reduce((a, b) => a + Number(b.eggs), 0);
  const remainingEggs = totalEggs - totalIncubator;

  const pieData = [
    { name: "Available", value: remainingEggs },
    { name: "Incubator", value: totalIncubator },
    { name: "Broken", value: totalBroken }
  ];

  const zoneData = records.reduce((acc, r) => {
    const existing = acc.find(a => a.zone === r.zone);
    if (existing) existing.eggs += r.net;
    else acc.push({ zone: r.zone, eggs: r.net });
    return acc;
  }, []);

  const handleSubmit = async () => {
    try {
      const net = form.collected - form.broken;
      if (editId) {
        await axios.put(`${API}/api/eggs/${editId}`, {...form, net});
        setEditId(null);
      } else {
        await axios.post(`${API}/api/eggs`, {...form, createdBy: userName});
      }
      setForm({ zone: "", collected: "", broken: "", notes: "" });
      fetchData();
    } catch (err) {
      alert("Error saving record.");
    }
  };

  const handleIncubator = async () => {
    try {
      await axios.post(`${API}/api/incubator`, { ...incubatorForm, createdBy: userName });
      setIncubatorForm({ eggs: "", notes: "" });
      fetchData();
    } catch (err) {
      alert("Error saving incubator record.");
    }
  };

  const handleEdit = (record) => {
    setEditId(record._id);
    setForm({ zone: record.zone, collected: record.collected, broken: record.broken, notes: record.notes || "" });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this record?")) {
      await axios.delete(`${API}/api/eggs/${id}`);
      fetchData();
    }
  };

  const handleDeleteIncubator = async (id) => {
    if (window.confirm("Delete this record?")) {
      await axios.delete(`${API}/api/incubator/${id}`);
      fetchData();
    }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>🥚 Egg Production</h2>

        {/* KPI Cards */}
        <div style={styles.cards}>
          <div style={styles.card}><h4>Today</h4><p style={styles.kpi}>{todayEggs}</p></div>
          <div style={styles.card}><h4>This Week</h4><p style={styles.kpi}>{weekEggs}</p></div>
          <div style={styles.card}><h4>This Month</h4><p style={styles.kpi}>{monthEggs}</p></div>
          <div style={styles.card}><h4>Total</h4><p style={styles.kpi}>{totalEggs}</p></div>
          <div style={styles.card}><h4>🔴 Broken</h4><p style={{...styles.kpi,color:"#c62828"}}>{totalBroken}</p></div>
          <div style={styles.card}><h4>🐣 Incubator</h4><p style={{...styles.kpi,color:"#1565c0"}}>{totalIncubator}</p></div>
          <div style={{...styles.card,background:"#e8f5e9"}}><h4>✅ Available</h4><p style={{...styles.kpi,color:"#2e7d32"}}>{remainingEggs}</p></div>
        </div>

        {/* Charts */}
        <div style={styles.chartsRow}>
          <div style={styles.chartBox}>
            <h3>Egg Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({name, value}) => `${name}: ${value}`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={styles.chartBox}>
            <h3>Eggs by Zone</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={zoneData}>
                <XAxis dataKey="zone" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="eggs" fill="#2e7d32" name="Eggs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button style={{...styles.tab,...(activeTab==="collection"?styles.activeTab:{})}} onClick={() => setActiveTab("collection")}>Egg Collection</button>
          <button style={{...styles.tab,...(activeTab==="incubator"?styles.activeTab:{})}} onClick={() => setActiveTab("incubator")}>🐣 Incubator</button>
        </div>

        {activeTab === "collection" && (
          <>
            <h3 style={styles.subtitle}>{editId ? "✏️ Edit Record" : "Add Collection"}</h3>
            <div style={styles.form}>
              <input style={styles.input} placeholder="Zone (Laying Zone A)" value={form.zone} onChange={(e) => setForm({...form, zone: e.target.value})} />
              <input style={styles.input} type="number" placeholder="Collected" value={form.collected} onChange={(e) => setForm({...form, collected: e.target.value})} />
              <input style={styles.input} type="number" placeholder="Broken" value={form.broken} onChange={(e) => setForm({...form, broken: e.target.value})} />
              <input style={styles.input} placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} />
              <button style={styles.button} onClick={handleSubmit}>{editId ? "Update" : "Record Eggs"}</button>
              {editId && <button style={styles.cancelBtn} onClick={() => { setEditId(null); setForm({ zone: "", collected: "", broken: "", notes: "" }); }}>Cancel</button>}
            </div>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th>Date</th><th>Zone</th><th>Collected</th><th>Broken</th><th>Net</th><th>By</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r._id} style={styles.row}>
                      <td>{new Date(r.date).toLocaleDateString()}</td>
                      <td>{r.zone}</td>
                      <td>{r.collected}</td>
                      <td style={{color:"#c62828"}}>{r.broken}</td>
                      <td style={{color:"#2e7d32",fontWeight:"bold"}}>{r.net}</td>
                      <td style={{fontSize:12,color:"#555"}}>{r.createdBy || "-"}</td>
                      <td>
                        <button style={styles.editBtn} onClick={() => handleEdit(r)}>Edit</button>
                        {isAdmin && <button style={styles.deleteBtn} onClick={() => handleDelete(r._id)}>Delete</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "incubator" && (
          <>
            <h3 style={styles.subtitle}>🐣 Record Eggs for Incubator</h3>
            <div style={styles.form}>
              <input style={styles.input} type="number" placeholder="Number of Eggs" value={incubatorForm.eggs} onChange={(e) => setIncubatorForm({...incubatorForm, eggs: e.target.value})} />
              <input style={styles.input} placeholder="Notes (optional)" value={incubatorForm.notes} onChange={(e) => setIncubatorForm({...incubatorForm, notes: e.target.value})} />
              <button style={styles.button} onClick={handleIncubator}>Record Incubator</button>
            </div>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th>Date</th><th>Eggs</th><th>Notes</th><th>By</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {incubatorRecords.map((r) => (
                    <tr key={r._id} style={styles.row}>
                      <td>{new Date(r.date).toLocaleDateString()}</td>
                      <td style={{color:"#1565c0",fontWeight:"bold"}}>{r.eggs}</td>
                      <td>{r.notes}</td>
                      <td style={{fontSize:12,color:"#555"}}>{r.createdBy || "-"}</td>
                      <td>{isAdmin && <button style={styles.deleteBtn} onClick={() => handleDeleteIncubator(r._id)}>Delete</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container:{padding:20,background:"rgba(255,255,255,0.88)",minHeight:"100vh"},
  title:{color:"#2e7d32"},
  subtitle:{color:"#2e7d32",marginTop:15},
  cards:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(110px, 1fr))",gap:10,marginBottom:20},
  card:{background:"white",padding:15,borderRadius:10,boxShadow:"0 2px 5px rgba(0,0,0,0.1)",textAlign:"center"},
  kpi:{fontSize:22,fontWeight:"bold",margin:0},
  chartsRow:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:15,marginBottom:20},
  chartBox:{background:"white",padding:20,borderRadius:10,boxShadow:"0 2px 5px rgba(0,0,0,0.1)"},
  tabs:{display:"flex",gap:10,marginBottom:15},
  tab:{padding:"8px 20px",borderRadius:8,border:"1px solid #2e7d32",background:"white",color:"#2e7d32",cursor:"pointer"},
  activeTab:{background:"#2e7d32",color:"white"},
  form:{display:"flex",flexDirection:"column",gap:10,maxWidth:400,marginBottom:20},
  input:{padding:10,borderRadius:8,border:"1px solid #ccc",fontSize:16},
  button:{padding:12,background:"#2e7d32",color:"white",border:"none",borderRadius:8,fontSize:16,cursor:"pointer"},
  cancelBtn:{padding:12,background:"#757575",color:"white",border:"none",borderRadius:8,fontSize:16,cursor:"pointer"},
  tableWrap:{overflowX:"auto"},
  table:{width:"100%",borderCollapse:"collapse",background:"white",borderRadius:10,overflow:"hidden"},
  thead:{background:"#2e7d32",color:"white"},
  row:{borderBottom:"1px solid #eee",textAlign:"center"},
  editBtn:{background:"#1565c0",color:"white",border:"none",padding:"4px 8px",borderRadius:6,cursor:"pointer",marginRight:4},
  deleteBtn:{background:"#c62828",color:"white",border:"none",padding:"4px 8px",borderRadius:6,cursor:"pointer"}
};

export default Eggs;
