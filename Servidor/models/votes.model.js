const mongoose = require("mongoose");
const { Schema } = mongoose;

const optionSchema = new Schema({
    text: { type: String, required: true },
    votes: { type: Number, default: 0 },
});

const voteSchema = new Schema({
    question: { type: String, required: true },
    options: [optionSchema],
    voted: [String],
});

const Vote = mongoose.model("Vote", voteSchema);
module.exports = { Vote };
