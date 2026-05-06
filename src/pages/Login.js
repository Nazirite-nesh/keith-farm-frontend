import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://keith-farm-backend.onrender.com";

function Login() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API}/api/auth/users`);
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, []);

  const handleUserSelect = (e) => {
    const name = e.target.value;
    setSelectedUser(name);
    const user = users.find(u => u.name === name);
    if (user) setEmail(user.email);
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        email,
        password
      });
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed. Check your password.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <div style={styles.card}>
          <img src="/Logo.png" alt="King Nazirite Nesh" style={styles.logo} />
          <h2 style={styles.title}>King Nazirite Nesh Farm</h2>
          <p style={styles.subtitle}>Farm Management System</p>

          <select style={styles.input}
            value={selectedUser}
            onChange={handleUserSelect}>
            <option value="">Select Your Name</option>
            {users.map(u => (
              <option key={u._id} value={u.name}>{u.name}</option>
            ))}
          </select>

          <input style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} />

          <input style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />

          <button style={styles.button} onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundImage: "url('/Background.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  overlay: {
    background: "rgba(0,0,0,0.6)",
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  card: {
    background: "rgba(255,255,255,0.95)",
    padding: 30,
    borderRadius: 16,
    width: "90%",
    maxWidth: 380,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    objectFit: "cover"
  },
  title: { color: "#2e7d32", margin: 0, textAlign: "center" },
  subtitle: { color: "#555", margin: 0, fontSize: 14 },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 16,
    boxSizing: "border-box"
  },
  button: {
    width: "100%",
    padding: 12,
    background: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 16,
    cursor: "pointer"
  }
};

export default Login;