const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    shifts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shift',
      required: true
    }]
  });

// Create the shift model
const Day = mongoose.model('Day', daySchema);
module.exports = Day;