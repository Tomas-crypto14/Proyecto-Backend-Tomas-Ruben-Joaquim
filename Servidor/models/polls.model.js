const mongoose = require("mongoose");

const { Schema } = require("mongoose");

const pollSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
});
const Poll = mongoose.model("Polls", pollSchema);

module.exports = { Poll };
