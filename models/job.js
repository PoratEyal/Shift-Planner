const mongoose = require("mongoose");

// Define the role schema
const jobSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});

// Create the role model
module.exports = mongoose.model("job", jobSchema);
