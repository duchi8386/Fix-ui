const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    options: [
        {
            text: { type: String, required: true }, // Đáp án
            scores: {
                oily: { type: Number, required: true },
                dry: { type: Number, required: true },
                combination: { type: Number, required: true },
                normal: { type: Number, required: true }
            }
        }
    ],
});

module.exports = mongoose.model("Question", QuestionSchema);
