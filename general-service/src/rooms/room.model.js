const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  co_owner: {
    type: String,
    required: true,
  },
  users: {
    type: Array,
    required: true,
  },
  tasks: {
    type: Array,
    required: false,
  },
});

module.exports = mongoose.model("Rooms", roomSchema);
