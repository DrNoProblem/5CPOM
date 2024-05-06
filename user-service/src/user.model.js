const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'superAdmin', 'admin'],
    required: true
  },
  draws: {
    type: Array,
    required: false
  },
  draws: {
    type: Array,
    required: false
  }
});

const User = mongoose.model('Users', userSchema);

module.exports = User;
