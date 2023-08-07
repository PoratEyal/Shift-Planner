const mongoose = require('mongoose');
const message = new mongoose.Schema({
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  shift:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'shift'
  },
  message: {
    type: String
  }
});
const Message = mongoose.model('Message', message);
module.exports = Message;