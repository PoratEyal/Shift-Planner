const mongoose = require('mongoose');
const weekSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      default: false 
    },
    day: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Day'
    }]
});
const Week = mongoose.model('Week', weekSchema);
module.exports = Week;