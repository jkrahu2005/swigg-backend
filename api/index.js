const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: '*', // Explicitly set (default but good practice to specify)
  methods: ['GET', 'HEAD', 'OPTIONS'], // Only allow necessary methods
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-Request-Id']
}));

// API 1 - Restaurants
app.get("/api/restaurants", async (req, res) => {
  try {
    const response = await fetch(
      "https://www.swiggy.com/dapi/restaurants/list/v5?lat=28.7040592&lng=77.10249019999999&is-seo-homepage-enabled=true",
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json",
          // Consider adding more headers if needed
        },
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Restaurant fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API 2 - Menu
app.get("/api/restaurant-menu/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(
      `https://www.swiggy.com/mapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.7040592&lng=77.10249019999999&restaurantId=${id}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json",
          // Consider adding more headers if needed
        },
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Menu fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add OPTIONS handler for preflight requests
app.options('*', cors());

module.exports = serverless(app);
