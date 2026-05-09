import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.user?.role || user?.role;
  const isAdmin = role === "admin";
  const userName = user?.user?.name || user?.name || "User";
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-KE", {
      weekday: "short", year: "numeric",
      month: "short", day: "numeric"
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-KE", {
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
  };

  return (
    <div>
      {/* Top bar */}
      <div style={styles.topBar}>
        <div style={styles.topLeft}>
          <img src="/Logo.png" alt="Logo" style={styles.logo} />
          <span style={styles.brand}>King Nazirite Nesh Farm</span>
        </div>
        <div style={styles.topRight}>
          <span style={styles.clock}>🕐 {formatTime(time)}</span>
          <span style={styles.date}>📅 {formatDate(time)}</span>
          <span style={styles.userTag}>👤 {userName}</span>
        </div>
      </div>

      {/* Nav links */}
      <div style={styles.nav}>
        <button style={styles.btn} onClick={() => navigate("/dashboard")}>Dashboard</button>
        {isAdmin && <button style={styles.btn} onClick={() => navigate("/income")}>Income</button>}
        {isAdmin && <button style={styles.btn} onClick={() => navigate("/expenses")}>Expenses</button>}
        <button style={styles.btn} onClick={() => navigate("/animals")}>Animals</button>
        <button style={styles.btn} onClick={() => navigate("/eggs")}>Eggs</button>
        <button style={styles.btn} onClick={() => navigate("/feed")}>Feed</button>
        <button style={styles.btn} onClick={() => navigate("/health")}>Health</button>
        {isAdmin && <button style={styles.btn} onClick={() => navigate("/profitloss")}>P&L</button>}
        {isAdmin && <button style={styles.btn} onClick={() => navigate("/workers")}>Workers</button>}
        {isAdmin && <button style={styles.btn} onClick={() => navigate("/reports")}>Reports</button>}
        {isAdmin && <button style={styles.btn} onClick={() => navigate("/alerts")}>🔔 Alerts</button>}
        <button style={styles.logoutBtn} onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

const styles = {
  topBar: {
    background: "#1b5e20",
    padding: "8px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8
  },
  topLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    objectFit: "cover"
  },
  brand: {
    color: "#ffd700",
    fontWeight: "bold",
    fontSize: 16
  },
  topRight: {
    display: "flex",
    gap: 15,
    alignItems: "center",
    flexWrap: "wrap"
  },
  clock: {
    color: "white",
    fontSize: 13
  },
  date: {
    color: "white",
    fontSize: 13
  },
  userTag: {
    color: "#ffd700",
    fontSize: 13,
    fontWeight: "bold"
  },
  nav: {
    background: "#2e7d32",
    padding: "8px 20px",
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
    alignItems: "center"
  },
  btn: {
    background: "transparent",
    color: "white",
    border: "1px solid white",
    padding: "5px 10px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13
  },
  logoutBtn: {
    background: "#c62828",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13
  }
};

export default Navbar;