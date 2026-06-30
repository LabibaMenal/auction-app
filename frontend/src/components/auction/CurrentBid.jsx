import { useAuction } from "../../context/AuctionProvider";
const CurrentBid = () => {
  const { selectedAuction } = useAuction();
  return (
    <div>
      <p className="muted">Current bid</p>
      <p className="auction-card-price" style={{ fontSize: "22px" }}>${selectedAuction?.currentBid ?? 0}</p>
    </div>
  );
};
export default CurrentBid;