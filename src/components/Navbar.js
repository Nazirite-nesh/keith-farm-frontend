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

  const formatDate = (d) => d.toLocaleDateString("en-KE", {weekday:"short",year:"numeric",month:"short",day:"numeric"});
  const formatTime = (d) => d.toLocaleTimeString("en-KE", {hour:"2-digit",minute:"2-digit",second:"2-digit"});

  return (
    <div>
      <div style={{background:"#1b5e20",padding:"8px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <img src="/Logo.png" alt="Logo" style={{width:40,height:40,borderRadius:"50%",objectFit:"cover"}} />
          <span style={{color:"#ffd700",fontWeight:"bold",fontSize:16}}>King Nazirite Nesh Farm</span>
        </div>
        <div style={{display:"flex",gap:15,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{color:"white",fontSize:13}}>🕐 {formatTime(time)}</span>
          <span style={{color:"white",fontSize:13}}>📅 {formatDate(time)}</span>
          <span style={{color:"#ffd700",fontSize:13,fontWeight:"bold"}}>👤 {userName}</span>
        </div>
      </div>
      <div style={{background:"#2e7d32",padding:"8px 20px",display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
        <button style={{background:"transparent",color:"white",border:"1px solid white",padding:"5px 10px",borderRadius:6,cursor:"pointer",fontSize:13}} onClick={() => navigate("/dashboard")}>Dashboard</button>
        {isAdmin && <button style={{background:"transparent",color:"white",border:"1px solid white",padding:"5px 10px",borderRadius:6,cursor:"pointer",fontSize:13}} onClick={() => navigate("/income")}>Income</button>}
        {isAdmin && <button style={{background:"transparent",color:"white",border:"1px solid white",padding:"5px 10px",borderRadius:6,cursor:"pointer",fontSize:13}} onClick={() => navigate("/expenses")}>Expenses</button>}
        <button style={{background:"transparent",color:"white",border:"1px solid white",padding:"5px 10px",borderRadius:6,cursor:"pointer",fontSize:13}} onClick={() => navigate("/animals")}>Animals</button>
        <button style={{background:"transparent",color:"white",border:"1px solid white",padding:"5px 10px",borderRadius:6,cursor:"pointer",fontSize:13}} onClick={() => navigate("/eggs")}>Eggs</button>
        <button style={{background:"transparent",color:"white",border:"1px solid white",padding:"5px 10px",borderRadius:6,cursor:"pointer",fontSize:13}} onClick={() => navigate("/feed")}>Feed</button>
        <button style={{background:"transparent",color:"white",border:"1px solid white",padding:"5px 10px",borderRadius:6,cursor:"pointer",fontSize:13}} onClick={() => navigate("/health")}>Health</button>
        {isAdmin && <button style={{background:"transparent",color:"white",border:"1px solid white",padding:"5px 10px",borderRadius:6,cursor:"pointer",fontSize:13}} onClick={() => navigate("/profitloss")}>P&L</button>}
        {isAdmin && <button style={{background:"transparent",color:"white",border:"1px solid white",padding:"5px 10px",borderRadius:6,cursor:"pointer",fontSize:13}} onClick={() => navigate("/workers")}>Workers</button>}
        <button style={{background:"#c62828",color:"white",border:"none",padding:"5px 10px",borderRadius:6,cursor:"pointer",fontSize:13}} onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;
