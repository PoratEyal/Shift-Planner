const mongoose = require('mongoose');
const Shift = require('./shift');
const daySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    shifts: [Shift.schema]
  });

// Create the shift model
const Day = mongoose.model('Day', daySchema);
module.exports = Day;