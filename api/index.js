const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

// ✅ Add fetch
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

// ✅ Correct CORS middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // 👈 allow all origins
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("✅ Swiggy Backend API is live");
});

// ✅ Get Restaurants
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
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get Menu
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
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports.handler = serverless(app);
