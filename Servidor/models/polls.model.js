const mongoose = require("mongoose");

const { Schema } = require("mongoose");

const pollSchema = new Schema({
    question: { type: String, required: true },
    options: {
        type: Object,
        required: true,
        validate: {
            validator: function (value) {
                // Debe ser un objeto no vacío
                if (
                    typeof value !== "object" ||
                    value === null ||
                    Array.isArray(value)
                )
                    return false;
                const keys = Object.keys(value);
                if (keys.length === 0) return false;
                // Cada valor debe ser un número
                return keys.every((key) => typeof value[key] === "number");
            },
            message:
                "Options debe ser un objeto no vacío y cada campo debe ser un número.",
        },
    },
    voted: { type: Array, required: false },
});
const Poll = mongoose.model("Polls", pollSchema);

module.exports = { Poll };
