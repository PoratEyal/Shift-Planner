const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  });

// Create the shift model
const Shift = mongoose.model('Shift', shiftSchema);
module.exports = Shift;