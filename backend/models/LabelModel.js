const mongoose = require("mongoose");

const LabelSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Label", LabelSchema);
