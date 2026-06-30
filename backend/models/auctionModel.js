const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
  title:        { type: String, required: true, trim: true },
  description:  { type: String, trim: true },
  image:        { type: String },
  seller:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  winner:       { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  startingPrice:        { type: Number, required: true },
  reservePrice:         { type: Number },
  currentBid:           { type: Number, default: 0 },
  currentHighestBidder: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  startTime: { type: Date, required: true },
  endTime:   { type: Date, required: true },
  status: {
    type: String,
    enum: ["scheduled", "live", "ended", "cancelled"],
    default: "scheduled",
  },
  bids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bid" }],
}, { timestamps: true });

auctionSchema.index({ status: 1, endTime: 1 });
auctionSchema.index({ seller: 1 });

module.exports = mongoose.model("Auction", auctionSchema);