import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.user?.role || user?.role;
  const isAdmin = role === "admin";

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={{background:"#2e7d32",padding:"10px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"}}>
      <span style={{color:"white",fontWeight:"bold",fontSize:18}}>Keith's Farm</span>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <button style={{background:"transparent",color:"white",border:"1px solid white",padding:"6px 12px",borderRadius:6,cursor:"pointer"}} onClick={() => navigate("/dashboard")}>Dashboard</button>
        {isAdmin && <button style={{background:"transparent",color:"white",border:"1px solid white",padding:"6px 12px",borderRadius:6,cursor:"pointer"}} onClick={() => navigate("/income")}>Income</button>}
        {isAdmin && <button style={{background:"transparent",color:"white",border:"1px solid white",padding:"6px 12px",borderRadius:6,cursor:"pointer"}} onClick={() => navigate("/expenses")}>Expenses</button>}
        <button style={{background:"transparent",color:"white",border:"1px solid white",padding:"6px 12px",borderRadius:6,cursor:"pointer"}} onClick={() => navigate("/animals")}>Animals</button>
        <button style={{background:"transparent",color:"white",border:"1px solid white",padding:"6px 12px",borderRadius:6,cursor:"pointer"}} onClick={() => navigate("/eggs")}>Eggs</button>
        <button style={{background:"transparent",color:"white",border:"1px solid white",padding:"6px 12px",borderRadius:6,cursor:"pointer"}} onClick={() => navigate("/feed")}>Feed</button>
        <button style={{background:"transparent",color:"white",border:"1px solid white",padding:"6px 12px",borderRadius:6,cursor:"pointer"}} onClick={() => navigate("/health")}>Health</button>
        {isAdmin && <button style={{background:"transparent",color:"white",border:"1px solid white",padding:"6px 12px",borderRadius:6,cursor:"pointer"}} onClick={() => navigate("/profitloss")}>P&L</button>}
        {isAdmin && <button style={{background:"transparent",color:"white",border:"1px solid white",padding:"6px 12px",borderRadius:6,cursor:"pointer"}} onClick={() => navigate("/workers")}>Workers</button>}
        <button style={{background:"#c62828",color:"white",border:"none",padding:"6px 12px",borderRadius:6,cursor:"pointer"}} onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;
