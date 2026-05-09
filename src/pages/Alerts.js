import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const API = "https://keith-farm-backend.onrender.com";

function Alerts() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [testResult, setTestResult] = useState(null);

  const sendTestAlert = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/alerts/test`);
      setTestResult({ success: true, msg: res.data.message });
    } catch (err) {
      setTestResult({ success: false, msg: "Failed to send test alert" });
    }
    setLoading(false);
  };

  const checkAlerts = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`${API}/api/alerts/check`);
      setResult(res.data);
    } catch (err) {
      setResult({ message: "Error checking alerts", alerts: [] });
    }
    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>🔔 SMS & Email Alerts</h2>
        <p style={styles.desc}>
          Send automated alerts via SMS and Email for low feed stock and upcoming health treatments.
        </p>

        {/* Test Alert */}
        <div style={styles.card}>
          <h3>🧪 Test Alert System</h3>
          <p style={{color:"#555",fontSize:14}}>Send a test SMS and Email to verify the system is working.</p>
          <button style={styles.testBtn} onClick={sendTestAlert} disabled={loading}>
            {loading ? "Sending..." : "📨 Send Test Alert"}
          </button>
          {testResult && (
            <div style={{...styles.resultBox, background: testResult.success ? "#e8f5e9" : "#ffebee", borderLeft: `4px solid ${testResult.success ? "#2e7d32" : "#c62828"}`}}>
              {testResult.success ? "✅" : "❌"} {testResult.msg}
            </div>
          )}
        </div>

        {/* Check & Send Alerts */}
        <div style={styles.card}>
          <h3>⚠️ Check Farm Alerts</h3>
          <p style={{color:"#555",fontSize:14}}>Check for low feed stock and overdue health treatments. Alerts will be sent via SMS and Email.</p>
          <button style={styles.alertBtn} onClick={checkAlerts} disabled={loading}>
            {loading ? "Checking..." : "🔍 Check & Send Alerts"}
          </button>

          {result && (
            <div style={styles.resultSection}>
              <h4 style={{color: result.alerts?.length > 0 ? "#c62828" : "#2e7d32"}}>
                {result.message}
              </h4>
              {result.alerts?.length > 0 && (
                <div>
                  {result.alerts.map((a, i) => (
                    <div key={i} style={styles.alertItem}>⚠️ {a}</div>
                  ))}
                </div>
              )}
              {result.alerts?.length === 0 && (
                <div style={styles.clearBox}>✅ All clear! No alerts needed.</div>
              )}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={styles.card}>
          <h3>📋 Alert Settings</h3>
          <div style={styles.infoRow}>
            <span>📧 Email</span>
            <span style={{color:"#2e7d32"}}>naziritenesh@gmail.com</span>
          </div>
          <div style={styles.infoRow}>
            <span>📱 SMS</span>
            <span style={{color:"#2e7d32"}}>+254707247920</span>
          </div>
          <div style={styles.infoRow}>
            <span>🌽 Feed Alert</span>
            <span style={{color:"#f57c00"}}>When stock ≤ reorder level</span>
          </div>
          <div style={styles.infoRow}>
            <span>💉 Health Alert</span>
            <span style={{color:"#f57c00"}}>When treatment due within 3 days</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: 20, background: "rgba(255,255,255,0.88)", minHeight: "100vh" },
  title: { color: "#2e7d32" },
  desc: { color: "#555", marginBottom: 20 },
  card: { background: "white", padding: 20, borderRadius: 10, boxShadow: "0 2px 5px rgba(0,0,0,0.1)", marginBottom: 20 },
  testBtn: { padding: 12, background: "#1565c0", color: "white", border: "none", borderRadius: 8, fontSize: 15, cursor: "pointer", marginTop: 10 },
  alertBtn: { padding: 12, background: "#2e7d32", color: "white", border: "none", borderRadius: 8, fontSize: 15, cursor: "pointer", marginTop: 10 },
  resultBox: { marginTop: 15, padding: 12, borderRadius: 8, fontSize: 14 },
  resultSection: { marginTop: 15 },
  alertItem: { background: "#fff3e0", padding: "8px 12px", borderRadius: 6, marginTop: 8, fontSize: 14, borderLeft: "4px solid #f57c00" },
  clearBox: { background: "#e8f5e9", padding: 12, borderRadius: 8, color: "#2e7d32" },
  infoRow: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee", fontSize: 14 }
};

export default Alerts;
