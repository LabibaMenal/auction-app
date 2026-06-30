import { useAuction } from "../../context/AuctionProvider";
const AuctionTimer = () => {
  const { timeLeft } = useAuction();
  return (
    <div>
      <p className="muted">Time left</p>
      <p className="timer-display">{Math.floor(timeLeft / 60)}m {timeLeft % 60}s</p>
    </div>
  );
};
export default AuctionTimer;