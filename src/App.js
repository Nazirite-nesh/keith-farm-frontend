import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import Expenses from "./pages/Expenses";
import Animals from "./pages/Animals";
import Eggs from "./pages/Eggs";
import Feed from "./pages/Feed";
import Health from "./pages/Health";
import ProfitLoss from "./pages/ProfitLoss";
import Workers from "./pages/Workers";
import background from "./background.jpg";

function App() {
  return (
    <div style={{
      backgroundImage: `url(${process.env.PUBLIC_URL}/Background.png)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      minHeight: "100vh"
    }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/animals" element={<Animals />} />
          <Route path="/eggs" element={<Eggs />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/health" element={<Health />} />
          <Route path="/profitloss" element={<ProfitLoss />} />
          <Route path="/workers" element={<Workers />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;