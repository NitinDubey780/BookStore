const mongoose = require("mongoose");

const book = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        prize: {
            type: Number,
            required: true,
        },
        desc: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            required: true,
        },
        // 📌 Add this line inside Book Schema
        category: {
            type: String,
            required: true,
        },
    },

    {timestamps: true }
)

module.exports = mongoose.model("books",book);