const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  shiftId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  workers: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }]
});

// Create the shift model
const Shift = mongoose.model('Shift', shiftSchema);
module.exports = Shift;