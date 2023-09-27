const mongoose = require("mongoose");
const message = new mongoose.Schema({
    worker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    week: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Week",
    },
    message: {
        type: String,
    },
});
const Message = mongoose.model("Message", message);
module.exports = Message;
