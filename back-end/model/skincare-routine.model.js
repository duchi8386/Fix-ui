const mongoose = require("mongoose");

const SkincareRoutineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    skinType: { type: mongoose.Schema.Types.ObjectId, ref: "SkinType", required: true },
    steps: [{ stepNumber: Number, description: String, product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" } }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SkincareRoutine", SkincareRoutineSchema);
