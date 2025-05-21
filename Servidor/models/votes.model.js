const mongoose = require("mongoose");

const { Schema } = require("mongoose");
const votesSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    question: { type: String, required: true},
    options: { type: String, required: true},
    timestamp: { type: Date },
});
const Vote = mongoose.model("Votes", votesSchema);

module.exports = { Vote };
