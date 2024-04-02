const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: false,
  },
  datelimit: {
    type: Date,
    required: true,
  },
  renders: {
    type: String,
    required: false,
  },
  correction: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Tasks", taskSchema);
