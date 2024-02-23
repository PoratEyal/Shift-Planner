const mongoose = require('mongoose');
const ShiftData = require('./partShift');
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
  amountOfWorkers: {
    type: Number,
    required: true
  },
  workers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  availableWorkers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  standBy:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  shiftData: [ShiftData.schema]
});

// Create the shift model
const shift = mongoose.model('shift', shiftSchema);
module.exports = shift;