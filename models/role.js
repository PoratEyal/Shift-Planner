const mongoose = require("mongoose");

// Define the role schema
const roleSchema = new mongoose.Schema({
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    name: {
        type: String,
        required: true,
    },
});

// Create the role model
module.exports = mongoose.model("Role", roleSchema);
