const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  board: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Task", TaskSchema);
