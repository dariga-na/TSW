const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
    default: "#fff",
  },
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
  },
});

module.exports = mongoose.model("Event", EventSchema);
