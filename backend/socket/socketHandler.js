const Auction = require("../models/auctionModel");
const Bid = require("../models/bidModel");
const { startAuction } = require("./timerManager");

const userSocketMap = new Map();

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join_auction", ({ auctionId, userId }) => {
      userSocketMap.set(userId, socket.id);
      socket.join(auctionId.toString());
    });

    socket.on("join_auction_room", (auctionId) => {
      socket.join(auctionId.toString());
    });

    socket.on("place_bid", async ({ auctionId, amount }) => {
      try {
        const idStr = auctionId.toString();
        const auction = await Auction.findById(idStr);

        if (!auction || auction.status === "ended") return;
        if (amount <= auction.currentBid) return;

        await Bid.updateMany(
          { auction: idStr, isWinning: true },
          { isWinning: false }
        );

        const newBid = await Bid.create({
          auction: idStr,
          bidder: "000000000000000000000001", // Replaced with actual auth later
          amount: amount,
          isWinning: true
        });

        auction.currentBid = amount;
        await auction.save();

        io.to(idStr).emit("auction_update", {
          currentBid: amount,
          currentHighestBidder: "You"
        });

        io.to(idStr).emit("bid_confirmed", { bid: newBid });

      } catch (err) {
        console.error("Bid error:", err);
      }
    });

    socket.on("bidding_pulse", ({ auctionId, user }) => {
      socket.to(auctionId.toString()).emit("bidding_pulse", { user });
    });

    socket.on("bidding_pulse_stop", (auctionId) => {
      socket.to(auctionId.toString()).emit("bidding_pulse_stop");
    });
  });
};