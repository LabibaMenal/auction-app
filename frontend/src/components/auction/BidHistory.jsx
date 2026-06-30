import { useAuction } from "../../context/AuctionProvider";
const BidHistory = () => {
  const { bids } = useAuction();
  return (
    <div>
      <p className="muted">Bid history</p>
      {bids.length === 0 && <p className="muted">No bids yet.</p>}
      <ul className="bid-history-list">
        {bids.map((bid) => <li key={bid._id}><span>${bid.amount}</span><span className="muted">{bid.bidder}</span></li>)}
      </ul>
    </div>
  );
};
export default BidHistory;