const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();

// スケジュール管理のバックエンド
const appCalender = express();
const mongoose = require("mongoose");
const CalenderApiRouter = require("./routes/EventRoutes");
const calenderPORT = process.env.PORT || 8001;
const passKey = process.env.DB_PASS;

// MongoDBへの接続
mongoose
  .connect(
    `mongodb+srv://${passKey}@cluster0.8wwhsyd.mongodb.net/events?retryWrites=true&w=majority`
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB", err));

appCalender.use(express.urlencoded({ extended: true }));
appCalender.use(express.json());
appCalender.use(cors());
appCalender.use("/api", CalenderApiRouter);

appCalender.listen(calenderPORT, () => {
  console.log(`Server is running on port ${calenderPORT}`);
});

module.exports = appCalender;

// 天気取得のバックエンド
const appWeather = express();
const weatherPORT = process.env.PORT || 5000;
const axios = require("axios");
const apiKey = process.env.API_KEY;

appWeather.use(express.json());
appWeather.use(cors());

appWeather.listen(weatherPORT, () => {
  console.log(`Server is running on port ${weatherPORT}`);
});

appWeather.post("/weather", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    console.log("Received Latitude:", latitude);
    console.log("Received Longitude:", longitude);

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=ja`,
      { timeout: 5000 }
    );

    const weatherData = {
      data: response.data,
    };

    res.json(weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = appWeather;
