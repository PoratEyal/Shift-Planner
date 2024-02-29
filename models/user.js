const mongoose = require('mongoose');
const role = require('./role').schema;
const userSchema = new mongoose.Schema({
    fullName: {
      type: String,
      required: true
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
      required: true,
      unique: true,
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
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: false
    },
    active: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      required: true,
    },
  });

// Create the user model
module.exports = mongoose.model('User', userSchema);