const express = require('express');
const router = express.Router();
const Event = require("../models/Event");

//getメソッド
router.get("/v1/events", async(req, res) => {
  try {
    const allEvents = await Event.find({});
    res.status(200).json(allEvents);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

// postメソッド
router.post("/v1/event", async(req, res) => {
  try {
    const createEvent = await Event.create(req.body);
    res.status(200).json(createEvent);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;