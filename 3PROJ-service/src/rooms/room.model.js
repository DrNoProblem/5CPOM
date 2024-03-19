const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  datelimit: {
    type: Date,
    required: true
  },
  renders: {
    type: String,
    required: true
  },
  correction: {
    type: String,
    required: true
  }
});

const Room = mongoose.model('Rooms', roomSchema);

module.exports = Room;
