const mongoose = require('mongoose');

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

// Create the user model
const User = mongoose.model('User', userSchema);
module.exports = User;