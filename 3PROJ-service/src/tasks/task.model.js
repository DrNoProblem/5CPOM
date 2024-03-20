const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  datelimit: {
    type: Date,
    required: true,
  },
  renders: {
    type: String,
    required: true,
  },
  correction: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Tasks", taskSchema);
