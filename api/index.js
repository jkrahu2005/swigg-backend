const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const fetch = require("node-fetch"); // ✅ Add this line

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-Request-Id']
}));

app.get("/", (req, res) => {
  res.send("✅ Swiggy Backend API is running");
});

app.get("/api/restaurants", async (req, res) => {
  const swiggyAPI =
    "https://www.swiggy.com/dapi/restaurants/list/v5?lat=28.7040592&lng=77.10249019999999&is-seo-homepage-enabled=true";

  try {
    const response = await fetch(swiggyAPI, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching restaurant list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/restaurant-menu/:id", async (req, res) => {
  const { id } = req.params;
  const swiggyAPI = `https://www.swiggy.com/mapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.7040592&lng=77.10249019999999&restaurantId=${id}`;

  try {
    const response = await fetch(swiggyAPI, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = serverless(app);
