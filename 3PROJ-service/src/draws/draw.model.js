const mongoose = require("mongoose");

const drawSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  script: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Draws", drawSchema);