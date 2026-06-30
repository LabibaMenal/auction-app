const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { init, restartTimers } = require("./socket/timerManager");
const socketHandler = require("./socket/socketHandler");

dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = [
  "https://auction-app-drab.vercel.app",
  "http://localhost:5173",
];

app.use(cors({ origin: allowedOrigins }));

app.use("/api/auctions", require("./routes/auctionRoutes"));
app.use("/api/bids", require("./routes/bidRoutes"));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: allowedOrigins }
});

init(io); // give timerManager access to io
socketHandler(io);

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await restartTimers(); // resume any live auctions on reboot
  })
  .catch((err) => console.log("MongoDB error:", err));

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, io };