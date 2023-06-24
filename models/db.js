const mongoose = require('mongoose');

// Define the role schema
const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
});

// Define the user schema
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }
});

// Create the role model
const Role = mongoose.model('Role', roleSchema);

// Create the user model
const User = mongoose.model('User', userSchema);

module.exports = { User, Role };
