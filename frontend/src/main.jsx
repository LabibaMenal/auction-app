import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuctionProvider } from "./context/AuctionProvider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuctionProvider>
      <App />
    </AuctionProvider>
  </BrowserRouter>
);