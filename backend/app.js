const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");
const passKey = process.env.DB_PASS;
const apiKey = process.env.API_KEY;
const PORT = process.env.PORT || 5001;

// MongoDBへの接続
mongoose
  .connect(
    `mongodb+srv://${passKey}@cluster0.8wwhsyd.mongodb.net/schedule-app?retryWrites=true&w=majority`
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB", err));

// ＝＝＝カレンダー、Todo、ノート、設定のバックエンド＝＝＝
const app = express();
const CalenderApiRouter = require("./routes/EventRoutes");
const TaskApiRouter = require("./routes/TaskRoutes");
const LabelApiRouter = require("./routes/LabelRoutes");
const NotepadApiRouter = require("./routes/NotepadRoutes");
const SettingApiRouter = require("./routes/SettingRoutes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/api", CalenderApiRouter);
app.use("/api/tasks", TaskApiRouter);
app.use("/api/labels", LabelApiRouter);
app.use("/api/notepads", NotepadApiRouter);
app.use("/api/settings", SettingApiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// ＝＝＝天気取得のバックエンド＝＝＝
const appWeather = express();
const weatherPORT = process.env.PORT || 5000;

appWeather.use(express.json());
appWeather.use(cors());

appWeather.listen(weatherPORT, () => {
  console.log(`Server is running on port ${weatherPORT}`);
});

// 3時間予報
appWeather.post("/weather_forecast", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=ja`,
      { timeout: 5000 }
    );

    const weatherData = {
      data: forecastResponse.data,
    };

    res.json(weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// 現在情報
appWeather.post("/weather_current", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const currentResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=ja`,
      { timeout: 5000 }
    );

    const weatherData = {
      data: currentResponse.data,
    };

    res.json(weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = { app, appWeather };
