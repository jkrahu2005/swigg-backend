const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const serverless = require("serverless-http");

const app = express();
app.use(cors());

// ➤ API 1: Get all restaurants
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

// ➤ API 2: Get restaurant menu
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
