const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

// ✅ Dynamic import of fetch for serverless (Vercel)
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

// ✅ Explicit CORS headers
app.use(cors());
app.options("*", cors());

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("✅ Swiggy backend is live");
});

// ✅ Get restaurant list
app.get("/api/restaurants", async (req, res) => {
  const url =
    "https://www.swiggy.com/dapi/restaurants/list/v5?lat=28.7040592&lng=77.10249019999999&is-seo-homepage-enabled=true";

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ API error:", err);
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
});

// ✅ Get menu by ID
app.get("/api/restaurant-menu/:id", async (req, res) => {
  const { id } = req.params;
  const url = `https://www.swiggy.com/mapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.7040592&lng=77.10249019999999&restaurantId=${id}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ Menu API error:", err);
    res.status(500).json({ error: "Failed to fetch menu" });
  }
});

module.exports = serverless(app);
