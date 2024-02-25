const express = require('express');
const router = express.Router();
const Event = require("../models/Event");

//getメソッド
router.get("/allevents", async (req, res) => {
  try {
    const allEvents = await Event.find({});
    res.status(200).json(allEvents);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

//getメソッド
router.get("/eventinfo", async (req, res) => {
  try {
    const event = await Event.find({ id: req.query.id });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});



// postメソッド
router.post("/addevent", async (req, res) => {
  try {
    const createEvent = await Event.create(req.body);
    res.status(200).json(createEvent);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;