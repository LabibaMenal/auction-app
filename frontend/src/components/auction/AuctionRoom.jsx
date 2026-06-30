import { useEffect, useState } from "react";
import { useAuction } from "../../context/AuctionProvider";
import AuctionTimer from "./AuctionTimer";
import CurrentBid from "./CurrentBid";
import BidPanel from "./BidPanel";
import BidHistory from "./BidHistory";

const AuctionRoom = ({ auctionId }) => {
  const { loadAuctionDetails, selectedAuction } = useAuction();
  const [paid, setPaid] = useState(false);

  useEffect(() => { loadAuctionDetails(auctionId); }, [auctionId]);

  if (!selectedAuction) return <p className="muted">Loading auction...</p>;

  if (selectedAuction.status === "ended") {
    return (
      <div className="card auction-ended">
        <h2>Auction ended</h2>
        <p className="muted">Winner: {selectedAuction.winner?.username || "No winner"}</p>
        <p className="auction-card-price">Final bid: ${selectedAuction.currentBid}</p>
        {!paid ? (
          <button className="btn btn-gold" onClick={() => setPaid(true)}>Pay now</button>
        ) : (
          <p className="success">Payment simulated successfully — Stripe integration goes here.</p>
        )}
      </div>
    );
  }

  return (
    <div className="card auction-room">
      <AuctionTimer />
      <CurrentBid />
      <BidPanel />
      <BidHistory />
    </div>
  );
};
export default AuctionRoom;