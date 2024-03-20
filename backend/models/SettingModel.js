const mongoose = require("mongoose");

const SettingSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Setting", SettingSchema);
