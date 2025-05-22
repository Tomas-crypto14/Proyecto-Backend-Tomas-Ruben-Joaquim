const mongoose = require("mongoose");

const { Schema } = require("mongoose");

const optionSchema = new Schema({
    text: { type: String, required: true },
    votes: { type: Number, default: 0 },
});
const votesSchema = new Schema({
    question: {
        type: String,
        required: true,
    },
    options: [optionSchema],
    voted: array,
});
const Vote = mongoose.model("Votes", votesSchema);

module.exports = { Vote };
