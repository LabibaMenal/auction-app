const express = require("express");
const router = express.Router();
const { getAuctions, createAuction, getAuctionById, startAuction } = require("../controllers/auctionControllers");

router.get("/", getAuctions);
router.post("/", createAuction);
router.get("/:id", getAuctionById);
router.post("/:id/start", startAuction);

module.exports = router;