import { useParams } from "react-router-dom";
import AuctionRoom from "../components/auction/AuctionRoom";

const AuctionDetailPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Auction Room</h1>
      <AuctionRoom auctionId={id} />
    </div>
  );
};

export default AuctionDetailPage;