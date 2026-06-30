import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AuctionDetailPage from "./pages/AuctionDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auction/:id" element={<AuctionDetailPage />} />
    </Routes>
  );
}
export default App;