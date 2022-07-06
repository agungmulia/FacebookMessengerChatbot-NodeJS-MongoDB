const mongoose = require("mongoose");

//this model is for summary collation
const MessageSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    text: [{
        type: String,
        required: true
    }]
});

module.exports = mongoose.model("Messages", MessageSchema);