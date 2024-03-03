const express = require("express");
const router = express.Router();
const Event = require("../models/EventModel");

//getメソッド
router.get("/allevents", async (req, res) => {
  try {
    const allEvents = await Event.find({});
    res.status(200).json(allEvents);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

//event id getメソッド
router.get("/eventinfo/:id", async (req, res) => {
  try {
    const event = await Event.find({ id: req.params.id });
    res.status(200).json(event);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// postメソッド
router.post("/addevent", async (req, res) => {
  try {
    const createEvent = await Event.create(req.body);
    res.status(200).json(createEvent);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// deleteメソッド
router.delete("/eventinfo/:id", async (req, res) => {
  try {
    const event = await Event.deleteMany({ id: req.params.id });
    res.status(200).json(event);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// putメソッド
router.put("/eventinfo/:id", async (req, res) => {
  try {
    const event = await Event.updateOne(
      { id: req.params.id },
      { $set: req.body }
    );
    res.status(200).json(event);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
