const mongoose = require('mongoose');
const role = require('./role').schema;
const userSchema = new mongoose.Schema({
    fullName: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: role,
      required: false
    },
    email: {
      type: String,
      required: false
    },
    job:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'job',
      required: true
    },
    manager:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    token:{
      type: String
    },
    useRoles:{
      type: Boolean,
      default: false,
      required: false
    }
  });

// Create the user model
module.exports = mongoose.model('User', userSchema);