const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  workers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  availableWorkers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

// Create the shift model
const shift = mongoose.model('shift', shiftSchema);
module.exports = shift;