const mongoose = require('mongoose');
const Day = require('./day');
const weekSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      default: false 
    },
    day: [Day.schema]
    
});
const Week = mongoose.model('Week', weekSchema);
module.exports = Week;