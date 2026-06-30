const express = require("express");
const router = express.Router();
const { getBidsByAuction } = require("../controllers/bidControllers");

router.get("/:auctionId", getBidsByAuction);

module.exports = router;