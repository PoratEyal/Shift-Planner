const mongoose = require('mongoose');
const Shift = require('./shift');
const User = require("./user")

const ShiftData = new mongoose.Schema({
    shiftId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Shift
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    message: {
        type: String
    },
    start: {
        type: Date
    },
    end:{
        type: Date
    }
});
const shiftData = mongoose.model('shiftData', ShiftData);
module.exports = shiftData