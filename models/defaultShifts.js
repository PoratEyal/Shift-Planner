const mongoose = require("mongoose");
const Shift = require("./shift");
const defaultShiftSchema = new mongoose.Schema({
    ofManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    maxAmount: Number,
    shifts: [Shift.schema],
});
const defaultShift = mongoose.model("defaultShift", defaultShiftSchema);
module.exports = defaultShift;
