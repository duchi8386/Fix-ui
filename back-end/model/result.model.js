const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    skinType: { type: String, enum: ["oily", "dry", "combination", "normal"], required: true },
    score: { type: Number, required: true },
    recommendedRoutine: { type: mongoose.Schema.Types.ObjectId, ref: "SkincareRoutine" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Result", ResultSchema);
