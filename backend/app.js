const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const apiRouter = require("./routes/api");
const PORT = process.env.PORT || 8001;
const dotenv = require("dotenv").config();

// MongoDBへの接続
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_PASS}@cluster0.8wwhsyd.mongodb.net/events?retryWrites=true&w=majority`
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB", err));

// Expressアプリケーションの構成
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORSを有効にする
app.use(cors());

// Expressルーターの使用
app.use("/api", apiRouter);

// サーバーの起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
