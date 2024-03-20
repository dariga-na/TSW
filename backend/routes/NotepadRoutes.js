const express = require("express");
const router = express.Router();
const Notepad = require("../models/NotepadModel");

//getメソッド
router.get("/all", async (req, res) => {
  try {
    const Notepads = await Notepad.find({});
    res.status(200).json(Notepads);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// putメソッド
router.put("/:id", async (req, res) => {
  try {
    const putNotepad = await Notepad.updateOne(
      { id: req.params.id },
      { $set: req.body }
    );
    res.status(200).json(putNotepad);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
