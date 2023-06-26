const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    // date: {
    //   type:date,
    //   required: true
    // },
    shift: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shift'
    }
  });

// Create the shift model
const Day = mongoose.model('Day', daySchema);
module.exports = Day;