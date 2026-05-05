import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={styles.nav}>
      <span style={styles.brand}>🌿 Keith's Farm</span>
      <div style={styles.links}>
        <button style={styles.btn} onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button style={styles.btn} onClick={() => navigate("/income")}>Income</button>
        <button style={styles.btn} onClick={() => navigate("/expenses")}>Expenses</button>
        <button style={styles.btn} onClick={() => navigate("/animals")}>Animals</button>
        <button style={styles.logoutBtn} onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

const styles = {
  nav: { background: "#2e7d32", padding: "10px 20px", display: "flex",
    justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" },
  brand: { color: "white", fontWeight: "bold", fontSize: 18 },
  links: { display: "flex", gap: 8, flexWrap: "wrap" },
  btn: { background: "transparent", color: "white", border: "1px solid white",
    padding: "6px 12px", borderRadius: 6, cursor: "pointer" },
  logoutBtn: { background: "#c62828", color: "white", border: "none",
    padding: "6px 12px", borderRadius: 6, cursor: "pointer" }
};

export default Navbar;