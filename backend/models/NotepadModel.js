const mongoose = require("mongoose");

const NotepadSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Notepad", NotepadSchema);
