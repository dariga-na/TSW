const express = require("express");
const router = express.Router();
const axios = require("axios");

const apiKey = process.env.API_KEY;

// mainページの天気情報バー
router.post("/current_weather", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`,
      { timeout: 5000 }
    );
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/weather", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`,
      { timeout: 5000 }
    );
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
