const express = require("express");
const router = express.Router();
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const loginKey = process.env.LOGIN_PASS;
const PORT = process.env.PORT || 8001;

// MongoDBへの接続
mongoose
  .connect(
    `mongodb+srv://${loginKey}@cluster0.8wwhsyd.mongodb.net/tsw-login?retryWrites=true&w=majority`
  )
  .then(() => console.log("Connected to MongoDBlogin"))
  .catch((err) => console.log("Error connecting to MongoDBlogin", err));

// POST /login ルートに対するユーザー認証の処理
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // ユーザー名とパスワードの検証
  if (username === "example" && password === "password") {
    req.session.user = username;
    res.status(200).json({ message: "ログインに成功しました" });
  } else {
    // 認証失敗
    res
      .status(401)
      .json({ message: "ユーザー名またはパスワードが正しくありません" });
  }
});

module.exports = router;
