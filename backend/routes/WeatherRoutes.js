const express = require("express");
const router = express.Router();
const axios = require("axios");

const apiKey = process.env.API_KEY;

router.post("/weather", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`,
      { timeout: 5000 }
    );
    const weatherData = {
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
    };
    res.json(weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
