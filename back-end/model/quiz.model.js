const mongoose = require("mongoose");

const QuizzSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Quiz", QuizzSchema);
