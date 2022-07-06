const mongoose = require("mongoose");

//this model is for message collation
const MessageSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    text: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Message", MessageSchema);