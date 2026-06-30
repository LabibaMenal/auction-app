import { createContext, useContext, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const AuctionContext = createContext();

export const AuctionProvider = ({ children }) => {
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [pulseMessage, setPulseMessage] = useState("");
  const socketRef = useRef(null);

  const loadAuctionDetails = (id) => {
    if (socketRef.current) socketRef.current.disconnect();
    socketRef.current = io(API_URL);

    axios.get(`${API_URL}/api/auctions/${id}`)
      .then((res) => setSelectedAuction(res.data))
      .catch((err) => console.error(err));

    axios.get(`${API_URL}/api/bids/${id}`)
      .then((res) => setBids(res.data))
      .catch((err) => console.error(err));

    socketRef.current.emit("join_auction", { auctionId: id, userId: "test-user-123" });
    socketRef.current.emit("join_auction_room", id);

    socketRef.current.on("auction_update", (data) => {
      setSelectedAuction((prev) => ({ ...prev, currentBid: data.currentBid }));
    });
    socketRef.current.on("bid_confirmed", ({ bid }) => {
      setBids((prev) => [bid, ...prev]);
    });
    socketRef.current.on("timer_tick", ({ timeLeft }) => {
      setTimeLeft(Math.floor(timeLeft / 1000));
    });
    socketRef.current.on("auction_ended", ({ winner }) => {
      setSelectedAuction((prev) => ({ ...prev, status: "ended", winner }));
    });
    socketRef.current.on("bidding_pulse", ({ user }) => {
      setPulseMessage(`${user} is typing a bid...`);
    });
    socketRef.current.on("bidding_pulse_stop", () => setPulseMessage(""));
  };

  const placeBid = (amount) => {
    if (!selectedAuction) return;
    socketRef.current?.emit("place_bid", { auctionId: selectedAuction._id, userId: "test-user-123", amount });
  };

  const emitPulse = (isTyping) => {
    if (!selectedAuction) return;
    if (isTyping) socketRef.current?.emit("bidding_pulse", { auctionId: selectedAuction._id, user: "test-user-123" });
    else socketRef.current?.emit("bidding_pulse_stop", selectedAuction._id);
  };

  return (
    <AuctionContext.Provider value={{ selectedAuction, bids, timeLeft, pulseMessage, loadAuctionDetails, placeBid, emitPulse }}>
      {children}
    </AuctionContext.Provider>
  );
};

export const useAuction = () => useContext(AuctionContext);