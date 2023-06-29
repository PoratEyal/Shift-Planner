const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true
    },
    job:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'job',
      required: true
    },
    token:{
      type: String
    }
  });

// Create the user model
module.exports = mongoose.model('User', userSchema);