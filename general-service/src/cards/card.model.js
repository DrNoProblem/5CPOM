const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  costType: {
    type: String,
    required: true,
  },
  costValue: {
    type: Number,
    required: true,
  },
  ownerTargetType: {
    type: String,
    required: false,
  },
  ownerTargetValue: {
    type: Number,
    required: false,
  },
  enemyTargetType: {
    type: String,
    required: false,
  },
  enemyTargetValue: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model("cards", cardSchema);
