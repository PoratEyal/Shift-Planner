const mongoose = require("mongoose");
const Shift = require("./shift");
const daySchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    holiday: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    shifts: [Shift.schema],
});

// Create the shift model
const Day = mongoose.model("Day", daySchema);
module.exports = Day;
