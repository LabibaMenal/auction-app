const Auction = require("../models/auctionModel");
const Bid = require("../models/bidModel");

let io;
const activeTimers = new Map(); // auctionId -> { interval, timeout }

const init = (socketIo) => { io = socketIo; };

const closeAuction = async (auctionId) => {
  const timers = activeTimers.get(auctionId);
  if (timers) {
    clearInterval(timers.interval);
    clearTimeout(timers.timeout);
    activeTimers.delete(auctionId);
  }

  const auction = await Auction.findById(auctionId);
  if (!auction) return;

  const winningBid = await Bid.findOne({ auction: auctionId, isWinning: true });

  auction.status = "ended";
  auction.winner = winningBid?.bidder || null;
  await auction.save();

  io.to(auctionId).emit("auction_ended", {
    winner: winningBid?.bidder || null,
    finalBid: winningBid?.amount || 0,
  });

  io.socketsLeave(auctionId);
};

const startAuctionTimer = (auctionId, endTime) => {
  if (activeTimers.has(auctionId)) return;

  const interval = setInterval(() => {
    const timeLeft = Math.max(0, endTime - Date.now());
    io.to(auctionId).emit("timer_tick", { timeLeft });
    if (timeLeft === 0) closeAuction(auctionId);
  }, 1000);

  const duration = endTime - Date.now();
  const timeout = setTimeout(() => closeAuction(auctionId), duration);

  activeTimers.set(auctionId, { interval, timeout });
};

const restartTimers = async () => {
  const liveAuctions = await Auction.find({ status: "live" });
  for (const auction of liveAuctions) {
    if (Date.now() >= auction.endTime) {
      await closeAuction(auction._id.toString());
    } else {
      startAuctionTimer(auction._id.toString(), auction.endTime.getTime());
    }
  }
};

module.exports = { init, startAuctionTimer, closeAuction, restartTimers };