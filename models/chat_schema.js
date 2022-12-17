const mongoose = require("mongoose");

//Schema
const ChatSchema = new mongoose.Schema({
    client_id: {
        type: String,
        required: true,
    },
    data: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("chat", ChatSchema);