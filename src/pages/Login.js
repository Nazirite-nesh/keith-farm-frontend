import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("https://keith-farm-backend.onrender.com/api/auth/login", {
        email,
        password
      });
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed. Check your email and password.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🌿 Keith's Livestock Farm</h2>
      <input style={styles.input} type="email" placeholder="Email"
        onChange={(e) => setEmail(e.target.value)} />
      <input style={styles.input} type="password" placeholder="Password"
        onChange={(e) => setPassword(e.target.value)} />
      <button style={styles.button} onClick={handleLogin}>Login</button>
    </div>
  );
}

const styles = {
  container: { maxWidth: 320, margin: "100px auto", display: "flex",
    flexDirection: "column", gap: 12, padding: 20 },
  title: { color: "#2e7d32", textAlign: "center" },
  input: { padding: 10, borderRadius: 8, border: "1px solid #ccc",
    fontSize: 16 },
  button: { padding: 12, background: "#2e7d32", color: "white",
    border: "none", borderRadius: 8, fontSize: 16, cursor: "pointer" }
};

export default Login;