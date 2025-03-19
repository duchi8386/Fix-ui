const mongoose = require("mongoose");

const PromotionSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discountPercentage: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ["Active", "Expired"], default: "Active" }
});

module.exports = mongoose.model("Promotion", PromotionSchema);
