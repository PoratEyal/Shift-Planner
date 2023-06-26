const mongoose = require('mongoose');

const weekSchema = new mongoose.Schema({
    weekNumber: {
      type: Number,
      required: true
    },
    // startDate: {
    //   type: Date,
    //   required: true,
    // },
    // endtDate: {
    //     type: Date,
    //     required: true,
    // },
    day: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Day'
    }
  });

// Create the user model
const Week = mongoose.model('Week', weekSchema);
module.exports = Week;