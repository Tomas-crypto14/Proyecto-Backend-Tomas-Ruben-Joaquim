const mongoose = require("mongoose");

const { Schema } = require("mongoose");
const pollSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true},
    description: { type: String},
    timestamp: { type: Date },
});
const Poll = mongoose.model("Polls", pollSchema);

module.exports = { Poll };
