import { useState } from "react";
import { useAuction } from "../../context/AuctionProvider";
const BidPanel = () => {
  const { placeBid, emitPulse, selectedAuction, pulseMessage } = useAuction();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const handleBid = () => {
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= (selectedAuction?.currentBid ?? 0)) {
      setError(`Bid must be higher than $${selectedAuction?.currentBid ?? 0}`); return;
    }
    setError(""); placeBid(parsed); setAmount("");
  };
  return (
    <div>
      <p className="muted">Place a bid</p>
      <div className="bid-panel-row">
        <input
          type="number" value={amount}
          onChange={(e) => { setAmount(e.target.value); emitPulse(true); }}
          onBlur={() => emitPulse(false)}
          placeholder={`More than $${selectedAuction?.currentBid ?? 0}`} />
        <button className="btn btn-gold" onClick={handleBid}>Bid</button>
      </div>
      {error && <p className="error">{error}</p>}
      {pulseMessage && <p className="pulse-text">{pulseMessage}</p>}
    </div>
  );
};
export default BidPanel;