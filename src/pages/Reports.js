import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API = "https://keith-farm-backend.onrender.com";

function Reports() {
  const [loading, setLoading] = useState(false);

  const exportIncome = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/income`);
      const data = res.data.map(r => ({
        Date: new Date(r.date).toLocaleDateString(),
        Source: r.source,
        Category: r.category,
        Quantity: r.quantity,
        "Unit Price": r.unitPrice,
        Total: r.total,
        "Created By": r.createdBy || "-"
      }));
      exportToExcel(data, "Income_Report");
    } catch (err) { alert("Error exporting income"); }
    setLoading(false);
  };

  const exportExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/expense`);
      const data = res.data.map(r => ({
        Date: new Date(r.date).toLocaleDateString(),
        Category: r.category,
        Amount: r.amount,
        Notes: r.notes,
        "Created By": r.createdBy || "-"
      }));
      exportToExcel(data, "Expenses_Report");
    } catch (err) { alert("Error exporting expenses"); }
    setLoading(false);
  };

  const exportAnimals = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/animals`);
      const data = res.data.map(r => ({
        Tag: r.tag,
        Type: r.type,
        Breed: r.breed,
        Weight: r.weight,
        Pen: r.pen,
        Sex: r.sex,
        Status: r.status,
        "Created By": r.createdBy || "-"
      }));
      exportToExcel(data, "Animals_Report");
    } catch (err) { alert("Error exporting animals"); }
    setLoading(false);
  };

  const exportEggs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/eggs`);
      const data = res.data.map(r => ({
        Date: new Date(r.date).toLocaleDateString(),
        Zone: r.zone,
        Collected: r.collected,
        Broken: r.broken,
        Net: r.net,
        Notes: r.notes,
        "Created By": r.createdBy || "-"
      }));
      exportToExcel(data, "Eggs_Report");
    } catch (err) { alert("Error exporting eggs"); }
    setLoading(false);
  };

  const exportEggSales = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/eggsales`);
      const data = res.data.map(r => ({
        Date: new Date(r.date).toLocaleDateString(),
        Quantity: r.quantity,
        "Price Per Egg": r.pricePerEgg,
        Total: r.total,
        Buyer: r.buyer,
        Notes: r.notes,
        "Created By": r.createdBy || "-"
      }));
      exportToExcel(data, "EggSales_Report");
    } catch (err) { alert("Error exporting egg sales"); }
    setLoading(false);
  };

  const exportFeed = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/feed`);
      const data = res.data.map(r => ({
        Name: r.name,
        Unit: r.unit,
        "Current Stock": r.quantity,
        "Reorder Level": r.reorderLevel,
        Status: r.quantity === 0 ? "Out" : r.quantity <= r.reorderLevel ? "Low" : "OK",
        "Created By": r.createdBy || "-"
      }));
      exportToExcel(data, "Feed_Report");
    } catch (err) { alert("Error exporting feed"); }
    setLoading(false);
  };

  const exportHealth = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/health`);
      const data = res.data.map(r => ({
        Date: new Date(r.date).toLocaleDateString(),
        Animal: r.animalId?.tag || "N/A",
        Type: r.type,
        Description: r.description,
        Medication: r.medication,
        Cost: r.cost,
        "Next Due": r.nextDueDate ? new Date(r.nextDueDate).toLocaleDateString() : "-",
        "Created By": r.createdBy || "-"
      }));
      exportToExcel(data, "Health_Report");
    } catch (err) { alert("Error exporting health"); }
    setLoading(false);
  };

  const exportAll = async () => {
    setLoading(true);
    try {
      const [incomeRes, expenseRes, animalsRes, eggsRes, feedRes, healthRes, eggSalesRes] = await Promise.all([
        axios.get(`${API}/api/income`),
        axios.get(`${API}/api/expense`),
        axios.get(`${API}/api/animals`),
        axios.get(`${API}/api/eggs`),
        axios.get(`${API}/api/feed`),
        axios.get(`${API}/api/health`),
        axios.get(`${API}/api/eggsales`).catch(() => ({data:[]}))
      ]);

      const wb = XLSX.utils.book_new();

      const addSheet = (data, name) => {
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, name);
      };

      addSheet(incomeRes.data.map(r => ({ Date: new Date(r.date).toLocaleDateString(), Source: r.source, Category: r.category, Total: r.total, By: r.createdBy || "-" })), "Income");
      addSheet(expenseRes.data.map(r => ({ Date: new Date(r.date).toLocaleDateString(), Category: r.category, Amount: r.amount, Notes: r.notes, By: r.createdBy || "-" })), "Expenses");
      addSheet(animalsRes.data.map(r => ({ Tag: r.tag, Type: r.type, Breed: r.breed, Status: r.status, By: r.createdBy || "-" })), "Animals");
      addSheet(eggsRes.data.map(r => ({ Date: new Date(r.date).toLocaleDateString(), Zone: r.zone, Collected: r.collected, Broken: r.broken, Net: r.net, By: r.createdBy || "-" })), "Eggs");
      addSheet(eggSalesRes.data.map(r => ({ Date: new Date(r.date).toLocaleDateString(), Qty: r.quantity, Total: r.total, Buyer: r.buyer, By: r.createdBy || "-" })), "EggSales");
      addSheet(feedRes.data.map(r => ({ Name: r.name, Stock: r.quantity, Unit: r.unit, By: r.createdBy || "-" })), "Feed");
      addSheet(healthRes.data.map(r => ({ Date: new Date(r.date).toLocaleDateString(), Animal: r.animalId?.tag || "N/A", Type: r.type, Cost: r.cost, By: r.createdBy || "-" })), "Health");

      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([wbout], { type: "application/octet-stream" }), "KingNazirite_Farm_Report.xlsx");
    } catch (err) { alert("Error exporting full report"); }
    setLoading(false);
  };

  const exportToExcel = (data, filename) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, filename);
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), `${filename}.xlsx`);
  };

  const reports = [
    { title: "💰 Income Report", desc: "All income records", action: exportIncome, color: "#2e7d32" },
    { title: "💸 Expenses Report", desc: "All expense records", action: exportExpenses, color: "#c62828" },
    { title: "🐖 Animals Report", desc: "All animal records", action: exportAnimals, color: "#1565c0" },
    { title: "🥚 Eggs Report", desc: "Egg collection records", action: exportEggs, color: "#f57c00" },
    { title: "🛒 Egg Sales Report", desc: "Egg sales records", action: exportEggSales, color: "#6a1b9a" },
    { title: "🌽 Feed Report", desc: "Feed inventory records", action: exportFeed, color: "#00838f" },
    { title: "💉 Health Report", desc: "Health & vet records", action: exportHealth, color: "#ad1457" },
  ];

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>📊 Export Reports</h2>
        <p style={styles.subtitle}>Download your farm data as Excel files</p>

        <button style={styles.exportAllBtn} onClick={exportAll} disabled={loading}>
          {loading ? "Exporting..." : "📥 Export Complete Farm Report (All Modules)"}
        </button>

        <h3 style={styles.sectionTitle}>Export Individual Reports</h3>
        <div style={styles.grid}>
          {reports.map((r, i) => (
            <div key={i} style={styles.card}>
              <h3 style={{color: r.color}}>{r.title}</h3>
              <p style={styles.desc}>{r.desc}</p>
              <button style={{...styles.btn, background: r.color}} onClick={r.action} disabled={loading}>
                {loading ? "..." : "📥 Export Excel"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: 20, background: "rgba(255,255,255,0.88)", minHeight: "100vh" },
  title: { color: "#2e7d32" },
  subtitle: { color: "#555", marginBottom: 20 },
  exportAllBtn: { width: "100%", padding: 15, background: "#1b5e20", color: "white", border: "none", borderRadius: 10, fontSize: 16, cursor: "pointer", marginBottom: 25, fontWeight: "bold" },
  sectionTitle: { color: "#2e7d32", marginBottom: 15 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 15 },
  card: { background: "white", padding: 20, borderRadius: 10, boxShadow: "0 2px 5px rgba(0,0,0,0.1)" },
  desc: { color: "#555", fontSize: 13, margin: "8px 0" },
  btn: { width: "100%", padding: 10, color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14 }
};

export default Reports;
