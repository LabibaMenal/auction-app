const Auction = require("../models/auctionModel");

const getAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find().sort({ createdAt: -1 });
    res.json(auctions || []);
  } catch (err) {
    console.error("getAuctions error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const createAuction = async (req, res) => {
  try {
    const { title, description, image, startingPrice, reservePrice, startTime, endTime } = req.body;
    const auction = await Auction.create({
      title, description, image, startingPrice, reservePrice, startTime, endTime,
      seller: "000000000000000000000001",
      currentBid: 0,
      status: "scheduled",
    });
    res.status(201).json(auction);
  } catch (err) {
    console.error("createAuction error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id).populate("bids");
    if (!auction) return res.status(404).json({ message: "Auction not found" });
    res.json(auction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const startAuction = async (req, res) => {
  try {
    const { startAuctionTimer } = require("../socket/timerManager");
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: "Auction not found" });
    if (auction.status !== "scheduled")
      return res.status(400).json({ message: "Auction already started or ended" });
    auction.status = "live";
    await auction.save();
    startAuctionTimer(auction._id.toString(), auction.endTime.getTime());
    res.json(auction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAuctions, createAuction, getAuctionById, startAuction };