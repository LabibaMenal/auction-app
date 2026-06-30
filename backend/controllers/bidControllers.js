const Bid = require("../models/bidModel");
const Auction = require("../models/auctionModel");

const getBidsByAuction = async (req, res) => {
  try {
    const bids = await Bid.find({ auction: req.params.auctionId })
      .sort({ amount: -1 })
      .populate("bidder", "username");
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getBidsByAuction };