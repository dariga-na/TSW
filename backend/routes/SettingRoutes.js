const express = require("express");
const router = express.Router();
const Setting = require("../models/SettingModel");

//getメソッド
router.get("/all", async (req, res) => {
  try {
    const Settings = await Setting.find({});
    res.status(200).json(Settings);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// putメソッド
router.put("/:id", async (req, res) => {
  try {
    const putSetting = await Setting.updateOne(
      { id: req.params.id },
      { $set: req.body }
    );
    res.status(200).json(putSetting);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
