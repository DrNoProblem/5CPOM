const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
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

const Task = mongoose.model('Tasks', taskSchema);

module.exports = Task;
