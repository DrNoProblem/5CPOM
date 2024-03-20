const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  co_owner: {
    type: String,
    required: true
  },
  users: {
    type: String,
    required: true
  },
  tasks: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Rooms', roomSchema);
