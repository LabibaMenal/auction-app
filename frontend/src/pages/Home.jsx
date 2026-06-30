import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AuctionForm from "../components/auction/AuctionForm";

const statusClass = (status) => {
  if (status === "live") return "badge badge-live";
  if (status === "scheduled") return "badge badge-scheduled";
  return "badge badge-ended";
};

const Home = () => {
  const [auctions, setAuctions] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchAuctions = () => {
    axios.get("http://localhost:5000/api/auctions")
      .then((res) => setAuctions(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => { fetchAuctions(); }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Live auctions</h1>
        <button className="btn btn-gold" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Cancel" : "+ New auction"}
        </button>
      </div>

      {showForm && (
        <AuctionForm onCreated={() => { setShowForm(false); fetchAuctions(); }} />
      )}

      <div className="auction-grid">
        {auctions.length === 0 && <p className="muted">No auctions yet. Create one above.</p>}
        {auctions.map((a) => (
          <Link to={`/auction/${a._id}`} className="auction-card" key={a._id}>
            <div className="auction-card-image">
              {a.image
                ? <img src={a.image} alt={a.title} />
                : <span className="auction-card-placeholder">No image</span>}
            </div>
            <div className="auction-card-body">
              <span className={statusClass(a.status)}>{a.status}</span>
              <h3>{a.title}</h3>
              <p className="auction-card-price">${a.currentBid || a.startingPrice}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default Home;