// /api/index.js
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");

// ✅ Use node-fetch for Vercel compatibility
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

// ✅ Enable CORS
app.use(cors());
app.options("*", cors());

app.get("/", (req, res) => {
  res.send("✅ Swiggy Backend is live");
});

app.get("/restaurants", async (req, res) => {
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
    console.error("❌ Failed to fetch restaurants:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/restaurant-menu/:id", async (req, res) => {
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
    console.error("❌ Failed to fetch menu:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Export as serverless handler
module.exports.handler = serverless(app);
