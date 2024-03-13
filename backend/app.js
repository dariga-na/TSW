const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");
const passKey = process.env.DB_PASS;
const apiKey = process.env.API_KEY;

// MongoDBへの接続
mongoose
  .connect(
    `mongodb+srv://${passKey}@cluster0.8wwhsyd.mongodb.net/schedule-app?retryWrites=true&w=majority`
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB", err));

// スケジュール管理のバックエンド
const appCalender = express();
const CalenderApiRouter = require("./routes/EventRoutes");
const calenderPORT = process.env.PORT || 8001;

appCalender.use(express.urlencoded({ extended: true }));
appCalender.use(express.json());
appCalender.use(cors());
appCalender.use("/api", CalenderApiRouter);

appCalender.listen(calenderPORT, () => {
  console.log(`Server is running on port ${calenderPORT}`);
});

// タスク管理のバックエンド
const appTodo = express();
const TaskApiRouter = require("./routes/TaskRoutes");
const LabelApiRouter = require("./routes/LabelRoutes");
const todoPORT = process.env.PORT || 5001;

appTodo.use(express.urlencoded({ extended: true }));
appTodo.use(express.json());
appTodo.use(cors());
appTodo.use("/api/tasks", TaskApiRouter);
appTodo.use("/api/labels", LabelApiRouter);

appTodo.listen(todoPORT, () => {
  console.log(`Server is running on port ${todoPORT}`);
});

// 天気取得のバックエンド
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
    console.log("Received Latitude:", latitude);
    console.log("Received Longitude:", longitude);

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
    console.log("Received Latitude:", latitude);
    console.log("Received Longitude:", longitude);

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

module.exports = { appCalender, appTodo, appWeather };
