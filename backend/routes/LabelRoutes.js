const express = require("express");
const router = express.Router();
const Label = require("../models/LabelModel");

//getメソッド
router.get("/all", async (req, res) => {
  try {
    const Labels = await Label.find({});
    res.status(200).json(Labels);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// putメソッド
router.put("/:id", async (req, res) => {
  try {
    const putLabel = await Label.updateOne(
      { id: req.params.id },
      { $set: req.body }
    );
    res.status(200).json(putLabel);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
